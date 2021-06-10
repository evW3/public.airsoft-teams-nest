import { IsString } from 'class-validator';

export class TransferRecoverPassword {

    @IsString()
    email: string;
}