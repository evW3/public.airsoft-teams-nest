import { IsString, IsNumber } from 'class-validator';

export class TransportPlayerDto {
    @IsNumber()
    id: number;

    @IsNumber()
    playerId: number;

    @IsString()
    description: string;
}