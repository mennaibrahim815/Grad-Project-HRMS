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

export const processUploadedFile2 = asyncWraper(async (req, res, next) => {
    // 1. فحص ذكي للملفات (Array أو Object)
    if (!req.files || (Array.isArray(req.files) && req.files.length === 0)) return next();

    // 2. توحيد شكل البيانات لمصفوفة (عشان نخلص من وجع دماغ الـ iterable)
    const fileArray = Array.isArray(req.files) 
        ? req.files 
        : Object.values(req.files).flat();

    const uploadPromises = fileArray.map((file) => {
        return new Promise(async (resolve, reject) => {
            try {
                // معالجة الصور بـ Sharp
                if (file.mimetype.startsWith("image/")) {
                    const bufferAfterSharp = await sharp(file.buffer)
                        .resize({ width: 800, withoutEnlargement: true })
                        .toFormat("jpeg")
                        .toBuffer();

                    const uploadStream = cloudinary.uploader.upload_stream(
                        { folder: "hrms_uploads" },
                        (error, result) => {
                            if (error) return reject(error);
                            // بنحط اللينك هنا عشان setFilesToBody تشوفه
                            file.path = result.secure_url; 
                            resolve();
                        }
                    );
                    streamifier.createReadStream(bufferAfterSharp).pipe(uploadStream);
                } 
                // معالجة الملفات الـ PDF
                else if (file.mimetype === "application/pdf") {
                    const uploadStream = cloudinary.uploader.upload_stream(
                        { folder: "hrms_documents", resource_type: "raw" },
                        (error, result) => {
                            if (error) return reject(error);
                            file.path = result.secure_url;
                            resolve();
                        }
                    );
                    streamifier.createReadStream(file.buffer).pipe(uploadStream);
                } else {
                    resolve();
                }
            } catch (err) { reject(err); }
        });
    });

    await Promise.all(uploadPromises);

    next();
});