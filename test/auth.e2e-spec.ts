import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import * as request from 'supertest';

describe('Authentication e2e', () => {
  let app: INestApplication;
  const EMAIL = 'test1@test.com';
  const PASSWORD = '123456';

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('should handle signup request', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email: EMAIL, password: PASSWORD })
      .expect(201);
    const { id, email } = res.body;
    expect(id).toBeDefined();
    expect(email).toEqual(EMAIL);
  });

  it('should signup a new user and get that user', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email: EMAIL, password: PASSWORD })
      .expect(201);

    const cookie = res.get('Set-Cookie');

    const response = await request(app.getHttpServer())
      .get('/auth/whoami')
      .set('Cookie', cookie)
      .expect(200);

    const { id, email } = response.body;
    expect(id).toBeDefined();
    expect(email).toEqual(EMAIL);
  });
});
