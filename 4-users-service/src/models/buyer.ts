import mongoose, { Model, model, Schema } from 'mongoose';
import { IBuyerDocument } from '@ohjobber/shared';

const buyer: Schema = new Schema(
  {
    username: { type: String, required: true, index: true },
    email: { type: String, required: true, index: true },
    profilePicture: { type: String, required: true },
    country: { type: String, required: true },
    isSeller: { type: Boolean, default: false },
    purchasedGigs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Gig' }],
    createdAt: { type: Date }
  },
  {
    versionKey: false
  }
);

const BuyerModel: Model<IBuyerDocument> = model<IBuyerDocument>('Buyer', buyer, 'Buyer');
export { BuyerModel };
