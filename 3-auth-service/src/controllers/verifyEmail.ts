import { Request, Response } from 'express';
import { BadRequestError, IAuthDocument } from '@ohjobber/shared';
import { getAuthUserById, getAuthUserByVerificationToken, updateVerifyEmailField } from '@auth/services/auth';
import { StatusCodes } from 'http-status-codes';

export async function verifyEmail(req: Request, res: Response): Promise<void> {
  try {
    const { token } = req.body;
    const existingUser: IAuthDocument | undefined = await getAuthUserByVerificationToken(token);

    if (!existingUser) {
      throw new BadRequestError('Verification token is either invalid or already had been used.', 'VerifyEmail update() method error');
    }

    await updateVerifyEmailField(existingUser.id!, 1, '');
    const updatedUser = await getAuthUserById(existingUser.id!);

    res.status(StatusCodes.OK).json({ message: 'Email verified successfully.', user: updatedUser });
  } catch (error) {
    console.error('VerifyEmail Controller Error:', error);
    const errorMessage = error instanceof BadRequestError ? error.message : 'An unexpected error occurred during the verify-email process.';
    res
      .status(error instanceof BadRequestError ? StatusCodes.BAD_REQUEST : StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: errorMessage });
  }
}
