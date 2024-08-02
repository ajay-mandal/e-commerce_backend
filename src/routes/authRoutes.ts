import express from 'express';
import { register, login, updateRole } from '../controllers/authController';
import { isSuperAdmin } from '../middlewares/role';
import { auth } from '../middlewares/auth';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.put('/updateRole',auth, isSuperAdmin, updateRole)
export default router;
