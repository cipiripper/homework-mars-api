import { Request, Response } from "express";
import BadRequest from "../models/errors/bad-request";
import ImageService from "../services/image-service";
import { CAMERA_NAMES, ROVER_NAMES } from "../services/nasa-api-service";
import Controller from "./controller";

export default class Images extends Controller {
    public static getImage(req: Request, res: Response) {
        const camera = req.params.camera;
        const rover = req.params.rover;
        const sol = Number(req.params.sol);

        Controller.checkValueContainedIn(rover, "rover", ROVER_NAMES);
        Controller.checkValueContainedIn(camera, "camera", CAMERA_NAMES);

        if (isNaN(sol) || !Number.isInteger(sol) || sol < 0) {
            throw new BadRequest('Sol has to be a positive integer.');
        }

        return ImageService.getImages(rover, camera, sol);
    }
}