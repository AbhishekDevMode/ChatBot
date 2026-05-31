import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../zustand/useAuth";

const Login = () => {
  const [userInput, setUserInput] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const { authUser, setAuthUser } = useAuth();

  const handleInput = (e) => {
    setUserInput({ ...userInput, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(`/api/auth/login`, userInput);
      const data = response.data;
      if (data.success === false) {
        toast.error(data.message);
        setLoading(false);
        return;
      }

      toast.success(data.message || "Login successful");
      localStorage.setItem("chatapp", JSON.stringify(data));
      setAuthUser(data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast.error(error?.response?.data?.message || "Login failed");
    }
  };

  if (authUser) return <Navigate to="/" />;

  return (
    <div className="flex flex-col items-center justify-center mix-w-full mx-auto">
      <div className="w-full p-6 rounded-lg shadow-lg bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-0">
        <h1 className="text-3xl font-bold text-center text-gray-300">
          Login <span className="text-gray-950">Chatters</span>
        </h1>
        <form onSubmit={handleSubmit} className="flex flex-col text-black mt-4">
          <div>
            <label className="label p-2">
              <span className="font-bold text-gray-950 text-xl">Email:</span>
            </label>
            <input
              type="email"
              id="email"
              onChange={handleInput}
              placeholder="Enter your email"
              required
              className="w-full input-bordered h-10 px-3 py-2 rounded-md"
            />
          </div>
          <div className="mt-2">
            <label className="label p-2">
              <span className="font-bold text-gray-950 text-xl">Password:</span>
            </label>
            <input
              type="password"
              id="password"
              onChange={handleInput}
              placeholder="Enter your password"
              required
              className="w-full input-bordered h-10 px-3 py-2 rounded-md"
            />
          </div>
          <button
            type="submit"
            className="mt-6 self-center w-full px-2 py-2 bg-gray-950 text-white rounded-md text-lg hover:bg-gray-900 transition-colors"
            disabled={loading}
          >
            {loading ? "Loading..." : "Login"}
          </button>
        </form>
        <div className="pt-4 text-center">
          <p className="text-sm font-semibold text-gray-800">
            Don't have an account?{" "}
            <Link to="/signup" className="text-gray-950 font-bold underline cursor-pointer hover:text-white transition-colors">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
