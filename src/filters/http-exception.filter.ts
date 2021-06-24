import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    constructor(private mongoModel: any) {}

    async catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        const status = exception.getStatus();

        const model = new this.mongoModel({
            path: request.path,
            params: request.body,
            errorDescription: exception.message,
            status,
            mode: process.env.NODE_ENV
        });

        await model.save();

        response
            .status(status)
            .json({
                statusCode: status,
                path: request.url,
                errorDescription: exception.message
            });
    }
}