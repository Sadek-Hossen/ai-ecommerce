import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['client', 'admin'], default: 'client' },
  addresses: [{
    id: String,
    street: String,
    city: String,
    state: String,
    zipCode: String,
    isDefault: { type: Boolean, default: false }
  }],
  paymentMethods: [{
    id: String,
    type: { type: String, default: 'card' },
    last4: String,
    brand: String,
    expiryDate: String
  }],
  cart: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    quantity: { type: Number, default: 1 },
    selectedVariant: mongoose.Schema.Types.Mixed
  }],
  createdAt: { type: Date, default: Date.now }
});

// Hash password before saving
userSchema.pre('save', async function(this: any, next: any) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

export const User = mongoose.model('User', userSchema);
