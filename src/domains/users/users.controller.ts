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
import { FileInterceptor } from '@nestjs/platform-express';

import { TransportSendRecoverTokenDto } from './dto/transportSendRecoverToken.dto';
import { UsersService } from './users.service';
import { TransportRecoverPasswordDto } from './dto/transportRecoverPassword.dto';
import { SchemaValidate } from '../../pipes/schemaValidate';
import { ChangePasswordSchema } from './schemas/changePassword.schema';
import { TransportIdDto } from './dto/transportId.dto';
import { TransportUpdateProfileDto } from './dto/transportUpdateProfile.dto';
import { UpdateProfileSchema } from './schemas/updateProfile.schema';
import { SendRecoverTokenSchema } from './schemas/sendRecoverToken.schema';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Post('/send-recover-code')
    @UsePipes(new SchemaValidate(SendRecoverTokenSchema))
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
    @UsePipes(new SchemaValidate(UpdateProfileSchema))
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