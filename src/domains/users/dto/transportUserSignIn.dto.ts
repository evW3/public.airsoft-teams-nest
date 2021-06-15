import { IsString } from 'class-validator';

export class TransportUserSignInDto {
    @IsString()
    email: string;

    @IsString()
    password: string;
}