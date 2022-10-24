import ImageService from "../image-service";

describe("ImageService", () => {
    it("Should throw error on bad param", () => {
        ImageService.getImages("curiosity", "camera", 2);
        expect(true).toEqual(true);
    });

    it("Should cache data", async () => {
        const response1 = await ImageService.getImages("curiosity", "FHAZ", 2, true);
        const response2 = await ImageService.getImages("curiosity", "FHAZ", 2, true);

        expect(response1.metadata.fromCache).toEqual(false);
        expect(response2.metadata.fromCache).toEqual(true);
    });
});