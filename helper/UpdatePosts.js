import PostsDAOV2 from "../dao/v2/PostsDAO"

// Check if addedUsers exist in the post object, if not, add it. If yes, return post
export default async function UpdateToNewPostSchema(post) {
    if (!post.hasOwnProperty("addedUsers")) {
        post.addedUsers = [post.creatorUserID]
        PostsDAOV2.putPosts(post._id, post)

        return post
    }

    return null
}