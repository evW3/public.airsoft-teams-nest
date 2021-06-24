import { UsersService } from './users.service';
import { Users } from './users.model';
import { BlockList } from '../blockList/blockList.model';
import { BlockListService } from '../blockList/blockList.service';
import { SMTPService } from './SMTP.service';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

describe('[UNIT] Users', () => {
    const mockResult = ['test'];
    let usersService: UsersService;

    beforeAll(async () => {
        const module = await Test.createTestingModule({
            imports: [
                ConfigModule.forRoot({
                    envFilePath: [`.${process.env.NODE_ENV}.env`]
                }),
                JwtModule.register({
                    secret: process.env.TOKEN_CODE_KEY,
                    signOptions: { expiresIn: process.env.TOKEN_CODE_EXPIRES_IN }
                }),
            ],
            providers: [
                UsersService,
                SMTPService,
                BlockListService,
                {
                    provide: getRepositoryToken(Users),
                    useValue: {
                        findOne() {
                            return ['test']
                        }
                    },
                },
                {
                    provide: getRepositoryToken(BlockList),
                    useValue: {}
                }
            ],
        }).compile();
        usersService = await module.get<UsersService>(UsersService);
    });

    it('should return mock user', async function(done) {
        expect(await usersService.getUser(1)).toEqual(mockResult);
        done();
    });
});