import { MigrationInterface, QueryRunner, Table, TableColumn, TableForeignKey } from 'typeorm';
import { queryTypes, statuses } from '../src/utils/enums';

export class Queries16231027655010 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: 'queries',
            columns: [
                {
                    name: 'id',
                    type: 'int',
                    isPrimary: true,
                    generationStrategy: 'increment',
                    isGenerated: true
                },
                {
                    name: 'status',
                    type: 'enum',
                    enum: [statuses.PROCESSED, statuses.DECLINE, statuses.ACCEPTED]
                },
                {
                    name: 'type',
                    type: 'enum',
                    enum: [queryTypes.EXIT_FROM_TEAM, queryTypes.CHANGE_ROLE, queryTypes.JOIN_TEAM, queryTypes.MOVE_TO_ANOTHER_TEAM]
                }
            ]
        }), true);
        await queryRunner.addColumn('queries', new TableColumn({
            name: 'comment_id',
            type: 'int',
            isNullable: true
        }));
        await queryRunner.addColumn('queries', new TableColumn({
            name: 'user_id',
            type: 'int',
            isNullable: true
        }));
        await queryRunner.createForeignKey('queries', new TableForeignKey({
            columnNames: ['comment_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'comments'
        }));
        await queryRunner.createForeignKey('queries', new TableForeignKey({
            columnNames: ['user_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'users'
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const table = await queryRunner.getTable('queries');
        const foreignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf('comment_id') !== -1);
        const foreignUser = table.foreignKeys.find(fk => fk.columnNames.indexOf('user_id') !== -1);
        await queryRunner.dropForeignKey('queries', foreignKey);
        await queryRunner.dropForeignKey('queries', foreignUser);
        await queryRunner.dropColumn('queries', 'comment_id');
        await queryRunner.dropColumn('queries', 'user_id');
        await queryRunner.dropTable('queries');
    }
}