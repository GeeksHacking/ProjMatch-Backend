const app = require("../index.js")
const supertest = require("supertest")
const axios = require("axios")
const dotenv = require("dotenv")

dotenv.config("../.env")
const api = supertest(app)

// Sample Data
const sampleProject = {
    "projectName": "Sample Project",
    "description": "This just a test wow",
    "creatorUserID": "SOMEUSERID",
    "contact": "discord.gg/idkdoesthisexist",
    "tags": ["tag1", "tag2"],
    "technologies": ["tech1", "tech2"],
    "images": "no",
}
let sampleProjectUid;

describe("POST /api/v1/posts", () => {
    test("Send an unauthenticated request", async () => {
        await api.post("/api/v1/posts").expect(401)
    })

    describe("Test authenticated requests", () => {
        test("Authenticated POST request", async () => {
            const accessToken = await require("./jest.setup.cjs")()

            if (accessToken === undefined) {
                throw new Error("Access token returned undefined")
            }

            const response = await api.post("/api/v1/posts").set('Authorization', `Bearer ${accessToken}`).send(sampleProject)
            expect(response.statusCode).toBe(200)
            expect(response.body.status).toEqual("success")
            expect(response.body.insertedProjectWithID).not.toBeUndefined()
            sampleProjectUid = response.body.insertedProjectWithID
        })
    })
})

describe("GET /api/v1/posts", () => {
    test("Send an unauthenticated request", async () => {
        await api.get("/api/v1/posts").expect(401)
    })

    describe("Test authenticated requests", () => {
        test("Get all Users", async () => {
            const accessToken = await require("./jest.setup.cjs")()

            if (accessToken === undefined) {
                throw new Error("Access token returned undefined")
            }

            await api.get("/api/v1/posts").set('Authorization', `Bearer ${accessToken}`).expect(200).expect('Content-Type', /application\/json/)
        })

        test("Filter by Project UID", async () => {
            const accessToken = await require("./jest.setup.cjs")()

            if (accessToken === undefined) {
                throw new Error("Access token returned undefined")
            }

            const response = await api.get(`/api/v1/posts?id=${sampleProjectUid}`).set('Authorization', `Bearer ${accessToken}`)
            expect(response.statusCode).toBe(200)
            expect(response.body.totalPosts).toEqual(1)
            expect(response.body.posts[0].projectName).toEqual(sampleProject.projectName)
        })

        test("Filter by User UID", async () => {
            const accessToken = await require("./jest.setup.cjs")()

            if (accessToken === undefined) {
                throw new Error("Access token returned undefined")
            }

            const response = await api.get(`/api/v1/posts?userID=${sampleProject.creatorUserID}`).set('Authorization', `Bearer ${accessToken}`)
            expect(response.statusCode).toBe(200)
            expect(response.body.totalPosts).toEqual(1)
            expect(response.body.posts[0].projectName).toEqual(sampleProject.projectName)
        })

        test("Filter but does not exist", async () => {
            const accessToken = await require("./jest.setup.cjs")()

            if (accessToken === undefined) {
                throw new Error("Access token returned undefined")
            }

            const response = await api.get(`/api/v1/posts?userID=SOMETOKENTHATNOEXIST`).set('Authorization', `Bearer ${accessToken}`)
            expect(response.statusCode).toBe(200)
            expect(response.body.totalPosts).toEqual(0)
        })
    })
})

describe("PUT /api/v1/posts", () => {
    const updateProject = {
        "id": sampleProjectUid,
        "update": {
            "projectName": "Sample Updated Project"
        }
    }

    test("Send PUT Request", async () => {
        const accessToken = await require("./jest.setup.cjs")()

        if (accessToken === undefined) {
            throw new Error("Access token returned undefined")
        }

        updateProject.id = sampleProjectUid

        const response = await api.put(`/api/v1/posts`).set('Authorization', `Bearer ${accessToken}`).send(updateProject)
        expect(response.statusCode).toBe(200)
        expect(response.body.status).toBe("success")
    })

    test("Validate PUT Request", async () => {
        const accessToken = await require("./jest.setup.cjs")()

        if (accessToken === undefined) {
            throw new Error("Access token returned undefined")
        }

        if (sampleProjectUid === undefined) {
            throw new Error("Sample User's UID is undefined")
        }

        updateProject.id = sampleProjectUid

        const response = await api.get(`/api/v1/posts?id=${sampleProjectUid}`).set('Authorization', `Bearer ${accessToken}`)
        expect(response.statusCode).toBe(200)
        expect(response.body.posts[0].projectName).toEqual(updateProject["update"]["projectName"])
    })
})

describe("DELETE /api/v1/posts", () => {
    test("Send DELETE Request", async () => {
        const accessToken = await require("./jest.setup.cjs")()

        if (accessToken === undefined) {
            throw new Error("Access token returned undefined")
        }

        if (sampleProjectUid === undefined) {
            throw new Error("Sample User's UID is undefined")
        }

        const deleteProject = {
            "id": sampleProjectUid
        }

        const response = await api.delete(`/api/v1/posts`).set('Authorization', `Bearer ${accessToken}`).send(deleteProject)
        expect(response.statusCode).toBe(200)
        expect(response.body.status).toBe("success")
        expect(response.body.deletedProjectWithID).toEqual(sampleProjectUid)
    })

    test("Validate DELETE Request", async () => {
        const accessToken = await require("./jest.setup.cjs")()

        if (accessToken === undefined) {
            throw new Error("Access token returned undefined")
        }

        if (sampleProjectUid === undefined) {
            throw new Error("Sample User's UID is undefined")
        }

        const response = await api.get(`/api/v1/posts?id=${sampleProjectUid}`).set('Authorization', `Bearer ${accessToken}`)
        expect(response.statusCode).toBe(200)
        expect(response.body.totalPosts).toEqual(0)
    })
})