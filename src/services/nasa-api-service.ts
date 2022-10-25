import Axios from "axios";
import ServiceUnavailable from "../models/errors/service-unavailable";

export const ROVER_NAMES = {
    "CURIOSITY": "Curiosity",
    "OPPORTUNITY": "Opportunity",
    "SPIRIT": "Spirit"
};

export const CAMERA_NAMES = {
    "FHAZ": "Front Hazard Avoidance Camera",
    "RHAZ": "Rear Hazard Avoidance Camera",
    "MAST": "Mast Camera",
    "CHEMCAM": "Chemistry and Camera Complex",
    "MAHLI": "Mars Hand Lens Imager",
    "MARDI": "Mars Descent Imager",
    "NAVCAM": "Navigation Camera",
    "PANCAM": "Panoramic Camera",
    "MINITES": "Miniature Thermal Emission Spectrometer (Mini-TES)"
};

class NasaAPIService {
    private key: string;
    private apiRateLimit: number;

    constructor() {
        this.key = process.env.NASA_API_KEY || "DEMO_KEY";
        this.apiRateLimit = Number(process.env.NASA_API_LIMIT) || 0;
    }

    public async getMarsRoverPhotos(rover: string, camera: string, sol: number): Promise<MarsRoverPhoto[]> {
        let photos: MarsRoverPhoto[] = [];

        const response = await Axios.get(`https://api.nasa.gov/mars-photos/api/v1/rovers/${rover}/photos?sol=${sol}&camera=${camera.toLocaleLowerCase()}&api_key=${this.key}`);
        photos = [...response.data.photos];

        const remainingTickets = Number(response.headers['x-ratelimit-remaining']);
        if (remainingTickets <= this.apiRateLimit) {
            throw new ServiceUnavailable();
        }

        return photos;
    }
}

export interface MarsRoverPhoto {
    camera: MarsRoverCamera;
    earth_date: string;
    id: number;
    img_src: string;
    sol: number;
    rover: MarsRover;
}

export interface MarsRoverCamera {
    name: string;
    full_name: string;
    id: number;
    rover_id: number;
}

export interface MarsRover {
    id: number;
    landing_date: string;
    launch_date: string;
    name: string;
    status: string;
}

export default new NasaAPIService();