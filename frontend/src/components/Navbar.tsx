import { useDispatch, useSelector } from "react-redux";
import Profile from "../assets/hacker.png";
import { useState } from "react";
import { logout } from "../slices/authSlice";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const { user } = useSelector((state: any) => state.auth);
  console.log(user);

  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  function openCloseModal(){
    setOpen(!open);
  }

  function logoutUser(){
    dispatch(logout());
    toast.success("Logged out successfully");
    navigate("/login");
  }

  return (
    <div className="bg-gray-100 h-16 w-full px-4 py-2">
      <div className="flex justify-between items-center  max-w-11/12  mx-auto">
        <div className="text-2xl font-bold font-sans cursor-pointer">
          Task Manager
        </div>

        <div>
          <button
            onClick={openCloseModal}
            className="flex items-center justify-center cursor-pointer hover:scale-105 transition duration-100"
          >
            <img
              className="h-10 w-10 rounded-full border-1 border-gray-500"
              src={Profile}
              alt="Profile"
            />
          </button>
        </div>
      </div>

      {open && (
        <div className="absolute top-16 right-0 w-56 bg-white rounded-xl shadow-lg z-50 p-4 border border-gray-200">
          <div className="flex flex-col space-y-3">
            {/* User name */}
            <p className="text-gray-800 font-semibold border-b border-gray-200 pb-2">
              {user.name}
            </p>
            {/* Logout button */}
            <button onClick={logoutUser} className="w-full text-left px-3 py-2 text-sm text-red-600 rounded-lg hover:bg-red-50 transition">
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
