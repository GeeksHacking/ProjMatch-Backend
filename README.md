# ProjMatch BackEnd API
Documentation on how to use ProjMatch's Backend API and a brief description on how it works. Do note that the Back-End is only meant to be called from the ProjMatch site ([projmatch.geekshacking.com](https://projmatch.geekshacking.com)) or from localhost.

## Unit Tests
This repository contains Unit Tests for the Images, Posts and Users API. Unit Tests are run on GitHub actions on every push and pull request. Pull requests will only be accepted if all unit tests passes!

## Continuous Delivery
Once a pull request has been approved and merged into main, GitHub Actions is used to automatically dockerise the project, and deploy it to Google Cloud Run. In an event in which the deployment fails, Cloud Run will continue using the last working deployment.

## API Authentication
For testing purposes, an Auth0 Machine-to-Machine (M2M) token is used for authorisation. However, in the production environment, an authorisation token is generated with the user's access token.

---

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

---

## Posts API
The Posts API allows you to get, create, update and delete posts from users.  
**Endpoint:** ```/api/v1/posts```
## Post Schema
```json
{
    "projectName": "",
    "description": "",
    "images": [],
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

---

# Users API
The Users API will allow you to retrieve information about users. To obtain some slightly sensitive information (savedPosts, algoData and technologies), verification of the user's identity is done. With the proper authentication, Users API will allow the front-end to Create, Read, Update and Delete (CRUD) users. 

## Verifying User's Identity
The specifics of how user identity is verified will be discussed under each request type. In short, when the front-end makes a request to this back-end, a Authorisation Bearer Token is sent. This token is a JSON Web Token (JWT), containing information about the authentication type. Using the Authorisation Token, a request is made to the Auth0 ```/userinfo``` endpoint. This endpoint will return information about the user, for instance, the user's email. This email will be matched to the ProjMatch account's email. If it matches, this is considered as the user's identity is verified.

## GET Request
A GET Request allows you to retrieve information about a specific user, or get the list of users in the ProjMatch database. You are also allowed to filter by some parameters. These filter parameters are to be added into the API Request's Query Field.

### Authentication and Response
As mentioned, some data (savedPosts, algoData and technologies) will be filtered if the user sending the request does not match the user in which he/she is retrieving the data of. For instance, if User A tries to get the data of User B, the aforementioned data fields will be removed from the filter request. However, when User A tries to get information on him/herself, those data fields will be added into the request.

### Filtering Users
1. username
2. email
3. userID -- ID of the User stored in MongoDB  

Sample GET Request with a Username Filter: ```(domain)/api/v2/users?username=helloworld```

### Sample Response
Assuming that the user is **NOT** verified:
```json
{
    "username": "",
    "about": "",
    "profileImg": "",
    "bannerImg": "",
    "contact": "",
    "rating": 0.0,
}
```
Assuming the user **IS** verified:
```json
{
    "username": "",
    "about": "",
    "profileImg": "",
    "bannerImg": "",
    "contact": "",
    "rating": 0.0,
    "technologies": [],
    "savedPosts": [],
    "algoData": []
}
```

## POST Request
A POST Request to the Users API allows you to create a new user. However, this method will only be authorised if the contact email of the new user matches the email that is used to sign in with Auth0.  

All fields are required when creating a new user. The **username, contact, about, algoData and skills**. Add these fields into the request body.  

## PUT Request

TODO: POST, PUT and DELETE Requests

---

## Images API
The Images API is deprecated. When performing CRUD Operations on a User/Project, if a new image is to be added, the respective APIs will handle Image Services. The Image URL from S3 will be returned, removing the need for the Images API.