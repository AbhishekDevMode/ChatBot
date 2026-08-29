import React from "react";
import ReactDOM from "react-dom/client";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { AuthContextProvider } from "./context/AuthContext.jsx";
import { SocketContextProvider } from "./context/SocketContext.jsx";
import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || (
  window.location.hostname === 'localhost' 
    ? 'http://localhost:4000' 
    : 'https://chatbot-server-fryy.onrender.com'
);

axios.defaults.baseURL = BACKEND_URL;
axios.defaults.withCredentials = true;

axios.interceptors.request.use((config) => {
  try {
    const user = JSON.parse(localStorage.getItem("chatapp"));
    if (user && user.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
  } catch (err) {
    console.error("Error reading token from localStorage", err);
  }
  return config;
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AuthContextProvider>
      <SocketContextProvider>
        <React.StrictMode>
          <App />
        </React.StrictMode>
      </SocketContextProvider>
    </AuthContextProvider>
  </BrowserRouter>
);
