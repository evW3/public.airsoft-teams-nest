import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Errors {
    @Prop()
    path: string;

    @Prop({ type: "object" })
    params: {};

    @Prop()
    errorDescription: string;

    @Prop()
    status: number;

    @Prop()
    mode: string;
}

export type ErrorsDocument = Errors & Document;

export const ErrorsSchema = SchemaFactory.createForClass(Errors);