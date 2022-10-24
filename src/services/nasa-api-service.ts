import Image from "../models/image";
import Axios from "axios";

class NasaAPIService {
    private key: string;

    constructor() {
        this.key = process.env.NASA_API_KEY || "DEMO_KEY";
    }

    public async getMarsRoverPhotos(rover: string, camera: string, sol: number) {
        const response = await Axios.get(`https://api.nasa.gov/mars-photos/api/v1/rovers/${rover}/photos?sol=${sol}&camera=${camera.toLocaleLowerCase()}&api_key=${this.key}`);
        return response.data;
    }
}

export default new NasaAPIService();