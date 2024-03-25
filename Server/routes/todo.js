const express = require('express');
const { query } = require('../helpers/db.js');

const MyToDoRouter = express.Router();

// Define root endpoint
MyToDoRouter.get('/', async (req, res) => {
    try {
        const result = await query('SELECT * FROM task');
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error executing query:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// POST Endpoint ("/new")
MyToDoRouter.post('/new', async (req, res) => {
    try {
        const result = await query('INSERT INTO task (description) VALUES ($1) returning *', [req.body.description]);
        res.status(201).json({ id: result.rows[0].id });
    } catch (error) {
        console.error('Error executing query:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// DELETE Endpoint ("/delete/:id")
MyToDoRouter.delete('/delete/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const result = await query('DELETE FROM task WHERE id = $1', [id]);
        if (result.rowCount === 0) {
            res.status(404).json({ error: 'Task not found' });
        } else {
            res.status(200).json({ message: 'Task deleted successfully' });
        }
    } catch (error) {
        console.error('Error executing query:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Error handling for Invalid Endpoints
MyToDoRouter.use((req, res) => {
    res.status(404).json({ error: 'Endpoint not found' });
});

module.exports = { MyToDoRouter }; // Updated export statement
