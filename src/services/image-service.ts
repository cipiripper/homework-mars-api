import CacheService from "./cache-service";
import NasaAPIService, { CAMERA_NAMES, MarsRoverPhoto, ROVER_NAMES } from "./nasa-api-service";

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
                res.photos.push({
                    url: image.img_src,
                    date: image.earth_date,
                    id: image.id
                });
                return res;
            }, new ImagesGetResponse(rover, camera, sol));

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

export interface Image {
    url: String;
    date: String;
    id: number;
}

export class ImagesGetResponse {
    public rover: String | null;
    public camera: String | null;
    public photos: Array<Image>;
    public sol: number;
    public metadata: any;

    constructor(rover: string, camera: string, sol: number) {
        this.rover = (ROVER_NAMES as any)[rover.toUpperCase()];
        this.camera = (CAMERA_NAMES as any)[camera.toUpperCase()];
        this.photos = [];
        this.sol = sol;
    }
}

export default new ImageService();