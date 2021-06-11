import { MigrationInterface, QueryRunner} from 'typeorm';

export class ClearAll16231027656000 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {}

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('roles_permission');

        await queryRunner.dropTable('permissions');

        const table5 = await queryRunner.getTable('query_params');
        const foreignKeyQuery5 = table5.foreignKeys.find(fk => fk.columnNames.indexOf('query_id') !== -1);
        await queryRunner.dropForeignKey('query_params', foreignKeyQuery5);
        await queryRunner.dropColumn('query_params', 'query_id');
        await queryRunner.dropTable('query_params');

        const table2 = await queryRunner.getTable('queries');
        const foreignKey2 = table2.foreignKeys.find(fk => fk.columnNames.indexOf('comment_id') !== -1);
        await queryRunner.dropForeignKey('queries', foreignKey2);
        await queryRunner.dropColumn('queries', 'comment_id');
        await queryRunner.dropTable('queries');

        await queryRunner.dropTable('comments');

        const table3 = await queryRunner.getTable('block_list');
        const foreignKeyUser3 = table3.foreignKeys.find(fk => fk.columnNames.indexOf('user_id') !== -1);
        await queryRunner.dropForeignKey('block_list', foreignKeyUser3);
        await queryRunner.dropColumn('block_list', 'user_id');
        await queryRunner.dropTable('block_list');

        const table4 = await queryRunner.getTable('devices');
        const foreignKeyUser4 = table4.foreignKeys.find(fk => fk.columnNames.indexOf('user_id') !== -1);
        await queryRunner.dropForeignKey('devices', foreignKeyUser4);
        await queryRunner.dropColumn('devices', 'user_id');
        await queryRunner.dropTable('devices');

        const table11 = await queryRunner.getTable('verification_codes');
        const foreignKeyUser11 = table11.foreignKeys.find(fk => fk.columnNames.indexOf('user_id') !== -1);
        await queryRunner.dropForeignKey('verification_codes', foreignKeyUser11);
        await queryRunner.dropColumn('verification_codes', 'user_id');
        await queryRunner.dropTable('verification_codes');

        const table = await queryRunner.getTable('users');
        const foreignKeyRole = table.foreignKeys.find(fk => fk.columnNames.indexOf('role_id') !== -1);
        const foreignKeyTeam = table.foreignKeys.find(fk => fk.columnNames.indexOf('team_id') !== -1);
        await queryRunner.dropForeignKey('users', foreignKeyRole);
        await queryRunner.dropForeignKey('users', foreignKeyTeam);
        await queryRunner.dropColumn('users', 'role_id');
        await queryRunner.dropColumn('users', 'team_id');
        await queryRunner.dropTable('users');

        await queryRunner.dropTable('teams');

        await queryRunner.dropTable('roles');

        await queryRunner.clearTable('migrations');
    }
}