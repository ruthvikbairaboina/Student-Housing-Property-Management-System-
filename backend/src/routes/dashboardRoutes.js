import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { query } from '../services/dbService.js';

const router = Router();

router.get(
  '/summary',
  asyncHandler(async (_req, res) => {
    const [tenants] = await query('SELECT COUNT(*) as total FROM tenants');
    const [rooms] = await query('SELECT COUNT(*) as total FROM rooms');
    const [openComplaints] = await query("SELECT COUNT(*) as total FROM complaints WHERE status != 'resolved'");
    const [pendingBills] = await query("SELECT COUNT(*) as total FROM billing WHERE payment_status = 'pending'");

    res.json({
      tenants: tenants.total,
      rooms: rooms.total,
      openComplaints: openComplaints.total,
      pendingBills: pendingBills.total,
    });
  })
);

export default router;
