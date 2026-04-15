import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { query } from '../services/dbService.js';
import { authorizeRoles } from '../middleware/roles.js';

const router = Router();

router.get(
  '/',
  asyncHandler(async (_req, res) => {
    const rooms = await query(
      `SELECT r.id, r.room_number, r.floor, r.capacity, r.monthly_rent,
              COUNT(ra.id) AS occupied
       FROM rooms r
       LEFT JOIN room_allocations ra ON ra.room_id = r.id AND ra.status = 'active'
       GROUP BY r.id
       ORDER BY r.room_number`
    );
    res.json(rooms);
  })
);

router.post(
  '/allocate',
  authorizeRoles('admin', 'owner', 'employee'),
  asyncHandler(async (req, res) => {
    const { tenant_id, room_id, start_date } = req.body;
    await query(
      'INSERT INTO room_allocations (tenant_id, room_id, start_date, status) VALUES (?, ?, ?, ?)',
      [tenant_id, room_id, start_date, 'active']
    );
    res.status(201).json({ message: 'Room allocated successfully' });
  })
);

export default router;
