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
      ? `SELECT b.* FROM billing b JOIN tenants t ON t.id = b.tenant_id WHERE t.user_id = ? ORDER BY b.due_date DESC`
      : 'SELECT * FROM billing ORDER BY due_date DESC';
    const rows = req.user.role === 'tenant' ? await query(sql, [req.user.id]) : await query(sql);
    res.json(rows);
  })
);

router.post(
  '/',
  authorizeRoles('admin', 'owner', 'employee'),
  asyncHandler(async (req, res) => {
    const { tenant_id, amount, due_date, billing_type } = req.body;
    await query(
      'INSERT INTO billing (tenant_id, amount, due_date, billing_type, payment_status) VALUES (?, ?, ?, ?, ?)',
      [tenant_id, amount, due_date, billing_type, 'pending']
    );
    res.status(201).json({ message: 'Bill created' });
  })
);

router.patch(
  '/:id/pay',
  authorizeRoles('tenant', 'admin', 'owner', 'employee'),
  asyncHandler(async (req, res) => {
    await query('UPDATE billing SET payment_status = ?, paid_on = CURRENT_DATE WHERE id = ?', ['paid', req.params.id]);
    res.json({ message: 'Payment marked as complete' });
  })
);

export default router;
