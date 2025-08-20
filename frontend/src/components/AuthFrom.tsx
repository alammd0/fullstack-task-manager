import { useState } from "react";
import { toast } from "sonner";
import Spinner from "./Spinner";
import { Link, useNavigate } from "react-router-dom";
import type { LoginUser, SignUser } from "../types";
import { login, register } from "../services/authAPI";
import { useDispatch } from "react-redux";
import { setAuth } from "../slices/authSlice";

export default function AuthForm({ type } : { type : "login" | "signup" }) {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const [userData, setUserData] = useState<SignUser>({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserData({
      ...userData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (type == "login") {
      setLoading(true);
      const response = await login(userData as LoginUser);
      if (!response.data) {
        toast.error(response.message);
        setLoading(false);
        return;
      }
      toast.success(response.message); 
      dispatch(setAuth(response.data));
      navigate("/home")
      setLoading(false);
    } else {
      setLoading(true);
      const response = await register(userData as SignUser);
      if (!response.user) {
        toast.error(response.message);
        setLoading(false);
        return;
      }

      toast.success(response.message);
      navigate("/login", { replace : true })
      setLoading(false);
    }

    setUserData({
      name: "",
      email: "",
      password: "",
    });
  };

  if(loading){
    return <Spinner />
  }

  return (
    <div className="flex h-screen flex-col items-center justify-center font-OpenSans">
      <div className="w-full max-w-md bg-white shadow-xl rounded-xl flex flex-col gap-4 p-5 border border-gray-200">
        <h1 className="text-center text-3xl font-semibold text-gray-800 font-OpenSans">
          {type == "login"
            ? "Welcome Back"
            : "Join Task Manager"
          }
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {type == "signup" && (
            <div className="flex flex-col gap-2">
              <label className="text-sm" htmlFor="name">
                {" "}
                Name <sup className="text-red-500">*</sup>
              </label>
              <input
                className="px-4 py-2 border border-gray-400 rounded-md w-full outline-none focus:border-gray-800 capitalize"
                type="text"
                name="name"
                id="name"
                placeholder="Your Name"
                value={userData.name}
                onChange={handleChange}
                required
              />
            </div>
          )}

          <div className="flex flex-col gap-2">
            <label className="text-sm" htmlFor="email">
              {" "}
              Email <sup className="text-red-500">*</sup>
            </label>
            <input
              className="px-4 py-2 border border-gray-400 rounded-md w-full outline-none focus:border-gray-800"
              type="email"
              name="email"
              id="email"
              placeholder="Email"
              value={userData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="flex flex-col gap-2 relative">
            <label className="text-sm" htmlFor="password">
              {" "}
              Password <sup className="text-red-500">*</sup>
            </label>
            <input
              className="px-4 py-2 border border-gray-400 rounded-md w-full outline-none focus:border-gray-800"
              type={showPassword ? "text" : "password"}
              name="password"
              id="password"
              placeholder="Password"
              value={userData.password}
              onChange={handleChange}
              required
            />

            <div className="absolute right-2 top-10 flex items-center justify-center">
              {showPassword ? (
                <div onClick={() => setShowPassword(false)}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1"
                    stroke="currentColor"
                    className="size-5 cursor-pointer"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
                    />
                  </svg>
                </div>
              ) : (
                <div onClick={() => setShowPassword(true)}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1"
                    stroke="currentColor"
                    className="size-5 cursor-pointer"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                    />
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                    />
                  </svg>
                </div>
              )}
            </div>
          </div>

          <button
            className="px-4 py-2 rounded-md bg-gray-500 text-white hover:bg-gray-700 transition duration-100 cursor-pointer"
            type="submit"
          >
            {type == "login" ? "Login" : "Sign Up"}
          </button>
        </form>

        <Link to={type == "login" ? "/" : "/login"}>
          <p className="text-center text-sm text-gray-500">
            {type == "login"
              ? "Don't have an account? Please Sign Up"
              : "Already have an account? Please Login"}
          </p>
        </Link>
      </div>
    </div>
  );
}