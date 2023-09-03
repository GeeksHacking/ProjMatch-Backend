import UsersDAOV2 from '../../dao/v2/UsersDAO.js'
import axios from 'axios'

export default class UsersControllerV2 {
    async getUserInformationAuth0(bearerToken) {
        const apiOptions = {
            method: "GET",
            url: `${process.env.AUTH0_ISSUER_BASE_URL}/userinfo`,
            authorization: `Bearer ${bearerToken}`
        }

        const response = await axios.request(apiOptions)

        return response
    }

    static async apiGetUsers(req, res) {
        try {
            const usersPerPage = req.query.usersPerPage ? parseInt(req.query.usersPerPage, 10) : 100 // Default to showing a maximum of 100 users per page
            const page = req.query.page ? parseInt(req.query.page, 10) : 0 // Default to the first page

            // Configure User Filters
            let filters = {}
            if (req.query.username) { // Filter by Username
                filters.username = req.query.username
            } else if (req.query.email) { // Filter by Email
                filters.email = req.query.email
            } else if (req.query.userID) { // Filter by User ID
                if (req.query.userID.length !== 24) {
                    throw {
                        "msg": "Invalid UserID",
                        "statusCode": 400
                    }
                }

                filters.userID = req.query.userID
            }

            // Get the usersList and totalUsers from UsersDAOV2
            const { usersList, totalUsers } = await UsersDAOV2.getUser({ filters, page, usersPerPage })

            // Sort the data, and only show necessary info
            /// Get user information from Auth0 using /userinfo endpoint
            const bearerToken = req.headers["authorization"]
            const userInfoFromAuth0 = await getUserInformationAuth0(bearerToken)

            /// Loop through Users List, remove unnecessary info. If that user is the user requesting for info, all info can be added
            let newUsersList = null
            for (let i = 0; i < usersList.length; i++) {
                if (usersList[i].email !== userInfoFromAuth0.email) {
                    let temp = usersList[i]
                    delete temp.savedPosts
                    delete temp.algoData
                    delete temp.technologies
                    newUsersList.push(temp)
                } else {
                    newUsersList.push(usersList[i])
                }
            }

            // Prepare JSON response
            const response = {
                users: newUsersList,
                totalUsers: totalUsers,
                filters: filters,
                page: page,
                usersPerPage: usersPerPage
            }

            // Send JSON Response
            res.status(200).json(response)
        } catch (err) {
            res.status(err.statusCode).json({ error: err.msg })
        }
    }

    static async apiPostUsers(req, res) {
        const bearerToken = req.headers["authorization"]

        try {
            const username = req.body.username
            const contact = req.body.contact
            const about = req.body.about
            const algoData = req.body.algoData
            const skills = req.body.skills

            if (username === undefined || contact === undefined || about === undefined || algoData === undefined || skills === undefined) {
                throw {
                    "msg": "Arguments for Creating User is incomplete",
                    "statusCode": 400
                }
            }

            // Check if the User already exists
            // TODO: Call the UsersDAOV2 GetUsers API
            const { resUserList, resTotalUsers } = await UsersDAOV2.getUser({ filters, page, usersPerPage })
            if (resTotalUsers !== 0) {
                // User already exists
                throw {
                    "msg": "User already exists! Cannot create user.",
                    "statusCode": 400
                }
            } else {
                // User does not exist, so can create user
                const response = await UsersDAOV2.postUser(username, contact, about, algoData, skills)

                // TODO
            }

        } catch (err) {
            res.status(err.statusCode).json({ error: err.msg })
        }
    }

    static async apiPutUsers(req, res) {
        const bearerToken = req.headers["authorization"]

        try {
            // Get Data from API Request Body
            const id = req.body.id
            const update = req.body.update

            if (id === undefined || update === undefined) {
                throw {
                    "msg": "ID or Update Object is Undefined!",
                    "statusCode": 400
                }
            }

            // Verify if user is authorised to edit user
            const userInfoFromAuth0 = await getUserInformationAuth0(bearerToken)
            const { usersList, totalUsers } = await UsersDAOV2.getUser({ userID: id }) // get user with UserID
            /// If there are no users with the ID, throw error
            if ( totalUsers === 0 ) {
                throw {
                    "msg": `User with UserID of ${id} does not exist.`,
                    "statusCode": 400
                }
            }
            /// Check if the user from userList has the same email as userInfoFromAuth0
            if (usersList[0].contact === userInfoFromAuth0.email) {
                // User is authenticated
                const response = await UsersDAOV2.putUser(id, update)

                res.status(200).json({ status: "success", updated: response })
            } else {
                // User does not have permission to update this person
                throw {
                    "msg": `You do not have permission to update the information for user with UserID of ${id}`,
                    "statusCode": 403
                }
            }
        } catch (err) {
            res.status(err.statusCode).json({ error: err.msg })
        }
    }

    static async apiDeleteUsers(req, res) {

    }
}