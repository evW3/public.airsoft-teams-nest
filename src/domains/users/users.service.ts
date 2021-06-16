import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getManager, Repository } from 'typeorm';

import { Users } from './users.model';
import { BcryptService } from '../auth/bcrypt.service';
import { VerificationCodes } from './verificationCodes.model';
import { TransportSendRecoverTokenDto } from './dto/transportSendRecoverToken.dto';
import { SMTPService } from './SMTP.service';
import { TokenService } from '../auth/token.service';
import { VerificationCodesService } from './verificationCodes.service';
import { TransportRecoverPasswordDto } from './dto/transportRecoverPassword.dto';
import { TransportUpdateProfileDto } from './dto/transportUpdateProfile.dto';
import path from "path";
import { srcFolder, url } from '../../constants';
import fs from "fs";
import { v4 as uuid } from 'uuid';
import { Express } from 'express';
import { Queries } from '../queries/queries.model';
import { BlockList } from '../blockList/blockList.model';

@Injectable()
export class UsersService {
    constructor(@InjectRepository(Users) private usersRepository: Repository<Users>,
                private readonly smtpService: SMTPService,
                private readonly tokenService: TokenService,
                private readonly bcryptService: BcryptService,
                private readonly verificationCodesService: VerificationCodesService) {}

    async sendRecoverCode(transportSendRecoverToken: TransportSendRecoverTokenDto) {
        try {
            const user = await this.getUserByEmail(transportSendRecoverToken.email);
            const verificationCodeEntity = new VerificationCodes();
            verificationCodeEntity.user = user;
            const codeId = await this.verificationCodesService.create(verificationCodeEntity);
            const recoverToken = this.tokenService.createRecoverToken(user.id, codeId);
            await this.smtpService.sendMail(recoverToken, 'Recover Password', user.email);

            return { message: 'Check ur email, token was sent', status: HttpStatus.OK };
        } catch (e) {
            if(e instanceof HttpException)
                return e;
            else
                new HttpException('Server error!', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async recoverPassword(transportRecoverPassword: TransportRecoverPasswordDto) {
        const userEntity = await getManager().findOne(Users, transportRecoverPassword.id);
        const cryptResult = await this.bcryptService.encrypt(transportRecoverPassword.password);

        userEntity.password = cryptResult.encryptedPassword;
        userEntity.password_salt = cryptResult.salt;
        await this.save(userEntity);
    }

    async updateProfile(transportUpdateProfile: TransportUpdateProfileDto): Promise<void> {
        if(transportUpdateProfile.login ||
          (transportUpdateProfile.newPassword && transportUpdateProfile.currentPassword)) {

            const userEntity = await getManager().findOne(Users, transportUpdateProfile.id);
            if(transportUpdateProfile.newPassword && transportUpdateProfile.currentPassword) {

                const userSalt = await this.getUserSalt(transportUpdateProfile.id);
                const encryptedPassword = await this.bcryptService.encryptBySalt(transportUpdateProfile.currentPassword, userSalt);
                const isUserValid = await this.validateUser(transportUpdateProfile.id, encryptedPassword);

                if(isUserValid) {
                    userEntity.password = await this.bcryptService.encryptBySalt(transportUpdateProfile.newPassword, userSalt);
                }
            }

            if(transportUpdateProfile.login) {
                userEntity.login = transportUpdateProfile.login;
            }

            await this.save(userEntity);
        }
    }

    async loadPhoto(file: Express.Multer.File) {
        const rootDir = path.resolve(srcFolder, '..', 'uploads');

        if (!fs.existsSync(rootDir)){
            fs.mkdirSync(rootDir);
        }

        const name = file.originalname;
        const extension: string = name.split('.').reverse()[0];
        const uniqueName = `${ uuid() + '.' + extension }`;
        const fullFilePathToWrite = path.resolve(rootDir, uniqueName);
        const fullUrl = `${ url }/${ uniqueName }`;
        fs.writeFileSync(fullFilePathToWrite, file.buffer);
    }

    async save(user: Users): Promise<number> {
        const userEntity = await this.usersRepository.save(user);
        return userEntity.id;
    }

    async getUserByEmail(email: string): Promise<Users> {
        const user = await this.usersRepository.findOne({ where: { email } });
        return user;
    }

    async getUserIdByEmail(email: string): Promise<number> {
        const user = await this.usersRepository.findOne({ where: { email }, select: ['id'] });
        return user.id;
    }

    async isUserEmailUnique(email: string): Promise<boolean> {
        const count = await this.usersRepository.count({ where: { email } });
        return count === 0;
    }

    async validateUser(id: number, password: string): Promise<boolean> {
        const count = await this.usersRepository.count({ where: { id, password } });
        return count === 1;
    }

    async getUserSalt(id: number): Promise<string> {
        const user = await this.usersRepository.findOne({ where: { id }, select: ['password_salt'] });
        return user.password_salt;
    }

    async isExistsEmail(email: string): Promise<boolean> {
        const count = await this.usersRepository.count({ where: { email } });
        return count === 1;
    }

    async getUser(id: number): Promise<Users> {
        return await this.usersRepository.findOne({
            where: { id },
            join: {
                alias: "user",
                leftJoinAndSelect: {
                    role: "user.role",
                    team: "user.team"
                }
            }
        });
    }

    async getUserRole(id: number): Promise<string> {
        const user = await this.usersRepository.findOne({
            where: {id},
            join: {
                alias: "user",
                leftJoinAndSelect: {
                    role: "user.role",
                }
            }
         });
        return user.role.name;
    }

    async getUserQueries(id: number): Promise<Queries[]> {
        const user = await this.usersRepository.findOne({
            where: {id},
            join: {
                alias: "user",
                leftJoinAndSelect: {
                    queries: "user.queries",
                }
            }
        });
        return user.queries;
    }

    async isUserInBlockList(id: number): Promise<boolean> {
        const user = await this.usersRepository.findOne({
            where: {id},
            join: {
                alias: "user",
                leftJoinAndSelect: {
                    blockList: "user.blockList",
                }
            }
        });
        console.log(user.blockList);
        return !!user.blockList;
    }

    async isUserHaveTeam(id: number): Promise<boolean> {
        const user = await this.usersRepository.findOne({
            where: {id},
            join: {
                alias: 'user',
                leftJoinAndSelect: {
                    team: 'user.team'
                }
            }
        });
        return !!user.team;
    }
}