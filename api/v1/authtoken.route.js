import express from "express"
import AuthTokenController from "./authtoken.controller"

router = express.Router()

router.route("/")
    .get(AuthTokenController.getAuthToken)

export default router