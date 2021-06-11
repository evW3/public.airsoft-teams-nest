import { MigrationInterface, QueryRunner, Table, TableColumn, TableForeignKey } from 'typeorm';
import { v4 as uuid } from 'uuid';

export class VerificationCodes16231027655014 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: 'verification_codes',
            columns: [
                {
                    name: 'id',
                    type: 'int',
                    isPrimary: true,
                    generationStrategy: 'increment',
                    isGenerated: true
                },
                {
                    name: 'code',
                    type: 'uuid',
                    default: '\'' + uuid() + '\''
                }
            ]
        }));
        await queryRunner.addColumn('verification_codes', new TableColumn({
            name: 'user_id',
            type: 'int'
        }));
        await queryRunner.createForeignKey('verification_codes', new TableForeignKey({
            columnNames: ['user_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'users'
        }))
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const table = await queryRunner.getTable('verification_codes');
        const foreignKeyUser = table.foreignKeys.find(fk => fk.columnNames.indexOf('user_id') !== -1);
        await queryRunner.dropForeignKey('verification_codes', foreignKeyUser);
        await queryRunner.dropColumn('verification_codes', 'user_id');
        await queryRunner.dropTable('verification_codes');
    }
}