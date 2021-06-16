import { IsNumber } from 'class-validator';

export class TransportExcludeFromTeamDto {
    @IsNumber()
    id: number;

    @IsNumber()
    userId: number;
}