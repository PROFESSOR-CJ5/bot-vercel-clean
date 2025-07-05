import fetch from 'node-fetch';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: "Method not allowed, tumia POST" });
  }

  // Kusoma data kutoka kwa form (x-www-form-urlencoded)
  const buffers = [];
  for await (const chunk of req) buffers.push(chunk);
  const data = Buffer.concat(buffers).toString();
  const params = new URLSearchParams(data);
  const userInput = params.get("text");

  const HF_TOKEN = process.env.HF_TOKEN;

  const response = await fetch('https://api-inference.huggingface.co/models/facebook/bart-large-mnli', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${HF_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      inputs: userInput,
      parameters: {
        candidate_labels: ["animal", "sports", "politics"]
      }
    })
  });

  const result = await response.json();

  res.status(200).send(`
    <h2>Majibu kutoka HuggingFace</h2>
    <pre>${JSON.stringify(result, null, 2)}</pre>
    <a href="/">Rudi Nyumbani</a>
  `);
}
