import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { query } from '../services/dbService.js';
import { authorizeRoles } from '../middleware/roles.js';

const router = Router();

router.get(
  '/',
  authorizeRoles('admin', 'owner', 'employee'),
  asyncHandler(async (_req, res) => {
    const tenants = await query(
      `SELECT t.id, u.name, u.email, t.phone, t.emergency_contact, t.lease_start, t.lease_end
       FROM tenants t
       JOIN users u ON u.id = t.user_id
       ORDER BY t.id DESC`
    );
    res.json(tenants);
  })
);

router.post(
  '/',
  authorizeRoles('admin', 'owner'),
  asyncHandler(async (req, res) => {
    const { user_id, phone, emergency_contact, lease_start, lease_end } = req.body;
    await query(
      'INSERT INTO tenants (user_id, phone, emergency_contact, lease_start, lease_end) VALUES (?, ?, ?, ?, ?)',
      [user_id, phone, emergency_contact, lease_start, lease_end]
    );
    res.status(201).json({ message: 'Tenant profile created' });
  })
);

export default router;
