import HttpError from "./http-error";

export default class ServiceUnavailable extends HttpError {
    constructor(message: string = "Service Unavailable at the moment, please try again in 60 seconds.") {
        super("ServiceUnavailable", 503, message);
    }
}