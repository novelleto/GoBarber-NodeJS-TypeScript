import AppError from '@shared/errors/AppError';

import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import UpdateProfileService from './UpdateProfileService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let updateProfile: UpdateProfileService;

describe('UpdateProfile', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();

    updateProfile = new UpdateProfileService(
      fakeUsersRepository,
      fakeHashProvider,
    );
  });

  it('should be able to update the profile', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'john@doe.com',
      password: '654321',
    });

    const updatedUser = await updateProfile.run({
      user_id: user.id,
      name: 'John Doe II',
      email: 'John2@doe.com',
    });

    expect(updatedUser.name).toBe('John Doe II');
    expect(updatedUser.email).toBe('John2@doe.com');
  });

  it('should not be able to update profile from non-existing user', async () => {
    await expect(
      updateProfile.run({
        user_id: 'non-existing-user-id',
        name: 'Test',
        email: 'test@doe.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to change the email to another existing one', async () => {
    await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'john@doe.com',
      password: '654321',
    });

    const user = await fakeUsersRepository.create({
      name: 'Jonh D Doe',
      email: 'johnd@doe.com',
      password: '123123',
    });

    await expect(
      updateProfile.run({
        user_id: user.id,
        name: 'John D Doe',
        email: 'john@doe.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to update the password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'john@doe.com',
      password: '654321',
    });

    const updatedUser = await updateProfile.run({
      user_id: user.id,
      name: 'John Doe II',
      email: 'John2@doe.com',
      old_password: '654321',
      password: '123321',
    });

    expect(updatedUser.password).toBe('123321');
  });

  it('should not be able to update the password without the old one', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'john@doe.com',
      password: '654321',
    });

    await expect(
      updateProfile.run({
        user_id: user.id,
        name: 'John Doe II',
        email: 'John2@doe.com',
        password: '123321',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update the password with wrong old password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'john@doe.com',
      password: '654321',
    });

    await expect(
      updateProfile.run({
        user_id: user.id,
        name: 'John Doe II',
        email: 'John2@doe.com',
        old_password: 'wrong-old-password',
        password: '123321',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
