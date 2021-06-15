import { IsNumber } from 'class-validator';

export class TransportQueryDto {
    @IsNumber()
    id: number;

    @IsNumber()
    queryId: number;
}