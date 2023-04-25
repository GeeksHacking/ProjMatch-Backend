import UsersDAO from "../../dao/UsersDAO.js"

export default class UsersController {
    static async apiGetUsers(req, res, next) {
        try {
            const usersPerPage = req.query.usersPerPage ? parseInt(req.query.usersPerPage, 10) : 1000
            const page = req.query.page ? parseInt(req.query.page, 10) : 0

            let filters = {}
            if (req.query.user) {
                filters.user = req.query.user
            } else if (req.query.email) {
                filters.email = req.query.email
            } else if (req.query.ph) {
                filters.ph = req.query.ph
            } else if (req.query.id) {
                filters.id = req.query.id
            }

            const { usersList, totalUsers } = await UsersDAO.getUsers({
                filters,
                page,
                usersPerPage
            })

            let response = {
                users: usersList,
                page: page,
                filters: filters,
                usersPerPage: usersPerPage,
                totalUsers: totalUsers
            }
            res.json(response)
        } catch (err) {
            res.status(500).json({ error: err.message })
        }
    }

    static async apiPostUsers(req, res, next) {
        try {
            const username = req.body.username
            const rlName = req.body.rlName
            const regEmail = req.body.regEmail
            const regPhone = req.body.regPhone

            if (username === undefined || rlName === undefined || regEmail === undefined || regPhone === undefined) {
                throw new Error("Arguments for Creating User is incomplete")
            }

            const reviewRes = await UsersDAO.addUser(username, rlName, regEmail, regPhone)

            if (reviewRes.error) {
                throw new Error(reviewRes.error)
            }

            res.json({ status: "success", addedUserWithUsername: username, addedUserWithUserID: reviewRes.insertedId })
        } catch (err) {
            res.status(500).json({ error: err.message })
        }
    }

    static async apiUpdateUsers(req, res, next) {
        try {
            const id = req.body.id
            const update = req.body.update

            if (id === undefined || update === undefined) {
                throw new Error("ID or Update Object is Undefined")
            }

            const reviewRes = await UsersDAO.updateUser(id, update)

            if (reviewRes.error) {
                throw new Error(reviewRes.error)
            }

            res.json({ status: "success", updated: reviewRes })
        } catch (err) {
            res.status(500).json({ error: err.message })
        }
    }

    static async apiDeleteUsers(req, res, next) {
        try {
            const id = req.body.id
            
            if (id === undefined) {
                throw new Error("ID returned undefined.")
            }

            const reviewRes = await UsersDAO.deleteUser(id)

            if (reviewRes.error) {
                throw new Error(reviewRes.error)
            } else {
                res.json({ status: "success", deletedUserWithID: id, response: reviewRes })
            }
        } catch (err) {
            res.status(500).json({ error: `${err.message}` })
        }
    }
}