import app from "./server.js"
import dotenv from "dotenv"
import mongodb from 'mongodb'
import { MongoMemoryServer } from 'mongodb-memory-server'

let MongoClient
if (process.env.NODE_ENV === 'test') {
    const mongodb = require('mongodb')
    const { MongoMemoryServer } = require('mongodb-memory-server')
    MongoClient = mongodb.MongoClient
} else {
    MongoClient = mongodb.MongoClient
}

// DAO
import UsersDAO from "./dao/UsersDAO.js"
import PostsDAO from "./dao/PostsDAO.js"
import UsersDAOV2 from "./dao/v2/UsersDAO.js"
import PostsDAOV2 from "./dao/v2/PostsDAO.js"

dotenv.config()

const port = process.env.PORT || 8080
let mongod;

;(async () => {
    try {
        let dbUrl = process.env.ATLAS_URI
        if (process.env.NODE_ENV === 'test') {
            mongod = await MongoMemoryServer.create();
            dbUrl = mongod.getUri();
        }
        const client = await MongoClient.connect(dbUrl, { useNewUrlParser: true })
        await UsersDAO.injectDB(client)
        await PostsDAO.injectDB(client)
        await UsersDAOV2.injectDB(client)
        await PostsDAOV2.injectDB(client)

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

if (process.env.NODE_ENV === 'test') {
    module.exports = app
}