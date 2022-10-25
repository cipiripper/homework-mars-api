import ImageService from "../image-service";

describe("ImageService", () => {
    it("Should not throw error on bad param", async () => {
        const response = await ImageService.getImages("curiosity", "camera", 2);
        expect(response.camera).toBeUndefined();

    });

    it("Should cache data", async () => {
        const response1 = await ImageService.getImages("curiosity", "FHAZ", 2, true);
        const response2 = await ImageService.getImages("curiosity", "FHAZ", 2, true);

        expect(response1.metadata.fromCache).toEqual(false);
        expect(response2.metadata.fromCache).toEqual(true);
    });
});