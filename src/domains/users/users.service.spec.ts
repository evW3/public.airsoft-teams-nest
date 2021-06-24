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
                        },
                        save(user: any) {
                            return user;
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

    it('should save mock user', async function(done) {
        const tmpUser = new Users();
        tmpUser.email = 'someEmail@gmail.com';
        tmpUser.password = 'test';
        expect(await usersService.save(tmpUser)).toEqual(tmpUser);
        done();
    });

});