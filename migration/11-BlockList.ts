import { MigrationInterface, QueryRunner, Table, TableColumn, TableForeignKey } from 'typeorm';

export class BlockList16231027655011 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: 'block_list',
            columns: [
                {
                    name: 'id',
                    type: 'int',
                    isPrimary: true,
                    generationStrategy: 'increment',
                    isGenerated: true
                },
                {
                    name: 'description',
                    type: 'text'
                }
            ]
        }), true);
        await queryRunner.addColumn('block_list', new TableColumn({
            name: 'user_id',
            type: 'int'
        }));
        await queryRunner.createForeignKey('block_list', new TableForeignKey({
            columnNames: ['user_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'users'
        }))
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const table = await queryRunner.getTable('block_list');
        const foreignKeyUser = table.foreignKeys.find(fk => fk.columnNames.indexOf('user_id') !== -1);
        await queryRunner.dropForeignKey('block_list', foreignKeyUser);
        await queryRunner.dropColumn('block_list', 'user_id');
        await queryRunner.dropTable('block_list');
    }
}