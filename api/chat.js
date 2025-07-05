import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed, tumia POST' });
  }

  const HF_TOKEN = process.env.HF_TOKEN;
  const message = req.body.message;

  if (!HF_TOKEN) {
    return res.status(500).json({ error: "HF_TOKEN haijasanidiwa." });
  }

  if (!message) {
    return res.status(400).json({ error: "Tuma ujumbe (message) kwenye body." });
  }

  try {
    const response = await fetch('https://api-inference.huggingface.co/models/HuggingFaceH4/zephyr-7b-alpha', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${HF_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        inputs: `<|system|>You are a helpful assistant.<|user|>${message}<|assistant|>`,
        parameters: {
          max_new_tokens: 200,
          temperature: 0.7,
          return_full_text: false
        }
      })
    });

    const data = await response.json();

    if (data.error) {
      return res.status(500).json({ error: data.error });
    }

    const reply = data[0]?.generated_text || "Samahani, siwezi kujibu sasa hivi.";

    res.status(200).json({ reply });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
