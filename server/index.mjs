

import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.JSON_SERVER_PORT;

// Define the path to the data folder
const dataFolderPath = join(__dirname, 'data');

// Serve static files from the "data" folder
app.use('/data', express.static(dataFolderPath));

app.get('/', (req, res) => {
    res.send(`
        Static hosted json files:
        <br />
        <ul>
            <li><a href="/data/assessments.json">http://localhost:${PORT}/data/assessments.json</a></li>
            <li><a href="/data/questions.json">http://localhost:${PORT}/data/questions.json</a></li>
            <li><a href="/data/student-responses.json">http://localhost:${PORT}/data/student-responses.json</a></li>
            <li><a href="/data/students.json">http://localhost:${PORT}/data/students.json</a></li>
        </ul>
    `);
})

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});