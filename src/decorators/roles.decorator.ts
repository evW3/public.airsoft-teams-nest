import { ROLES_KEY } from '../constants';
import { SetMetadata } from '@nestjs/common';

export const CreateRole = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);