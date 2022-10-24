import Image from "../image";

export default class ImagesGetResponse {
    public rover: String | null;
    public camera: String | null;
    public photos: Array<Image>;

    constructor() {
        this.rover = null;
        this.camera = null;
        this.photos = [];
    }
}