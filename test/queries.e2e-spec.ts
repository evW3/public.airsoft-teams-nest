import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { Teams } from '../src/domains/teams/teams.model';
import { Connection } from 'typeorm';
import { Users } from '../src/domains/users/users.model';
import { QueryParams } from '../src/domains/queries/queryParams.model';
import { Queries } from '../src/domains/queries/queries.model';
const request = require('supertest')

let response: any;
let app: INestApplication;

const mockCreateUser = {
    email: '1happyrock11@gmail.com',
    password: 'test',
    repeatPassword: 'test'
}

describe('Queries', () => {
    let token: string;
    let adminToken: string;
    let mockTeam = { name: 'newTeam' }

    let teamEntity: Teams;
    let queryJoinTeamEntity: Queries;
    let queryRoleEntity: Queries;
    let queryExitTeamEntity: Queries;

    beforeAll(async (done) => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();

        const response1 = await request(app.getHttpServer())
            .post('/auth/sign-up')
            .send(mockCreateUser)
            .expect(HttpStatus.CREATED)
        token = response1.body.token;

        const response2 = await request(app.getHttpServer())
            .post('/auth/sign-in')
            .send({ ...mockCreateUser, repeatPassword: undefined, email: '1happyrock1@gmail.com' })
            .expect(HttpStatus.OK)
        adminToken = response2.body.token;

        done();
    });

    it('Change role query', async (done) => {
        const response = await request(app.getHttpServer())
            .post('/queries/change-role')
            .set({ 'Authorization': `Bearer ${token}` })
            .expect(HttpStatus.CREATED)
        expect(response.body).not.toBeUndefined();
        queryRoleEntity = response.body;
        done();
    });

    it('Create team', async (done) => {
        response = await request(app.getHttpServer())
            .post('/teams/')
            .set({ 'Authorization': `Bearer ${adminToken}` })
            .send(mockTeam)
            .expect(HttpStatus.CREATED);
        expect(response.body).not.toBeUndefined();
        teamEntity = response.body;
        done();
    });

    it('Create join team query', async (done) => {
        response = await request(app.getHttpServer())
            .post('/queries/join-team')
            .set({ 'Authorization': `Bearer ${token}` })
            .send({ teamId: teamEntity.id })
            .expect(HttpStatus.CREATED);
        expect(response.body).not.toBeUndefined();
        queryJoinTeamEntity = response.body;
        done();
    });

    it('Accept join team query', async (done) => {
        const tmpResponse = await request(app.getHttpServer())
            .patch('/players/accept-join-team')
            .set({ 'Authorization': `Bearer ${adminToken}` })
            .send({queryId: queryJoinTeamEntity.id})
            .expect(HttpStatus.OK);
        expect(tmpResponse.body).not.toBeUndefined();
        queryJoinTeamEntity = tmpResponse.body;
        done();
    });

    it('Create exit team query', async (done) => {
        const response = await request(app.getHttpServer())
            .post('/queries/exit-team')
            .set({ 'Authorization': `Bearer ${token}` })
            .expect(HttpStatus.CREATED);
        expect(response.body).not.toBeUndefined();
        queryExitTeamEntity = response.body;
        done();
    });

    it('Get queries', async (done) => {
        const response = await request(app.getHttpServer())
            .get('/queries/')
            .set({ 'Authorization': `Bearer ${adminToken}` })
            .expect(HttpStatus.OK);
        expect(response.body).not.toBeUndefined();
        done();
    });

    afterAll(async (done) => {
        const connection = app.get(Connection);

        await connection
            .getRepository(QueryParams)
            .remove(queryJoinTeamEntity.queryParams);

        await connection
            .getRepository(Queries)
            .remove(queryJoinTeamEntity);

        await connection
            .getRepository(Queries)
            .remove(queryRoleEntity);

        await connection
            .getRepository(Queries)
            .remove(queryExitTeamEntity);

        await connection
            .getRepository(Teams)
            .remove(teamEntity);

        let userEntity = await connection
            .getRepository(Users)
            .findOne({ where:  {email: mockCreateUser.email } });

        if(userEntity) {
            await connection
                .getRepository(Users)
                .remove(userEntity);
        }

        done();
    });
});
