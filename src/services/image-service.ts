import Image from "../models/image";
import CacheService from "./cache-service";
import NasaAPIService, { MarsRoverPhoto } from "./nasa-api-service";

class ImageService {
    public async getImages(rover: string, camera: string, sol: number, includeMetadata?: boolean): Promise<ImagesGetResponse> {
        const cacheKey = `${rover}-${camera}-${sol}`;
        const cachedObject = (await CacheService.getObject(cacheKey)) as ImagesGetResponse;

        if (cachedObject) {
            if (includeMetadata) {
                cachedObject.metadata = {
                    fromCache: true
                };
            }
            return cachedObject as ImagesGetResponse;
        } else {
            const images = await NasaAPIService.getMarsRoverPhotos(rover, camera, sol);
            const response = images.reduce((res: ImagesGetResponse, image: MarsRoverPhoto) => {
                res.rover = image.rover.name;
                res.camera = image.camera.full_name;
                res.photos.push({
                    url: image.img_src,
                    date: image.earth_date,
                    id: image.id,
                    sol: image.sol
                });

                return res;
            }, new ImagesGetResponse());

            await CacheService.setObject(cacheKey, response);

            if (includeMetadata) {
                response.metadata = {
                    fromCache: false
                };
            }

            return response;
        }
    }
}

export class ImagesGetResponse {
    public rover: String | null;
    public camera: String | null;
    public photos: Array<Image>;
    public metadata: any;

    constructor() {
        this.rover = null;
        this.camera = null;
        this.photos = [];
    }
}

export default new ImageService();