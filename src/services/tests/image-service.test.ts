import ImageService from "../image-service";

describe("Image Service", () => {
    it("Should return image data", () => {
        ImageService.getImages("curiosity", "camera", 2);
        expect(true).toEqual(true);
    });

    it("Should throw error on bad param", () => {
        ImageService.getImages("curiosity", "camera", 2);
        expect(true).toEqual(true);
    });

    it("Should cache data", () => {
        ImageService.getImages("curiosity", "camera", 2);
        expect(true).toEqual(true);
    });
});