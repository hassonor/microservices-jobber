import crypto from 'crypto';

import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { authConfig } from '@auth/config';
import { authChannel } from '@auth/server';
import { changePasswordSchema, emailSchema, passwordSchema } from '@auth/schemes/password';
import { BadRequestError, IAuthDocument, IEmailMessageDetails } from '@ohjobber/shared';
import {
  getAuthUserByPasswordToken,
  getAuthUserByEmail,
  getAuthUserByUsername,
  updatePassword,
  updatePasswordToken
} from '@auth/services/auth';
import { publishDirectMessage } from '@auth/queues/producers/auth';
import { AuthModel } from '@auth/models/auth';

export async function forgotPassword(req: Request, res: Response): Promise<void> {
  try {
    const { error } = await Promise.resolve(emailSchema.validate(req.body));
    if (error?.details) {
      throw new BadRequestError(error.details[0].message, 'Password forgotPassword() method error');
    }

    const { email } = req.body;
    const existingUser: IAuthDocument | undefined = await getAuthUserByEmail(email);
    if (!existingUser) {
      throw new BadRequestError('Invalid credentials', 'Password forgotPassword() method error');
    }

    const randomBytes: Buffer = await Promise.resolve(crypto.randomBytes(20));
    const randomCharacters: string = randomBytes.toString('hex');
    const expirationDate: Date = new Date();
    expirationDate.setHours(expirationDate.getHours() + 1); // token expiration date -> add 1 hour

    await updatePasswordToken(existingUser.id!, randomCharacters, expirationDate);
    const resetLink = `${authConfig.CLIENT_URL}/reset_password?token=${randomCharacters}`;
    const messageDetails: IEmailMessageDetails = {
      receiverEmail: existingUser.email!,
      resetLink,
      username: existingUser.username!,
      template: 'forgotPassword'
    };

    await publishDirectMessage(
      authChannel,
      'jobber-email-notification',
      'auth-email',
      JSON.stringify(messageDetails),
      'Forgot password message sent to notification service.'
    );

    res.status(StatusCodes.OK).json({ message: 'Password reset link was sent to email.' });
  } catch (error) {
    console.error('Forgot Password Error:', error); // move to elasticsearch later
    const errorMessage =
      error instanceof BadRequestError ? error.message : 'An unexpected error occurred during the forgot password process.';
    res
      .status(error instanceof BadRequestError ? StatusCodes.BAD_REQUEST : StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: errorMessage });
  }
}

export async function resetPassword(req: Request, res: Response): Promise<void> {
  try {
    const { error } = await Promise.resolve(passwordSchema.validate(req.body));
    if (error?.details) {
      throw new BadRequestError(error.details[0].message, 'Password resetPassword() method error');
    }

    const { password, confirmPassword } = req.body;
    const { token } = req.params;
    if (password !== confirmPassword) {
      throw new BadRequestError('Passwords do not match.', 'Password resetPassword() method error');
    }

    const existingUser: IAuthDocument | undefined = await getAuthUserByPasswordToken(token);
    if (!existingUser) {
      throw new BadRequestError('Reset token has expired', 'Password resetPassword() method error');
    }

    const hashedPassword: string = await AuthModel.prototype.hashPassword(password);
    await updatePassword(existingUser.id!, hashedPassword);

    const messageDetails: IEmailMessageDetails = {
      username: existingUser.username!,
      template: 'resetPasswordSuccess'
    };
    await publishDirectMessage(
      authChannel,
      'jobber-email-notification',
      'auth-email',
      JSON.stringify(messageDetails),
      'Reset password success message were sent to notification service.'
    );

    res.status(StatusCodes.OK).json({ message: 'Password successfully updated.' });
  } catch (error) {
    console.error('Reset Password Error:', error); // move to elasticsearch later
    const errorMessage =
      error instanceof BadRequestError ? error.message : 'An unexpected error occurred during the reset password process.';
    res
      .status(error instanceof BadRequestError ? StatusCodes.BAD_REQUEST : StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: errorMessage });
  }
}

export async function changePassword(req: Request, res: Response): Promise<void> {
  try {
    const { error } = await Promise.resolve(changePasswordSchema.validate(req.body));
    if (error?.details) {
      throw new BadRequestError(error.details[0].message, 'Password changePassword() method error');
    }
    const { newPassword } = req.body;

    const existingUser: IAuthDocument | undefined = await getAuthUserByUsername(`${req.currentUser?.username}`);
    if (!existingUser) {
      throw new BadRequestError('User not found', 'Password changePassword() method error');
    }

    const hashedPassword: string = await AuthModel.prototype.hashPassword(newPassword);
    await updatePassword(existingUser.id!, hashedPassword);

    const messageDetails: IEmailMessageDetails = {
      username: existingUser.username!,
      template: 'resetPasswordSuccess'
    };
    await publishDirectMessage(
      authChannel,
      'jobber-email-notification',
      'auth-email',
      JSON.stringify(messageDetails),
      'Password change success message were sent to notification service.'
    );

    res.status(StatusCodes.OK).json({ message: 'Password successfully updated.' });
  } catch (error) {
    console.error('changePassword Error:', error); // move to elasticsearch later
    const errorMessage =
      error instanceof BadRequestError ? error.message : 'An unexpected error occurred during the change password process.';
    res
      .status(error instanceof BadRequestError ? StatusCodes.BAD_REQUEST : StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: errorMessage });
  }
}
