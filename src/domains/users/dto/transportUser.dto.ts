import { IsString } from 'class-validator';

export class TransportUserDto {
    @IsString()
    email: string;

    @IsString()
    password: string;

    @IsString()
    repeatPassword: string
}