import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';

import { UsersService } from '../domains/users/users.service';

@Injectable()
export class BlockListGuard implements CanActivate {
    constructor(private readonly usersService: UsersService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        try {
            const req = context.switchToHttp().getRequest();
            const id = req.body.id
            if(id) {
                const isUserInBanList = await this.usersService.isUserInBlockList(id);
                return !isUserInBanList;
            }
            return true;
        } catch (e) {
            if(e instanceof HttpException)
                throw e;
            else
                throw new HttpException('Server error!', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}