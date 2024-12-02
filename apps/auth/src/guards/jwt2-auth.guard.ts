import { AuthGuard } from '@nestjs/passport';

export class Jwt2AuthGuard extends AuthGuard('jwt2') {}
