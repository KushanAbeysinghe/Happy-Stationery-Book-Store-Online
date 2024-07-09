const db = require('../config/db');

const getBankDetails = async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM bank_details LIMIT 1');
    if (rows.length > 0) {
      res.json(rows[0]);
    } else {
      res.status(404).json({ message: 'Bank details not found' });
    }
  } catch (error) {
    console.error('Error fetching bank details:', error);
    res.status(500).json({ message: 'Error fetching bank details' });
  }
};

module.exports = { getBankDetails };
