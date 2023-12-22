import UpdateMembersDAO from "../../../dao/v2/UpdateMembersDAO.js"
import Auth0UserInfo from "../../../helper/auth0.userinfo.js"
import UsersDAOV2 from "../../../dao/v2/UsersDAO.js"
export default class UpdatePostMemberController {
    static async apiAddUser(req, res) {
        const bearerToken = req.headers["authorization"].split(" ")[1]
        
        try {
            const postID = req.body.postID
            const addUserID = req.body.addUserID
            const ownerUserID = req.body.ownerUserID
            
            if (postID === undefined || addUserID === undefined) {
                throw {
                    "msg": "PostID or ID of user to add returned undefined",
                    "statusCode": 400
                }
            }

            // Check for Authorisation
            const userInfoFromAuth0 = await Auth0UserInfo.getUserInformationAuth0(bearerToken)
            const auth0UserID = userInfoFromAuth0.data.sub.replace(/\D/g, '')
            const { usersList, totalUsers } = await UsersDAOV2.getUser({ userID: ownerUserID }, 0, 1)
            const pmUser = usersList[0]
            
            if (pmUser.auth0UserID !== auth0UserID) {
                throw {
                    "msg": `User with User ID: ${ownerUserID} has no permission to add users to post.`,
                    "statusCode": 401
                }
            }
            
            // Update Shared Users
            const updateResponse = await UpdateMembersDAO.putMember(postID, addUserID)
            if (updateResponse.status === "success") {
                res.status(200).json({ status: "success", updated: response })
            } else {
                throw {
                    "msg": response.response,
                    "statusCode": 500
                }
            }
        } catch (err) {
            res.status(err.statusCode ? err.statusCode : 500).json({ error: err.msg ? err.msg : err.message })
        }
    }
    
    static async apiRemoveUser(req, res) {
        const bearerToken = req.headers["authorization"].split(" ")[1]
        
        try {
            const postID = req.body.postID
            let removeUserID = req.body.removeUserID

            removeUserID = typeof removeUserID === "string" ? Array(removeUserID) : removeUserID
            
            // Check for Authorisation
            const userInfoFromAuth0 = await Auth0UserInfo.getUserInformationAuth0(bearerToken)
            const auth0UserID = userInfoFromAuth0.data.sub.replace(/\D/g, '')
            const { usersList, totalUsers } = await UsersDAOV2.getUser({ userID: ownerUserID }, 0, 1)
            const pmUser = usersList[0]
            
            if (pmUser.auth0UserID !== auth0UserID) {
                throw {
                    "msg": `User with User ID: ${ownerUserID} has no permission to remove users to post.`,
                    "statusCode": 401
                }
            }

            // Update Shared Users
            const updateResponse = await UpdateMembersDAO.removeMember(postID, removeUserID)
            if (updateResponse.status === "success") {
                res.status(200).json({ status: "success", updated: response })
            } else {
                throw {
                    "msg": response.response,
                    "statusCode": 500
                }
            }
        } catch (err) {
            res.status(err.statusCode ? err.statusCode : 500).json({ error: err.msg ? err.msg : err.message })
        }
    }
}