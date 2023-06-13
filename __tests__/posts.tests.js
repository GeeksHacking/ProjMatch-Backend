const app = require("../index.js")
const supertest = require("supertest")
const axios = require("axios")
const dotenv = require("dotenv")

dotenv.config("../.env")
const api = supertest(app)

describe("GET /api/v1/posts", () => {
    test("Send an unauthenticated request", async () => {
        await api.get("/api/v1/posts").expect(401)
    })

    describe("Test authenticated requests", () => {
        test("Authenticated GET request", async () => {
            const accessToken = await require("./jest.setup.cjs")()

            if (accessToken === undefined) {
                throw new Error("Access token returned undefined")
            }

            await api.get("/api/v1/posts").set('Authorization', `Bearer ${accessToken}`).expect(200).expect('Content-Type', /application\/json/)
        })
    })
})