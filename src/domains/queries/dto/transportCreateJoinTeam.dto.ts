import { IsNumber, IsString } from 'class-validator';

export class TransportCreateJoinTeamDto {
    @IsNumber()
    id: number
    
    @IsString()
    teamName: string
}