import express from 'express';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware (optional)
app.use(express.json()); // For parsing application/json

// Define a simple route
app.get('/', (req, res) => {
    res.send('Hello, World!');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});