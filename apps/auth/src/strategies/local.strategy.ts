// import { Injectable, UnauthorizedException } from '@nestjs/common';
// import { PassportStrategy } from '@nestjs/passport';
// import { Strategy } from 'passport-local';
// import { UsersService } from '../users/users.service';

// @Injectable()
// export class LocalStategy extends PassportStrategy(Strategy) {
//   constructor(private readonly usersService: UsersService) {
//     super({ usernameField: 'email' });
//   }

//   async validate(email: string, password: string) {
//     try {
//       return await this.usersService.verifyUser(email, password);
//     } catch (err) {
//       throw new UnauthorizedException(err);
//     }
//   }
// }

/*In NestJS, once you've defined an authentication strategy and
 registered it as a provider in a module, you can access the user 
 object or user information that the strategy returns in your application's 
 request object using the @Request() decorator.
 */

//related to : export class LocalAuthGuard extends AuthGuard('local') {}
// and   @UseGuards(LocalAuthGuard)
