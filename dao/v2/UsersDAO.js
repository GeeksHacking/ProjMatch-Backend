import mongodb from "mongodb"

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

export default class UsersDAOV2 {
    static async injectDB(conn) {
        if (users) { return }

        try {
            users = await conn.db("usersMain").collection("users")
        } catch(err) {
            console.error(`Cannot create a connection handle for in usersDAO with: ${err}`)
        }
    }

    static async getUser({
        filters = null,
        page = 0, 
        usersPerPage = 100
    } = {}) {
        try {
            // Query and Filter according to Filter Parameter
            let query

            if (filters) {
                if ("username" in filters) {
                    query = { "username": { $eq: filters["username"] } }
                }

                if ("email" in filters) {
                    query = { "contact": { $eq: filters["email"] } }
                }

                if ("userID" in filters) {
                    query = { "_id": new ObjectID(filters["userID"]) }
                }
            }

            let cursor
            try {
                cursor = await users.find(query)
            } catch (err) {
                throw {
                    "msg": "Unable to find users with specified query",
                    "statusCode": 404
                }
            }

            try {
                const displayCursor = cursor.limit(usersPerPage).skip(usersPerPage * page)
                const usersList = await displayCursor.toArray()
                const totalUsers = await users.countDocuments(query)

                return { usersList, totalUsers }
            } catch (err) {
                throw {
                    "msg": `Unable to convert cursor to array, or a problem occured when counting documents: ${err}`,
                    "statusCode": 500
                }
            }
        } catch (err) {
            throw {
                "msg": err.msg ? err.msg : "An unknown error occured",
                "statusCode": err.statusCode ? err.statusCode : 500
            }
        }
    }

    static async postUser(username, contact, about, algoData, skills) {
        // Create a new User in the ProjMatch MongoDB
        try {

            // User Structure
            const UserStruct = new makeStruct(["username", "about", "profileImg", "bannerImg", "contact", "rating", "technologies", "savedPosts", "algoData"])
            const userDoc = new UserStruct(username, about, "", "", contact, 0.0, skills, [], algoData)

            const response = await users.insertOne(userDoc)

            return {
                "status": "success",
                "response": response
            }
        } catch (err) {
            return {
                "status": "failure",
                "response": err
            }
        }    
    }

    static async deleteUser(id) {
        try {
            const response = await users.deleteOne({ "_id": new ObjectID(id) })

            if (response.deletedCount !== 0) {
                return {
                    "status": "success",
                    "response": response
                }
            } else {
                return {
                    "status": "failure",
                    "response": "Delete Unsuccessful, 0 accounts deleted."
                }
            }
        } catch (err) {
            return {
                "status": "failure",
                "response": err
            }
        }
    }

    static async putUser(id, update) {
        try {
            const response = await users.updateOne({ "_id": new ObjectID(id)}, { $set: update })

            return {
                "response": response,
                "status": "success"
            }
        } catch (err) {
            return {
                "response": err.message,
                "status": "failure"
            }
        }
    }
}