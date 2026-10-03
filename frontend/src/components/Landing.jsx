import React, { useContext, useEffect } from 'react'
import { Link } from "react-router-dom";
import PasskeyContext from '../context/PasskeyContext';

const Landing = () => {
  const { isLogin, navigate } = useContext(PasskeyContext);

  useEffect(() => {
    if (isLogin) {
      navigate("/home");
    } else {
      navigate("/");
    }
  }, [isLogin]);

  return (
    <div className="bg-gray-50 font-sans text-gray-900">

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-500 to-blue-300 text-white py-24 px-6 text-center">
        <h1 className="text-5xl font-bold leading-tight mb-6">
          <span>Secure Your Digital Life with </span>
          <span className="text-gray-700">&lt;</span>
          Password
          <span className="text-gray-700"> Manager /&gt;</span>

        </h1>
        <p className="text-xl mb-6">
          The easiest and most secure way to manage your passwords, store sensitive data, and never forget another password again.
        </p>
        <div className="flex justify-center items-center gap-6">
          <Link to="/login" className="bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-8 rounded-full text-lg transition-all duration-200">
            Login
          </Link>
          <span className='ml-1'>
            <i className="fa-solid fa-key text-2xl"></i>
          </span>
          <Link to="/signup" className="bg-transparent border-2 border-white hover:bg-white hover:text-indigo-600 text-white py-3 px-8 rounded-full text-lg transition-all duration-200">
            Sign Up
          </Link>
        </div>
      </section>

      {/* Info Section */}
      <section className="py-20 px-6 bg-gray-100 text-center">
        <h2 className="text-3xl font-semibold text-indigo-600 mb-6">Why Choose Password Manager?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 max-w-screen-lg mx-auto">
          <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-200">
            <h3 className="text-xl font-semibold text-indigo-600 mb-4">Military-Grade Security</h3>
            <p className="text-gray-700">
              We use AES-256 encryption to ensure your passwords and sensitive data are always safe and protected.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-200">
            <h3 className="text-xl font-semibold text-indigo-600 mb-4">Easy to Use</h3>
            <p className="text-gray-700">
              Our user-friendly interface makes it easy to manage and autofill your passwords with just a few clicks.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-200">
            <h3 className="text-xl font-semibold text-indigo-600 mb-4">Access Anywhere</h3>
            <p className="text-gray-700">
              PassSafe works across all your devices, so you can always access your passwords on desktop, mobile, or tablet.
            </p>
          </div>
        </div>
      </section>

    </div>
  )
}

export default Landing
