import axios from 'axios'

export default class AuthTokenController {
    static async getAuthToken(req, res, next) {
        try {
            const accessToken = req.query.accessToken

            if (accessToken === undefined) {
                throw new Error("Access Token required to get Authorisation Token")
            }

            var apiOptions = {
                method: "POST",
                url: "https://projmatch.us.auth0.com/oauth/token",
                headers: {
                    "content-type": "application/x-www-form-urlencoded",
                },
                data: new URLSearchParams({
                    grant_type: "authorization_code",
                    client_id: process.env.AUTH0_CLIENT_ID,
                    client_secret: process.env.AUTH0_CLIENT_SECRET,
                    audience: process.env.AUTH0_AUDIENCE,
                    code: accessToken,
                    redirect_uri: `${process.env.AUTH0_BASE_URL}/Load`,
                }),
            };

            let token
            await axios.request(apiOptions).then((res) => {
                token = res.data["access_token"]
            })
            .catch((err) => {
                throw new Error(`Error in calling Auth0 OAuth: ${err}`)
            })
            
            if (token === undefined || token === "") {
                throw new Error("Authorisation Token is empty/undefined")
            }
            
            res.json({ status: "success", token: token})
        } catch (err) {
            res.status(500).json({ error: err.message })
        }
    }
}