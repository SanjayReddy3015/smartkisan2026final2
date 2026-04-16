import serverless from "serverless-http";
import { app, setupApp } from "./index";

let serverlessHandler: any;

export const handler = async (event: any, context: any) => {
    if (!serverlessHandler) {
        await setupApp();
        serverlessHandler = serverless(app);
    }
    return serverlessHandler(event, context);
};
