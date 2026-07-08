require('dotenv').config();
const express = require('express');
const multer = require('multer');
const cors = require('cors');
const Anthropic = require('@anthropic-ai/sdk');

const app = express();
const upload = multer();
const client = new Anthropic();

app.use(cors());

app.post('/analyze', upload.single('statement'), async (req, res) => {
  try {
    const fileContent = req.file.buffer.toString('utf-8');

    const message = await client.messages.create({
      model: 'claude-opus-4-5',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: `Here is a bank statement. Please summarize it:\n\n${fileContent}`
        }
      ]
    });

    res.json({ summary: message.content[0].text });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

app.listen(3001, () => console.log('Server running on port 3001'));