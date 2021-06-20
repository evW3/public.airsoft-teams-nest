import { InjectModel } from '@nestjs/mongoose';
import { Model } from "mongoose";
import { LoggerService } from '@nestjs/common';

export class MyLogger implements LoggerService {
    constructor(private mongoModel: any) {}

    log(message: string) {
        console.log(message);
        // const model = new this.mongoModel({
        //     path: '/some',
        //     params: {
        //         some: 'some'
        //     },
        //     errorDescription: 'some',
        //     status: 200,
        //     mode: 'test'
        // });
        // model.save();
    }

    error(message: string, trace: string) {
        console.log(message);
    }

    warn(message: string) {}

    debug(message: string) {}

    verbose(message: string) {}
}