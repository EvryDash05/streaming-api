import { APIGatewayProxyEvent } from "aws-lambda";
import { PlanRepository } from "../../../../domain/repository/PlanRepository";
import { UserRepository } from "../../../../domain/repository/userRepository";
import { buildLambdaResponse, LambdaResponse } from "../../../../utils/HttpUtils";
import { PaymentBusiness } from "../../../../application/business/PaymentBusiness";
import { SubscriptionRequest } from "../../../models/request/SubscriptionRequest";
import { jsonBodyParser } from "../../../middlewares/parsingMiddleware";
import { zodValidator } from "../../../middlewares/validationMiddleware";
import AuthMiddlewares from "../../../security/middlewares/authMiddlewares";
import middy from "@middy/core";
import { errorHandlerMiddleware } from "../../../middlewares/errorHandlerMiddleware";
import { corsMiddleware } from "../../../middlewares/corsMiddleware";

const userRepository = new UserRepository();
const planRepository = new PlanRepository();

export async function paySubscription(
    event: APIGatewayProxyEvent
): Promise<LambdaResponse> {
    const response = await new PaymentBusiness(userRepository, planRepository).createPaymentPreference(event.body as unknown as SubscriptionRequest);
    return buildLambdaResponse(response.statusCode, response);
}

export const handler = middy(paySubscription)
    .use(jsonBodyParser())
    .use(zodValidator(SubscriptionRequest.validateSchema()))
    .use(AuthMiddlewares.verifyJwt())
    .use(AuthMiddlewares.cheackRoles(['PRODUCER', 'USER']))
    .use(errorHandlerMiddleware())
    .use(corsMiddleware());