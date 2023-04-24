import express from "express"
import ImageController from "./images.controller.js"
import multer from "multer"

// Image Upload
const storage = multer.memoryStorage()
const fileFilter = (req, file, cb) => {
    if (file.mimetype.split("/")[0] === "image") {
        cb(null, true)
    } else {
        cb(new multer.MulterError("LIMIT_UNEXPECTED_FILE"), false)
    }
}

const upload = multer({ storage, fileFilter, limits: {fileSize: 1500000} }) // 1.5MB Max File Size

const router = express.Router()

router.route("/")
    .get(ImageController.apiGetImages)
    .post(upload.array("files"), ImageController.apiPostImages)
    .delete(ImageController.apiDeleteImages)

router.use((error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        switch (error.code) {
            case "LIMIT_FILE_SIZE":
                return res.status(400).json({ message: "Uploaded file is too big, > 1.5 MB" })
            case "LIMIT_UNEXPECTED_FILE":
                return res.status(400).json({ message: "Uploaded file is not an image, file must be an Image" })
        }
    }
})

export default router