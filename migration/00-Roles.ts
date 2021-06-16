import { MigrationInterface, QueryRunner, Table } from 'typeorm';


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