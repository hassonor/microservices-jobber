import * as crypto from 'node:crypto';

import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { UploadApiResponse } from 'cloudinary';
import { signupSchema } from '@auth/schemes/signup';
import { BadRequestError, firstLetterUppercase, IAuthDocument, IEmailMessageDetails, lowerCase, uploads } from '@ohjobber/shared';
import { createAuthUser, getAuthUserByUsernameOrEmail, signToken } from '@auth/services/auth';
import { authConfig } from '@auth/config';
import { StatusCodes } from 'http-status-codes';
import { publishDirectMessage } from '@auth/queues/producers/auth';
import { authChannel } from '@auth/server';

export async function create(req: Request, res: Response): Promise<void> {
  try {
    const { error } = await Promise.resolve(signupSchema.validate(req.body));
    if (error?.details) {
      throw new BadRequestError(error.details[0].message, 'SignUp create() method error');
    }

    const { username, email, password, country, profilePicture } = req.body;
    const checkIfUserExist: IAuthDocument | undefined = await getAuthUserByUsernameOrEmail(username, email);
    if (checkIfUserExist) {
      throw new BadRequestError('Invalid credentials. Email or Username', 'SignUp create() method error');
    }

    const profilePublicId = uuidv4();
    const uploadResult: UploadApiResponse = (await uploads(profilePicture, `${profilePublicId}`, true, true)) as UploadApiResponse;
    if (!uploadResult.public_id) {
      throw new BadRequestError('Image upload failed. Try again.', 'SignUp create() method error');
    }

    const randomBytes: Buffer = await Promise.resolve(crypto.randomBytes(20));
    const randomCharacters: string = randomBytes.toString('hex');
    const authData: IAuthDocument = {
      username: firstLetterUppercase(username),
      email: lowerCase(email),
      profilePublicId,
      password,
      country,
      profilePicture: uploadResult?.secure_url,
      emailVerificationToken: randomCharacters
    } as IAuthDocument;

    const result: IAuthDocument = (await createAuthUser(authData)) as IAuthDocument;
    const verificationLink = `${authConfig.CLIENT_URL}/confirm_email?v_token=${authData.emailVerificationToken}`;
    const messageDetails: IEmailMessageDetails = {
      receiverEmail: result.email,
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

    const userJWT: string = signToken(result.id!, result.email!, result.username!);
    res.status(StatusCodes.CREATED).json({ message: 'User created successfully', user: result, token: userJWT });
  } catch (error) {
    console.error('SignUp Error:', error);
    const isBadRequest = error instanceof BadRequestError;
    res.status(isBadRequest ? StatusCodes.BAD_REQUEST : StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: isBadRequest ? error.message : 'An unexpected error occurred during the sign-up process.'
    });
  }
}
