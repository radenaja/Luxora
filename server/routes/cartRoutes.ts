import { Router } from 'express';
import { getCart, addToCart, updateCartItem, removeFromCart, clearCart } from '../controllers/cartController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Secure all endpoints under /api/cart
router.use(authenticateToken);

router.get('/', getCart as any);
router.post('/', addToCart as any);
router.put('/:productId', updateCartItem as any);
router.delete('/:productId', removeFromCart as any);
router.delete('/', clearCart as any);

export default router;
