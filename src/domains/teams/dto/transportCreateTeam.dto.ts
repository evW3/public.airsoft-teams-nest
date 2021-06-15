import { IsString } from 'class-validator';

export class TransportCreateTeamDto {
    @IsString()
    name: string
}