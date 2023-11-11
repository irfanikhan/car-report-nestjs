import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { User } from '../user.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;

  beforeEach(async () => {
    const users: User[] = [];
    // Create a copy of UsersService
    fakeUsersService = {
      // we use two methods of UsersService since AuthService is only using two methods
      find: (email: string) => {
        const filtered = users.filter((user: User) => user.email === email);
        return Promise.resolve(filtered);
      },
      create: (email: string, password: string) => {
        const user = {
          id: Math.floor(Math.random() * 9999),
          email,
          password,
        } as User;
        users.push(user);
        return Promise.resolve(user);
      },
    };

    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
      ],
    }).compile();

    service = module.get(AuthService);
  });

  it('can create an instance of auth service', async () => {
    expect(service).toBeDefined();
  });

  it('creates a new user with salted and hashed password', async () => {
    const user = await service.signUp('test@test.com', '1234');

    expect(user.password).not.toEqual('1234');

    const [salt, hash] = user.password.split('.');

    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('throws an error if user signs up with email that is in use', async () => {
    await service.signUp('test@test.com', '1234');

    await expect(service.signUp('test@test.com', '1234')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('throws an error if signin with unused email', async () => {
    await expect(service.signIn('test@mail.com', 'abc')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('throws if an invalid password is provided', async () => {
    await service.signUp('test@test.com', '1234');

    await expect(service.signIn('test@test.com', 'fasfda')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('return user if correct password is provided', async () => {
    await service.signUp('test@test.com', '1234');

    const user = await service.signIn('test@test.com', '1234');
    expect(user).toBeDefined();
  });
});
