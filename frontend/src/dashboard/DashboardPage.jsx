import { useEffect, useState } from 'react';
import api from '../api';
import { useAuth } from '../context/AuthContext';

const roleHighlights = {
  admin: ['Manage all entities', 'Approve and monitor operations', 'View system-wide analytics'],
  owner: ['Track occupancy and revenue', 'Review complaints and maintenance', 'Control agreements and billing'],
  tenant: ['Pay rent bills', 'Raise complaints', 'Submit maintenance requests'],
  employee: ['Process maintenance tasks', 'Assign parking and room changes', 'Update complaint statuses'],
};

export default function DashboardPage() {
  const [summary, setSummary] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    api.get('/dashboard/summary').then((res) => setSummary(res.data));
  }, []);

  return (
    <div className="space-y-4">
      <section className="bg-white p-4 rounded shadow">
        <h2 className="text-xl font-semibold">{user?.role?.toUpperCase()} Dashboard</h2>
        <ul className="mt-2 list-disc list-inside text-slate-600">
          {(roleHighlights[user?.role] || []).map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { key: 'tenants', label: 'Tenants' },
          { key: 'rooms', label: 'Rooms' },
          { key: 'openComplaints', label: 'Open Complaints' },
          { key: 'pendingBills', label: 'Pending Bills' },
        ].map((metric) => (
          <article key={metric.key} className="bg-white rounded shadow p-4">
            <p className="text-sm text-slate-500">{metric.label}</p>
            <p className="text-2xl font-semibold">{summary?.[metric.key] ?? '--'}</p>
          </article>
        ))}
      </section>
    </div>
  );
}
