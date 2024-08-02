import { Request, Response } from 'express';
import Cart from '../models/Cart';
import User from '../models/User';
import Order from '../models/Order';
import { sendCheckoutEmail } from '../utils/resend';

interface ShippingAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export const addToCart = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }
    const { productId, quantity } = req.body;
    
    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
    }

    const existingItem = cart.items.find(item => item.product.toString() === productId);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity });
    }

    await cart.calculateTotal();
    await cart.save();
    res.status(200).json(cart);
  } catch (error: any) {
    res.status(400).json({ message: 'Failed to add item to cart', error: error.message });
  }
};

export const getCart = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId  = req.user?.userId;
    const cart = await Cart.findOne({ user: userId }).populate('items.product');
    if (!cart) {
      res.status(404).json({ message: 'Cart not found' });
      return;
    }
    res.status(200).json(cart);
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to fetch cart', error: error.message });
  }
};

export const updateCartItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId  = req.user?.userId;
    const { productId, quantity } = req.body;

    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      res.status(404).json({ message: 'Cart not found' });
      return;
    }

    const item = cart.items.find(item => item.product.toString() === productId);
    if (!item) {
      res.status(404).json({ message: 'Item not found in cart' });
      return;
    }

    item.quantity = quantity;
    await cart.calculateTotal();
    await cart.save();
    res.status(200).json(cart);
  } catch (error: any) {
    res.status(400).json({ message: 'Failed to update cart item', error: error.message });
  }
};

export const removeFromCart = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId  = req.user?.userId;
    const { productId } = req.body;

    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      res.status(404).json({ message: 'Cart not found' });
      return;
    }

    cart.items = cart.items.filter(item => item.product.toString() !== productId);
    await cart.calculateTotal();
    await cart.save();
    res.status(200).json(cart);
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to remove item from cart', error: error.message });
  }
};

export const checkout = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const shippingAddress: ShippingAddress = req.body.shippingAddress;

    if (!shippingAddress) {
      res.status(400).json({ message: 'Shipping address is required' });
      return;
    }

    const cart = await Cart.findOne({ user: userId }).populate('items.product');
    if (!cart || cart.items.length === 0) {
      res.status(400).json({ message: 'Cart is empty' });
      return;
    }

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    const order = new Order({
      user: userId,
      shippingAddress,
      products: cart.items.map(item => ({
        product: (item.product as any)._id,
        quantity: item.quantity
      })),
    });

    await order.save();
    await sendCheckoutEmail(user.email);

    // Clear the cart
    cart.items = [];
    await cart.calculateTotal();
    await cart.save();

    res.status(200).json({ message: 'Checkout successful', order });
  } catch (error: any) {
    console.error('Checkout error:', error);
    res.status(500).json({ message: 'Checkout failed', error: error.message });
  }
};
