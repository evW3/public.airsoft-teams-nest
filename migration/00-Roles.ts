import { MigrationInterface, QueryRunner, Table, TableColumn, TableForeignKey, TableIndex } from 'typeorm';
import { v4 as uuidv4 } from "uuid";
import { defaultPhotoUrl } from '../src/constants';

export class Roles1623102765500 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: 'roles',
            columns: [
                {
                    name: 'id',
                    type: 'int',
                    isPrimary: true,
                    generationStrategy: 'increment',
                    isGenerated: true
                },
                {
                    name: 'name',
                    type: 'text'
                }
            ]
        }), true);
        // await queryRunner.createIndex('roles', new TableIndex({
        //     name: 'IDX_ROLES_NAME',
        //     columnNames: ['name']
        // }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('roles');
    }
}