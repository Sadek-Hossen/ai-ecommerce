/*
import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    name: String,
    price: Number,
    quantity: Number,
    selectedVariant: {
      size: String,
      color: String
    },
    image: String
  }],
  total: { type: Number, required: true },
  status: { type: String, default: 'Pending' },
  customer: {
    name: String,
    email: String
  },
  createdAt: { type: Date, default: Date.now }
});

export const Order = mongoose.model('Order', orderSchema);
*/
