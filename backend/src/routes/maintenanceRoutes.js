import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { query } from '../services/dbService.js';
import { authorizeRoles } from '../middleware/roles.js';

const router = Router();

router.get(
  '/',
  authorizeRoles('admin', 'owner', 'employee', 'tenant'),
  asyncHandler(async (_req, res) => {
    const requests = await query('SELECT * FROM maintenance_requests ORDER BY created_at DESC');
    res.json(requests);
  })
);

router.post(
  '/',
  authorizeRoles('tenant', 'employee', 'admin'),
  asyncHandler(async (req, res) => {
    const { room_id, issue_type, description, priority } = req.body;
    await query(
      'INSERT INTO maintenance_requests (requested_by_user_id, room_id, issue_type, description, priority, status) VALUES (?, ?, ?, ?, ?, ?)',
      [req.user.id, room_id, issue_type, description, priority ?? 'medium', 'open']
    );
    res.status(201).json({ message: 'Maintenance request submitted' });
  })
);

router.patch(
  '/:id/status',
  authorizeRoles('admin', 'owner', 'employee'),
  asyncHandler(async (req, res) => {
    const { status } = req.body;
    await query('UPDATE maintenance_requests SET status = ? WHERE id = ?', [status, req.params.id]);
    res.json({ message: 'Maintenance request updated' });
  })
);

export default router;
