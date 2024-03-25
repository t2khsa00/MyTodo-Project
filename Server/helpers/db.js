require('dotenv').config();
const { Pool } = require('pg');

const query = (sql, values = []) => {
    return new Promise(async (resolve, reject) => {
        try {
            const pool = openDb();
            const result = await pool.query(sql, values);
            resolve(result);
        } catch (error) {
            reject(error.message);
        }
    });
};

const openDb = () => {
    try {
        const pool = new Pool({
            user: process.env.DB_USER,
            host: process.env.DB_HOST,
            database: process.env.DB_NAME,
            password: process.env.DB_PASSWORD,
            port: process.env.DB_PORT
        });
        return pool;
    } catch (error) {
        console.error('Error connecting to database:', error);
        throw new Error('Unable to connect to database');
    }
};

module.exports = { query }; // Updated export statement
