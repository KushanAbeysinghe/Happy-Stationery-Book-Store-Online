const db = require('../config/db');

const User = {
  create: async (username, email, phone, address, postalCode, province, district, area) => {
    const [result] = await db.execute(
      'INSERT INTO users (username, email, phone, address, postal_code, province, district, area) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [username, email, phone, address, postalCode, province, district, area]
    );
    return { id: result.insertId, username, email, phone, address, postalCode, province, district, area };
  },
  findByEmail: async (email) => {
    const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0];
  }
};

module.exports = User;
