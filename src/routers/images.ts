import { Router } from "express";
import ImagesController from "../controllers/images-controller";
import PublicRoute from "../lib/public-route";

const router = Router();

router.get("/images/:rover/:camera/:sol", PublicRoute(ImagesController.getImage));

export default router;