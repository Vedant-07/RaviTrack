import express from 'express';
import {
  addLog,
  getLogsByAsset,
  updateLog,
  deleteLog
} from '../controllers/serviceLogController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

// Both admin and staff can access these routes (protect middleware allows both roles)
router.route('/')
  .post(protect, addLog);

router.route('/asset/:assetId')
  .get(protect, getLogsByAsset);

router.route('/:id')
  .put(protect, updateLog)
  .delete(protect, deleteLog);
//.deleteAll(...) for deleting all the logs of no longer valid asset, will build in the v2

export default router;
