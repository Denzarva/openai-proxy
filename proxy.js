const express = require('express');
const fetch = require('node-fetch');
const app = express();
app.use(express.json());

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

app.all('*', async (req, res) => {
  const url = `https://api.openai.com${req.originalUrl}`;
  const headers = {
    'Authorization': `Bearer ${OPENAI_API_KEY}`,
    'Content-Type': 'application/json',
    ...req.headers
  };

  try {
    const response = await fetch(url, {
      method: req.method,
      headers,
      body: ['GET', 'HEAD'].includes(req.method) ? undefined : JSON.stringify(req.body)
    });
    const text = await response.text();
    res.status(response.status).send(text);
  } catch (err) {
    console.error('❌ Ошибка при запросе к OpenAI:', err);
    res.status(500).send({ error: err.message });
  }
});

app.listen(process.env.PORT || 8787, () => {
  console.log('✅ Прокси запущен');
});
