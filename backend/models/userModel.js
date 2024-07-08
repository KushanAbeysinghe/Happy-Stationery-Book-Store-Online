const db = require('../config/db');

const User = {
  create: async (username, email, password, isAdmin = false) => {
    const [result] = await db.execute(
      'INSERT INTO users (username, email, password, isAdmin) VALUES (?, ?, ?, ?)',
      [username, email, password, isAdmin]
    );
    return result.insertId;
  },
  findByEmail: async (email) => {
    const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0];
  },
  findById: async (id) => {
    const [rows] = await db.execute('SELECT * FROM users WHERE id = ?', [id]);
    return rows[0];
  }
};

module.exports = User;
