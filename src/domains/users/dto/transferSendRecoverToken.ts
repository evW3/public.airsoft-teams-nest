import { IsString } from 'class-validator';

export class TransferSendRecoverToken {

    @IsString()
    email: string;
}