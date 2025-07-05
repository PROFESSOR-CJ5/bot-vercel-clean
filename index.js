import fetch from 'node-fetch';

export default async function handler(req, res) {
  const HF_TOKEN = process.env.HF_TOKEN;

  if (!HF_TOKEN) {
    return res.status(500).json({ error: "HF_TOKEN not set" });
  }

  const headers = {
    Authorization: `Bearer ${HF_TOKEN}`,
    'Content-Type': 'application/json'
  };

  const data = {
    inputs: "The quick brown fox jumps over the lazy dog"
  };

  try {
    const response = await fetch('https://api-inference.huggingface.co/models/gpt2', {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(data)
    });

    const json = await response.json();

    if (json.error) {
      return res.status(500).json({ error: json.error });
    }

    return res.status(200).json(json);

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
