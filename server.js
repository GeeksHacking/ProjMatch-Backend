import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import { auth } from "express-oauth2-jwt-bearer"
// Route Files
import users from "./api/v1/users.route.js"
import images from "./api/v1/images.route.js"
import posts from "./api/v1/posts.route.js"

dotenv.config()

// Server Setup
const app = express()
const jwtCheck = auth({
    audience: 'projmatchAPI',
    issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
    tokenSigningAlg: "RS256"
})

app.use(jwtCheck)
app.use(cors({
    origin: '*',
    optionsSuccessStatus: 200,
    methods: ['GET','POST','DELETE','UPDATE','PUT','PATCH']
}))
app.use(express.json())

app.use("/api/v1/users", users)
app.use("/api/v1/images", images)
app.use("/api/v1/posts", posts)
app.use("*", (req, res) => res.status(404).json({error: "Not Found"}))
app.use((err, req, res, next) => {
    const status = err.status || 500
    const msg = err.message || "Internal Server Error"
    res.status(status).send({ error: msg })
})

export default app