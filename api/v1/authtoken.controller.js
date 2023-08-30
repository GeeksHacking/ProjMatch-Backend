import axios from 'axios'

export default class AuthTokenController {
    static async getAuthToken(req, res, next) {
        try {
            const accessToken = req.body.accessToken

            if (accessToken === undefined) {
                throw new Error("Access Token required to get Authorisation Token")
            }

            const getToken = async (accessToken) => {
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

                try {
                    const response = await axios.request(apiOptions)

                    const accessToken = response.data["access_token"]
                    return accessToken
                } catch (err) {
                    console.error("Failed to get API Authentication Token with: ", err);
                }
            }

            const token = await getToken(accessToken)
            if (token === undefined || token === "") {
                throw new Error("Authorisation Token is empty/undefined")
            }
            
            res.json({ status: "success", token: token})
        } catch (err) {
            res.status(500).json({ error: err.message })
        }
    }
}