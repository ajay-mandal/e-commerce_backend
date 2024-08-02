import express from 'express';
import { auth } from '../middlewares/auth';
import { isSuperAdmin } from '../middlewares/role';
import { 
  createProduct, 
  getAllProducts,
  updateProduct, 
  deleteProduct, 
  getProductById
} from '../controllers/productController';

const router = express.Router();

router.get('/', getAllProducts);
router.get('/:id', getProductById);

// Super admin routes
router.post('/', auth, isSuperAdmin, createProduct);
router.put('/:id', auth, isSuperAdmin, updateProduct);
router.delete('/:id', auth, isSuperAdmin, deleteProduct);

export default router;
