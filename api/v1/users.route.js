import express from "express"
import UsersController from "./users.controller.js"

const router = express.Router()

router.route("/")
    .get(UsersController.apiGetUsers)
    .post(UsersController.apiPostUsers)
    .delete(UsersController.apiDeleteUsers)
    .put(UsersController.apiUpdateUsers)

export default router