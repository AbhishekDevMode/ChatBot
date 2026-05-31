import { Link } from "react-router-dom";
const Navbar = () => {
  return (
    <div className="flex flex-col items-center justify-center mix-w-full mx-auto">
      <div className="w-full p-6 rounded-lg- shadow-lg bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-0 ">
        <h1 className="text-3xl font-bold text-center text-gray-300">
          Login <span className="text-gray-950">Chatters</span>{" "}
        </h1>
        <form action="" className="flex flex-col">
          <div>
            <label htmlFor="" className=" label p-2">
              <span className="font-bold text-gray-950 text-xl label-text">
                Email:
              </span>
            </label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              required
              className="w-full input-bordered h-10"
            />
            <label htmlFor="" className=" label p-2">
              <span className="font-bold text-gray-950 text-xl label-text">
                Password:
              </span>
            </label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              required
              className="w-full input-bordered h-10"
            />
          </div>
          <div></div>
          <button
            type="submit"
            className="mt-4 self-center w-auto px-2 py-1 bg-gray-950 text-lg hover:bg-gray-900 text-2xl"
          >
            Login
          </button>
        </form>
        <div className="pt-2">
          <p className="text-sm font-semibold text-gray-800">
            Don't have an account?{" "}
            <Link to={"/signup"}>
              <span className="text-gray-950 font-bold underline cursor-pointer hover:text-green-950">
                Sign Up
              </span>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
