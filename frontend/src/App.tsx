import { Route, Routes, useLocation } from "react-router-dom"
import SignUp from "./pages/Signup"
import Login from "./pages/Login"
import Navbar from "./components/Navbar";
import Home from "./pages/Home";

function App() {

  const location = useLocation();
  const locationPath = location.pathname;

  return (
    <div className="bg-gray-100 min-h-screen">
       {
         locationPath === "/home" && <Navbar />
       }

       <Routes>
          <Route path="/" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<Home />} />
       </Routes>
    </div>
  )
}

export default App
