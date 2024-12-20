import { IBuyerDocument } from '@ohjobber/shared';
import { BuyerModel } from '@users/models/buyer';

const getBuyerByEmail = async (email: string): Promise<IBuyerDocument | null> => {
  const buyer: IBuyerDocument | null = (await BuyerModel.findOne({ email }).exec()) as IBuyerDocument;
  return buyer;
};

const getBuyerByUsername = async (username: string): Promise<IBuyerDocument | null> => {
  const buyer: IBuyerDocument | null = (await BuyerModel.findOne({ username }).exec()) as IBuyerDocument;
  return buyer;
};

const getRandomBuyers = async (size: number): Promise<IBuyerDocument[]> => {
  const arrayOfRandomBuyers: IBuyerDocument[] = await BuyerModel.aggregate([{ $sample: { size } }]);
  return arrayOfRandomBuyers;
};

const createBuyer = async (buyerData: IBuyerDocument): Promise<void> => {
  const checkIfBuyerExist: IBuyerDocument | null = await getBuyerByEmail(`${buyerData.email}`);
  if (!checkIfBuyerExist) {
    await BuyerModel.create(buyerData);
  }
};

const updateBuyerIsSellerProp = async (email: string): Promise<void> => {
  await BuyerModel.updateOne(
    { email },
    {
      $set: {
        isSeller: true
      }
    }
  ).exec();
};

const updateBuyerPurchasedGigsProp = async (buyerId: string, purchasedGigsId: string, type: string): Promise<void> => {
  await BuyerModel.updateOne(
    { _id: buyerId },
    type == 'purchased-gigs'
      ? {
          $push: {
            purchasedGigs: purchasedGigsId
          }
        }
      : {
          $pull: {
            purchasedGigs: purchasedGigsId
          }
        }
  ).exec();
};

export { getBuyerByEmail, getBuyerByUsername, getRandomBuyers, createBuyer, updateBuyerIsSellerProp, updateBuyerPurchasedGigsProp };
