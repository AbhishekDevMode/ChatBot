import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../zustand/useAuth";

const Signup = () => {
  const [userInput, setUserInput] = useState({
    username: "",
    email: "",
    password: "",
    gender: "male",
  });
  const [loading, setLoading] = useState(false);
  const { authUser, setAuthUser } = useAuth();

  const handleInput = (e) => {
    setUserInput({ ...userInput, [e.target.id]: e.target.value });
  };

  const handleCheckboxChange = (gender) => {
    setUserInput({ ...userInput, gender });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post("/api/auth/register", userInput);
      const data = response.data;
      if (data.success === false) {
        toast.error(data.message);
        setLoading(false);
        return;
      }
      toast.success("Signup successful!");
      localStorage.setItem("chatapp", JSON.stringify(data));
      setAuthUser(data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast.error(error?.response?.data?.message || "Signup failed");
    }
  };

  if (authUser) return <Navigate to="/" />;

  return (
    <div className="flex flex-col items-center justify-center mix-w-full mx-auto">
      <div className="w-full p-6 rounded-lg shadow-lg bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-0">
        <h1 className="text-3xl font-bold text-center text-gray-300">
          Sign Up <span className="text-gray-950">Chatters</span>
        </h1>
        <form onSubmit={handleSubmit} className="flex flex-col text-black mt-4">
          <div>
            <label className="label p-2">
              <span className="font-bold text-gray-950 text-xl">Username:</span>
            </label>
            <input
              type="text"
              id="username"
              onChange={handleInput}
              placeholder="Enter username"
              required
              className="w-full input-bordered h-10 px-3 py-2 rounded-md"
            />
          </div>
          <div className="mt-2">
            <label className="label p-2">
              <span className="font-bold text-gray-950 text-xl">Email:</span>
            </label>
            <input
              type="email"
              id="email"
              onChange={handleInput}
              placeholder="Enter email"
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
              placeholder="Enter password"
              required
              className="w-full input-bordered h-10 px-3 py-2 rounded-md"
            />
          </div>

          <div className="flex mt-4 gap-4">
            <label className="label cursor-pointer gap-2">
              <span className="label-text font-bold text-gray-950">Male</span>
              <input
                type="radio"
                name="gender"
                className="radio border-gray-950"
                checked={userInput.gender === "male"}
                onChange={() => handleCheckboxChange("male")}
              />
            </label>
            <label className="label cursor-pointer gap-2">
              <span className="label-text font-bold text-gray-950">Female</span>
              <input
                type="radio"
                name="gender"
                className="radio border-gray-950"
                checked={userInput.gender === "female"}
                onChange={() => handleCheckboxChange("female")}
              />
            </label>
          </div>

          <button
            type="submit"
            className="mt-6 self-center w-full px-2 py-2 bg-gray-950 text-white rounded-md text-lg hover:bg-gray-900 transition-colors"
            disabled={loading}
          >
            {loading ? "Loading..." : "Sign Up"}
          </button>
        </form>
        <div className="pt-4 text-center">
          <p className="text-sm font-semibold text-gray-800">
            Already have an account?{" "}
            <Link to="/login" className="text-gray-950 font-bold underline cursor-pointer hover:text-white transition-colors">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
