import { HttpStatus, INestApplication } from '@nestjs/common';
const request = require('supertest')
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { Users } from '../src/domains/users/users.model';
import { connection } from 'mongoose';
import { Connection } from 'typeorm';
import { Queries } from '../src/domains/queries/queries.model';

let app: INestApplication;

const mockCreateUser = {
    email: 'eV@gmail.com',
    password: 'test',
    repeatPassword: 'test'
}

const admin = {
    email: '1happyrock1@gmail.com',
    password: 'test'
}

describe('Managers', () => {
    let token: string;
    let adminToken: string;
    let changeRoleEntity: any;
    let userEntity: any;

    let connection: any;

    beforeAll(async (done) => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();

        connection = app.get(Connection);

        token = (await request(app.getHttpServer())
            .post('/auth/sign-up')
            .send(mockCreateUser)
            .expect(HttpStatus.CREATED))
            .body
            .token;

        adminToken = (await request(app.getHttpServer())
            .post('/auth/sign-in')
            .send(admin)
            .expect(HttpStatus.OK))
            .body
            .token;

        changeRoleEntity = (await request(app.getHttpServer())
            .post('/queries/change-role')
            .set({ 'Authorization': `Bearer ${token}` })
            .expect(HttpStatus.CREATED))
            .body;

        done();
    });

    it('accept change role', async (done) => {
        let tmp = (await request(app.getHttpServer())
            .patch('/managers/accept-change-role')
            .set({ 'Authorization': `Bearer ${adminToken}` })
            .send({ queryId: changeRoleEntity.id })
            .expect(HttpStatus.OK)).body;
        done();
    });

    it('block manager', async (done) => {
        userEntity = await connection
            .getRepository(Users)
            .findOne({ where: { email: mockCreateUser.email } });

        await request(app.getHttpServer())
            .post('/managers/block')
            .set({ 'Authorization': `Bearer ${adminToken}` })
            .send({
                managerId: userEntity.id,
                description: 'someReason'
            })
            .expect(HttpStatus.CREATED);
        done();
    });

    it('unblock manager', async (done) => {
        await request(app.getHttpServer())
            .delete('/managers/unblock')
            .set({ 'Authorization': `Bearer ${adminToken}` })
            .send({
                managerId: userEntity.id,
                description: 'someReason'
            })
            .expect(HttpStatus.OK);
        done();
    });

    afterAll(async (done) => {
        await connection
            .getRepository(Queries)
            .remove(changeRoleEntity)

        await connection
            .getRepository(Users)
            .remove(userEntity);

        done();
    });
});