import { IsNumber, IsString } from 'class-validator';

export class TransportUpdateProfileDto {
    @IsNumber()
    id: number;

    @IsString()
    newPassword: string;

    @IsString()
    currentPassword: string;

    @IsString()
    login: string;
}