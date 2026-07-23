# PrepAI — AI-Powered Technical & HR Interview Preparation Platform

**PrepAI** is a full-stack, AI-assisted interview preparation platform. It parses candidate resumes, extracts core skills and gaps, generates customized interview questions, and provides an interactive mock interview experience.

---

## ✨ Features

- 📄 **Resume PDF Parser**: Instant NLP extraction of text and skills from uploaded resumes.
- ⚡ **AI Skill Gap Analysis**: Identifies candidate strengths and areas for improvement.
- 🎯 **Targeted Question Generation**: Generates customized technical and HR interview questions based on candidate profile.
- 💬 **Interactive Mock Interview**: Practice answering real-time interview prompts.
- 🔒 **User Authentication**: Secure JWT-based authentication and user dashboard.

---

## 🛠️ Tech Stack

- **Frontend**: React (Vite), Tailwind CSS, Lucide Icons
- **Backend**: Node.js, Express.js, MongoDB (Mongoose)
- **AI Integration**: Google Gemini AI (`@google/generative-ai`)
- **Authentication**: JWT, bcryptjs
- **File Processing**: Multer, pdf-parse

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- MongoDB running locally (`mongodb://localhost:27017`) or a MongoDB Atlas URI

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_GITHUB_USERNAME/PrepAI.git
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

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📄 License

This project is licensed under the MIT License.
