import { NextFunction, Request, Response } from "express";
import BadRequest from "../models/errors/bad-request";
import HttpError from "../models/errors/http-error";
import Image from "../models/image";
import ImageService from "../services/image-service";
import Controller from "./controller";

export const ROVER_NAMES = {
    "CURIOSITY": 1,
    "OPPORTUNITY": 1,
    "SPIRIT": 1
};

export const CAMERA_NAMES = {
    "FHAZ": 1,
    "RHAZ": 1,
    "MAST": 1,
    "CHEMCAM": 1,
    "MAHLI": 1,
    "MARDI": 1,
    "NAVCAM": 1,
    "PANCAM": 1,
    "MINITES": 1
};

export default class Images extends Controller {
    public static getImage(req: Request, res: Response) {
        const camera = req.params.camera;
        const rover = req.params.rover;
        const sol = Number(req.params.sol);

        Controller.checkValueContainedIn(rover, "rover", ROVER_NAMES);
        Controller.checkValueContainedIn(camera, "camera", CAMERA_NAMES);

        if (sol < 0) {
            throw new BadRequest('Sol has to be a positive integer.');
        }

        return ImageService.getImages(rover, camera, sol);
    }
}