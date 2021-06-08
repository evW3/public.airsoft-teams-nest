import {MigrationInterface, QueryRunner} from "typeorm";

export class RolesSeed1623102765502 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('INSERT INTO roles (name) VALUES (\'PLAYER\');');
        await queryRunner.query('INSERT INTO roles (name) VALUES (\'MANAGER\');');
        await queryRunner.query('INSERT INTO roles (name)  VALUES (\'ADMIN\');');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {}
}
