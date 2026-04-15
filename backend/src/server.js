import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { testConnection } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import tenantRoutes from './routes/tenantRoutes.js';
import roomRoutes from './routes/roomRoutes.js';
import parkingRoutes from './routes/parkingRoutes.js';
import complaintRoutes from './routes/complaintRoutes.js';
import agreementRoutes from './routes/agreementRoutes.js';
import billingRoutes from './routes/billingRoutes.js';
import maintenanceRoutes from './routes/maintenanceRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import { authenticate } from './middleware/auth.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => res.json({ status: 'ok' }));
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', authenticate, dashboardRoutes);
app.use('/api/tenants', authenticate, tenantRoutes);
app.use('/api/rooms', authenticate, roomRoutes);
app.use('/api/parking', authenticate, parkingRoutes);
app.use('/api/complaints', authenticate, complaintRoutes);
app.use('/api/agreements', authenticate, agreementRoutes);
app.use('/api/billing', authenticate, billingRoutes);
app.use('/api/maintenance', authenticate, maintenanceRoutes);

app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(500).json({ message: 'Internal server error', error: error.message });
});

const bootstrap = async () => {
  try {
    await testConnection();
    app.listen(PORT, () => {
      console.log(`Backend running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Unable to connect to MySQL:', error.message);
    process.exit(1);
  }
};

bootstrap();
