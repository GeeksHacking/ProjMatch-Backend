import express from "express"
import UsersController from "../controllers/users.controller.js"

const router = express.Router()

router.route("/")
    .get(UsersController.apiGetUsers)
    .post(UsersController.apiPostUsers)
    .delete(UsersController.apiDeleteUsers)
    .put(UsersController.apiPutUsers)

router.route("/:id/projects")
    .get(UsersController.apiGetPostsWithUser)

export default router