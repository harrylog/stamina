import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { AUTH_SERVICE } from '../constants/services';
import { BaseUserDto } from '../dto';

@Injectable()
export class JwtAuthGuardCommon implements CanActivate {
  private readonly logger = new Logger(JwtAuthGuardCommon.name);

  constructor(
    @Inject(AUTH_SERVICE) private readonly authClient: ClientProxy,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const jwt =
      request.cookies?.Authentication ||
      request.headers?.authentication ||
      request.headers?.authorization?.replace('Bearer ', '');

    if (!jwt) {
      this.logger.warn('No JWT token found in request');
      return false;
    }

    // Validate JWT with auth service and attach user to request
    // Role checking is handled by RolesGuard
    return this.authClient
      .send<BaseUserDto>('authenticate', {
        Authentication: jwt,
      })
      .pipe(
        tap((user) => {
          this.logger.log(`User authenticated: ${user.email}`);
          request.user = user;
        }),
        map(() => true),
        catchError((err) => {
          this.logger.error('Authentication failed:', err.message);
          return of(false);
        }),
      );
  }
}
