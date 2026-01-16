import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { UserRole } from 'lib/common';
import * as bcrypt from 'bcryptjs';

export interface DevUser {
  email: string;
  password: string;
  name: string;
  roles: UserRole[];
}

export const DEV_USERS: DevUser[] = [
  {
    email: 'admin@dev.com',
    password: 'admin123',
    name: 'Dev Admin',
    roles: [UserRole.ADMIN],
  },
  {
    email: 'user@dev.com',
    password: 'user123',
    name: 'Dev User',
    roles: [UserRole.USER],
  },
  {
    email: 'mod@dev.com',
    password: 'mod123',
    name: 'Dev Moderator',
    roles: [UserRole.MODERATOR],
  },
];

@Injectable()
export class UsersSeeder implements OnModuleInit {
  private readonly logger = new Logger(UsersSeeder.name);

  constructor(private readonly usersRepository: UsersRepository) {}

  async onModuleInit() {
    await this.seedDevUsers();
  }

  private async seedDevUsers() {
    this.logger.log('Checking for dev users...');

    for (const devUser of DEV_USERS) {
      try {
        const existingUser = await this.usersRepository
          .findOne({ email: devUser.email })
          .catch(() => null);

        if (!existingUser) {
          const hashedPassword = await bcrypt.hash(devUser.password, 10);
          await this.usersRepository.create({
            email: devUser.email,
            password: hashedPassword,
            plainPassword: devUser.password,
            name: devUser.name,
            roles: devUser.roles,
            isActive: true,
            lastLogin: new Date(),
          });
          this.logger.log(`Created dev user: ${devUser.email}`);
        } else {
          this.logger.log(`Dev user already exists: ${devUser.email}`);
        }
      } catch (error) {
        this.logger.error(`Failed to seed user ${devUser.email}:`, error);
      }
    }

    this.logger.log('Dev users seeding complete');
  }
}
