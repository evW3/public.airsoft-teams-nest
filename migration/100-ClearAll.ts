import { MigrationInterface, QueryRunner} from 'typeorm';
import { RolePermissions16231027655007 } from './07-RolePermissions';
import { Permissions1623102765505 } from './05-Permissions';
import { QueryParams16231027655013 } from './13-QueryParams';
import { Queries16231027655009 } from './9-Queries';
import { Comments16231027655010 } from './10-Comments';
import { BlockList16231027655011 } from './11-BlockList';
import { Devices16231027655012 } from './12-Devices';
import { VerificationCodes16231027655014 } from './14-VerificationCodes';
import { Users1623102765503 } from './03-Users';
import { Teams1623102765501 } from './01-Teams';
import { Roles1623102765500 } from './00-Roles';

export class ClearAll16231027656000 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {}

    public async down(queryRunner: QueryRunner): Promise<void> {
        const rolePermission = new RolePermissions16231027655007();
        const permission = new Permissions1623102765505();
        const queryParams = new QueryParams16231027655013();
        const queries = new Queries16231027655009();
        const comments = new Comments16231027655010();
        const blockList = new BlockList16231027655011();
        const devices = new Devices16231027655012();
        const verificationCodes = new VerificationCodes16231027655014();
        const users = new Users1623102765503();
        const teams = new Teams1623102765501();
        const roles = new Roles1623102765500();

        await rolePermission.down(queryRunner);
        await permission.down(queryRunner);
        await queryParams.down(queryRunner);
        await comments.down(queryRunner);
        await queries.down(queryRunner);
        await blockList.down(queryRunner);
        await devices.down(queryRunner);
        await verificationCodes.down(queryRunner);
        await users.down(queryRunner);
        await teams.down(queryRunner);
        await roles.down(queryRunner);

        await queryRunner.clearTable('migrations');
    }
}