import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { query } from '../services/dbService.js';
import { authorizeRoles } from '../middleware/roles.js';

const router = Router();

router.get(
  '/',
  authorizeRoles('admin', 'owner', 'tenant', 'employee'),
  asyncHandler(async (req, res) => {
    const sql = req.user.role === 'tenant'
      ? `SELECT a.* FROM rental_agreements a JOIN tenants t ON t.id = a.tenant_id WHERE t.user_id = ? ORDER BY a.start_date DESC`
      : 'SELECT * FROM rental_agreements ORDER BY start_date DESC';
    const data = req.user.role === 'tenant' ? await query(sql, [req.user.id]) : await query(sql);
    res.json(data);
  })
);

router.post(
  '/',
  authorizeRoles('admin', 'owner'),
  asyncHandler(async (req, res) => {
    const { tenant_id, room_id, start_date, end_date, rent_amount, security_deposit } = req.body;
    await query(
      `INSERT INTO rental_agreements
      (tenant_id, room_id, start_date, end_date, rent_amount, security_deposit, status)
      VALUES (?, ?, ?, ?, ?, ?, 'active')`,
      [tenant_id, room_id, start_date, end_date, rent_amount, security_deposit]
    );
    res.status(201).json({ message: 'Rental agreement created' });
  })
);

export default router;
