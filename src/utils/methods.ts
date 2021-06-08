import { v4 as uuid } from 'uuid';
import { IKeyValue, IObjectWithName } from './interfaces';

export function createUniqueName(): string {
    return uuid().split('-')[0]
}

export function getListPermissions(PermissionsList: IKeyValue): IObjectWithName[] {
    let permissionNames: IObjectWithName[] = [];
    Object.keys(PermissionsList).forEach(key => permissionNames.push({ name: key }));
    return permissionNames;
}