import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../enums';

// export const Roles = (...roles: string[]) => SetMetadata('roles', roles);
export const Roles = (...roles: UserRole[]) => SetMetadata('roles', roles);
