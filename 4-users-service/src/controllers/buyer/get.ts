import { Request, Response } from 'express';
import { BadRequestError, IBuyerDocument } from '@ohjobber/shared';
import { getBuyerByEmail, getBuyerByUsername } from '@users/services/buyer';
import { StatusCodes } from 'http-status-codes';

const buyerByEmail = async (req: Request, res: Response): Promise<void> => {
  try {
    const buyer: IBuyerDocument | null = await getBuyerByEmail(req.currentUser!.email);
    res.status(StatusCodes.OK).json({ message: 'Buyer profile', buyer });
  } catch (error) {
    // console.error('buyerByEmail Error:', error); // move to elasticsearch later
    const errorMessage = error instanceof BadRequestError ? error.message : 'An unexpected error occurred during get a buyer by email.';
    res
      .status(error instanceof BadRequestError ? StatusCodes.BAD_REQUEST : StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: errorMessage });
  }
};

const buyerByCurrentUsername = async (req: Request, res: Response): Promise<void> => {
  try {
    const buyer: IBuyerDocument | null = await getBuyerByUsername(req.currentUser!.username);
    res.status(StatusCodes.OK).json({ message: 'Buyer profile', buyer });
  } catch (error) {
    // console.error('buyerByCurrentUsername Error:', error); // move to elasticsearch later
    const errorMessage =
      error instanceof BadRequestError ? error.message : 'An unexpected error occurred during get a buyer by current Username.';
    res
      .status(error instanceof BadRequestError ? StatusCodes.BAD_REQUEST : StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: errorMessage });
  }
};

const buyerByUsername = async (req: Request, res: Response): Promise<void> => {
  try {
    const buyer: IBuyerDocument | null = await getBuyerByUsername(req.params.username);
    res.status(StatusCodes.OK).json({ message: 'Buyer profile', buyer });
  } catch (error) {
    // console.error('buyerByUsername Error:', error); // move to elasticsearch later
    const errorMessage = error instanceof BadRequestError ? error.message : 'An unexpected error occurred during get a buyer by Username.';
    res
      .status(error instanceof BadRequestError ? StatusCodes.BAD_REQUEST : StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: errorMessage });
  }
};

export { buyerByEmail, buyerByCurrentUsername, buyerByUsername };
