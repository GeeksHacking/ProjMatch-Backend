const app = require("../index.js")
const supertest = require("supertest")
const axios = require("axios")
const dotenv = require("dotenv")

dotenv.config("../.env")
const api = supertest(app)

// Sample Data
let sampleUserUid;
const sampleUser = {
    "username": "Im a TESTTTT",
    "rlName": "API Testing -- Mock User",
    "regEmail": "test@test.com",
    "regPhone": 0
}

describe("POST /api/v1/users", () => {
    test("Send an unauthenticated request", async () => {
        await api.post("/api/v1/users").expect(401)
    })

    describe("Test authenticated requests", () => {
        test("Authenticated POST request", async () => {
            const accessToken = await require("./jest.setup.cjs")()

            if (accessToken === undefined) {
                throw new Error("Access token returned undefined")
            }

            const response = await api.post("/api/v1/users").set('Authorization', `Bearer ${accessToken}`).send(sampleUser)
            expect(response.statusCode).toBe(200)
            expect(response.body.addedUserWithUsername).toEqual(sampleUser["username"])
            expect(response.body.addedUserWithUserID).not.toBeUndefined()
            sampleUserUid = response.body.addedUserWithUserID
        })
    })
})

describe("GET /api/v1/users", () => {
    test("Send an unauthenticated request", async () => {
        await api.get("/api/v1/users").expect(401)
    })

    describe("Test authenticated requests", () => {
        test("Get all Users", async () => {
            const accessToken = await require("./jest.setup.cjs")()

            if (accessToken === undefined) {
                throw new Error("Access token returned undefined")
            }

            try {
                const response = await api.get("/api/v1/users").set('Authorization', `Bearer ${accessToken}`).expect('Content-Type', /application\/json/)
                expect(response.statusCode).toBe(200)

            } catch (e) {
                throw new Error(`Expected Status 200, got error with ${e}`)
            }
        })

        test("Filter by UID", async () => {
            const accessToken = await require("./jest.setup.cjs")()

            if (accessToken === undefined) {
                throw new Error("Access token returned undefined")
            }

            if (sampleUserUid === undefined) {
                throw new Error("Sample User's UID is undefined")
            }

            const response = await api.get(`/api/v1/users?id=${sampleUserUid}`).set('Authorization', `Bearer ${accessToken}`)
            expect(response.statusCode).toBe(200)
            expect(response.body.users[0].regEmail).toContain(sampleUser["regEmail"])
            expect(response.body.users[0]._id).toContain(sampleUserUid)
        })

        test("Filter by Email", async () => {
            const accessToken = await require("./jest.setup.cjs")()

            if (accessToken === undefined) {
                throw new Error("Access token returned undefined")
            }

            if (sampleUserUid === undefined) {
                throw new Error("Sample User's UID is undefined")
            }

            const response = await api.get(`/api/v1/users?email=${sampleUser["regEmail"]}`).set('Authorization', `Bearer ${accessToken}`)
            expect(response.statusCode).toBe(200)
            expect(response.body.users[0]._id).toContain(sampleUserUid)
            expect(response.body.users[0].regEmail).toContain(sampleUser["regEmail"])
        })
    })
})

describe("PUT /api/v1/users", () => {
    const updateUser = {
        "id": sampleUserUid,
        "update": {
            "regPhone": 12345678
        }
    }

    test("Send PUT Request", async () => {
        const accessToken = await require("./jest.setup.cjs")()

        if (accessToken === undefined) {
            throw new Error("Access token returned undefined")
        }

        if (sampleUserUid === undefined) {
            throw new Error("Sample User's UID is undefined")
        }

        const response = await api.put(`/api/v1/users`).set('Authorization', `Bearer ${accessToken}`).send(updateUser)
        expect(response.statusCode).toBe(200)
        expect(response.body.status).toBe("success")
        console.log(response.body)
    })

    test("Validate PUT Request", async () => {
        const accessToken = await require("./jest.setup.cjs")()

        if (accessToken === undefined) {
            throw new Error("Access token returned undefined")
        }

        if (sampleUserUid === undefined) {
            throw new Error("Sample User's UID is undefined")
        }

        const response = await api.get(`/api/v1/users?id=${sampleUserUid}`).set('Authorization', `Bearer ${accessToken}`)
        expect(response.statusCode).toBe(200)
        expect(response.body.regPhone).toEqual(updateUser["update"]["regPhone"])
    })
})

describe("DELETE /api/v1/users", () => {
    test("Send DELETE Request", async () => {
        const accessToken = await require("./jest.setup.cjs")()

        if (accessToken === undefined) {
            throw new Error("Access token returned undefined")
        }

        if (sampleUserUid === undefined) {
            throw new Error("Sample User's UID is undefined")
        }

        const deleteUser = {
            "id": sampleUserUid
        }

        const response = await api.delete(`/api/v1/users`).set('Authorization', `Bearer ${accessToken}`).send(deleteUser)
        expect(response.statusCode).toBe(200)
        expect(response.body.status).toBe("success")
        expect(response.body.deletedUserWithID).toEqual(sampleUserUid)
    })

    test("Validate DELETE Request", async () => {
        const accessToken = await require("./jest.setup.cjs")()

        if (accessToken === undefined) {
            throw new Error("Access token returned undefined")
        }

        if (sampleUserUid === undefined) {
            throw new Error("Sample User's UID is undefined")
        }

        const response = await api.get(`/api/v1/users?id=${sampleUserUid}`).set('Authorization', `Bearer ${accessToken}`)
        expect(response.statusCode).toBe(200)
        expect(response.body.totalUsers).toEqual(0)
    })
})