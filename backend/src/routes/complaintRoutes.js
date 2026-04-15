import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { query } from '../services/dbService.js';
import { authorizeRoles } from '../middleware/roles.js';

const router = Router();

router.get(
  '/',
  asyncHandler(async (_req, res) => {
    const complaints = await query(
      `SELECT c.id, c.title, c.status, c.priority, c.created_at, u.name AS raised_by
       FROM complaints c
       JOIN users u ON u.id = c.tenant_user_id
       ORDER BY c.created_at DESC`
    );
    res.json(complaints);
  })
);

router.post(
  '/',
  authorizeRoles('tenant'),
  asyncHandler(async (req, res) => {
    const { title, description, priority } = req.body;
    await query(
      'INSERT INTO complaints (tenant_user_id, title, description, priority, status) VALUES (?, ?, ?, ?, ?)',
      [req.user.id, title, description, priority ?? 'medium', 'open']
    );
    res.status(201).json({ message: 'Complaint submitted successfully' });
  })
);

router.patch(
  '/:id/status',
  authorizeRoles('admin', 'owner', 'employee'),
  asyncHandler(async (req, res) => {
    const { status } = req.body;
    await query('UPDATE complaints SET status = ? WHERE id = ?', [status, req.params.id]);
    res.json({ message: 'Complaint status updated' });
  })
);

export default router;
