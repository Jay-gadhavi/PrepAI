# PrepAI — AI-Powered Technical & HR Interview Preparation Platform

**PrepAI** is a full-stack, AI-assisted interview preparation platform. It parses candidate resumes, validates document structure, extracts technical skills & proficiency scores, generates customized interview questions, and provides an interactive mock interview experience.

---

## ✨ Features

- 📄 **Resume PDF Parser & Validator**: Instant text extraction with automated document validation (detects and rejects non-resume uploads).
- ⚡ **Dynamic AI Skill Gap Analysis**: Powered by Groq AI (Llama 3.3 70B) for real-time skill detection, proficiency scoring (0-100%), strengths, focus areas, and learning roadmaps.
- 🎯 **Targeted Question Generation**: Generates 5 technical and 3 HR interview questions customized to candidate's exact resume technology stack.
- 💬 **Interactive Mock Interview**: Real-time evaluation of candidate responses with AI scoring and STAR-method feedback.
- 🔒 **User Authentication**: Secure JWT-based authentication, user profile management, and session history tracking.

---

## 🛠️ Tech Stack

- **Frontend**: React (Vite), Tailwind CSS, Lucide Icons
- **Backend**: Node.js, Express.js, MongoDB (Mongoose)
- **AI Integration**: Groq AI (`llama-3.3-70b-versatile` / `llama3-8b-8192`) & Google Gemini AI fallback
- **Authentication**: JWT, bcryptjs
- **File Processing**: Multer, pdf-parse

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- MongoDB running locally (`mongodb://localhost:27017`) or a MongoDB Atlas URI
- Free Groq API Key from [console.groq.com/keys](https://console.groq.com/keys)

### 1. Clone the repository

```bash
git clone https://github.com/Jay-gadhavi/PrepAI.git
cd PrepAI
```

### 2. Set up Backend

```bash
cd server
npm install
```

Create a `.env` file inside `server/` (refer to `.env.example`):

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/prepai
JWT_SECRET=your_jwt_secret_here
GROQ_API_KEY=gsk_your_groq_api_key_here
```

Start the backend server:

```bash
npm run dev
```

### 3. Set up Frontend

In a new terminal window:

```bash
cd client
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) (or `http://localhost:5173`) in your browser.

---

## 📄 License

This project is licensed under the MIT License.
