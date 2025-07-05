import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed, tumia POST' });
  }

  const HF_TOKEN = process.env.HF_TOKEN;

  if (!HF_TOKEN) {
    return res.status(500).json({ error: 'HF_TOKEN haipo kwenye .env' });
  }

  try {
    const response = await fetch(
      'https://api-inference.huggingface.co/models/tiiuae/falcon-7b-instruct',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${HF_TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ inputs: req.body.message })
      }
    );

    const data = await response.json();

    if (data.error) {
      return res.status(500).json({ error: 'HuggingFace error', details: data.error });
    }

    const reply = data[0]?.generated_text || "Samahani, sijajibu ipasavyo.";
    res.status(200).json({ bot: reply });
  } catch (err) {
    res.status(500).json({ error: 'Tatizo la ndani la server', details: err.message });
  }
}
