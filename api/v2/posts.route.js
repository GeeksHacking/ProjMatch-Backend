import express from "express"
import PostsControllerV2 from "./posts.controller.js"
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
    .get(PostsControllerV2.apiGetPosts)
    .post(upload.array("images"), PostsControllerV2.apiPostPosts)
    .delete(PostsControllerV2.apiDeletePosts)
    .put(upload.array("images"), PostsControllerV2.apiPutPosts)

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