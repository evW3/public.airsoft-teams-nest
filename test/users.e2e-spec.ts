import { HttpStatus, INestApplication } from '@nestjs/common';
const request = require('supertest')
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { Users } from '../src/domains/users/users.model';
import { connection } from 'mongoose';
import { Connection } from 'typeorm';

let app: INestApplication;

const mockCreateUser = {
    email: 'someAnotherEmail@gmail.com',
    password: 'test',
    repeatPassword: 'test'
}

const mockUpdateUser = {
    login: 'eV',
    currentPassword: mockCreateUser.password,
    newPassword: 'new'
}

let response: any;

describe('Users', () => {
    let innerMockUser = { ...mockCreateUser };
    innerMockUser = { ...innerMockUser, repeatPassword: undefined };
    let token: string;

    beforeAll(async (done) => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();

        await request(app.getHttpServer())
            .post('/auth/sign-up')
            .send(mockCreateUser)
            .expect(HttpStatus.CREATED)
            .then(async () => {
                const tmpResponse = await request(app.getHttpServer())
                    .post('/auth/sign-in')
                    .send(innerMockUser)
                    .expect(HttpStatus.OK);
                token = tmpResponse.body.token;
                return;
            })
        done();
    });

    it('get profile', async (done) => {
        response = await request(app.getHttpServer())
            .get('/users/profile')
            .set({ 'Authorization': `Bearer ${token}`})
            .expect(HttpStatus.OK)
        expect(response.body).not.toBeUndefined();
        done();
    });

    it('update profile', async (done) => {
       const response = await request(app.getHttpServer())
           .put('/users/profile')
           .set({ 'Authorization': `Bearer ${token}`})
           .send(mockUpdateUser)
           .expect(HttpStatus.OK)
       expect(response.body).not.toBeUndefined();
       done();
    });

    afterAll(async (done) => {
        const connection = app.get(Connection);

        let userEntity = await connection
            .getRepository(Users)
            .findOne({ where:{ email: mockCreateUser.email } });

        await connection
            .getRepository(Users)
            .remove(userEntity);

        done();
    });
});