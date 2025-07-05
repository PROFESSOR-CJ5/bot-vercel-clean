const http = require("http");
const fetch = require("node-fetch");
require("dotenv").config();

const HF_TOKEN = "Bearer " + process.env.HF_TOKEN;

const html = `
<!DOCTYPE html>
<html lang="sw">
<head>
  <meta charset="UTF-8">
  <title>Professor Bot</title>
</head>
<body>
  <h1>Karibu kwa Professor Bot</h1>
  <form method="POST">
    <textarea name="prompt" rows="6" cols="50" placeholder="Andika ujumbe wako hapa..."></textarea><br>
    <button type="submit">Tuma</button>
  </form>
</body>
</html>
`;

const server = http.createServer(async (req, res) => {
  if (req.method === "POST") {
    let body = "";
    req.on("data", chunk => { body += chunk.toString(); });
    req.on("end", async () => {
      const params = new URLSearchParams(body);
      const prompt = params.get("prompt");

      try {
        const response = await fetch("https://api-inference.huggingface.co/models/gpt2", {
          method: "POST",
          headers: {
            "Authorization": HF_TOKEN,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ inputs: prompt })
        });

        const data = await response.json();
        const reply = data[0]?.generated_text || "Samahani, hakuna jibu.";

        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(`
          ${html}
          <h3>Majibu:</h3>
          <pre>${reply}</pre>
        `);
      } catch (err) {
        res.writeHead(500);
        res.end("Hitilafu: " + err.message);
      }
    });
  } else {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(html);
  }
});

server.listen(3000, () => {
  console.log("Server inasikiliza kwenye port 3000");
});
