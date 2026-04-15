import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/tenants', label: 'Tenants' },
  { to: '/rooms', label: 'Rooms' },
  { to: '/parking', label: 'Parking' },
  { to: '/complaints', label: 'Complaints' },
  { to: '/billing', label: 'Billing' },
  { to: '/maintenance', label: 'Maintenance' },
];

export default function Layout({ children }) {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="bg-slate-900 text-white px-6 py-4 flex justify-between items-center">
        <div>
          <h1 className="font-semibold">Student Housing PMS</h1>
          <p className="text-xs text-slate-300">Role: {user?.role ?? 'guest'}</p>
        </div>
        {user && (
          <button className="bg-red-500 px-3 py-1 rounded" onClick={logout}>
            Logout
          </button>
        )}
      </header>

      {user && (
        <nav className="bg-white border-b px-6 py-3 flex gap-4 text-sm overflow-x-auto">
          {navItems.map((item) => (
            <Link key={item.to} className="text-slate-600 hover:text-blue-600" to={item.to}>
              {item.label}
            </Link>
          ))}
        </nav>
      )}

      <main className="p-6">{children}</main>
    </div>
  );
}
