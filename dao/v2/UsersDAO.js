import mongodb from "mongodb"
import axios from "axios"

let ObjectID
if (process.env.NODE_ENV === 'test') {
    const mongodb = require('mongodb')
    ObjectID = mongodb.ObjectId
} else {
    ObjectID = mongodb.ObjectId
}

let users

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

            const displayCursor = cursor.limit(usersPerPage).skip(usersPerPage * page)
            try {
                const usersList = await displayCursor.toArray()
                const totalUsers = await users.countDocuments(userQuery)

                return { usersList, totalUsers }
            } catch (err) {
                throw {
                    "msg": `Unable to convert cursor to array, or a problem occured when counting documents: ${err}`,
                    "statusCode": 500
                }
            }
        } catch (err) {
            throw {
                "msg": "Unnknown Error Occured",
                "statusCode": 500
            }
        }
    }

    static async postUser(username, contact, about, algoData, skills) {

    }

    static async deleteUser() {

    }

    static async putUser(id, update) {
        try {
            const response = await users.updateOne({ "_id": new ObjectID(id)}, { $set: update })

            return response
        } catch (err) {
            throw {
                "msg": err.message,
                "statusCode": 500
            }
        }
    }
}