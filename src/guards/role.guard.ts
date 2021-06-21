import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { UsersService } from '../domains/users/users.service';
import { ROLES_KEY } from '../constants';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private readonly usersService: UsersService,
                private readonly reflector: Reflector) {
    }
    async canActivate(context: ExecutionContext): Promise<boolean> {
        try {
            const requiredRoles = this.reflector.getAllAndOverride(ROLES_KEY, [
                context.getHandler(),
                context.getClass()
            ]);

            if(requiredRoles) {
                const req = context.switchToHttp().getRequest();
                const userId = req.body.id;
                const userRole = await this.usersService.getUserRole(userId);

                if(requiredRoles.includes(userRole)) {
                    return true;
                }

                throw new HttpException(`User must have role: ${ requiredRoles }`, HttpStatus.FORBIDDEN);
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