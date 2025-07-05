import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const HF_TOKEN = process.env.HF_TOKEN;

const headers = {
  'Authorization': `Bearer ${HF_TOKEN}`,
  'Content-Type': 'application/json'
};

const data = {
  inputs: "The quick brown fox jumps over the lazy dog",
  parameters: {
    candidate_labels: ["animal", "sports", "politics"]
  }
};

const url = 'https://api-inference.huggingface.co/models/facebook/bart-large-mnli';

fetch(url, {
  method: 'POST',
  headers: headers,
  body: JSON.stringify(data)
})
.then(res => res.json())
.then(json => {
  console.log("✅ Response from HuggingFace:");
  console.log(json);
})
.catch(err => {
  console.error("❌ Error:", err.message);
});
