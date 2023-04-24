import ImagesDAO from "../../dao/ImagesDAO.js"
import { createHash } from "crypto"

export default class ImagesController {
    static async apiGetImages(req, res, next) {
        try {
            const projectName = req.body.projectName
            const creatorUserID = req.body.creatorUserID
            let type = ""

            if (creatorUserID === undefined) {
                throw new Error("creatorUserID returned undefined, field is required")
            }

            if (projectName === undefined) {
                type = "user"
            } else {
                type = "project"
            }

            const reviewResponse = await ImagesDAO.getImages(type, projectName, creatorUserID)

            if (reviewResponse.error && reviewResponse.error.statusCode) {
                res.status(reviewResponse.error.statusCode).json({ error: reviewResponse.error.message })
                return
            } else if (reviewResponse.error) {
                throw new Error(reviewResponse.error.message)
            }

            let imageURL = []
            for (let i = 0; i < reviewResponse.Contents.length; i++) {
                const temp = "https://projmatch-images.s3.ap-southeast-1.amazonaws.com/"
                imageURL.push(temp.concat(reviewResponse.Contents[i].Key))
            }
            res.json({ status: "success", response: reviewResponse, imageURL: imageURL })
        } catch (err) {
            res.status(500).json({ error: err.message })
        }
    }

    static async apiPostImages(req, res, next) {
        try {
            const images = req.files
            const projectName = req.body.projectName
            const creatorUserID = req.body.creatorUserID
            let type = ""

            console.log(req)

            if (creatorUserID === undefined) {
                throw new Error("creatorUserID returned undefined, field is required")
            }

            if (projectName === undefined) {
                type = "user"
            } else {
                type = "project"
            }

            const reviewResponse = await ImagesDAO.addImages(type, projectName, creatorUserID, images)

            if (reviewResponse.error && reviewResponse.error.statusCode) {
                res.status(reviewResponse.error.statusCode).json({ error: reviewResponse.error.message })
                return
            } else if (reviewResponse.error) {
                throw new Error(reviewResponse.error.message)
            }

            let imageURL = []
            for (let i = 0; i < reviewResponse.length; i++) {
                imageURL.push(reviewResponse[i].Location)
            }

            if (imageURL === []) {
                throw new Error("Unable to save any images.")
            }

            res.json({ status: "success", response: reviewResponse, imageURL: imageURL })
        } catch (err) {
            res.status(500).json({ error: err.message })
        }
    }

    static async apiUpdateImages(req, res, next) {
        res.status(500).json({ error: "Feature WIP" })
    }

    static async apiDeleteImages(req, res, next) {
        try {
            const projectName = req.body.projectName
            const creatorUserID = req.body.creatorUserID
            const imageName = req.body.imageName

            if (creatorUserID === undefined) {
                throw new Error("creatorUserID returned undefined, field is required")
            }

            let folderName
            if (projectName === undefined) {
                folderName = createHash("sha256").update(`${creatorUserID}`).digest("hex")
            } else {
                folderName = createHash("sha256").update(`${projectName} | ${creatorUserID}`).digest("hex")
            }

            if (imageName === undefined || imageName === []) {
                throw new Error("imageName is undefined or contains no elements")
            }

            const reviewResponse = await ImagesDAO.deleteImages(folderName, imageName.split(","))

            if (reviewResponse.error && reviewResponse.error.statusCode) {
                res.status(reviewResponse.error.statusCode).json({ error: reviewResponse.error.message })
                return
            } else if (reviewResponse.error) {
                throw new Error(reviewResponse.error.message)
            }
            
            res.json({ status: "success", response: reviewResponse, deletedImagesWithNames: imageName.split(",")})
        } catch (err) {
            res.status(500).json({ error: err.message })
        }
    }
}