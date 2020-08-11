import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import ListProviderDayAvailabilityService from './ListProviderDayAvailabilityService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let listProviderDayAvailability: ListProviderDayAvailabilityService;

describe('ListProviderMonthAvailability', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    listProviderDayAvailability = new ListProviderDayAvailabilityService(
      fakeAppointmentsRepository,
    );
  });

  it('should be able to list the providers day availability', async () => {
    await fakeAppointmentsRepository.create({
      provider_id: 'provider.id',
      user_id: 'user',
      date: new Date(2020, 10, 12, 14, 0, 0),
    });

    await fakeAppointmentsRepository.create({
      provider_id: 'provider.id',
      user_id: 'user',
      date: new Date(2020, 10, 12, 16, 0, 0),
    });

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 10, 12, 11, 0, 0).getTime();
    });

    const availability = await listProviderDayAvailability.run({
      provider_id: 'provider.id',
      day: 12,
      year: 2020,
      month: 11,
    });

    expect(availability).toEqual(
      expect.arrayContaining([
        { hour: 8, available: false },
        { hour: 9, available: false },
        { hour: 10, available: false },
        { hour: 13, available: true },
        { hour: 14, available: false },
        { hour: 15, available: true },
        { hour: 16, available: false },
      ]),
    );
  });
});
