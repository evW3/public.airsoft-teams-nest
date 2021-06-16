import { MigrationInterface, QueryRunner } from 'typeorm';

import { getListPermissions } from '../src/utils/methods';
import { PermissionsList } from '../src/constants';

export class PermissionsSeed16231027655006 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        const permissions = getListPermissions(PermissionsList);
        for(let i of permissions) {
            await queryRunner.query(`INSERT INTO permissions (name) VALUES ('${ i.name }')`);
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {}

}