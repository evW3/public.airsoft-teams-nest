import { IsNumber } from 'class-validator';

export class TransportIdDto {
    @IsNumber()
    id: number;
}