import PostsControllerV2 from "./posts.controller"

export default class UpdatePostMemberController {
    static async apiAddUserToProj(req, res) {
        const bearerToken = req.headers["authorization"].split(" ")[1]

        try {
            const creatorUserID = req.body.creatorUserID
            const addUserID = req.body.addUserID

            if (creatorUserID === undefined || addUserID === undefined) {
                throw {
                    "msg": "Creator Use ID or ID of user to add returned undefined",
                    "statusCode": 400
                }
            }

            // TODO: Push to addedUsers array
        } catch (err) {
            res.status(err.statusCode ? err.statusCode : 500).json({ error: err.msg ? err.msg : err.message })
        }
    }
}