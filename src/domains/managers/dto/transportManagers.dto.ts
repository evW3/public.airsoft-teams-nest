import { IsString, IsNumber } from 'class-validator';

export class TransportManagersDto {
    @IsNumber()
    id: number;

    @IsNumber()
    managerId: number;

    @IsString()
    description: string;
}