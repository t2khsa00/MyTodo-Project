const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database Connection
const openDb = () => {
    try {
        const pool = new Pool({
            user: 'postgres',
            host: 'localhost',
            database: 'MyToDo',
            password: 'khatri',
            port: 5432
        });
        return pool;
    } catch (error) {
        console.error('Error connecting to database:', error);
        throw new Error('Unable to connect to database');
    }
};

// Define root endpoint
app.get('/', (req, res) => {
    const pool = openDb();
    pool.query('SELECT * FROM task', (error, result) => {
        if (error) {
            console.error('Error executing query:', error);
            res.status(500).json({ error: 'Internal server error' });
        } else {
            res.status(200).json(result.rows);
        }
    });
});

// POST Endpoint ("/new")
app.post('/new', (req, res) => {
    const pool = openDb();
    pool.query('INSERT INTO task (description) VALUES ($1) returning *', [req.body.description], (error, result) => {
        if (error) {
            console.error('Error executing query:', error);
            res.status(500).json({ error: 'Internal server error' });
        } else {
            res.status(201).json({ id: result.rows[0].id });
        }
    });
});

// DELETE Endpoint ("/delete/:id")
app.delete('/delete/:id', (req, res) => {
    const pool = openDb();
    const id = parseInt(req.params.id);
    pool.query('DELETE FROM task WHERE id = $1', [id], (error, result) => {
        if (error) {
            console.error('Error executing query:', error);
            res.status(500).json({ error: 'Internal server error' });
        } else {
            if (result.rowCount === 0) {
                res.status(404).json({ error: 'Task not found' });
            } else {
                res.status(200).json({ message: 'Task deleted successfully' });
            }
        }
    });
});

// Error Handling for Invalid Endpoints
app.use((req, res) => {
    res.status(404).json({ error: 'Endpoint not found' });
});

// Start the server
const PORT = process.env.PORT || 3001; // Use port 3001 by default
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
