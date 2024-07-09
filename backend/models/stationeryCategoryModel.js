const db = require('../config/db');

const StationeryCategory = {
  create: async (name) => {
    const [result] = await db.execute(
      'INSERT INTO stationery_categories (name) VALUES (?)',
      [name]
    );
    return result.insertId;
  },
  findAll: async () => {
    const [rows] = await db.execute('SELECT * FROM stationery_categories');
    return rows;
  }
};

module.exports = StationeryCategory;
