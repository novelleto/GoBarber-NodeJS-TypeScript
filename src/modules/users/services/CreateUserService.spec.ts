import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import CreateUserService from './CreateUserService';

describe('CreateUser', () => {
  it('should be able to create a new user', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();
    const createUser = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );

    const user = await createUser.run({
      name: 'John Doe',
      email: 'john@doe.com',
      password: '654321',
    });

    expect(user).toHaveProperty('id');
  });

  it('should not be able to create a new user with duplicated email', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();
    const createUser = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );

    await createUser.run({
      name: 'John Doe',
      email: 'john@doe.com',
      password: '654321',
    });

    expect(
      createUser.run({
        name: 'John Doe',
        email: 'john@doe.com',
        password: '654321',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
