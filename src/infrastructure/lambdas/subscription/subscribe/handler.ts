import { APIGatewayProxyEvent } from "aws-lambda";
import { SubscriptionBusiness } from "../../../../application/business/SubscriptionBusiness";
import { PlanRepository } from "../../../../domain/repository/PlanRepository";
import { SubscriptionRepository } from "../../../../domain/repository/SubscriptionRepository";
import { buildLambdaResponse, LambdaResponse } from "../../../../utils/HttpUtils";
import middy from "@middy/core";
import { SubscriptionRequest } from "../../../models/request/SubscriptionRequest";
import { UserRepository } from "../../../../domain/repository/userRepository";
import { jsonBodyParser } from "../../../middlewares/parsingMiddleware";
import { zodValidator } from "../../../middlewares/validationMiddleware";
import { errorHandlerMiddleware } from "../../../middlewares/errorHandlerMiddleware";
import { corsMiddleware } from "../../../middlewares/corsMiddleware";
import AuthMiddlewares from "../../../security/middlewares/authMiddlewares";

const subscriptionRepository = new SubscriptionRepository();
const userRepository = new UserRepository();
const planRepository = new PlanRepository();

export async function subscribe(
    event: APIGatewayProxyEvent
): Promise<LambdaResponse> {
    const response = await new SubscriptionBusiness(subscriptionRepository, userRepository, planRepository).subscribe(event.body as unknown as SubscriptionRequest);
    return buildLambdaResponse(response.statusCode, response);
}

export const handler = middy(subscribe)
    .use(jsonBodyParser())
    .use(zodValidator(SubscriptionRequest.validateSchema()))
    .use(AuthMiddlewares.verifyJwt())
    .use(AuthMiddlewares.cheackRoles(['PRODUCER', 'USER']))
    .use(errorHandlerMiddleware())
    .use(corsMiddleware());