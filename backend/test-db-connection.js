const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

(async () => {
  try {
    const connection = await mysql.createConnection({
      host: process.env.MYSQL_HOST,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE
    });
    console.log('Connection to MySQL successful');
    await connection.end();
  } catch (error) {
    console.error('Error connecting to MySQL:', error);
  }
})();
