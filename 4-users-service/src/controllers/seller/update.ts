import { Request, Response } from 'express';
import { BadRequestError, ISellerDocument } from '@ohjobber/shared';
import { StatusCodes } from 'http-status-codes';
import { sellerSchema } from '@users/schemes/seller';
import { updateSeller } from '@users/services/seller';

const updateSellerController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { error } = await Promise.resolve(sellerSchema.validate(req.body));
    if (error?.details) {
      throw new BadRequestError(error.details[0].message, 'Update seller() method error');
    }

    const sellerData: ISellerDocument = {
      profilePublicId: req.body.profilePublicId,
      fullName: req.body.fullName,
      profilePicture: req.body.profilePicture,
      description: req.body.description,
      oneliner: req.body.oneliner,
      country: req.body.country,
      skills: req.body.skills,
      languages: req.body.languages,
      responseTime: req.body.responseTime,
      experience: req.body.experience,
      education: req.body.education,
      socialLinks: req.body.socialLinks,
      certificates: req.body.certificates
    };

    const updatedSeller: ISellerDocument = await updateSeller(req.params.sellerId, sellerData);
    res.status(StatusCodes.OK).json({ message: 'Seller created successfully.', seller: updatedSeller });
  } catch (error) {
    // console.error('Created Seller Error:', error); // move to elasticsearch later
    const errorMessage = error instanceof BadRequestError ? error.message : 'An unexpected error occurred during create a new seller.';
    res
      .status(error instanceof BadRequestError ? StatusCodes.BAD_REQUEST : StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: errorMessage });
  }
};

export { updateSellerController };
