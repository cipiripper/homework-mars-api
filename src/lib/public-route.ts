import { NextFunction, Request, Response } from "express";
import HttpError from "../models/errors/http-error";
import ServiceUnavailable from "../models/errors/service-unavailable";
import InternalServerError from "../models/errors/internal-server-error";

function handleError(error: Error) {

    if (error instanceof HttpError) {
        return error;
    } else {
        console.error("ERROR: ", error);
        return new InternalServerError(error.message);
    }
}

export default function PublicRoute(handler: (req: Request, res: Response) => Promise<any>): any {
    return async function handlerExecutor(req: Request, res: Response, next: NextFunction) {
        try {
            const response = await handler(req, res);

            if (typeof response === "object") {
                res.contentType("application/json");
                res.send(JSON.stringify(response, null, 4));
            } else {
                res.contentType("text/html");
                res.send(response);
            }
        } catch (error: HttpError | any) {
            const errorResponse = handleError(error);

            if (error instanceof ServiceUnavailable) {
                res.setHeader('Retry-After', 60);
            }

            res.contentType("application/json");
            res.status(errorResponse.code).send(JSON.stringify(errorResponse, null, 4));
        }

        res.end();
    }
};