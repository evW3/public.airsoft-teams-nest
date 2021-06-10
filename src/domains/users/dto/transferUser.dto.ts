import { IsString } from 'class-validator';

export class TransferUserDto {
    @IsString()
    email: string;

    @IsString()
    password: string;

    @IsString()
    repeatPassword: string
}