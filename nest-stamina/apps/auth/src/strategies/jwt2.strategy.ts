// apps/auth/src/strategies/jwt2.strategy.ts
import { Injectable, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { TokenPayload } from '../interfaces/token-payload.interface';
import { USERS_SERVICE } from 'lib/common';

@Injectable()
export class Jwt2Strategy extends PassportStrategy(Strategy, 'jwt2') {
  constructor(
    configService: ConfigService,
    @Inject(USERS_SERVICE) private readonly usersClient: ClientProxy,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: any) =>
          request?.cookies?.Authentication ||
          request?.authentication ||
          request?.headers.authentication,
      ]),
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  async validate({ userId }: TokenPayload) {
    try {
      // Use the microservice client to get user data
      const user = await lastValueFrom(
        this.usersClient.send('get_user_by_id', { _id: userId }),
      );
      return user;
    } catch (err) {
      console.error('Error validating user:', err);
      return null;
    }
  }
}
