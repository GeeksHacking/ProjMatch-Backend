import app from "./server.js"
import dotenv from "dotenv"
const mongodb = require('mongodb')

// DAO
import UsersDAO from "./dao/UsersDAO.js"
import PostsDAO from "./dao/PostsDAO.js"

dotenv.config()
const MongoClient = mongodb.MongoClient

const port = process.env.PORT || 8080

;(async () => {
    try {
        const client = await MongoClient.connect(process.env.ATLAS_URI, { useNewUrlParser: true })
        await UsersDAO.injectDB(client)
        await PostsDAO.injectDB(client)

        if (process.env.NODE_ENV !== "test") {
            app.listen(port, () => {
                console.log(`Server listening on port ${port}`)
            })
        }
    }
    catch (err) {
        console.error(err.stack)
        process.exit(1)
    }
})()

module.exports = app