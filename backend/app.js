import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fetch from 'node-fetch'; // Use `node-fetch` v2 if using `require()`

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const apiKey = process.env.HUGGINGFACE_API_KEY;
const apiUrl = 'https://api-inference.huggingface.co/models/lichorosario/flux-cubist-cartoon'; // Update with correct model URL

app.post('/generate-image', async (req, res) => {
    const { text } = req.body;

    const headers = {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
    };

    const body = JSON.stringify({ inputs: text });

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: headers,
            body: body
        });

        if (response.ok) {
            const buffer = await response.buffer();
            res.set('Content-Type', 'image/png');
            res.send(buffer);
        } else {
            const errorText = await response.text();
            res.status(response.status).send(`Error generating image: ${errorText}`);
        }
    } catch (error) {
        res.status(500).send('Error generating image: ' + error.message);
    }
});

app.listen(5000, () => {
    console.log('Server running on http://localhost:5000');
});
