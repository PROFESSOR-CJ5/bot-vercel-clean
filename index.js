import express from 'express';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.post('/ask', async (req, res) => {
  const userInput = req.body.message;
  const HF_TOKEN = process.env.HF_TOKEN;

  const headers = {
    'Authorization': `Bearer ${HF_TOKEN}`,
    'Content-Type': 'application/json'
  };

  const data = {
    inputs: userInput,
    parameters: {
      candidate_labels: ["animal", "sports", "politics"]
    }
  };

  try {
    const response = await fetch("https://api-inference.huggingface.co/models/facebook/bart-large-mnli", {
      method: 'POST',
      headers,
      body: JSON.stringify(data)
    });
    const result = await response.json();
    res.send(`<h2>Umeuliza: ${userInput}</h2><pre>${JSON.stringify(result, null, 2)}</pre><a href="/">Rudi Nyuma</a>`);
  } catch (err) {
    res.send(`Error: ${err.message}`);
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
