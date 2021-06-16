import { MigrationInterface, QueryRunner, Table, TableColumn, TableForeignKey } from 'typeorm';

export class Comments16231027655010 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
                name: 'comments',
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
        await queryRunner.addColumn('comments', new TableColumn({
            name: 'query_id',
            type: 'int'
        }));
        await queryRunner.createForeignKey('comments', new TableForeignKey({
            columnNames: ['query_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'queries'
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const table = await queryRunner.getTable('comments');
        const foreignKeyQuery = table.foreignKeys.find(fk => fk.columnNames.indexOf('query_id') !== -1);
        await queryRunner.dropForeignKey('comments', foreignKeyQuery);
        await queryRunner.dropColumn('comments', 'query_id');
        await queryRunner.dropTable('comments');
    }
}