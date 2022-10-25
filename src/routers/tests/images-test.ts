import request from 'supertest'
import ApiServer from "../../api-server";
import { CAMERA_NAMES, ROVER_NAMES } from "../../services/nasa-api-service";

let server: ApiServer;

beforeAll(async () => {
    server = new ApiServer(0);
    await server.start();
});

describe("GET /api/images", () => {
    it('Should return valid image list for valid params', async () => {
        const req = request(server.getApp());
        const res = await req.get(`/api/images/curiosity/FHAZ/0`)
            .expect('Content-Type', /json/)
            .expect(200);

        expect(res.body).toHaveProperty("photos");
        expect(res.body).toHaveProperty("camera");
        expect(res.body).toHaveProperty("rover");
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

    it('Should return bad request for negative sol', async () => {
        const req = request(server.getApp());
        const res = await req.get(`/api/images/curiosity/FHAZ/-55`)
            .expect('Content-Type', /json/)
            .expect(404);
    });

    it('Should return bad request for bad sol', async () => {
        const req = request(server.getApp());
        const res = await req.get(`/api/images/curiosity/FHAZ/5.5`)
            .expect('Content-Type', /json/)
            .expect(404);
    });


    it('Should return bad request for string sol', async () => {
        const req = request(server.getApp());
        const res = await req.get(`/api/images/curiosity/FHAZ/SOL_SOL`)
            .expect('Content-Type', /json/)
            .expect(404);
    });
});

afterAll(async () => {
    if (server) {
        server.stop();
    }
});