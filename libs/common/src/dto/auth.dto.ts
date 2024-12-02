// lib/common/dto/auth.dto.ts
export class SignUpDto {
  email: string;
  password: string;
}

export class SignInDto {
  email: string;
  password: string;
}

export class TokenPayload {
  userId: string;
  email: string;
  roles: string[];
}
