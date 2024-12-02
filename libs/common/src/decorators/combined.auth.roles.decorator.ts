// lib/common/decorators/auth.decorator.ts
import { applyDecorators, UseGuards } from '@nestjs/common';
import { UserRole } from '../enums';
import { RolesGuard } from '../auth/roles.guard';
import { JwtAuthGuardCommon } from '../auth';
import { Roles } from './roles.decorator';

export function Auth(...roles: UserRole[]) {
  return applyDecorators(
    UseGuards(JwtAuthGuardCommon, RolesGuard),
    Roles(...roles),
  );
}

// Specific role decorators
export const UserAuth = () => Auth(UserRole.USER);
export const AdminAuth = () => Auth(UserRole.ADMIN);
export const ModeratorAuth = () => Auth(UserRole.MODERATOR);

// @Get('user-route')
// @UserAuth()  // Combines JwtAuthGuardCommon, RolesGuard, and USER role
// async getUserOnlyRoute() {
//   return 'This route is only for users';
// }

// @Get('admin-route')
// @AdminAuth()  // Combines JwtAuthGuardCommon, RolesGuard, and ADMIN role
// async getAdminOnlyRoute() {
//   return 'This route is only for admins';
// }

// @Get('custom-roles')
// @Auth(UserRole.ADMIN, UserRole.MODERATOR)  // Multiple roles
// async getMultiRoleRoute() {
//   return 'This route is for admins or moderators';
// }
