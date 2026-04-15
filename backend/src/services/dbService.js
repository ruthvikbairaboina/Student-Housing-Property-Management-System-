import { pool } from '../config/db.js';

export const query = async (sql, params = []) => {
  const [rows] = await pool.execute(sql, params);
  return rows;
};
