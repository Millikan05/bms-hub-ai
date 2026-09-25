import express from "express";
import cors from "cors";
import { GoogleGenAI } from "@google/genai";
import "dotenv/config";

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Gemini
const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

// Test route
app.get("/", (req, res) => {
    res.send("BMS Hub AI backend is running!");
});

// AI chat route
app.post("/api/chat", async (req, res) => {
    try {
        const { question } = req.body;

        if (!question || !question.trim()) {
            return res.status(400).json({
                error: "Question is required"
            });
        }

        const response = await ai.models.generateContent({
            model: "gemini-3.1-flash-lite",
            contents: `You are BMS (bachelor of medicine and surgery) AI. Please answer the questions at short-moderate length, put markdown symbols also give answers in bullet points, If a student asks about management of a disease your priority reference should be STG/NEMLIT (Tanzania): do not introduce yourself too much ${question}`
        });

        res.json({
            answer: response.text
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "AI request failed"
        });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`BMS Hub AI running on http://localhost:${PORT}`);
});