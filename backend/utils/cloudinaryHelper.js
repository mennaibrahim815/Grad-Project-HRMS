// utils/cloudinaryHelper.js
import { v2 as cloudinary } from "cloudinary";

export const deleteFromCloudinary = async (secureUrl) => {
    try {
        if (!secureUrl) return;

        const urlParts = secureUrl.split("/");

        const folderAndFile = urlParts.slice(-2).join("/");

        const publicId = folderAndFile.split(".")[0];

        await cloudinary.uploader.destroy(publicId);
        console.log(`Orphan image deleted from Cloudinary: ${publicId}`);
    } catch (error) {
        console.error("Failed to delete image from Cloudinary", error);
    }
};
