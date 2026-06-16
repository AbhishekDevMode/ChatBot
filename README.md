# 💬 Real-Time ChatBot

A full-stack, responsive chatbot application built using the **MERN Stack** (MongoDB, Express.js, React.js, Node.js). This application features a sleek user interface, secure user authentication, and persistent chat sessions.

🔗[Live Demo](https://chatbot-xqyt.onrender.com)

🚀 Features

Secure Authentication: User login and signup protected by JSON Web Tokens (JWT) and HTTP-only cookies.
Persistent Chat History: Seamlessly preserves conversation threads across sessions using structured database models.
Asynchronous Streaming UX: Dynamic, real-time message state updates with smooth frontend UI transitions.
Responsive UI: Fully optimized design that looks great on mobile, tablet, and desktop viewports.
RESTful Architecture: Clean separation of concerns with structured API routes for users and messages.


🛠️ Tech Stack

Frontend: React.js, Tailwind CSS (or Bootstrap/CSS depending on your setup), Vite
Backend: Node.js, Express.js
Database: MongoDB, Mongoose ORM
Authentication: JWT (JSON Web Tokens), bcryptjs, zustand
Deployment: Render (Backend/Full-Stack)

---

📦 Project Structure

```text
├── server/
│   ├── DB/         # Database configurations
│   ├── models/         # Mongoose Schemas (User, Message)
│   ├── controllers/    # Request handlers (auth, messages)
│   ├── middlewares/    # middlewares
│   ├── routes/         # Express API endpoints
│   └── socket          # Entry point
│   └── uploads         # profile images
│   └── server.js       # Entry point
└── client/
    ├── public/         # images
    ├── src/
    │   ├── assets/     # images
    │   ├── context/    # Global State / Auth State
    │   ├── home/      #components
             |--components/     #Reusable UI componnets
    │   ├── login/      # Login,SignUp,Navbar
    │   ├── profile/    # Users Profiles
    │   ├── register/   # Registration page 
    │   ├── utils/      # Verify
    │   ├── zustand/    # manage states
    │   └── main.jsx    # Client entry point

```
```
 Installation and Setup
To run this project locally, follow these steps:

1. Clone the repository
Bash
git clone [https://github.com/AbhishekDevMode/ChatBot.git](https://github.com/AbhishekDevMode/ChatBot.git)
cd ChatBot
2. Backend Setup
Navigate to your server directory (or root if a combined repository) and install dependencies:

Bash
cd backend
npm install
Create a .env file in the backend folder and configure the following variables:

Code snippet
PORT=5000
MONGO_URI=mongoose url
JWT_SECRET=secret key
NODE_ENV=development

Start the backend server:
Bash
npm start
3. Frontend Setup
Navigate to the client directory and install dependencies:

Bash
cd ../frontend
npm install
Start the development server:

Bash
npm run dev
```
