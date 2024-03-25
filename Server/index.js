require('dotenv').config();

const express = require('express');
const cors = require('cors');

const { MyToDoRouter } = require('./routes/todo.js');


const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/', MyToDoRouter);

// Server Startup
const port = process.env.PORT || 3000;

app.listen(port)