import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
// import * as request from 'supertest';

describe('Authentication e2e', async () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  // it('Signup user (POST)', () => {
  //   return request(app.getHttpAdapter())
  //   .post('/signup')
  // });
});
