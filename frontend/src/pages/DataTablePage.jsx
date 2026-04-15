import { useEffect, useState } from 'react';
import api from '../api';

export default function DataTablePage({ title, endpoint, columns }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get(endpoint);
        setRows(data);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [endpoint]);

  return (
    <section className="bg-white shadow rounded p-4">
      <h2 className="text-lg font-semibold mb-4">{title}</h2>
      {loading ? (
        <p className="text-slate-500">Loading...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b">
                {columns.map((col) => (
                  <th key={col.key} className="p-2">{col.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, idx) => (
                <tr key={row.id || idx} className="border-b hover:bg-slate-50">
                  {columns.map((col) => (
                    <td key={col.key} className="p-2">{row[col.key]?.toString?.() ?? '-'}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
