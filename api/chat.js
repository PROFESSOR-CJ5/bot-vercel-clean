import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: "Method not allowed, tumia POST" });
  }

  const HF_TOKEN = process.env.HF_TOKEN;
  const { message } = await req.body;

  const response = await fetch('https://api-inference.huggingface.co/models/facebook/bart-large-mnli', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${HF_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      inputs: message,
      parameters: {
        candidate_labels: ["animal", "sports", "politics"]
      }
    })
  });

  const result = await response.json();
  res.status(200).json(result);
}
