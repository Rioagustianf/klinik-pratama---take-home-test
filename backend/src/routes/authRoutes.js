import { Router } from 'express';
import { login, logout } from '../controllers/authController.js';
import { verifyJWT } from '../middlewares/auth.js';
import asyncHandler from '../utils/asyncHandler.js';

const router = Router();

router.post('/login', asyncHandler(login));
router.post('/logout', verifyJWT, asyncHandler(logout));

export default router;
