import { IsString } from 'class-validator';

export class TransportSendRecoverTokenDto {

    @IsString()
    email: string;
}