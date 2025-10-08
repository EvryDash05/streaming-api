import {UserBusiness} from "../../../application/business/UserBusiness";

export async function handler() {

    const response = await new UserBusiness().createUser({
        email: "email@gmail.com",
        password: "1231321_123132adasda"
    });

    return {statusCode: 200, body: JSON.stringify(response)};
}
