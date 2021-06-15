import { MigrationInterface, QueryRunner, Table, TableColumn, TableForeignKey, TableIndex } from 'typeorm';
import { v4 as uuidv4 } from "uuid";
import { defaultPhotoUrl } from '../src/constants';

export class Users1623102765503 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: 'users',
            columns: [
                {
                    name: 'id',
                    type: 'int',
                    isPrimary: true,
                    generationStrategy: 'increment',
                    isGenerated: true
                },
                {
                    name: 'email',
                    type: 'text'
                },
                {
                    name: 'password',
                    type: 'text'
                },
                {
                    name: 'password_salt',
                    type: 'text'
                },
                {
                    name: 'login',
                    type: 'text',
                    default: '\'' + uuidv4().split("-")[0] + '\''
                },
                {
                    name: 'profile_image',
                    type: 'text',
                    default: `'${ defaultPhotoUrl }/default.jpg'`
                }
            ]
        }), true);
        await queryRunner.addColumn('users', new TableColumn({
            name: 'role_id',
            type: 'int'
        }));
        await queryRunner.addColumn('users', new TableColumn({
            name: 'team_id',
            type: 'int',
            isNullable: true
        }));
        await queryRunner.createForeignKey('users', new TableForeignKey({
            columnNames: ['role_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'roles',
            onDelete: 'CASCADE'
        }));
        await queryRunner.createForeignKey('users', new TableForeignKey({
            columnNames: ['team_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'teams',
            onDelete: 'CASCADE'
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const table = await queryRunner.getTable('users');
        const foreignKeyRole = table.foreignKeys.find(fk => fk.columnNames.indexOf('role_id') !== -1);
        const foreignKeyTeam = table.foreignKeys.find(fk => fk.columnNames.indexOf('team_id') !== -1);
        await queryRunner.dropForeignKey('users', foreignKeyRole);
        await queryRunner.dropForeignKey('users', foreignKeyTeam);
        await queryRunner.dropColumn('users', 'role_id');
        await queryRunner.dropColumn('users', 'team_id');
        await queryRunner.dropTable('users');
    }
}