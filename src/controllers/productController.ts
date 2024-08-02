import { Request, Response } from 'express';
import Product, { IProduct } from '../models/Product';

export const createProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const productData: IProduct = req.body;
    const newProduct = await Product.create(productData);
    res.status(201).json(newProduct);
  } catch (error: any) {
    res.status(400).json({ message: 'Failed to create product', error: error.message });
  }
};

export const getAllProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to fetch products', error: error.message });
  }
};

export const getProductById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }
    res.status(200).json({product, _id: product._id});
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to fetch product', error: error.message });
  }
};

export const updateProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData: Partial<IProduct> = req.body;
    const updatedProduct = await Product.findByIdAndUpdate(id, updateData, { new: true });
    if (!updatedProduct) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }
    res.status(200).json(updatedProduct);
  } catch (error: any) {
    res.status(400).json({ message: 'Failed to update product', error: error.message });
  }
};

export const deleteProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const deletedProduct = await Product.findByIdAndDelete(id);
    if (!deletedProduct) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to delete product', error: error.message });
  }
};
