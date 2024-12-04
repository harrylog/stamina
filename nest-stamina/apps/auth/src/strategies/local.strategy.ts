// strategies/local.strategy.ts
import { Injectable, Inject, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { USERS_SERVICE } from 'lib/common';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(USERS_SERVICE) private readonly usersClient: ClientProxy,
  ) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string) {
    try {
      const user = await lastValueFrom(
        this.usersClient.send('verify_user', { email, password }),
      );

      if (!user) {
        throw new UnauthorizedException('Invalid credentials');
      }

      return user;
    } catch (err) {
      throw new UnauthorizedException(err?.message || 'Invalid credentials');
    }
  }
}

/*In NestJS, once you've defined an authentication strategy and
 registered it as a provider in a module, you can access the user 
 object or user information that the strategy returns in your application's 
 request object using the @Request() decorator.
 */

//related to : export class LocalAuthGuard extends AuthGuard('local') {}
// and   @UseGuards(LocalAuthGuard)
