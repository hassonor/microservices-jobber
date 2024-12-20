import { Request, Response } from 'express';
import { BadRequestError, ISellerDocument } from '@ohjobber/shared';
import { StatusCodes } from 'http-status-codes';
import { getRandomSellers, getSellerById, getSellerByUsername } from '@users/services/seller';

const getById = async (req: Request, res: Response): Promise<void> => {
  try {
    const seller: ISellerDocument | null = await getSellerById(req.params.sellerId);
    res.status(StatusCodes.OK).json({ message: 'Seller profile', seller });
  } catch (error) {
    // console.error('getById Error:', error); // move to elasticsearch later
    const errorMessage = error instanceof BadRequestError ? error.message : 'An unexpected error occurred during get a seller by id.';
    res
      .status(error instanceof BadRequestError ? StatusCodes.BAD_REQUEST : StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: errorMessage });
  }
};

const getByUsername = async (req: Request, res: Response): Promise<void> => {
  try {
    const seller: ISellerDocument | null = await getSellerByUsername(req.params.username);
    res.status(StatusCodes.OK).json({ message: 'Seller profile', seller });
  } catch (error) {
    // console.error('getByUsername Error:', error); // move to elasticsearch later
    const errorMessage = error instanceof BadRequestError ? error.message : 'An unexpected error occurred during get a seller by username.';
    res
      .status(error instanceof BadRequestError ? StatusCodes.BAD_REQUEST : StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: errorMessage });
  }
};

const getRandom = async (req: Request, res: Response): Promise<void> => {
  try {
    const sellers: ISellerDocument[] = await getRandomSellers(parseInt(req.params.size, 10));
    res.status(StatusCodes.OK).json({ message: 'Random sellers profile', sellers });
  } catch (error) {
    // console.error('getRandom Error:', error); // move to elasticsearch later
    const errorMessage = error instanceof BadRequestError ? error.message : 'An unexpected error occurred during get random sellers.';
    res
      .status(error instanceof BadRequestError ? StatusCodes.BAD_REQUEST : StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: errorMessage });
  }
};

export { getById, getByUsername, getRandom };
