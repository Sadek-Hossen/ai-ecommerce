import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  image: { type: String, required: true },
  variants: [{
    size: String,
    color: String,
    stock: Number
  }],
  rating: { type: Number, default: 5 },
  reviews: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

export const Product = mongoose.model('Product', productSchema);
