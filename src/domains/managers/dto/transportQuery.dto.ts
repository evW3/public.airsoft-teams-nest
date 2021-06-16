import { IsNumber, IsString } from 'class-validator';

export class TransportQueryDto {
    @IsNumber()
    id: number;

    @IsNumber()
    queryId: number;

    @IsString()
    description: string;
}