import { MigrationInterface, QueryRunner } from 'typeorm';
import config from '../config/default';
import bcrypt from 'bcrypt';

export class UsersSeed16231027655004 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        const admin = config['admin'];
        const security = config['security'];
        const salt: string = await bcrypt.genSalt(security.saltRounds);
        const roleId = (await queryRunner.query('SELECT id FROM roles WHERE name=\'ADMIN\''))[0].id;
        const passwordWithGlobalSalt: string = admin.password + security.globalSalt;
        const encryptedPassword: string = await bcrypt.hash(passwordWithGlobalSalt, salt);
        await queryRunner.query(`
            INSERT INTO users (email, password, password_salt, role_id)
            VALUES ('${admin.email}', '${encryptedPassword}', '${salt}', ${roleId});
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {}
}