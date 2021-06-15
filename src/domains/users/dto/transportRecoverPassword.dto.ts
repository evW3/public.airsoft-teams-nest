import { IsNumber, IsString } from 'class-validator';

export class TransportRecoverPasswordDto {
    @IsNumber()
    id: number;

    @IsNumber()
    codeId: number;

    @IsString()
    password: string;

    @IsString()
    passwordRepeat: string;
}