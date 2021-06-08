import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Requests {
    @Prop()
    path: string;

    @Prop()
    params: {};

    @Prop()
    mode: string;
}

export type RequestsDocument = Requests & Document;

export const RequestsSchema = SchemaFactory.createForClass(Requests);