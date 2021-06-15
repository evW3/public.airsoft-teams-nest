import {
    Body,
    Controller,
    Get,
    HttpStatus,
    Patch,
    Post,
    Put,
    UploadedFile,
    UseInterceptors,
    UsePipes,
} from '@nestjs/common';
import { Express } from 'express'
import { v4 as uuid } from 'uuid';
import { FileInterceptor } from '@nestjs/platform-express';
import path from "path";

import { TransportSendRecoverTokenDto } from './dto/transportSendRecoverToken.dto';
import { UsersService } from './users.service';
import { TransportRecoverPasswordDto } from './dto/transportRecoverPassword.dto';
import { SchemaValidate } from '../../pipes/schemaValidate';
import { ChangePasswordSchema } from './schemas/changePasswordSchema';
import { TransportIdDto } from './dto/transportId.dto';
import { TransportUpdateProfileDto } from './dto/transportUpdateProfile.dto';
import { srcFolder, url } from '../../constants';
import * as fs from 'fs';
import { BodyINter } from '../../interceptors/body';


@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Post('/send-recover-code')
    async sendRecoverCode(@Body() transportSendRecoverToken: TransportSendRecoverTokenDto) {
        return await this.usersService.sendRecoverCode(transportSendRecoverToken);
    }

    @Put('/recover-password')
    @UsePipes(new SchemaValidate(ChangePasswordSchema))
    async recoverPassword(@Body() transportRecoverPassword: TransportRecoverPasswordDto) {
        return this.usersService.recoverPassword(transportRecoverPassword);
    }

    @Get('/profile')
    async getProfile(@Body() transportId: TransportIdDto) {
        return await this.usersService.getUser(transportId.id);
    }

    @Put('/profile')
    async updateProfile(@Body() transportUpdateProfile: TransportUpdateProfileDto) {
        await this.usersService.updateProfile(transportUpdateProfile);
        return { message: 'Profile was updated', status: HttpStatus.OK };
    }

    @Patch('/upload-user-photo')
    @UseInterceptors(FileInterceptor('photo'))
    async uploadFile(@UploadedFile() file: Express.Multer.File) {
        //console.log(l);
        await this.usersService.loadPhoto(file);
    }
}