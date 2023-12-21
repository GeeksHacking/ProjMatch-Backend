import ImagesDAO from "../../../dao/ImagesDAO.js"
import PostsDAOV2 from "../../../dao/v2/PostsDAO.js"
import UsersDAOV2 from "../../../dao/v2/UsersDAO.js"
import Auth0UserInfo from "../../../helper/auth0.userinfo.js"
import UpdateToNewPostSchema from "../../../helper/UpdatePosts.js"

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

            const { postsList, totalPosts } = await PostsDAOV2.getPosts({
                filters,
                page,
                postsPerPage
            })

            const updatedPostList = []
            for (let i = 0; i < postsList.length; i++) {
                const updatedPost = await UpdateToNewPostSchema(postsList[i])
                
                updatedPostList.push(updatedPost !== null ? updatedPost : postsList[i])
            }

            let response = {
                posts: updatedPostList,
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
            const auth0UserID = userInfoFromAuth0.data.sub.replace(/\D/g, '')
            const { usersList, totalUsers } = await UsersDAOV2.apiGetUsers({ userID: creatorUserID }, 0, 1)
            const pmUser = usersList[0]
            
            if (pmUser.auth0UserID !== auth0UserID) {
                throw {
                    "msg": `User with User ID: ${creatorUserID} has no permission to remove users to post.`,
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

            if (imageURLs.length === 0) {
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
            const postID = req.body.id
            const update = req.body.update

            // Check for missing parameters
            if (postID === undefined || update === undefined) {
                throw {
                    "msg": "Post ID or update field returned undefined",
                    "statusCode": 400
                }
            }

            // Verify User Identity
            const postReqFilter = { id: postID }
            const { postsList, totalPosts } = await PostsDAOV2.getPosts({ postReqFilter })
            if (postsList.length === 0) {
                throw {
                    "msg": `Post with ${postID} not found.`,
                    "statusCode": 404
                }
            }
            const userInfoFromAuth0 = await Auth0UserInfo.getUserInformationAuth0(bearerToken)
            const auth0UserID = userInfoFromAuth0.data.sub.replace(/\D/g, '')
            const { usersList, totalUsers } = await UsersDAOV2.apiGetUsers({ userID: postsList[0].creatorUserID }, 0, 1)
            const pmUser = usersList[0]
            
            if (pmUser.auth0UserID !== auth0UserID) {
                throw {
                    "msg": `User with User ID: ${postsList[0].creatorUserID} has no permission to remove users to post.`,
                    "statusCode": 401
                }
            }

            // If verified, update post
            const updateResponse = await PostsDAOV2.putPosts(id, update)

            if (updateResponse.status === "failure") {
                throw {
                    "msg": deleteResponse.response,
                    "statusCode": 500
                }
            }

            res.status(200).json({ status: "success", updatedProjectWithID: postID })
        } catch (err) {
            res.status(err.statusCode ? err.statusCode : 500).json({ error: err.msg ? err.msg : err.message })
        }
    }

    static async apiDeletePosts(req, res) {
        const bearerToken = req.headers["authorization"].split(" ")[1]

        try {
            const postID = req.body.id

            // Check for missing PostID
            if (postID === undefined) {
                throw {
                    "msg": "Post ID returned undefined",
                    "statusCode": 400
                }
            }

            // Verify User Identity
            const postReqFilter = { id: postID }
            const { postsList, totalPosts } = await PostsDAOV2.getPosts({ postReqFilter })
            if (postsList.length === 0) {
                throw {
                    "msg": `Post with ${postID} not found.`,
                    "statusCode": 404
                }
            }
            const deletedProjImages = postsList[0].images
            const userInfoFromAuth0 = await Auth0UserInfo.getUserInformationAuth0(bearerToken)
            const auth0UserID = userInfoFromAuth0.data.sub.replace(/\D/g, '')
            const { usersList, totalUsers } = await UsersDAOV2.apiGetUsers({ userID: postsList[0].creatorUserID }, 0, 1)
            const pmUser = usersList[0]
            
            if (pmUser.auth0UserID !== auth0UserID) {
                throw {
                    "msg": `User with User ID: ${postsList[0].creatorUserID} has no permission to remove users to post.`,
                    "statusCode": 401
                }
            }

            // If verified, delete post
            const deleteResponse = await PostsDAOV2.deletePosts(postID)

            if (deleteResponse.status === "failure") {
                throw {
                    "msg": deleteResponse.response,
                    "statusCode": 500
                }
            }

            // Delete the Related Images from AWS S3
            const folderName = ""
            const imgNames = []
            //https://projmatch-photos.s3.ap-southeast-1.amazonaws.com/24b8a27590ade680009c375902b08278bdedddc400fa92a55278f5c7576cd42c/2879667a-9959-4de0-9ffd-9e73bff14c15.png
            for (let i = 0; i < deletedProjImages.length; i++) {
                const imageurl = deletedProjImages[i]
                folderName = imageurl.split("/")[3]
                imgNames.push(imageurl.split("/")[4])
            }
            const deleteImgResponse = await ImagesDAO.deleteImages(folderName, imgNames)

            res.status(200).json({ status: "success", deletedProjectWithID: postID })
        } catch (err) {
            res.status(err.statusCode ? err.statusCode : 500).json({ error: err.msg ? err.msg : err.message })
        }
    }
}