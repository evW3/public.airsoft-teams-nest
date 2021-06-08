import { MigrationInterface, QueryRunner, Table, TableColumn, TableForeignKey } from 'typeorm';

export class QueryParams16231027655013 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: 'query_params',
            columns: [
                {
                    name: 'id',
                    type: 'int',
                    isPrimary: true,
                    generationStrategy: 'increment',
                    isGenerated: true
                },
                {
                    name: 'parameter',
                    type: 'text'
                }
            ]
        }), true);
        await queryRunner.addColumn('query_params', new TableColumn({
            name: 'query_id',
            type: 'int'
        }));
        await queryRunner.createForeignKey('query_params', new TableForeignKey({
            columnNames: ['query_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'queries'
        }))
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const table = await queryRunner.getTable('query_params');
        const foreignKeyUser = table.foreignKeys.find(fk => fk.columnNames.indexOf('query_id') !== -1);
        await queryRunner.dropForeignKey('query_params', foreignKeyUser);
        await queryRunner.dropColumn('query_params', 'query_id');
        await queryRunner.dropTable('query_params');
    }
}