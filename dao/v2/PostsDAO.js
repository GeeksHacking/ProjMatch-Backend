import mongodb from 'mongodb'

let ObjectID
if (process.env.NODE_ENV === 'test') {
    const mongodb = require('mongodb')
    ObjectID = mongodb.ObjectId
} else {
    ObjectID = mongodb.ObjectId
}

let users

function makeStruct(keys) {
    if (!keys) return null;
    const count = keys.length;
    
    /** @constructor */
    function constructor() {
        for (let i = 0; i < count; i++) this[keys[i]] = arguments[i];
    }
    return constructor;
}

export default class PostsDAOV2 {
    static async injectDB(conn) {
        if (users) { return }

        try {
            users = await conn.db("usersMain").collection("users")
        } catch(err) {
            console.error(`Cannot create a connection handle for in usersDAO with: ${err}`)
        }
    }

    static async getPosts({
        filters = null,
        page = 0,
        postsPerPage = 100
    }) {
        // Query 
        let query

        if(filters) {
            if("id" in filters) {
                query = { "_id": new ObjectID(filters["id"]) }
            } else if ("userID" in filters) {
                query = { "creatorUserID": { $eq: filters["userID"] } }
            }
            else if ("search" in filters) {
                query = { "projectName": { $regex: filters["search"], $options: "i" } }
            }
        }
    }

    static async postPosts(projectName, description, creatorUserID, contact, ratings, tags, technologies, images) {
        try {
            const PostStruct = new makeStruct(["projectName", "description", "images", "creatorUserID", "contact", "rating", "tags", "technologies", "algoData"])
            const createdProj = new PostStruct(projectName, description, images, creatorUserID, contact, ratings, tags, technologies, [])
            
            const insertRequest = await posts.insertOne(createdProj)

            if (!insertRequest.acknowledged) {
                return {
                    "response": "Insert Posts Request was not acknoledged by the database",
                    "status": "failure"
                }
            }

            return {
                "response": insertRequest,
                "status": "success"
            }
        } catch (err) {
            return {
                "response": err,
                "status": "failure"
            }
        }
    }

    static async putPosts() {

    }

    static async deletePosts() {

    }
}