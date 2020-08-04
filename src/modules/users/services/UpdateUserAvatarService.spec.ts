import AppError from '@shared/errors/AppError';

import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import UpdateUserAvatarService from './UpdateUserAvatarService';

let fakeUsersRepository: FakeUsersRepository;
let fakeStorageProvider: FakeStorageProvider;
let updateUserAvatar: UpdateUserAvatarService;

describe('UpdataUserAvatar', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeStorageProvider = new FakeStorageProvider();
    updateUserAvatar = new UpdateUserAvatarService(
      fakeUsersRepository,
      fakeStorageProvider,
    );
  });
  it('should be able to update avatar image', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'john@doe.com',
      password: '654321',
    });

    await updateUserAvatar.run({
      user_id: user.id,
      avatarFilename: 'user_avatar.jpg',
    });

    expect(user.avatar).toBe('user_avatar.jpg');
  });

  it('non existing users should not be able to update avatar', async () => {
    await expect(
      updateUserAvatar.run({
        user_id: 'non-existing-user',
        avatarFilename: 'user_avatar.jpg',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to delete old avatar image when updating', async () => {
    const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'john@doe.com',
      password: '654321',
    });

    await updateUserAvatar.run({
      user_id: user.id,
      avatarFilename: 'user_avatar.jpg',
    });

    await updateUserAvatar.run({
      user_id: user.id,
      avatarFilename: 'user_avatar_new.jpg',
    });

    expect(deleteFile).toHaveBeenCalledWith('user_avatar.jpg');

    expect(user.avatar).toBe('user_avatar_new.jpg');
  });
});
