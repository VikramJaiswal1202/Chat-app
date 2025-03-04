import React, { useEffect } from "react";
import { Routes,Route, Navigate } from "react-router-dom";
import Navbar from "./Components/Navbar";
import HomePage from "./Pages/HomePage";
import SignUpPage from "./Pages/SignUpPage";
import LoginPage from "./Pages/LoginPage";
import SettingsPage from "./Pages/SettingsPage";
import ProfilePage from "./Pages/ProfilePage";
import { Toaster } from "react-hot-toast";
// import { axiosInstance } from "./lib/axios";
import { useAuthStore } from "./store/useAuthStore";
import {Loader} from "lucide-react";

const App = () => {
  const{authUser,checkAuth,isCheckingAuth}=useAuthStore();
  
  useEffect(()=>{
    checkAuth()
  }, [checkAuth]);

  console.log({authUser});

  if(isCheckingAuth && !authUser)return(
    <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin"/>
    </div>
  )


  return (
    <div data-theme="cupcake" >
      
      <Navbar/>

      <Routes>
        <Route path="/" element={authUser? <HomePage/>:<Navigate to="/login"/>} />
        <Route path="/signup" element={!authUser ?<SignUpPage/>: <Navigate to="/"/>} />
        <Route path="/login" element={!authUser ?<LoginPage/>: <Navigate to="/"/>} />
        <Route path="/settings" element={<SettingsPage/>} />
        <Route path="/profile" element={authUser? <ProfilePage/>: <Navigate to="/login"/>} />
      </Routes>
      <Toaster/>
    </div>
  );
};

export default App;
