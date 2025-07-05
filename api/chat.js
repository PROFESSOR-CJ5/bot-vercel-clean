import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed, tumia POST' });
  }

  try {
    const { message } = req.body;
    const HF_TOKEN = process.env.HF_TOKEN;

    if (!HF_TOKEN) {
      return res.status(500).json({ error: "HF_TOKEN haijawekwa kwenye environment (.env)" });
    }

    const response = await fetch('https://api-inference.huggingface.co/models/tiiuae/falcon-7b-instruct', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${HF_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ inputs: message })
    });

    const data = await response.json();

    // Angalia kama kuna error kutoka kwa HuggingFace
    if (data.error) {
      return res.status(500).json({ error: 'Tatizo la kutoka HuggingFace', details: data.error });
    }

    const reply = data[0]?.generated_text || "Samahani, sijajibu ipasavyo.";
    res.status(200).json({ bot: reply });

  } } catch (err) {
    console.error("ERROR:", err);  // ongeza hii
    res.status(500).json({ error: 'Tatizo la ndani la server', details: err.message });
  }
