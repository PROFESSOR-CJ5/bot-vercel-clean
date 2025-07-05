// index.js
require('dotenv').config();
const http = require('http');
const qs = require('querystring');
const fetch = require('node-fetch');

const HF_TOKEN = "Bearer " + process.env.HF_TOKEN;

const html = `
<!DOCTYPE html>
<html lang="sw">
<head>
  <meta charset="UTF-8" />
  <title>Professor Bot</title>
  <style>
    body {
      background: #0d1117;
      color: #c9d1d9;
      font-family: 'Segoe UI', sans-serif;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100vh;
    }
    h1 {
      color: #39ff14;
    }
    form {
      background: #161b22;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 0 10px #39ff14;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    input, button {
      padding: 10px;
      border: none;
      border-radius: 4px;
      font-size: 1em;
    }
    button {
      background: #39ff14;
      color: #000;
      cursor: pointer;
    }
    pre {
      background: #161b22;
      padding: 15px;
      border-radius: 8px;
      max-width: 600px;
      overflow-wrap: break-word;
    }
  </style>
</head>
<body>
  <h1>Professor Bot</h1>
  <form method="POST">
    <input type="text" name="name" placeholder="Jina lako" required />
    <input type="text" name="message" placeholder="Ujumbe kwa bot" required />
    <button type="submit">Tuma kwa Bot</button>
  </form>
</body>
</html>
`;

const server = http.createServer((req, res) => {
  if (req.method === 'POST') {
    let data = '';
    req.on('data', chunk => data += chunk);
    req.on('end', async () => {
      const parsed = qs.parse(data);
      const userMessage = parsed.message || "";

      // Call Hugging Face API
      try {
        const response = await fetch('https://api-inference.huggingface.co/models/gpt2', {
          method: 'POST',
          headers: {
            'Authorization': HF_TOKEN,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ inputs: userMessage })
        });

        const json = await response.json();
        const botReply = json[0]?.generated_text || "Samahani, bot haikuweza kutoa jibu.";

        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(`
          ${html}
          <h2 style="color:lime;">Asante ${parsed.name}, ujumbe wako umepokelewa.</h2>
          <h3>Jibu la bot:</h3>
          <pre>${botReply}</pre>
        `);
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'text/html' });
        res.end(`${html}<h2 style="color:red;">Hitilafu: ${err.message}</h2>`);
      }
    });
  } else {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(html);
  }
});

server.listen(process.env.PORT || 3000, () => {
  console.log(`Server inasikiliza kwenye port ${process.env.PORT || 3000}`);
});
