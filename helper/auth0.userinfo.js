import axios from "axios"

export default class Auth0UserInfo {
    static async getUserInformationAuth0(bearerToken) {
        const apiOptions = {
            method: "GET",
            url: `${process.env.AUTH0_ISSUER_BASE_URL}/userinfo`,
            headers: {
                "content-type": "application/json",
                authorization: `Bearer ${bearerToken}`,
            },
        }

        const response = await axios.request(apiOptions)
        return response
    }
}