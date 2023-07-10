/*

This file contains all the possible errors that the API can throw

*/

class NotFoundError extends Error {
    constructor(message) {
        super(message)

        this.name = 'NotFoundError'
        this.statusCode = 404
    }
}

class BadRequestError extends Error {
    constructor(message) {
        super(message)

        this.name = 'BadRequestError'
        this.statusCode = 400
    }
}

class ServerError extends Error {
    constructor(message) {
        super(message)

        this.name = 'ServerError'
        this.statusCode = 500
    }
}

class BadGatewayError extends Error {
    constructor(message) {
        super(message)

        this.name = 'BadGatewayError'
        this.statusCode = 502
    }
}
