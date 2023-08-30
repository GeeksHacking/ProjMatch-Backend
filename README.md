# ProjMatch BackEnd API
Documentation on how to use ProjMatch's Backend API and a brief description on how it works. Do note that the Back-End is only meant to be called from the ProjMatch site ([projmatch.geekshacking.com](https://projmatch.geekshacking.com)) or from localhost.

## Unit Tests
This repository contains Unit Tests for the Images, Posts and Users API. Unit Tests are run on GitHub actions on every push and pull request. Pull requests will only be accepted if all unit tests passes!

## Continuous Delivery
Once a pull request has been approved and merged into main, GitHub Actions is used to automatically dockerise the project, and deploy it to Google Cloud Run. In an event in which the deployment fails, Cloud Run will continue using the last working deployment.

## API Authentication
For testing purposes, an Auth0 Machine-to-Machine (M2M) token is used for authorisation. However, in the production environment, an authorisation token is generated with the user's access token.

## Auth Token API
The Auth Token API was created to mask the Auth0 Client ID and Client Secret. The front-end will call the Auth Token API with the user's access token as a parameter, and in turn, the API will return the authorisation token.  
**Endpoint:** ```/api/v1/authtoken```  


### Calling the Auth Token API
The Auth Token API is a **GET** ONLY API. Call the API with the user's access token in the request body.
#### Sample Request Body
```json
{
    accessToken: "token_goes_here"
}
```

## Images API
TODO: Description, GET, POST, PUT and DELETE Requests

## Posts API
The Posts API allows you to get, create, update and delete posts from users.  
**Endpoint:** ```/api/v1/posts```
## Post Schema
```json
{
    "projectName": "",
    "description": "",
    "images", []
    "creatorUserID": "",
    "contact": "",
    "rating": 0.0,
    "tags": [],
    "technologies": [],
    "algoData": []
}
``` 

## GET Request
A GET Request will allow you to obtain information relating to either ALL Posts, or a Specific Post. You are able to specify the number of posts you want to retrieve, and the page number. Depending on the page number, the next _x_ posts will be returned through the API.

### Retrieving Specific Posts
You are able to retrieve specific posts using the following methods: 
1. id -- Project ID
2. userID -- ID of a User (will return all posts created by that user)
3. search -- Project Name

These parameters are to be added into the query field of the URL.
Example of Filter Request: `(domain)/api/v1/posts?search=projmatch`

## POST Request
A POST Request will allow you to create a new project. All information sent to the API in a POST Request shoud be added into the request body. POST Requests require the following compulsory information:
1. projectName
    - The name of the project
    - Type: String
2. description
    - Description of what the project is
    - Type: String
3. creatorUserID
    - ID of the Project Creator
    - Type: String
4. tags
    - Various tags specified by the project creator
    - Type: Array of Strings
5. technologies
    - Technologies that will be used in the project
    - Type: Array of Strings
6. images
    - Call the Image API first to get the image URL in AWS S3 before storing into this array
    - Type: Array of URLs (stored as an Array of Strings)
7. contact
    - How other users can contact the project creator
    - Type: String

## PUT Request
TODO: PUT and Delete Requests
# Users API
TODO: Description, GET, POST, PUT and DELETE Requests