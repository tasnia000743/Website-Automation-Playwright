import { APIRequestContext } from "playwright/test";
import { DataReaderFactory } from "@/data/DataReaderFactory";
export class CommonApiUtils {
    private request: APIRequestContext;

    constructor(request: APIRequestContext) {
        this.request= request;
    }


    public async getApiToken() :Promise<string> {
        const respToken=await this.request.post(process.env.API_BASE_URL!+(await DataReaderFactory.readData("test-data/api-data/api-path-data.json"))[0].auth_path,  {
            
        data: {
            "username": process.env.API_USER_NAME,
            "password": process.env.API_PASSWORD
        }
    });
        return (await respToken.json()).token;
    }
}