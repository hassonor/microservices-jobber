import { Request, Response } from 'express';
import { UploadApiResponse } from 'cloudinary';
import { BadRequestError, isDataURL, ISellerGig, uploads } from '@ohjobber/shared';
import { StatusCodes } from 'http-status-codes';
import { gigUpdateSchema } from '@gig/schemes/gig';
import { updateActiveGigProp, updateGig } from '@gig/services/gig';

const gigUpdateController = async (req: Request, res: Response): Promise<void> => {
  const { error } = await Promise.resolve(gigUpdateSchema.validate(req.body));
  if (error?.details) {
    throw new BadRequestError(error.details[0].message, 'Update gig() method');
  }

  const isDataUrl = isDataURL(req.body.coverImage);
  let coverImage = '';
  if (isDataUrl) {
    const result: UploadApiResponse = (await uploads(req.body.coverImage)) as UploadApiResponse;
    if (!result.public_id) {
      throw new BadRequestError('File upload error. Try again.', ' Update gig() method');
    }

    coverImage = result?.secure_url;
  } else {
    coverImage = req.body.coverImage;
  }

  const gig: ISellerGig = {
    title: req.body.title,
    description: req.body.description,
    categories: req.body.categories,
    subCategories: req.body.subCategories,
    tags: req.body.tags,
    price: req.body.price,
    expectedDelivery: req.body.expectedDelivery,
    basicTitle: req.body.basicTitle,
    basicDescription: req.body.basicDescription,
    coverImage
  };

  const updatedGig: ISellerGig = await updateGig(req.params.gigId, gig);
  res.status(StatusCodes.OK).json({ message: 'Gig updated successfully.', gig: updatedGig });
};

const gigUpdateActiveController = async (req: Request, res: Response): Promise<void> => {
  try {
    const updatedGig: ISellerGig = await updateActiveGigProp(req.params.gigId, req.body.active);
    res.status(StatusCodes.OK).json({ message: 'Gig updated successfully.', gig: updatedGig });
  } catch (error) {
    // console.error('Created gig Error:', error); // move to elasticsearch later
    const errorMessage = error instanceof BadRequestError ? error.message : 'An unexpected error occurred during update a gig.';
    res
      .status(error instanceof BadRequestError ? StatusCodes.BAD_REQUEST : StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: errorMessage });
  }
};

export { gigUpdateController, gigUpdateActiveController };
