import { Body, Controller, HttpException, HttpStatus, Post, UsePipes } from '@nestjs/common';

import { IsExistEmailValidation } from '../auth/pipes/isExistEmailValidation';
import { TransferRecoverPassword } from './dto/transferRecoverPassword';
import { UsersService } from './users.service';
import { VerificationCodes } from './verificationCodes.model';
import { VerificationCodesService } from './verificationCodes.service';
import { TokenService } from '../auth/token.service';
import { SMTPService } from './SMTP.service';

@Controller('users')
export class UsersController {
    constructor(
        private readonly usersService: UsersService,
        private readonly verificationCodesService: VerificationCodesService,
        private readonly tokenService: TokenService,
        private readonly smtpService: SMTPService
    ) {}

    @Post('/send-recover-code')
    @UsePipes(IsExistEmailValidation)
    async sendRecoverCode(@Body() transferRecoverPassword: TransferRecoverPassword) {
        try {
            const user = await this.usersService.getUserByEmail(transferRecoverPassword.email);
            const verificationCodeEntity = new VerificationCodes();
            verificationCodeEntity.user = user;
            const codeId = await this.verificationCodesService.create(verificationCodeEntity);
            const recoverToken = this.tokenService.createRecoverToken(user.id, codeId);
            await this.smtpService.sendMail(recoverToken, 'Recover Password', user.email);
            return 'Check ur email, token was sent';
        } catch (e) {
            if(e instanceof HttpException)
                return e;
            else
                new HttpException('Server error!', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}