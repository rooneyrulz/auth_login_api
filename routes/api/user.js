import express from 'express';

// Import Controllers
import { getUsers, addUser, deleteUser } from '../../controllers/user';

const router = express.Router();

// @Description     > Fetching All Users
// @Route           > /api/users
// @Access-Control  > Public
router.get('', getUsers);

// @Description     > Adding User
// @Route           > /api/users/add
// @Access-Control  > Public
router.post('/add', addUser);

// @Description     > Deleting User
// @Route           > /api/users/:id
// @Access-Control  > Private
router.delete('/:id', deleteUser);

export default router;
