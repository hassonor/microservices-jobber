import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { getAuthUserByUsername, signToken } from '@auth/services/auth';
import { BadRequestError, IAuthDocument } from '@ohjobber/shared';

export async function refreshToken(req: Request, res: Response): Promise<void> {
  try {
    const { username } = req.params;
    if (!username) {
      throw new BadRequestError('Refresh Token failed.', 'refreshToken refreshToken() method error');
    }

    const existingUser: IAuthDocument | undefined = await getAuthUserByUsername(username);
    // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
    const userJWT: string = signToken(existingUser?.id!, existingUser?.email!, existingUser?.username!);
    res.status(StatusCodes.OK).json({ message: 'Refresh token', user: existingUser, token: userJWT });
  } catch (error) {
    console.error('refreshToken Error:', error); // move to elasticsearch later
    const errorMessage = error instanceof BadRequestError ? error.message : 'An unexpected error occurred during refresh the token.';
    res
      .status(error instanceof BadRequestError ? StatusCodes.BAD_REQUEST : StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: errorMessage });
  }
}
