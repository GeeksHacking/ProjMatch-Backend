import { query } from "express"
import mongodb from "mongodb"
import { ObjectId } from "mongodb";

let posts

/*
Post Object

{
    "projectName": "",
    "description": "",
    "creatorUserID": "",
    "rating": "",
    "tags": [],
    "technologies": [],
    "images": [],
    "isArchived": false
}

*/

function makeStruct(keys) {
    if (!keys) return null;
    const count = keys.length;
    
    /** @constructor */
    function constructor() {
        for (let i = 0; i < count; i++) this[keys[i]] = arguments[i];
    }
    return constructor;
}

export default class PostsDAO {
    static async injectDB(conn) {
        if (posts) { return }

        try {
            posts = await conn.db("usersMain").collection("posts")
        } catch(err) {
            console.error(`Cannot create a connection handle for in postsDAO with: ${err}`)
        }
    }

    static async getPosts({
        filters = null,
        page = 0,
        postsPerPage = 100
    } = {}) {
        let userQuery

        if(filters) {
            if("id" in filters) {
                if ("id" == "undefined" || "id" == null) {
                    throw new Error("ID is undefined or null")
                }

                const filterID = new ObjectId(filters["id"])
                userQuery = { "_id": filterID }
            } else if ("userID" in filters) {
                userQuery = { "creatorUserID": { $eq: filters["userID"] } }
            }
        }

        let cursor
        try {
            cursor = await posts
                .find(userQuery)
        } catch (err) {
            console.error(`Unable to find posts with: ${err}`)
            return { postsList: [], totalposts: 0 }
        }

        const displayCursor = cursor.limit(postsPerPage).skip(postsPerPage * page)
        try {
            const postsList = await displayCursor.toArray()
            const totalPosts = await posts.countDocuments(userQuery)

            return { postsList, totalPosts }
        } catch (err) {
            console.error(`Unable to convert cursor to array, or a problem occured when counting documents: ${err}`)
            
            return { postsList: [], totalPosts: 0 }
        }
    }
    
    static async addProject(projectName, description, creatorUserID, contact, ratings, tags, technologies, images, isArchived) {
        try {
            const PostStruct = new makeStruct(["projectName", "description", "creatorUserID", "contact", "ratings", "tags", "technologies", "images", "isArchived"])
            
            const createdProj = new PostStruct(projectName, description, creatorUserID, contact, ratings, tags, technologies, images, isArchived)
            
            const insertRequest = await posts.insertOne(createdProj)

            if (!insertRequest.acknowledged) {
                throw new Error("Insert Request not acknowledged by db")
            }

            return insertRequest
        } catch (err) {
            return { error: err }
        }
    }

    static async updateProject(id, update) {
        try {
            const updateResponse = await posts.updateOne({"_id": new ObjectId(id)}, {$set: update})

            return updateResponse
        } catch (err) {
            return { error: err }
        }
    }

    static async deleteProject(id) {
        try {
            const deleteResponse = await posts.deleteOne({
                "_id": new ObjectId(id)
            })

            if (deleteResponse.deletedCount === 0) {
                throw new Error("Delete Unsuccessful, no projects deleted")
            }

            return deleteResponse
        } catch (err) {
            return { error: err }
        }
    }
}