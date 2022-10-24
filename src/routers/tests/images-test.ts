import request from 'supertest'
import ApiServer from "../../api-server";
import { CAMERA_NAMES, ROVER_NAMES } from "../../controllers/images-controller";

let server: ApiServer;

beforeAll(async () => {
    server = new ApiServer(0);
    await server.start();
});

describe("Images API", () => {
    it('Should return valid image list for valid params', async () => {
        const req = request(server.getApp());
        const res = await req.get(`/api/images/curiosity/FHAZ/0`)
            .expect('Content-Type', /json/)
            .expect(200);

        expect(res.body).toMatchObject({ 'url': 'aaaaaaaa' });
    });

    it('Should return list of rovers for bad rover name', async () => {
        const req = request(server.getApp());
        const res = await req.get(`/api/images/FAKE_ROVER_NAME/FHAZ/0`)
            .expect('Content-Type', /json/)
            .expect(404);

        expect(res.body.message).toContain(Object.keys(ROVER_NAMES).join(", "));
    });

    it('Should return list of cameras for bad camera name', async () => {
        const req = request(server.getApp());
        const res = await req.get(`/api/images/curiosity/FAKE_CAMERA_NAME/0`)
            .expect('Content-Type', /json/)
            .expect(404);

        expect(res.body.message).toContain(Object.keys(CAMERA_NAMES).join(", "));
    });
});

afterAll(async () => {
    if (server) {
        server.stop();
    }
});