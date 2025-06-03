# 👨‍💻 CodeCollab — Real-Time Collaborative Coding Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)
[![Author](https://img.shields.io/badge/Author-mayanpathak-blue)](https://github.com/mayanpathak)

**CodeCollab** is a **real-time collaborative code editor** designed for seamless peer coding, interviews, live sharing, and AI-assisted development. Built with a focus on speed, simplicity, and scalability, it offers an intuitive IDE-like experience directly in your browser.

> ⚡️ Collaborate, code, compile, and co-create — all in one place.

---

## 🌐 Live Demo

https://code-collab-mny8.vercel.app/

---

## 🚀 Key Features

### 🧑‍💻 Real-Time Collaborative Editor
- Built with **WebSockets** (Socket.IO or similar)
- Share a room and code together instantly
- Real-time cursor + change broadcasting

### 🧠 AI Code Assistant *(Planned)*
- AI support using OpenAI or Gemini API
- Suggest snippets, fix bugs, and generate functions
- Slash commands: `/explain`, `/debug`, `/generate`

### 🌐 Multi-Language Support
- JavaScript, Python, C++, and more
- Syntax highlighting and editor themes via **Monaco Editor**

### 🔐 Auth & Rooms
- Google Auth (Firebase) or Email-based login
- Private room access via unique room codes or URLs
- Optional access control (Owner, Editor, Viewer)

### 📄 File Sharing & Tabs *(Upcoming)*
- Multi-tab file system
- Upload and share files in sessions

### 🌐 Website Builder *(Beta)*
- Drag-and-drop AI-assisted Web App Generator
- Tailwind, Framer Motion, shadcn/ui for polished designs
- Export React/Next.js-based projects with clean code

---

## 🧱 Tech Stack

| Layer | Tech |
|-------|------|
| **Frontend** | React.js, Tailwind CSS, Zustand, Monaco Editor, Shadcn UI |
| **Backend** | Node.js, Express.js, Socket.IO |
| **Authentication** | Firebase Auth / Custom JWT Auth |
| **AI Integration** | OpenAI (GPT-4 or GPT-4-turbo) / Gemini Pro API |
| **Website Builder** | Tailwind, Framer Motion, AI code generation |
| **Database** | Firestore or MongoDB (planned for user data, session history) |

---

## 📁 Folder Structure

codecollab/
├── client/
│ ├── src/
│ │ ├── components/
│ │ ├── pages/
│ │ ├── hooks/
│ │ ├── utils/
│ │ └── App.jsx
│ ├── public/
│ └── tailwind.config.js
├── server/
│ ├── src/
│ │ ├── sockets/
│ │ ├── routes/
│ │ └── index.js
├── .env
├── package.json
└── README.md

yaml
Copy
Edit

---

## 🛠️ Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/mayanpathak/codecollab.git
cd codecollab
2. Install Dependencies
For Client
bash
Copy
Edit
cd client
npm install
For Server
bash
Copy
Edit
cd ../server
npm install
3. Configure Environment Variables
Create a .env file in both client/ and server/ directories.

Example:

env
Copy
Edit
# For Client
VITE_FIREBASE_API_KEY=your_api_key
VITE_OPENAI_API_KEY=your_openai_key

# For Server
PORT=5000
OPENAI_API_KEY=your_openai_key
4. Run the Project
In two terminals:

bash
Copy
Edit
# Terminal 1 - Server
cd server
npm run dev

# Terminal 2 - Client
cd client
npm run dev
✨ Planned Features
 Version control / session playback

 Voice chat & screen sharing

 Full-stack preview in browser (Node.js + MongoDB + React)

 Compiler integration (via Judge0 API)

 Role-based access controls in rooms

 Export to GitHub/Gist

 AI Prompt Templates

🧠 AI Capabilities (Upcoming)
Feature	Example Command
Explain code	/explain const foo = () => {...}
Debug code	/debug
Autogenerate code	/generate login page with Tailwind
Translate between languages	/convert python to js

📊 Use Cases
🧪 Technical Interviews

🏫 Peer Coding in Classrooms

🧠 AI-Enhanced Development

🧑‍🏫 Live Coding Workshops

🛠️ Building Web Apps with AI

🤝 Contributing
We welcome contributions!

Fork the repo: CodeCollab

Create your feature branch (git checkout -b feature/your-feature)

Commit your changes (git commit -m 'feat: add new feature')

Push to the branch (git push origin feature/your-feature)

Open a Pull Request

📄 License
This project is licensed under the MIT License.

🧑‍💻 Maintainer
Built by @mayanpathak
Passionate about building collaborative developer tools and AI-powered platforms.

🌟 If you like this project...
Give it a ⭐ on GitHub!
