// api/chat.js
import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed, tumia POST' });
  }

  const HF_TOKEN = process.env.HF_TOKEN;
  const userInput = req.body.message;

  const response = await fetch('https://api-inference.huggingface.co/models/gpt2', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${HF_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ inputs: userInput })
  });

  const result = await response.json();
  const botResponse = result?.[0]?.generated_text || "Samahani, sikuelewa.";

  res.status(200).json({ reply: botResponse });
}
