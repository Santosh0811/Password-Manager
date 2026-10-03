import React, { useState, useContext } from 'react';
import Navbar from "./components/Navbar";
import { Routes, Route } from "react-router-dom";
import Home from './components/Home.jsx';
import PasskeyState from './context/PasskeyState.jsx';
import { ToastContainer } from 'react-toastify';
import Login from './components/Login.jsx';
import Signup from './components/Signup.jsx';
import Landing from './components/Landing.jsx';
import PasskeyContext from './context/PasskeyContext.jsx';
import ForgotPassword from './components/ForgotPassword.jsx';

const App = () => {

  return (
    <>
      <PasskeyState>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick={false}
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />

        <Navbar />
        <div className="fixed inset-0 -z-10 h-full w-full bg-blue-100 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]">
          <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-fuchsia-400 opacity-20 blur-[100px]"></div>
        </div>
        <Routes>
          {/* <Route exact path="/" element={<Home />} /> */}
          <Route exact path="/" element={<Landing />} />
          <Route exact path="/home" element={<Home />} />
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/signup" element={<Signup />} />
          <Route exact path="/forgotPassword" element={<ForgotPassword />} />
        </Routes>
      </PasskeyState>
    </>
  );
}

export default App;
