import { IKeyValue } from './utils/interfaces';

const url: string = `http://localhost:${process.env.PORT}`;

export const defaultPhotoUrl: string = `${url}/uploads/default.jpg`;

export const mongoDBConnection = () => ({
    username: process.env.MONGODB_USERNAME,
    password: process.env.MONGODB_PASSWORD,
    collection: process.env.MONGODB_COLLECTION
})

export const mode = process.env.NODE_ENV;

export const PermissionsList: IKeyValue = {
    activate_manager: [ 'ADMIN' ],
    get_managers: [ 'ADMIN' ],
    get_manager_by_id: [ 'ADMIN' ],
    block_manager: [ 'ADMIN' ],
    unblock_manager: [ 'ADMIN' ],
    decline_manager: [ 'ADMIN' ],
    register_team: [ 'ADMIN' ],
    move_user_from_team: [ 'ADMIN', 'MANAGER' ],
    accept_join_team: [ 'ADMIN', 'MANAGER' ],
    decline_join_team: [ 'ADMIN', 'MANAGER' ],
    get_player_by_id: [ 'ADMIN', 'MANAGER', 'PLAYER' ],
    get_team_members: [ 'ADMIN', 'MANAGER', 'PLAYER' ],
    get_players_who_into_team: [ 'ADMIN', 'MANAGER', 'PLAYER' ],
    accept_exit_team: [ 'ADMIN', 'MANAGER' ],
    decline_exit_team: [ 'ADMIN', 'MANAGER', 'PLAYER' ],
    unblock_player: ['ADMIN', 'MANAGER' ],
    block_player: ['ADMIN', 'MANAGER' ],
    change_role: [ 'PLAYER' ],
    exit_team: [ 'PLAYER' ],
    join_team: [ 'PLAYER' ],
    get_queries: [ 'ADMIN', 'MANAGER' ]
}