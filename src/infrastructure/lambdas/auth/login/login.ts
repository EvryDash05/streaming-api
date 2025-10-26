import { APIGatewayProxyEvent } from "aws-lambda";
import { buildLambdaResponse, LambdaResponse } from "../../../../utils/HttpUtils";

export async function registerUserHandler(
    event: APIGatewayProxyEvent
): Promise<LambdaResponse> {
    return buildLambdaResponse(200, {
        success: false,
        statusCode: 200,
        message: "Login",
        data: null,
        errors: null
    });
}