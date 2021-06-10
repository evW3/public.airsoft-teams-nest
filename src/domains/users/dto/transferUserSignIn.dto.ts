import { IsString } from 'class-validator';

export class TransferUserSignInDto {
    @IsString()
    email: string;

    @IsString()
    password: string;
}