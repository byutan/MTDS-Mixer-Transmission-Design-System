import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pkg;
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT
})

async function connectDB() {
    try {
        const client = await pool.connect();
        console.log("Connected to database.");
        client.release()
    } catch (error) {
        console.log("Failed to connect to database: ", error.message);
        process.exit(1)
    }
}

function query(text, params) {
    return pool.query(text, params);
}

export {
    pool,
    connectDB,
    query
}