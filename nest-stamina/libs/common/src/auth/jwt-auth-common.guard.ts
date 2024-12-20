import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Reflector } from '@nestjs/core';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { AUTH_SERVICE } from '../constants/services';
import { BaseUserDto } from '../dto';
import { UserRole } from '../enums';

@Injectable()
export class JwtAuthGuardCommon implements CanActivate {
  private readonly logger = new Logger(JwtAuthGuardCommon.name);

  constructor(
    @Inject(AUTH_SERVICE) private readonly authClient: ClientProxy,
    private readonly reflector: Reflector,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const jwt =
      context.switchToHttp().getRequest().cookies?.Authentication ||
      context.switchToHttp().getRequest().headers?.authentication;

    this.logger.log('Headers:', context.switchToHttp().getRequest().headers);
    this.logger.log('Cookies:', context.switchToHttp().getRequest().cookies);
    this.logger.log('JWT found:', jwt);
    if (!jwt) {
      return false;
    }

    const roles = this.reflector.get<UserRole[]>('roles', context.getHandler());

    return this.authClient
      .send<BaseUserDto>('authenticate', {
        Authentication: jwt,
      })
      .pipe(
        tap((res) => {
          this.logger.log('Auth response:', res);
          console.log('Auth response:', res);

          context.switchToHttp().getRequest().user = res;
          if (roles) {
            for (const role of roles) {
              if (!res.roles?.includes(role)) {
                this.logger.error(`User does not have required role: ${role}`);
                throw new UnauthorizedException();
              }
            }
          }
          context.switchToHttp().getRequest().user = res;

          console.log(res);
        }),
        map(() => true),
        catchError((err) => {
          this.logger.error('Auth error:', err);

          return of(false);
        }),
      );
  }
}
