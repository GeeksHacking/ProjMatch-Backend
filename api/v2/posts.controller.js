import ImagesDAO from "../../dao/ImagesDAO.js"
import PostsDAOV2 from "../../dao/v2/PostsDAO.js"
import Auth0UserInfo from "./auth0.userinfo.js"

export default class PostsControllerV2 {
    static async apiGetPosts(req, res) {
        try {
            const postsPerPage = req.query.postsPerPage ? parseInt(req.query.postsPerPage, 10) : 100
            const page = req.query.page ? parseInt(req.query.page, 10) : 0

            let filters = {}
            if (req.query.id) {
                filters.id = req.query.id
            } else if (req.query.userID) {
                filters.userID = req.query.userID
            }
            else if (req.query.search) {
                filters.search = req.query.search
            }

            const { postsList, totalPosts } = await PostsDAO.getPosts({
                filters,
                page,
                postsPerPage
            })

            let response = {
                posts: postsList,
                page: page,
                filters: filters,
                postsPerPage: postsPerPage,
                totalPosts: totalPosts
            }

            res.status(200).json(response)
        } catch (err) {
            res.status(err.statusCode ? err.statusCode : 500).json({ error: err.msg ? err.msg : err.message })
        }
    }

    static async apiPostPosts(req, res) {
        const bearerToken = req.headers["authorization"].split(" ")[1]


        try {
            const images = req.images
            const projectName = req.body.projectName
            const description = req.body.description
            const creatorUserID = req.body.creatorUserID
            const contact = req.body.contact
            const tags = req.body.tags
            const technologies = req.body.technologies

            // Check for missing parameters
            if (projectName === undefined || description === undefined || creatorUserID === undefined || tags === undefined || technologies === undefined || images === undefined || contact === undefined) {
                throw new Error("One or more required fields returned undefined. Refer to documentation to see required fields")
            }

            // Verify User's Identity
            const userInfoFromAuth0 = await Auth0UserInfo.getUserInformationAuth0(bearerToken)
            if (contact !== userInfoFromAuth0.data.email) {
                throw {
                    "msg": "User is not authorised to make a post under given user ID.",
                    "statusCode": 401
                }
            }

            // Create the Images in AWS S3 Database, return as S3 URLs
            let imgType = "project"
            if (projectName === undefined) {
                imgType = "user"
            }

            /// Call ImagesDAO to add to S3
            const imagesResponse = await ImagesDAO.addImages(type, projectName, creatorUserID, images)

            if (imagesResponse.status === "failure") {
                throw {
                    "msg": `Failed to save images to S3 with Error: ${imagesResponse.msg}`,
                    "statusCode": 500
                }
            }

            let imageURLs = []
            for (let i = 0; i < imagesResponse.response.length; i++) {
                imageURLs.push(imagesResponse.response[i].Location)
            }

            if (imageURLs === []) {
                throw {
                    "msg": `Failed to get image URLs with Error: ${imagesResponse.msg}`,
                    "statusCode": 500
                }
            }

            // Create Post with PostsDAOV2 POST Posts
            const postsResponse = await PostsDAOV2.postPosts(projectName, description, creatorUserID, contact, 0.0, tags, technologies, images)

            if (postsResponse.status === "failure") {
                throw {
                    "msg": postsResponse.response,
                    "statusCode": 500
                }
            }

            res.status(200).json({ status: "success", insertProjectWithID: postsResponse.insertedId })
        } catch (err) {
            res.status(err.statusCode ? err.statusCode : 500).json({ error: err.msg ? err.msg : err.message })
        }
    }

    static async apiPutPosts(req, res) {
        const bearerToken = req.headers["authorization"].split(" ")[1]

        try {
            

        } catch (err) {
            res.status(err.statusCode ? err.statusCode : 500).json({ error: err.msg ? err.msg : err.message })
        }
    }

    static async apiDeletePosts(req, res) {
        const bearerToken = req.headers["authorization"].split(" ")[1]

        try {

        } catch (err) {
            res.status(err.statusCode ? err.statusCode : 500).json({ error: err.msg ? err.msg : err.message })
        }
    }
}