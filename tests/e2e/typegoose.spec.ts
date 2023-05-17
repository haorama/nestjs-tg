import { INestApplication } from "@nestjs/common";
import { Server } from "http";
import { AppModule } from "../src/app.module";
import { Test } from "@nestjs/testing";
import * as request from "supertest";

describe("Typegoose", () => {
  let server: Server;
  let app: INestApplication;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    server = app.getHttpServer();
    await app.init();
  });

  it(`should return created document`, (done) => {
    const createDto = { name: "Test User", email: "test@email.com", age: 5 };
    request(server)
      .post("/users")
      .send(createDto)
      .expect(201)
      .end((err, { body }) => {
        expect(body.name).toEqual(createDto.name);
        expect(body.age).toEqual(createDto.age);
        expect(body.email).toEqual(createDto.email);
        done();
      });
  });

  afterEach(async () => {
    await app.close();
  });
});
