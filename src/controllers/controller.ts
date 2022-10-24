import BadRequest from "../models/errors/bad-request";
import HttpError from "../models/errors/http-error";
import InternalServerError from "../models/errors/internal-server-error";

export default abstract class Controller {
    static handleError(error: Error) {
        console.error(`[${this.name}] ERROR: `, error);

        if (error instanceof HttpError) {
            return error;
        } else {
            return new InternalServerError(error.message);
        }
    }

    static checkValueContainedIn(param: string, name: string, values: Object) {
        if (!values.hasOwnProperty(param.toUpperCase())) {
            throw new BadRequest(`Parameter "${name}" must have one of the predefined values: ${Object.keys(values).join(", ")}`);
        }
    }
}