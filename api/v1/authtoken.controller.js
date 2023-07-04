import axios from "axios";
require("dotenv").config()

export default class TokenController {
    static async getAccessToken(req, res, next) {
        try {
            const accessToken = req.body.accessToken

            if (accessToken === undefined) {
                throw new Error("Access Token returned undefined")
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
                    code: accessToken,
                    audience: process.env.AUTH0_AUDIENCE,
                    redirect_uri: process.env.AUTH0_BASE_URL + "/Home",
                }),
            };

            axios
			.request(apiOptions)
			.then(function (res) {
                res.status(200).json({ token: responseBody["access_token"] })
			})
			.catch(function (err) {
                throw new Error(err)
			});
        } catch (err) {
            res.status(500).json({ error: err.message })
        }
    }
}

/*

const storeAuthToken = async (accessToken) => {
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
				code: accessToken,
				audience: process.env.AUTH0_AUDIENCE,
				redirect_uri: process.env.AUTH0_BASE_URL + "/Home",
			}),
		};

		axios
			.request(apiOptions)
			.then(function (res) {
				const responseBody = res.data;
				localStorage.setItem(
					"authorisation_token",
					responseBody["access_token"]
				);
			})
			.catch(function (err) {
				console.error("Failed to get API Authentication Token with: ", err);
			});
	};

*/