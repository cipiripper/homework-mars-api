export default class HttpError {
    code: number;
    message: string;
    error: string;

    constructor(error: string, code: number, message: string) {
        this.error = error;
        this.code = code;
        this.message = message;
    }
}