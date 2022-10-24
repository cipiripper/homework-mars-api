import Image from "../models/image";
import ImagesGetResponse from "../models/responses/images-get-response";
import CacheService from "./cache-service";
import NasaAPIService from "./nasa-api-service";

class ImageService {
    public async getImages(rover: string, camera: string, sol: number): Promise<ImagesGetResponse> {
        const cacheKey = `${rover}-${camera}-${sol}`;
        const isCached = await CacheService.isCached(cacheKey);
        if (isCached) {
            const object = await CacheService.getObject(cacheKey);
            return object as ImagesGetResponse;
        } else {
            const data = await NasaAPIService.getMarsRoverPhotos(rover, camera, sol);
            const response = data.photos.reduce((res: ImagesGetResponse, image: any) => {
                res.rover = image.rover.name;
                res.camera = image.camera.name;
                res.photos.push({
                    url: image.img_src,
                    date: image.earth_date,
                    id: image.id,
                    sol: image.sol
                });

                return res;
            }, new ImagesGetResponse());

            await CacheService.set(cacheKey, response);
            return response;
        }
    }
}

export default new ImageService();