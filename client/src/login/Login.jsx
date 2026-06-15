import axios from "axios";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
const Login = () => {
  const navigate = useNavigate();
  const { setAuthUser } = useAuth();

  const [userInput, setUserInput] = useState({});
  const [loading, setLoading] = useState(false);

  const handelInput = (e) => {
    setUserInput({
      ...userInput,
      [e.target.id]: e.target.value
    });
  };
  // console.log(userInput);

  const handelSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const login = await axios.post(`/api/auth/login`, userInput);
      const data = login.data;
      if (data.success === false) {
        setLoading(false);
        console.log(data.message);
      }
      toast.success(data.message);
      localStorage.setItem("chatapp", JSON.stringify(data));
      setAuthUser(data);
      setLoading(false);
      navigate("/");
    } catch (error) {
      setLoading(false);
      console.log(error);
      toast.error(error?.response?.data?.message);
    }
  };
  return (
    <div className="flex flex-col items-center justify-center min-w-full mx-auto">
      <div className="w-full max-w-md p-8 rounded-2xl glass-panel">
        <h1 className="text-4xl font-bold text-center text-white mb-2">
          Login to <span className="text-sky-400">Chatters</span>
        </h1>
        <p className="text-sm text-center text-gray-300 mb-8">
          Welcome back! Please enter your details.
        </p>

        <form onSubmit={handelSubmit} className="flex flex-col gap-5">
          <div>
            <label className="label p-1 mb-1">
              <span className="font-medium text-gray-200 text-sm">Email</span>
            </label>
            <input
              id="email"
              type="email"
              onChange={handelInput}
              placeholder="Enter your email"
              required
              className="w-full px-4 py-3 rounded-lg glass-input text-sm"
            />
          </div>
          <div>
            <label className="label p-1 mb-1">
              <span className="font-medium text-gray-200 text-sm">
                Password
              </span>
            </label>
            <input
              id="password"
              type="password"
              onChange={handelInput}
              placeholder="Enter your password"
              required
              className="w-full px-4 py-3 rounded-lg glass-input text-sm"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="mt-4 w-full py-3 bg-sky-500 hover:bg-sky-400 text-white font-semibold rounded-lg transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="loading loading-spinner loading-sm"></span>
            ) : (
              "Login"
            )}
          </button>
        </form>

        <div className="pt-6 text-center">
          <p className="text-sm text-gray-300">
            Don't have an account?{" "}
            <Link to={"/register"}>
              <span className="text-sky-400 font-semibold hover:text-sky-300 hover:underline transition-colors">
                Register Now!
              </span>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
