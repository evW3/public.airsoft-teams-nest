import { HttpException, HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

import { VerificationCodesService } from '../verificationCodes.service';

@Injectable()
export class IsUserHaveVerificationCodeMiddleware implements NestMiddleware {
    constructor(private readonly usersService: VerificationCodesService) {}

    async use(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.body.id;
            const codeId = req.body.codeId;
            const isUserHaveVerificationCode = await this.usersService.isUserHasCode(userId, codeId);
            console.log(isUserHaveVerificationCode);
            if (isUserHaveVerificationCode) {
                next();
            } else {
                next(new HttpException('Can`t find user code', HttpStatus.BAD_REQUEST));
            }
        } catch (e) {
            if(e instanceof HttpException)
                next(e);
            else
                next(new HttpException('Server error!', HttpStatus.INTERNAL_SERVER_ERROR));
        }
    }
}
