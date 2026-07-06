import express from "express";
import path from "path";
import fs from "fs";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

// Initialize Gemini API safely
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey && apiKey !== "MY_GEMINI_API_KEY") {
  try {
    ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
    console.log("Gemini API initialized successfully.");
  } catch (err) {
    console.error("Failed to initialize Gemini API:", err);
  }
} else {
  console.warn("GEMINI_API_KEY is not configured or has placeholder value. AI features will be unavailable.");
}

app.use(express.json());

// Helper functions for reading/writing data
const dbPath = path.join(process.cwd(), "src", "data.json");

function readDB() {
  try {
    if (fs.existsSync(dbPath)) {
      const data = fs.readFileSync(dbPath, "utf-8");
      return JSON.parse(data);
    }
  } catch (error) {
    console.error("Error reading database:", error);
  }
  // Fallback if file read fails
  return { tutorials: [], submissions: [] };
}

function writeDB(data: any) {
  try {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), "utf-8");
  } catch (error) {
    console.error("Error writing database:", error);
  }
}

// Ensure database file exists
if (!fs.existsSync(dbPath)) {
  const initialData = { tutorials: [], submissions: [] };
  writeDB(initialData);
}

// API Endpoints

// 1. Get all tutorials
app.get("/api/tutorials", (req, res) => {
  const db = readDB();
  res.json(db.tutorials || []);
});

// 2. Create standard custom tutorial manually
app.post("/api/tutorials", (req, res) => {
  const db = readDB();
  const newTutorial = req.body;
  
  if (!newTutorial.title || !newTutorial.chapters || newTutorial.chapters.length === 0) {
    return res.status(400).json({ error: "Missing required tutorial fields" });
  }

  newTutorial.id = `tut-${Date.now()}`;
  db.tutorials = db.tutorials || [];
  db.tutorials.push(newTutorial);
  writeDB(db);

  res.status(201).json(newTutorial);
});

