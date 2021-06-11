import { IsNumber, IsString } from 'class-validator';

export class TransferRecoverPassword {
    @IsNumber()
    id: number;

    @IsNumber()
    codeId: number;

    @IsString()
    password: string;

    @IsString()
    passwordRepeat: string;
}