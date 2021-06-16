import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';
import { ErrorsService } from '../domains/errors/errors.service';
import { mode } from '../constants';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {

    async catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        const status = exception.getStatus();
        // await this.errorsService.create({
        //     path: request.url,
        //     params: { ...request.body },
        //     status,
        //     errorDescription: <string>exception.getResponse(),
        //     mode
        // });

        response
            .status(status)
            .json({
                statusCode: status,
                path: request.url
            });
    }
}