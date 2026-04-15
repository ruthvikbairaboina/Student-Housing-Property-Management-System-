import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { query } from '../services/dbService.js';
import { authorizeRoles } from '../middleware/roles.js';

const router = Router();

router.get(
  '/',
  asyncHandler(async (_req, res) => {
    const spots = await query(
      `SELECT p.id, p.spot_code, p.zone, p.status, u.name AS assigned_to
       FROM parking_spots p
       LEFT JOIN users u ON u.id = p.assigned_user_id
       ORDER BY p.spot_code`
    );
    res.json(spots);
  })
);

router.post(
  '/assign',
  authorizeRoles('admin', 'owner', 'employee'),
  asyncHandler(async (req, res) => {
    const { spot_id, assigned_user_id } = req.body;
    await query('UPDATE parking_spots SET assigned_user_id = ?, status = ? WHERE id = ?', [
      assigned_user_id,
      'occupied',
      spot_id,
    ]);
    res.json({ message: 'Parking assigned successfully' });
  })
);

export default router;
