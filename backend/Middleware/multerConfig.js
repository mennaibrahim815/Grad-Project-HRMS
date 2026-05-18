import multer from "multer";
import appErrors from "../utils/errors.js";
import { httpResponseText } from "../utils/httpResponseText.js";

const memoryStorage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    const mimeType = file.mimetype;
    const isImage = mimeType.startsWith("image/");
    const isPDF = mimeType === "application/pdf";

    if (isImage || isPDF) {
        return cb(null, true);
    } else {
        return cb(
            appErrors.create(
                400,
                "Only images and PDF files are allowed!",
                httpResponseText.FAIL
            ),
            false
        );
    }
};

const upload = multer({
    storage: memoryStorage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 },
});
export default upload;
