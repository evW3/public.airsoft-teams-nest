import { IsString, IsNumber } from 'class-validator';

export class TransportPlayer {
    @IsNumber()
    id: number;

    @IsNumber()
    playerId: number;

    @IsString()
    description: string;
}