import mongodb from 'mongodb'

let posts

export default class UpdateMembersDAO {
    static async injectDB(conn) {
        if (posts) { return }

        try {
            posts = await conn.db("usersMain").collection("posts")
        } catch(err) {
            console.error(`Cannot create a connection handle for in usersDAO with: ${err}`)
        }
    }

    static async putMember(postID, addUserID) {
        addUserID = typeof addUserID === "string" ? Array(addUserID) : addUserID

        try {
            const response = await posts.updateOne(
                { _id: postID },
                { $push: { addedUsers: { $each: addUserID } } }
            )
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

    static async removeMember(postID, removeUserID) {
        removeUserID = typeof removeUserID === "string" ? Array(removeUserID) : removeUserID
        
        try {
            const response = await posts.updateOne(
                { _id: postID },
                { $pull: { addedUsers: { $in: removeUserID } } }
            )
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