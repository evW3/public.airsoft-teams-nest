import { MigrationInterface, QueryRunner } from 'typeorm';

import { getListPermissions } from '../src/utils/methods';
import { PermissionsList } from '../src/constants';

export class RolePermissionsSeed16231027655008 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        const permissions = getListPermissions(PermissionsList);
        for(let i of permissions) {
            const currentPermissionId = (await queryRunner.query(`
                SELECT id
                FROM permissions
                WHERE name='${i.name}'
            `))[0].id;
            const roles = PermissionsList[i.name];
            const currentRoleIdPlayer = (await queryRunner.query(`SELECT id FROM roles where name='PLAYER'`))[0].id;
            const currentRoleIdManager = (await queryRunner.query(`SELECT id FROM roles where name='MANAGER'`))[0].id;
            const currentRoleIdAdmin = (await queryRunner.query(`SELECT id FROM roles where name='ADMIN'`))[0].id;
            for(let k of roles) {
                if(k === 'ADMIN') {
                    await queryRunner.query(`
                        INSERT INTO roles_permission (role_id, permission_id)
                        VALUES (${currentRoleIdAdmin}, ${currentPermissionId})
                    `)
                } else if(k === 'MANAGER') {
                    await queryRunner.query(`
                        INSERT INTO roles_permission (role_id, permission_id)
                        VALUES (${currentRoleIdManager}, ${currentPermissionId})
                    `)
                } else {
                    await queryRunner.query(`
                        INSERT INTO roles_permission (role_id, permission_id)
                        VALUES (${currentRoleIdPlayer}, ${currentPermissionId})
                    `)
                }
            }
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {}
}