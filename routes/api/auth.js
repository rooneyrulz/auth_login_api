import express from 'express';

// Import Controllers
import { authenticateUser, getCurrentUser } from '../../controllers/auth';

// Import Auth Middleware
import isAuth from '../../middleware/auth';

const router = express.Router();

// @Description     > Authenticate User
// @Route           > /api/user/auth
// @Access-Control  > Public
router.post('', authenticateUser);

// @Description     > Fetching Authenticated User
// @Route           > /api/auth/user
// @Access-Control  > Private
router.get('/user', isAuth, getCurrentUser);

export default router;
