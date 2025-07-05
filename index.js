import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

export default async function handler(req, res) {
  const HF_TOKEN = process.env.HF_TOKEN;

  const response = await fetch('https://api-inference.huggingface.co/models/facebook/bart-large-mnli', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${HF_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      inputs: "The quick brown fox jumps over the lazy dog",
      parameters: {
        candidate_labels: ["animal", "sports", "politics"]
      }
    })
  });

  const result = await response.json();
  res.status(200).json(result);
}
