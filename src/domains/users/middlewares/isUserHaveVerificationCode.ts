import { HttpException, HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

import { VerificationCodesService } from '../verificationCodes.service';

@Injectable()
export class IsUserHaveVerificationCode implements NestMiddleware {
    constructor(private readonly usersService: VerificationCodesService) {}

    async use(req: Request, res: Response, next: NextFunction) {
        try {
            await this.usersService.isUserHasCode(req.body.id, req.body.codeId);
        } catch (e) {
            if(e instanceof HttpException)
                next(e);
            else
                next(new HttpException('Server error!', HttpStatus.INTERNAL_SERVER_ERROR));
        }
    }
}
