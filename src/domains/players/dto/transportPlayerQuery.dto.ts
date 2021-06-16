import { IsNumber } from 'class-validator';

export class TransportPlayerQueryDto {
    @IsNumber()
    queryId: number;

    @IsNumber()
    id: number;
}