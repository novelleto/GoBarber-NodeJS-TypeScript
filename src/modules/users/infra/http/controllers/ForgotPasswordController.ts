import { Request, Response } from 'express';
import { container } from 'tsyringe';

import SendForgotPasswdEmailService from '@modules/users/services/SendForgotPasswdEmailService';

export default class ForgotPasswordController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { email } = request.body;

    const sendForgotPasswdEmail = container.resolve(
      SendForgotPasswdEmailService,
    );

    await sendForgotPasswdEmail.run({
      email,
    });

    return response.status(204).json();
  }
}
