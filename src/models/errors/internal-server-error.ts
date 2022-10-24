import HttpError from "./http-error";

export default class InternalServerError extends HttpError {
    constructor(message: string) {
        super("InernalServerError", 500, message);
    }
}