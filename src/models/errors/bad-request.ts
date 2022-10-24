import HttpError from "./http-error";

export default class BadRequest extends HttpError {
    constructor(message: string = "Bad request. Check your input and try again.") {
        super("BadRequest", 404, message);
    }
}