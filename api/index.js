import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed, tumia POST' });
  }

  const { message } = req.body;
  const HF_TOKEN = process.env.HF_TOKEN;

  try {
    const response = await fetch('https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${HF_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ inputs: message })
    });

    const data = await response.json();
    console.log("RESPONSE FROM HF:", data);

    let reply = "Samahani, sijajibu ipasavyo.";

    if (Array.isArray(data) && data[0]?.generated_text) {
      reply = data[0].generated_text;
    } else if (data.generated_text) {
      reply = data.generated_text;
    }

    res.status(200).json({ bot: reply });

  } catch (err) {
    console.error("ERROR:", err.message);
    res.status(500).json({ error: "Tatizo la ndani la server" });
  }
}
