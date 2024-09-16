import express from "express";
import OpenAI from "openai";
import dotenv from "dotenv";

// gpt-4o-2024-08-06

dotenv.config();

const app = express();
const port = 3001;

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.use(express.json());

app.post("/chat", async (req, res) => {
  try {
    const { message, model, temperature, max_tokens } = req.body;
    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: message }],
      model: model,
      max_tokens: max_tokens,
      temperature: temperature,
    });

    res.json(completion.choices[0].message);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
