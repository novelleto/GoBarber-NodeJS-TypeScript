import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ListProviderDayAvailabilityService from '@modules/appointments/services/ListProviderDayAvailabilityService';

export default class ProvidersMonthAvailabilityController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { provider_id } = request.params;
    const { day, month, year } = request.query;

    const listProvidersDayAvailability = container.resolve(
      ListProviderDayAvailabilityService,
    );

    const availability = await listProvidersDayAvailability.run({
      provider_id,
      day: Number(day),
      month: Number(month),
      year: Number(year),
    });

    return response.json(availability);
  }
}
