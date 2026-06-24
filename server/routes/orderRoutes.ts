import { Router } from 'express';
import { checkout, getOrders } from '../controllers/orderController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Secure all endpoints under /api/orders
router.use(authenticateToken);

router.post('/checkout', checkout as any);
router.get('/', getOrders as any);

export default router;
