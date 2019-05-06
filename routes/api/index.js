import express from 'express';

// Import Controllers
import { testController } from '../../controllers';

const router = express.Router();

// @Description     > Testing Route
// @Route           > /api/test
// @Access-Control  > Public
router.get('', testController);

export default router;
