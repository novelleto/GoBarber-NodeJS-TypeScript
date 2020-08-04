import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import AuthenticateUserService from './AuthenticateUserService';
import CreateUserService from './CreateUserService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let createUser: CreateUserService;
let authUser: AuthenticateUserService;

describe('AuthenticateUser', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();

    createUser = new CreateUserService(fakeUsersRepository, fakeHashProvider);

    authUser = new AuthenticateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );
  });

  it('should be able to authenticate', async () => {
    const user = await createUser.run({
      name: 'John Doe',
      email: 'john@doe.com',
      password: '654321',
    });

    const response = await authUser.run({
      email: 'john@doe.com',
      password: '654321',
    });

    expect(response).toHaveProperty('token');
    expect(response.user).toEqual(user);
  });

  it('should not be able to authenticate without existing user', async () => {
    await expect(
      authUser.run({
        email: 'john@doe.com',
        password: '654321',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to authenticate with not matching password', async () => {
    await createUser.run({
      name: 'John Doe',
      email: 'john@doe.com',
      password: '654321',
    });

    await expect(
      authUser.run({
        email: 'john@doe.com',
        password: 'wrong-pwd',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
