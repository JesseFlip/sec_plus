const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { STUDY_DATA, PORTS, ACRONYM_FLASH } = require('./data/studyData');

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// System prompt for SecBot
const SYSTEM_PROMPT = `
You are SecBot, a highly knowledgeable and encouraging CompTIA Security+ (SY0-701) AI Tutor and Accountability Coach.
Your goal is to help the user pass their exam and stay on track with their 3-day study sprint.

CONTEXT:
- Exam: CompTIA Security+ SY0-701
- Study Plan: A 3-day intensive sprint.
- Current Study Data: ${JSON.stringify(STUDY_DATA.exam.domains)}
- Day 1: Foundations & Threats (Domains 1 & 2)
- Day 2: Architecture & Operations (Domains 3 & 4)
- Day 3: Governance & Final Push (Domain 5 + Practice)

GUIDELINES:
1. TECHNICAL EXPERT: Answer any technical questions about Security+ concepts (e.g., "What is the difference between SQLi and XSS?"). Be precise and use exam-relevant terminology.
2. ACCOUNTABILITY COACH: If the user seems lost or discouraged, provide motivation. Ask them which study block they are currently working on.
3. STUDY TIPS: Share practical exam tips (e.g., "Skip PBQs on the first pass").
4. CONCISE & PROFESSIONAL: Keep responses helpful but not overly wordy. Use Markdown for formatting.
5. NO SPOILERS: If they ask about a specific practice question, explain the concept rather than just giving the answer.

If you don't have an API key, inform the user they need to set GEMINI_API_KEY in their .env file.
`;

app.get('/api/study-data', (req, res) => {
  res.json({ STUDY_DATA, PORTS, ACRONYM_FLASH });
});

app.post('/api/chat', async (req, res) => {
  const { message, history, progress } = req.body;

  // Fallback to Mock Mode if no API key or invalid
  const useMock = !process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === "your_api_key_here";

  if (useMock) {
    console.log("Using Mock Mode for Chatbot");
    let mockResponse = "I am currently in demo mode. Please set a valid GEMINI_API_KEY in server/.env to enable my full AI powers!";
    
    const lowerMessage = message.toLowerCase();
    if (lowerMessage.includes("hello") || lowerMessage.includes("hi")) {
      mockResponse = "Hello! I'm SecBot. I'm here to help you with your Security+ prep. You've completed " + (progress?.completed || 0) + " topics so far. Keep it up!";
    } else if (lowerMessage.includes("cia")) {
      mockResponse = "The CIA Triad stands for Confidentiality, Integrity, and Availability. It's the core of security! Confidentiality ensures only authorized users see data, Integrity ensures it hasn't been tampered with, and Availability ensures it's accessible when needed.";
    } else if (lowerMessage.includes("tip")) {
      mockResponse = "Exam Tip: Skip the Performance-Based Questions (PBQs) at the beginning. They can be time-consuming. Do the multiple-choice first to build confidence, then circle back!";
    }

    return res.json({ text: mockResponse });
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    // Convert history to Gemini format
    const chat = model.startChat({
      history: [
        { role: "user", parts: [{ text: SYSTEM_PROMPT }] },
        { role: "model", parts: [{ text: "Understood. I am SecBot, ready to assist with Security+ preparation and accountability." }] },
        ...(history || []).map(msg => ({
          role: msg.role === 'user' ? 'user' : 'model',
          parts: [{ text: msg.text }]
        }))
      ],
    });

    const result = await chat.sendMessage(message);
    const response = await result.response;
    const text = response.text();

    res.json({ text });
  } catch (error) {
    console.error("Chat Error:", error);
    // Even if it fails, try to give a helpful message
    res.status(500).json({ error: "Failed to communicate with AI. Is your API key valid?" });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
