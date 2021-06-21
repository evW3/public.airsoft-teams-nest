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

            console.log(verificationCode);
            const verificationCodesEntity = await this.verificationCodesRepository.save(verificationCode);
            return verificationCodesEntity.id;

    }

    async isUserHasCode(userId: number, codeId: number): Promise<boolean> {
        const count = await this.verificationCodesRepository.count({ where: { user: userId, id: codeId } });
        return count === 1;
    }

    async deleteCode(codeId: number): Promise<void> {
        await this.verificationCodesRepository.delete(codeId);
    }
}