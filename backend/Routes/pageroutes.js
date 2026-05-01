import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename=fileURLToPath(import.meta.url);
const __dirname=path.dirname(__filename);
const templatesRoot = path.join(__dirname, '../../frontend/templates');

const router = express.Router();

function sendTemplate(res, filename) {
    const filePath = path.join(templatesRoot, filename);
    res.sendFile(filePath, (err) => {
        if (err) {
            console.error(`Error loading template ${filename}:`, err);
            if (!res.headersSent) {
                res.status(err.statusCode || 500).send('Error loading page');
            }
        }
    });
}

router.get('/', (req, res) => {
    sendTemplate(res, 'index.html');
});

router.get('/naiyo24', (req, res) => {
    sendTemplate(res, 'naiyo24.html');
});

export default router;
