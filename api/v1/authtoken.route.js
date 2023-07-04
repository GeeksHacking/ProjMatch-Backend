import TokenController from "./authtoken.controller"
import express from "express"

const router = express.Router()

router.route("/")
    .get(TokenController.getAccessToken)