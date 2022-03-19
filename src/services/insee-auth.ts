import { HttpClient } from "./http-client"
import updateDotenv from "update-dotenv"
import dotenv from "dotenv"
dotenv.config({ path: "./.env" })

interface IFormatSirenConfig {
    url: string,
    client: string,
    secret: string,
    access_token: string
    expires_at: number
}
interface IPostResponse {
    access_token: string,
    scope: string,
    token_type: string,
    expires_in: number
}

export class SirenAPI extends HttpClient {
    private basicBase64: string
    constructor(private config: IFormatSirenConfig) {
        super(config.url)
        this.basicBase64 = Buffer.from(`${this.config.client}:${this.config.secret}`).toString("base64")
    }

    public async authentication(): Promise<IFormatSirenConfig> {
        if (!this.isValidToken()) {
            const { access_token, expires_in } = await this.getNewToken()
            this.config.access_token = access_token
            this.config.expires_at += expires_in
            updateDotenv({ SIREN_ACCESS_TOKEN: access_token, SIREN_EXPIRES_AT: this.config.expires_at.toString() })
        }
        return this.config
    }
    private isValidToken(): boolean {
        return this.config.expires_at >= new Date().getTime()
    }

    private getNewToken = () => this.axiosInstance.post<IPostResponse>(this.config.url, "grant_type=client_credentials", {
        headers: {
            "Authorization": `Basic ${this.basicBase64}`,
            "Content-Type": "application/x-www-form-urlencoded"
        }
    })
}
