import crypto from 'crypto';

import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { authConfig } from '@auth/config';
import { authChannel } from '@auth/server';
import { lowerCase } from 'lodash';
import { BadRequestError, IAuthDocument, IEmailMessageDetails } from '@ohjobber/shared';
import { getAuthUserById, getAuthUserByEmail, updateVerifyEmailField } from '@auth/services/auth';
import { publishDirectMessage } from '@auth/queues/producers/auth';

export async function getCurrentUser(req: Request, res: Response): Promise<void> {
  try {
    let user = null;
    const currentUser = req.currentUser!.id;
    const existingUser: IAuthDocument | undefined = await getAuthUserById(currentUser);
    if (Object.keys(existingUser!).length) {
      user = existingUser;
    }
    res.status(StatusCodes.OK).json({ message: 'Authenticated user', user });
  } catch (error) {
    const errorMessage = error instanceof BadRequestError ? error.message : 'An unexpected error occurred.';
    res
      .status(error instanceof BadRequestError ? StatusCodes.BAD_REQUEST : StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: errorMessage });
  }
}

export async function resendEmail(req: Request, res: Response): Promise<void> {
  try {
    const { email, userId } = req.body;
    const isUserExist: IAuthDocument | undefined = await getAuthUserByEmail(email);
    if (!isUserExist) {
      throw new BadRequestError('Email is invalid', 'CurrentUser resendEmail() method error');
    }

    const randomBytes: Buffer = await Promise.resolve(crypto.randomBytes(20));
    const randomCharacters: string = randomBytes.toString('hex');
    const verificationLink = `${authConfig.CLIENT_URL}/confirm_email?v_token=${randomCharacters}`;
    await updateVerifyEmailField(userId, 0, randomCharacters);

    const messageDetails: IEmailMessageDetails = {
      receiverEmail: lowerCase(email),
      verifyLink: verificationLink,
      template: 'verifyEmail'
    };
    await publishDirectMessage(
      authChannel,
      'jobber-email-notification',
      'auth-email',
      JSON.stringify(messageDetails),
      'Verify email message has been sent to notification service.'
    );

    const updatedUser = await getAuthUserById(parseInt(userId));

    res.status(StatusCodes.OK).json({ message: 'Email verification sent', user: updatedUser });
  } catch (error) {
    const errorMessage = error instanceof BadRequestError ? error.message : 'An unexpected error occurred.';
    res
      .status(error instanceof BadRequestError ? StatusCodes.BAD_REQUEST : StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: errorMessage });
  }
}
