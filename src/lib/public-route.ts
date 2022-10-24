import { NextFunction, Request, Response } from "express";
import HttpError from "../models/errors/http-error";

function handleError(error: Error) {
    console.error("ERROR: ", error);

    if (error instanceof HttpError) {
        return error;
    } else {
        return new HttpError(500, error.message);
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
            res.contentType("application/json");
            res.status(errorResponse.code).send(JSON.stringify(errorResponse));
        }

        res.end();
    }
};