import express from "express"
import PostsControllerV2 from "./posts.controller"

const router = express.Router()

router.route("/")
    .get(PostsControllerV2.apiGetPosts)
    .post(PostsControllerV2.apiPostPosts)
    .delete(PostsControllerV2.apiDeletePosts)
    .put(PostsControllerV2.apiPutPosts)

export default router