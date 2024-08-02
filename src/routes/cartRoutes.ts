import express from 'express';
import { auth } from '../middlewares/auth';
import { 
  addToCart, 
  getCart, 
  updateCartItem, 
  removeFromCart, 
  checkout 
} from '../controllers/cartController';

const router = express.Router();

router.use(auth);

router.get('/', getCart);
router.post('/add', addToCart);
router.put('/', updateCartItem);
router.delete('/', removeFromCart);
router.post('/checkout', checkout);

export default router;
