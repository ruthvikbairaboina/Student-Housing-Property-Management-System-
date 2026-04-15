import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { asyncHandler } from '../utils/asyncHandler.js';
import { query } from '../services/dbService.js';

const router = Router();

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

router.post(
  '/register',
  asyncHandler(async (req, res) => {
    const { name, email, password, role } = req.body;
    const hash = await bcrypt.hash(password, 10);
    await query('INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)', [
      name,
      email,
      hash,
      role,
    ]);
    res.status(201).json({ message: 'User created' });
  })
);

router.post(
  '/login',
  asyncHandler(async (req, res) => {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: 'Invalid login payload', issues: parsed.error.flatten() });
    }

    const [user] = await query('SELECT id, name, email, password_hash, role FROM users WHERE email = ?', [
      parsed.data.email,
    ]);

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const ok = await bcrypt.compare(parsed.data.password, user.password_hash);
    if (!ok) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id, role: user.role, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: '8h',
    });

    res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  })
);

export default router;
