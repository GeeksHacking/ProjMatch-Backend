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

// Test Users
describe("Testing Users API", () => {
    describe("POST /api/v1/users", () => {
        test("Send an unauthenticated request", async () => {
            await api.post("/api/v1/users").expect(401)
        })
    
        describe("Test authenticated requests", () => {
            test("Authenticated POST request", async () => {
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
    
            if (accessToken === undefined) {
                throw new Error("Access token returned undefined")
            }
    
            if (sampleUserUid === undefined) {
                throw new Error("Sample User's UID is undefined")
            }
    
            sampleUser.id = sampleUserUid
    
            const response = await api.put(`/api/v1/users`).set('Authorization', `Bearer ${accessToken}`).send(updateUser)
            expect(response.statusCode).toBe(200)
            expect(response.body.status).toBe("success")
        })
    
        test("Validate PUT Request", async () => {
    
            if (accessToken === undefined) {
                throw new Error("Access token returned undefined")
            }
    
            if (sampleUserUid === undefined) {
                throw new Error("Sample User's UID is undefined")
            }
            sampleUser.id = sampleUserUid
    
            const response = await api.get(`/api/v1/users?id=${sampleUserUid}`).set('Authorization', `Bearer ${accessToken}`)
            expect(response.statusCode).toBe(200)
            expect(response.body.users[0].regPhone).toEqual(updateUser["update"]["regPhone"])
        })
    })
    
    describe("DELETE /api/v1/users", () => {
        test("Send DELETE Request", async () => {
    
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
})

// Test Posts
describe("Testing Posts API", () => {
    describe("POST /api/v1/posts", () => {
        test("Send an unauthenticated request", async () => {
            await api.post("/api/v1/posts").expect(401)
        })
    
        describe("Test authenticated requests", () => {
            test("Authenticated POST request", async () => {
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
                if (accessToken === undefined) {
                    throw new Error("Access token returned undefined")
                }
    
                await api.get("/api/v1/posts").set('Authorization', `Bearer ${accessToken}`).expect(200).expect('Content-Type', /application\/json/)
            })
    
            test("Filter by Project UID", async () => {
    
                if (accessToken === undefined) {
                    throw new Error("Access token returned undefined")
                }
    
                const response = await api.get(`/api/v1/posts?id=${sampleProjectUid}`).set('Authorization', `Bearer ${accessToken}`)
                expect(response.statusCode).toBe(200)
                expect(response.body.totalPosts).toEqual(1)
                expect(response.body.posts[0].projectName).toEqual(sampleProject.projectName)
            })
    
            test("Filter by User UID", async () => {
    
                if (accessToken === undefined) {
                    throw new Error("Access token returned undefined")
                }
    
                const response = await api.get(`/api/v1/posts?userID=${sampleProject.creatorUserID}`).set('Authorization', `Bearer ${accessToken}`)
                expect(response.statusCode).toBe(200)
                expect(response.body.totalPosts).toEqual(1)
                expect(response.body.posts[0].projectName).toEqual(sampleProject.projectName)
            })
    
            test("Filter but does not exist", async () => {
    
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
    
            if (accessToken === undefined) {
                throw new Error("Access token returned undefined")
            }
    
            updateProject.id = sampleProjectUid
    
            const response = await api.put(`/api/v1/posts`).set('Authorization', `Bearer ${accessToken}`).send(updateProject)
            expect(response.statusCode).toBe(200)
            expect(response.body.status).toBe("success")
        })
    
        test("Validate PUT Request", async () => {
    
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
})