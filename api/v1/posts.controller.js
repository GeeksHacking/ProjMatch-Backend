import PostsDAO from "../../dao/PostsDAO.js"

export default class PostsController {
    static async apiGetPosts(req, res, next) {
        const postsPerPage = req.query.postsPerPage ? parseInt(req.query.postsPerPage, 10) : 100
        const page = req.query.page ? parseInt(req.query.page, 10) : 0

        let filters = {}
        if (req.query.id) {
            // console.log("ID: " + req.query.id)
            filters.id = req.query.id
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
        res.json(response)
    }

    static async apiPostPosts(req, res, next) {
        try {
            const projectName = req.body.projectName
            const description = req.body.description
            const creatorUserID = req.body.creatorUserID
            const contact = req.body.contact
            const ratings = req.body.ratings
            const tags = req.body.tags
            const technologies = req.body.technologies
            const images = req.body.images
            const isArchived = req.body.isArchived

            if (projectName === undefined || description === undefined || creatorUserID === undefined || tags === undefined || technologies === undefined || images === undefined || contact === undefined) {
                throw new Error("One or more required fields returned undefined. Refer to documentation to see required fields")
            }

            const reviewResponse = await PostsDAO.addProject(projectName, description, creatorUserID, contact, ratings, tags, technologies, images, isArchived)

            if (reviewResponse.error) {
                throw new Error(reviewResponse.error)
            }

            res.json({ status: "success", insertedProjectWithID: reviewResponse.insertedId })
        } catch (err) {
            res.status(500).json({ error: err.message })
        }
    }

    static async apiUpdatePosts(req, res, next) {
        try {
            const id = req.body.id
            const update = req.body.update

            if (id === undefined || update === undefined) {
                throw new Error("ID or Update Field is undefined.")
            }

            const updateResponse = await PostsDAO.updateProject(id, update)

            res.json({ status: "success", updated: updateResponse })
        } catch (err) {
            res.status(500).json({ error: err.message })
        }
    }

    static async apiDeletePosts(req, res, next) {
        try {
            const postID = req.body.id

            if (postID === undefined) {
                throw new Error("Post ID returned undefined")
            }

            const deleteResponse = await PostsDAO.deleteProject(postID)
            
            if (deleteResponse.error) {
                throw new Error(deleteResponse.error)
            }

            res.json({ status: "success", deletedProjectWithID: postID, response: deleteResponse })
        } catch (err) {
            res.status(500).json({ error: `Unable to delete post as ${err.message}` })
        }
    }
}