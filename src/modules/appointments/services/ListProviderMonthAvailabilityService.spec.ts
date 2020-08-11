import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import ListProviderMonthAvailabilityService from './ListProviderMonthAvailabilityService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let listProviderMonthAvailability: ListProviderMonthAvailabilityService;

describe('ListProviderMonthAvailability', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();

    listProviderMonthAvailability = new ListProviderMonthAvailabilityService(
      fakeAppointmentsRepository,
    );
  });

  it('should be able to list provider month availability', async () => {
    await fakeAppointmentsRepository.create({
      provider_id: 'provider.id',
      user_id: 'user',
      date: new Date(2020, 10, 12, 8, 0, 0),
    });

    await fakeAppointmentsRepository.create({
      provider_id: 'provider.id',
      user_id: 'user',
      date: new Date(2020, 10, 12, 9, 0, 0),
    });

    await fakeAppointmentsRepository.create({
      provider_id: 'provider.id',
      user_id: 'user',
      date: new Date(2020, 10, 12, 10, 0, 0),
    });

    await fakeAppointmentsRepository.create({
      provider_id: 'provider.id',
      user_id: 'user',
      date: new Date(2020, 10, 12, 11, 0, 0),
    });

    await fakeAppointmentsRepository.create({
      provider_id: 'provider.id',
      user_id: 'user',
      date: new Date(2020, 10, 12, 12, 0, 0),
    });

    await fakeAppointmentsRepository.create({
      provider_id: 'provider.id',
      user_id: 'user',
      date: new Date(2020, 10, 12, 13, 0, 0),
    });

    await fakeAppointmentsRepository.create({
      provider_id: 'provider.id',
      user_id: 'user',
      date: new Date(2020, 10, 12, 14, 0, 0),
    });

    await fakeAppointmentsRepository.create({
      provider_id: 'provider.id',
      user_id: 'user',
      date: new Date(2020, 10, 12, 15, 0, 0),
    });

    await fakeAppointmentsRepository.create({
      provider_id: 'provider.id',
      user_id: 'user',
      date: new Date(2020, 10, 12, 16, 0, 0),
    });

    await fakeAppointmentsRepository.create({
      provider_id: 'provider.id',
      user_id: 'user',
      date: new Date(2020, 10, 12, 17, 0, 0),
    });

    await fakeAppointmentsRepository.create({
      provider_id: 'provider.id',
      user_id: 'user',
      date: new Date(2020, 10, 15, 9, 0, 0),
    });

    const availability = await listProviderMonthAvailability.run({
      provider_id: 'provider.id',
      year: 2020,
      month: 11,
    });

    expect(availability).toEqual(
      expect.arrayContaining([
        { day: 11, available: true },
        { day: 12, available: false },
        { day: 15, available: true },
        { day: 16, available: true },
      ]),
    );
  });
});
