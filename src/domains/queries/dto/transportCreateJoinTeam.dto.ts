import { IsNumber } from 'class-validator';

export class TransportCreateJoinTeamDto {
    @IsNumber()
    id: number

    @IsNumber()
    teamId: number
}