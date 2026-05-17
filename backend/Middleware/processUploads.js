import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";
import sharp from "sharp";
import { asyncWraper } from "../Middleware/asyncWraper.js";
import dotenv from "dotenv";
dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const processUploadedFile = asyncWraper(async (req, res, next) => {
    if (!req.files || Object.keys(req.files).length === 0) return next();

    const uploadPromises = [];
    for (const fieldName in req.files) {
        const fileArray = req.files[fieldName];
        for (const file of fileArray) {
            const uploadPromise = new Promise(async (resolve, reject) => {
                try {
                    if (file.mimetype.startsWith("image/")) {
                        const bufferAfterSharp = await sharp(file.buffer)
                            .resize({
                                width: 800,
                                withoutEnlargement: true,
                            })
                            .toFormat("jpeg")
                            .jpeg({ quality: 80 })
                            .toBuffer();

                        const uploadStream = cloudinary.uploader.upload_stream(
                            { folder: "hrms_project_uploads" },
                            (error, result) => {
                                if (error) return reject(error);
                                file.filename = result.secure_url;
                                resolve();
                            }
                        );
                        streamifier
                            .createReadStream(bufferAfterSharp)
                            .pipe(uploadStream);
                    } else if (file.mimetype === "application/pdf") {
                        const cleanFileName = file.originalname.replace(
                            /\s+/g,
                            "_"
                        );

                        const uploadStream = cloudinary.uploader.upload_stream(
                            {
                                folder: "hrms_documents",
                                resource_type: "raw",
                                public_id: `${Date.now()}_${cleanFileName}`,
                            },
                            (error, result) => {
                                if (error) return reject(error);
                                file.filename = result.secure_url;
                                resolve();
                            }
                        );
                        streamifier
                            .createReadStream(file.buffer)
                            .pipe(uploadStream);
                    } else {
                        resolve();
                    }
                } catch (err) {
                    reject(err);
                }
            });

            uploadPromises.push(uploadPromise);
        }
    }

    await Promise.all(uploadPromises);

    next();
});
