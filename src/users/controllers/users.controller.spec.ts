import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from '../services/users.service';
import { User } from '../user.entity';
import { AuthService } from '../services/auth.service';

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: Partial<UsersService>;
  let authService: Partial<AuthService>;

  beforeEach(async () => {
    usersService = {
      findOne: (id: number) => {
        return Promise.resolve({
          id,
          email: 'test@test.com',
          password: '123',
        } as User);
      },
      find: (email: string) => {
        return Promise.resolve([{ id: 1, email, password: '123' } as User]);
      },
    };

    authService = {
      signUp: (email, password) =>
        Promise.resolve({ id: 1, email, password } as User),
      signIn: (email, password) =>
        Promise.resolve({ id: 1, email, password } as User),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: usersService,
        },
        {
          provide: AuthService,
          useValue: authService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('findAllUsers > should return the list of users', async () => {
    const users = await controller.findAllUsers('test@test.com');
    expect(users).toHaveLength(1);
  });

  it('findUser > should return a user with the given id', async () => {
    const user = await controller.findUser('1');
    expect(user.id).toEqual(1);
  });

  it('createUser > should signup with email and password', async () => {
    const session = { userId: -1000 };
    const user = await controller.createUser(
      { email: 'test@test.com', password: '1234' },
      session,
    );
    expect(user.id).toEqual(1);
    expect(session.userId).toEqual(1);
  });

  it('signIn > should signin user with email and password', async () => {
    const session = { userId: -100 };
    const user = await controller.signIn(
      { email: 'test@test.com', password: '1234' },
      session,
    );

    expect(user.id).toEqual(1);
    expect(session.userId).toEqual(1);
  });
});
