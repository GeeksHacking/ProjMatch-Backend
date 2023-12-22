import PostsDAOV2 from "../dao/v2/PostsDAO.js"

// Check if addedUsers exist in the post object, and ensure that post rating is an array, if not, add it. If yes, return post
export default async function UpdateToNewPostSchema(post) {
    if (!post.hasOwnProperty("addedUsers") || typeof post.rating !== "object") {
        if (typeof post.rating !== "object") {
            post.rating = [post.rating !== null ? post.rating : 0.0, 0]
        }

        if (!post.hasOwnProperty("addedUsers")) {
            post.addedUsers = [post.creatorUserID]
        }

        await PostsDAOV2.putPosts(post._id, post)
        return post
    }

    return null
}