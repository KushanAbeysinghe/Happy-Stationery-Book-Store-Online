const db = require('../config/db');

const getProvinces = async (req, res) => {
  try {
    const [provinces] = await db.execute('SELECT * FROM provinces');
    res.json(provinces);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching provinces', error });
  }
};

const getDistricts = async (req, res) => {
  try {
    const [districts] = await db.execute('SELECT * FROM districts');
    res.json(districts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching districts', error });
  }
};

const getAreas = async (req, res) => {
  try {
    const [areas] = await db.execute('SELECT * FROM areas');
    res.json(areas);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching areas', error });
  }
};

module.exports = { getProvinces, getDistricts, getAreas };
