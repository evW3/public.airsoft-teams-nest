import { MigrationInterface, QueryRunner, Table, TableColumn, TableForeignKey } from 'typeorm';

export class Devices16231027655012 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: 'devices',
            columns: [
                {
                    name: 'id',
                    type: 'int',
                    isPrimary: true,
                    generationStrategy: 'increment',
                    isGenerated: true
                },
                {
                    name: 'ip',
                    type: 'text'
                },
                {
                    name: 'browser',
                    type: 'text'
                }
            ]
        }), true);
        await queryRunner.addColumn('devices', new TableColumn({
            name: 'user_id',
            type: 'int'
        }));
        await queryRunner.createForeignKey('devices', new TableForeignKey({
            columnNames: ['user_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'users'
        }))
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const table = await queryRunner.getTable('devices');
        const foreignKeyUser = table.foreignKeys.find(fk => fk.columnNames.indexOf('user_id') !== -1);
        await queryRunner.dropForeignKey('devices', foreignKeyUser);
        await queryRunner.dropColumn('devices', 'user_id');
        await queryRunner.dropTable('devices');
    }
}