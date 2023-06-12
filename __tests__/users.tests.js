const app = require("../index.js");
const mongodb = require("mongodb")
import request from 'supertest'

const MongoClient = mongodb.MongoClient

describe("GET /api/v1/users", () => {

    /* Connecting to the database before each test. */
    beforeAll(async () => {
        await MongoClient.connect(process.env.ATLAS_URI);
    });

    /* Closing database connection after each test. */ 
    afterAll(async () => {
        await MongoClient.close();
    });

    test("Send an unauthenticated request", async () => {
        const response = await request(app).get("/api/v1/users")
        expect(response.statusCode).toBe(401)
    })
})