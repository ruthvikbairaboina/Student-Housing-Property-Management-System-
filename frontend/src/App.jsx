import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import DashboardPage from './dashboard/DashboardPage';
import DataTablePage from './pages/DataTablePage';

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tenants"
          element={
            <ProtectedRoute>
              <DataTablePage
                title="Tenant Management"
                endpoint="/tenants"
                columns={[
                  { key: 'id', label: 'ID' },
                  { key: 'name', label: 'Name' },
                  { key: 'email', label: 'Email' },
                  { key: 'phone', label: 'Phone' },
                ]}
              />
            </ProtectedRoute>
          }
        />
        <Route
          path="/rooms"
          element={
            <ProtectedRoute>
              <DataTablePage
                title="Room Allocation"
                endpoint="/rooms"
                columns={[
                  { key: 'room_number', label: 'Room' },
                  { key: 'floor', label: 'Floor' },
                  { key: 'capacity', label: 'Capacity' },
                  { key: 'occupied', label: 'Occupied' },
                  { key: 'monthly_rent', label: 'Rent' },
                ]}
              />
            </ProtectedRoute>
          }
        />
        <Route
          path="/parking"
          element={
            <ProtectedRoute>
              <DataTablePage
                title="Parking Assignment"
                endpoint="/parking"
                columns={[
                  { key: 'spot_code', label: 'Spot' },
                  { key: 'zone', label: 'Zone' },
                  { key: 'status', label: 'Status' },
                  { key: 'assigned_to', label: 'Assigned To' },
                ]}
              />
            </ProtectedRoute>
          }
        />
        <Route
          path="/complaints"
          element={
            <ProtectedRoute>
              <DataTablePage
                title="Complaint Tracking"
                endpoint="/complaints"
                columns={[
                  { key: 'title', label: 'Title' },
                  { key: 'priority', label: 'Priority' },
                  { key: 'status', label: 'Status' },
                  { key: 'raised_by', label: 'Raised By' },
                ]}
              />
            </ProtectedRoute>
          }
        />
        <Route
          path="/billing"
          element={
            <ProtectedRoute>
              <DataTablePage
                title="Billing"
                endpoint="/billing"
                columns={[
                  { key: 'tenant_id', label: 'Tenant ID' },
                  { key: 'billing_type', label: 'Type' },
                  { key: 'amount', label: 'Amount' },
                  { key: 'payment_status', label: 'Payment Status' },
                ]}
              />
            </ProtectedRoute>
          }
        />
        <Route
          path="/maintenance"
          element={
            <ProtectedRoute>
              <DataTablePage
                title="Maintenance Requests"
                endpoint="/maintenance"
                columns={[
                  { key: 'issue_type', label: 'Issue' },
                  { key: 'priority', label: 'Priority' },
                  { key: 'status', label: 'Status' },
                  { key: 'room_id', label: 'Room' },
                ]}
              />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}
