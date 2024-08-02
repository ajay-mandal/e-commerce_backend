import mongoose, { Document, Schema } from 'mongoose';

export interface ICartItem {
  product: Schema.Types.ObjectId;
  quantity: number;
}

export interface ICart extends Document {
  user: Schema.Types.ObjectId;
  items: ICartItem[];
  total: number;
  createdAt: Date;
  updatedAt: Date;
  calculateTotal: () => Promise<void>;
}

const CartItemSchema = new Schema({
  product: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  }
});

const CartSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  items: [CartItemSchema],
  total: {
    type: Number,
    required: true,
    default: 0
  }
}, {
  timestamps: true
});

// Calculating the total price of the cart
CartSchema.methods.calculateTotal = async function(): Promise<void> {
  let total = 0;
  for (let item of this.items) {
    const product = await mongoose.model('Product').findById(item.product);
    if (product) {
      total += product.price * item.quantity;
    }
  }
  this.total = total;
  return this.save();
};

const Cart = mongoose.model<ICart>('Cart', CartSchema);

export default Cart;
