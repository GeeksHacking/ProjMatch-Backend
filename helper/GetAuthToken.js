export default function GetAuthToken(authHeader) {
    try {
        if (authHeader === undefined || authHeader === "" || !authHeader.includes("Bearer")) {
            throw new Error()
        }
        
        const bearerToken = authHeader.split(" ")[1]
        return bearerToken
    } catch (err) {
        throw {
            "msg": "Unable to extract Authentication Bearer Token",
            "statusCode": 401
        }
    }
}