import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import { auth } from "express-oauth2-jwt-bearer"
// Route Files
import users from "./api/v1/users.route.js"
import images from "./api/v1/images.route.js"
import posts from "./api/v1/posts.route.js"
import authToken from "./api/v1/authtoken.route.js"

import usersv2 from "./api/v2/routes/users.route.js"
import postsv2 from "./api/v2/routes/posts.route.js"

dotenv.config()

// Server Setup
const app = express()
const jwtCheck = auth({
    audience: process.env.AUTH0_AUDIENCE,
    issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL
})
const allowedOrigin = ["https://projmatch.geekshacking.com", "http://localhost:3000"]
var corsOptionsDelegate = function (req, callback) {
    var corsOptions;
    if (allowedOrigin.indexOf(req.header('Origin')) !== -1) {
      corsOptions = { origin: true } // reflect (enable) the requested origin in the CORS response
    } else {
      corsOptions = { origin: false } // disable CORS for this request
    }
    callback(null, corsOptions) // callback expects two parameters: error and options
}

app.options("*", cors(corsOptionsDelegate))
app.use(cors(corsOptionsDelegate))
app.use(express.json())

// V2 API
app.use("/api/v2/posts", jwtCheck, postsv2)
app.use("/api/v2/users", jwtCheck, usersv2)
app.use("/api/v2/authtoken", authToken)

// Default
app.use("*", (req, res) => res.status(404).json({error: "Not Found"}))
app.use((err, req, res, next) => {
    const status = err.status || 500
    const msg = err.message || "Internal Server Error"
    res.status(status).send({ error: msg })
})

export default app