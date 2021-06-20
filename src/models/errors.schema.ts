import { Schema } from 'mongoose';

export const ErrorsScheme = new Schema({
    path: String,
    params: {},
    errorDescription: String,
    status: Number,
    mode: String
});