// 3. AI Tutorial Generator (Gemini-Powered)
app.post("/api/tutorials/generate-ai", async (req, res) => {
  const { topic, difficulty } = req.body;

  if (!topic) {
    return res.status(400).json({ error: "Topic is required to generate a tutorial" });
  }

  if (!ai) {
    return res.status(503).json({ 
      error: "AI capabilities are not available because the Gemini API key is missing. Please add your GEMINI_API_KEY in the Secrets panel." 
    });
  }

  try {
    console.log(`Generating AI Tutorial for topic: "${topic}", difficulty: "${difficulty || "Intermediate"}"`);
    const prompt = `Create an exhaustive, high-quality coding tutorial with a hands-on coding playground challenge about the topic: "${topic}". 
The target skill level is "${difficulty || "Intermediate"}". 
Include 2 to 3 detailed chapters explaining key concepts with structured explanations.
Create an active starter code playground challenge under 'codeTemplate' along with comments showing how to complete it.
Provide the ideal working solution code in 'solutionCode'.
Provide 2 or 3 high-quality interactive multiple-choice quiz questions specifically testing the knowledge explained in your chapters.
Ensure all JSON parameters strictly match the requested schema.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are a master technical educator and developer advocate. You create clean, elegant, readable coding tutorials with interactive markdown instructions, starter exercises, and conceptual quizzes. Maintain a welcoming, structured tone.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: "Descriptive title of the tutorial" },
            description: { type: Type.STRING, description: "1-2 sentence description explaining what the user will master" },
            category: { type: Type.STRING, description: "Programming language or technology category (e.g. JavaScript, Python, React, Go, SQL)" },
            difficulty: { type: Type.STRING, description: "Target level", enum: ["Beginner", "Intermediate", "Advanced"] },
            duration: { type: Type.STRING, description: "Estimated completion time, e.g. '15 mins'" },
            chapters: {
              type: Type.ARRAY,
              description: "The core training content",
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING, description: "Unique chapter id like 'ch1', 'ch2'" },
                  title: { type: Type.STRING, description: "Clear chapter name" },
                  content: { type: Type.STRING, description: "Deep conceptual explanation formatted with standard Markdown, lists, bullet points, and code boxes." }
                },
                required: ["id", "title", "content"]
              }
            },
            codeTemplate: { type: Type.STRING, description: "Starter code template containing function declaration, setup, and clear TODO comments. This must be ready to run/complete by the student." },
            solutionCode: { type: Type.STRING, description: "The correct solution code resolving the TODO comments cleanly." },
            runInstructions: { type: Type.STRING, description: "1 sentence instruction on how the code will execute or behave." },
            quiz: {
              type: Type.ARRAY,
              description: "2 or 3 concept-check questions",
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING, description: "ID like 'q1', 'q2'" },
                  question: { type: Type.STRING, description: "The quiz question text" },
                  options: { type: Type.ARRAY, description: "Exactly 4 options", items: { type: Type.STRING } },
                  correctAnswer: { type: Type.INTEGER, description: "0-indexed index of correct option" },
                  explanation: { type: Type.STRING, description: "Detailed explanation of the correct option" }
                },
                required: ["id", "question", "options", "correctAnswer", "explanation"]
              }
            }
          },
          required: ["title", "description", "category", "difficulty", "duration", "chapters", "codeTemplate", "solutionCode", "runInstructions", "quiz"]
        }
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("Empty response from Gemini API");
    }

    const tutorialData = JSON.parse(text);
    tutorialData.id = `ai-tut-${Date.now()}`;
    tutorialData.isAICreated = true;

    // Save newly generated AI tutorial into DB
    const db = readDB();
    db.tutorials = db.tutorials || [];
    db.tutorials.push(tutorialData);
    writeDB(db);

    res.status(201).json(tutorialData);
  } catch (error: any) {
    console.error("AI Generation Error:", error);
    res.status(500).json({ error: error.message || "Failed to generate tutorial using AI" });
  }
});

// 4. Get all playground submissions for peer review
app.get("/api/submissions", (req, res) => {
  const db = readDB();
  res.json(db.submissions || []);
});

// 5. Submit code for a tutorial
app.post("/api/submissions", (req, res) => {
  const db = readDB();
  const { tutorialId, tutorialTitle, userName, submittedCode, userNotes } = req.body;

  if (!tutorialId || !userName || !submittedCode) {
    return res.status(400).json({ error: "Missing required fields for code submission" });
  }

  const newSubmission = {
    id: `sub-${Date.now()}`,
    tutorialId,
    tutorialTitle,
    userName,
    submittedCode,
    userNotes: userNotes || "",
    createdAt: new Date().toISOString(),
    reviews: []
  };

  db.submissions = db.submissions || [];
  db.submissions.unshift(newSubmission); // Show newer submissions first
  writeDB(db);

  res.status(201).json(newSubmission);
});

// 6. Add manual peer review to a submission
app.post("/api/submissions/:id/reviews", (req, res) => {
  const { id } = req.params;
  const { reviewerName, ratingCorrectness, ratingReadability, ratingArchitecture, comments } = req.body;

  if (!reviewerName || !comments) {
    return res.status(400).json({ error: "Reviewer name and comments are required" });
  }

  const db = readDB();
  const submissionIndex = db.submissions.findIndex((s: any) => s.id === id);

  if (submissionIndex === -1) {
    return res.status(404).json({ error: "Submission not found" });
  }

  const newReview = {
    id: `rev-${Date.now()}`,
    reviewerName,
    ratingCorrectness: Number(ratingCorrectness) || 5,
    ratingReadability: Number(ratingReadability) || 5,
    ratingArchitecture: Number(ratingArchitecture) || 5,
    comments,
    createdAt: new Date().toISOString(),
    isAI: false
  };

  db.submissions[submissionIndex].reviews = db.submissions[submissionIndex].reviews || [];
  db.submissions[submissionIndex].reviews.push(newReview);
  writeDB(db);

  res.status(201).json(newReview);
});

// 7. Request AI Peer Review (Gemini-Powered Code Reviewer)
app.post("/api/submissions/:id/reviews/ai", async (req, res) => {
  const { id } = req.params;

  if (!ai) {
    return res.status(503).json({ 
      error: "AI review capabilities are unavailable because the Gemini API key is missing. Please add your GEMINI_API_KEY in the Secrets panel." 
    });
  }

  const db = readDB();
  const submission = db.submissions.find((s: any) => s.id === id);

  if (!submission) {
    return res.status(404).json({ error: "Submission not found" });
  }

  // Find the original tutorial to provide full context to Gemini
  const tutorial = db.tutorials.find((t: any) => t.id === submission.tutorialId);
  const codeTemplate = tutorial ? tutorial.codeTemplate : "N/A";
  const solutionCode = tutorial ? tutorial.solutionCode : "N/A";

  try {
    console.log(`Generating AI Review for submission by: "${submission.userName}" on tutorial: "${submission.tutorialTitle}"`);
    const prompt = `Conduct an exhaustive, constructive, and highly professional code review of the student's submission.

### Tutorial context:
- Title: "${submission.tutorialTitle}"
- Original Starter Template:
\`\`\`
${codeTemplate}
\`\`\`
- Expected Target Solution:
\`\`\`
${solutionCode}
\`\`\`

### Student Submission details:
- Submitted Code:
\`\`\`
${submission.submittedCode}
\`\`\`
- Student Notes / Thoughts:
"${submission.userNotes || "None provided."}"

Evaluate the student's code on:
1. Correctness: Does it solve the challenge properly? Are there any logical edge cases, syntax errors, or infinite loops?
2. Readability: Is the code properly indented? Are naming conventions clear? Are there redundant lines?
3. Architecture: Is the approach idiomatic and efficient? Are they using modern patterns (e.g. state functions correctly, robust async try/catch)?

Deliver a detailed review comments block using Markdown formatting. Detail what they got right, break down suggestions clearly, and optionally provide a clean/refactored or optimized version. Finally, score each criteria from 1 to 5.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are an elite Staff Software Engineer and friendly Technical Mentor. You provide deep, constructive, and encouraging code feedback in standard Markdown format. Your advice is precise and focuses on coding best practices.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            ratingCorrectness: { type: Type.INTEGER, description: "Correctness score from 1 to 5" },
            ratingReadability: { type: Type.INTEGER, description: "Readability score from 1 to 5" },
            ratingArchitecture: { type: Type.INTEGER, description: "Architecture/Efficiency score from 1 to 5" },
            comments: { type: Type.STRING, description: "Extremely rich code review analysis formatted in clean Markdown, calling out details, showing code snippet comparison, and ending with encouragement." }
          },
          required: ["ratingCorrectness", "ratingReadability", "ratingArchitecture", "comments"]
        }
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("Empty review response from Gemini API");
    }

    const reviewData = JSON.parse(text);
    
    const newAIReview = {
      id: `rev-ai-${Date.now()}`,
      reviewerName: "AI Code Mentor",
      ratingCorrectness: reviewData.ratingCorrectness,
      ratingReadability: reviewData.ratingReadability,
      ratingArchitecture: reviewData.ratingArchitecture,
      comments: reviewData.comments,
      createdAt: new Date().toISOString(),
      isAI: true
    };

    // Save AI review into the submission's reviews list
    const submissionIndex = db.submissions.findIndex((s: any) => s.id === id);
    db.submissions[submissionIndex].reviews = db.submissions[submissionIndex].reviews || [];
    db.submissions[submissionIndex].reviews.push(newAIReview);
    writeDB(db);

    res.status(201).json(newAIReview);
  } catch (error: any) {
    console.error("AI Review Generation Error:", error);
    res.status(500).json({ error: error.message || "Failed to generate AI Code Review" });
  }
});


// Serve Vite or static files

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    // Development mode
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production mode
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
