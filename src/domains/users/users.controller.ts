import {
    Body,
    Controller,
    Get,
    HttpException,
    HttpStatus,
    Patch,
    Post,
    Put,
    Req,
    UploadedFile,
    UseInterceptors,
    UsePipes,
} from '@nestjs/common';
import { Express } from 'express'
import { FileInterceptor } from '@nestjs/platform-express';
import fs from "fs";
import { v4 as uuid } from 'uuid';
import { JwtService } from '@nestjs/jwt';
import { getManager } from 'typeorm';
import path from "path";

import { TransportSendRecoverTokenDto } from './dto/transportSendRecoverToken.dto';
import { UsersService } from './users.service';
import { TransportRecoverPasswordDto } from './dto/transportRecoverPassword.dto';
import { SchemaValidate } from '../../pipes/schemaValidate';
import { ChangePasswordSchema } from './schemas/changePassword.schema';
import { TransportIdDto } from './dto/transportId.dto';
import { TransportUpdateProfileDto } from './dto/transportUpdateProfile.dto';
import { UpdateProfileSchema } from './schemas/updateProfile.schema';
import { SendRecoverTokenSchema } from './schemas/sendRecoverToken.schema';
import { VerificationCodes } from './verificationCodes.model';
import { VerificationCodesService } from './verificationCodes.service';
import { TokenService } from '../auth/token.service';
import { SMTPService } from './SMTP.service';
import { Users } from './users.model';
import { BcryptService } from '../auth/bcrypt.service';
import { srcFolder, url } from '../../constants';
import { ExcludePassword } from '../../interceptors/response';


@Controller('users')
@UseInterceptors(ExcludePassword)
export class UsersController {
    constructor(private readonly usersService: UsersService,
                private readonly verificationCodesService: VerificationCodesService,
                private readonly tokenService: TokenService,
                private readonly smtpService: SMTPService,
                private readonly bcryptService: BcryptService) {}

    @Post('/send-recover-code')
    @UsePipes(new SchemaValidate(SendRecoverTokenSchema))
    async sendRecoverCode(@Body() transportSendRecoverToken: TransportSendRecoverTokenDto) {
        const user = await this.usersService.getUserByEmail(transportSendRecoverToken.email);
        const verificationCodeEntity = new VerificationCodes();
        verificationCodeEntity.user = user;
        const codeId = await this.verificationCodesService.create(verificationCodeEntity);
        const recoverToken = this.tokenService.createRecoverToken(user.id, codeId);

        await this.smtpService.sendMail(recoverToken, 'Recover Password', user.email);

        return { message: 'Check ur email, token was sent', status: HttpStatus.OK };
    }

    @Put('/recover-password')
    @UsePipes(new SchemaValidate(ChangePasswordSchema))
    async recoverPassword(@Body() transportRecoverPassword: TransportRecoverPasswordDto) {
        const userEntity = await getManager().findOne(Users, transportRecoverPassword.id);
        const cryptResult = await this.bcryptService.encrypt(transportRecoverPassword.password);

        userEntity.password = cryptResult.encryptedPassword;
        userEntity.password_salt = cryptResult.salt;
        await this.usersService.save(userEntity);

        return { message: 'Password was changed', status: HttpStatus.OK };
    }

    @Get('/profile')
    async getProfile(@Body() transportId: TransportIdDto) {
        return await this.usersService.getUser(transportId.id);
    }

    @Put('/profile')
    @UsePipes(new SchemaValidate(UpdateProfileSchema))
    async updateProfile(@Body() transportUpdateProfile: TransportUpdateProfileDto) {
        if(transportUpdateProfile.login ||
            (transportUpdateProfile.newPassword && transportUpdateProfile.currentPassword)) {

            const userEntity = await getManager().findOne(Users, transportUpdateProfile.id);
            if(transportUpdateProfile.newPassword && transportUpdateProfile.currentPassword) {

                const userSalt = await this.usersService.getUserSalt(transportUpdateProfile.id);
                const encryptedPassword = await this.bcryptService.encryptBySalt(transportUpdateProfile.currentPassword, userSalt);
                const isUserValid = await this.usersService.validateUser(transportUpdateProfile.id, encryptedPassword);

                if(isUserValid) {
                    userEntity.password = await this.bcryptService.encryptBySalt(transportUpdateProfile.newPassword, userSalt);
                }
            }

            if(transportUpdateProfile.login) {
                userEntity.login = transportUpdateProfile.login;
            }

            return await this.usersService.save(userEntity);
        }

        return { message: 'Profile was updated', status: HttpStatus.OK };
    }

    @Patch('/upload-user-photo')
    @UseInterceptors(FileInterceptor('photo'))
    async uploadFile(@UploadedFile() file: Express.Multer.File, @Req() request: any) {
            const token = request.headers.authorization.split(' ').reverse()[0];

            const rootDir = path.resolve(srcFolder, '..', '..', 'uploads');

            if (!fs.existsSync(rootDir)) {
                fs.mkdirSync(rootDir);
            }

            const params = this.tokenService.decryptToken(token);

            if(params.id) {
                delete params.iat;
                delete params.exp;

                const name = file.originalname;
                const extension: string = name.split('.').reverse()[0];
                const uniqueName = `${ uuid() + '.' + extension }`;
                const fullFilePathToWrite = path.resolve(rootDir, uniqueName);
                const fullUrl = `${ url }/uploads/${ uniqueName }`;
                const userEntity = await getManager().findOne(Users, params.id);

                fs.writeFileSync(fullFilePathToWrite, file.buffer);

                userEntity.profile_image = fullUrl;
                const newUserEntity = await this.usersService.save(userEntity);

                return newUserEntity;
            } else {
                throw new HttpException('Invalid token', HttpStatus.FORBIDDEN);
            }
    }
}