const app = require("../index.js")
const supertest = require("supertest")
const axios = require("axios")
const dotenv = require("dotenv")

dotenv.config("../.env")
const api = supertest(app)

describe("GET /api/v1/users", () => {
    test("Send an unauthenticated request", async () => {
        await api.get("/api/v1/users").expect(401)
    })

    describe("Test authenticated requests", () => {
        test("Authenticated GET request", async () => {
            const accessToken = await require("./jest.setup.cjs")()

            if (accessToken === undefined) {
                throw new Error("Access token returned undefined")
            }

            try {
                await api.get("/api/v1/users").set('Authorization', `Bearer ${accessToken}`).expect(200).expect('Content-Type', /application\/json/)
            } catch (e) {
                throw new Error(`Expected Status 200, got error with ${e}`)
            }

        })
    })
})