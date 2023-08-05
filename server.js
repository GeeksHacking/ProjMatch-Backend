import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import { auth } from "express-oauth2-jwt-bearer"
// Route Files
import users from "./api/v1/users.route.js"
import images from "./api/v1/images.route.js"
import posts from "./api/v1/posts.route.js"
import email from "./api/v1/email.js"


dotenv.config()

// Server Setup
const app = express()
const jwtCheck = auth({
    audience: process.env.AUTH0_AUDIENCE,
    issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL
})
const corsOptions = {
    origin: "https://projmatch.geekshacking.com"
}

app.use(cors(corsOptions))
app.use(express.json())

app.use("/api/v1/email", email)
app.use("/api/v1/users", jwtCheck, users)
app.use("/api/v1/images", jwtCheck, images)
app.use("/api/v1/posts", jwtCheck, posts)
app.use("*", (req, res) => res.status(404).json({error: "Not Found"}))
app.use((err, req, res, next) => {
    const status = err.status || 500
    const msg = err.message || "Internal Server Error"
    res.status(status).send({ error: msg })
})

export default app