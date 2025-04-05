const express = require('express');
const fetch = require('node-fetch');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Authorization, Content-Type');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Проверка корня
app.get('/', (req, res) => {
  res.send('🟢 OpenAI Proxy работает!');
});

// Прокси для всех /v1/* запросов
app.all('/v1/*', async (req, res) => {
  const openaiPath = req.originalUrl;
  const openaiUrl = `https://api.openai.com${openaiPath}`;
  const token = req.headers['authorization'];

  try {
    const openaiRes = await fetch(openaiUrl, {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token,
      },
      body: ['GET', 'HEAD'].includes(req.method) ? null : JSON.stringify(req.body),
    });

    const data = await openaiRes.json();
    res.status(openaiRes.status).json(data);
  } catch (err) {
    console.error('[Proxy Error]', err);
    res.status(500).json({ error: 'Proxy error', detail: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Proxy listening on port ${PORT}`);
});
