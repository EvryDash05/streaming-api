import middy from "@middy/core";
import { PlanBusiness } from "../../../../application/business/PlanBusiness";
import { PlanRepository } from "../../../../domain/repository/PlanRepository";
import { buildLambdaResponse, LambdaResponse } from "../../../../utils/HttpUtils";
import { corsMiddleware } from "../../../middlewares/corsMiddleware";
import { errorHandlerMiddleware } from "../../../middlewares/errorHandlerMiddleware";
import AuthMiddlewares from "../../../security/middlewares/authMiddlewares";

const planRepository = new PlanRepository();

export async function getAllPlansHandler(): Promise<LambdaResponse> {
    const response = await new PlanBusiness(planRepository).getAllPlans();
    return buildLambdaResponse(response.statusCode, response);
}

export const handler = middy(getAllPlansHandler)
    .use(AuthMiddlewares.verifyJwt())
    .use(AuthMiddlewares.cheackRoles(['USER', 'PRODUCER']))
    .use(errorHandlerMiddleware())
    .use(corsMiddleware());