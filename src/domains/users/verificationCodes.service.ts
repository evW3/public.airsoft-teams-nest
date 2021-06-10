import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VerificationCodes } from './verificationCodes.model';


@Injectable()
export class VerificationCodesService {
    constructor(
        @InjectRepository(VerificationCodes)
        private verificationCodesRepository: Repository<VerificationCodes>
    ) {}

    async create(verificationCode: VerificationCodes): Promise<number> {
        const verificationCodesEntity = await this.verificationCodesRepository.save(verificationCode);
        return verificationCodesEntity.id;
    }
}