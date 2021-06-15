import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';

@Injectable()
export class BodyINter implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): any {
        console.log(context.switchToHttp().getRequest());
    }
}