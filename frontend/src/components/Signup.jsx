import React, { useState, useContext, useEffect } from 'react'
import Spinner from './Spinner';
import PasskeyContext from '../context/PasskeyContext';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

const Signup = (props) => {
  const { BACKEND_URL, setProgress, navigate, loading, setLoading, isTrue, setIsTrue, isLogin } = useContext(PasskeyContext);
  const [signupForm, setSignupForm] = useState({ userName: "", email: "", password: "", otp: "" });

  const onChange = (e) => {
    setSignupForm({ ...signupForm, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProgress(10)
    setLoading(true);

    try {
      const response = await fetch(`${BACKEND_URL}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(signupForm),
      });

      setProgress(25);

      const data = await response.json();

      if (response.ok) {
        setProgress(75)
        toast.success(data.message);
        setIsTrue(true);
      }
      else {
        if (data.errors && Array.isArray(data.errors)) {
          data.errors.forEach((error) => {
            toast.error(error.msg);
          });
        } else {
          toast.error(data.message || "Something went wrong");
        }
      }

    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
      setProgress(100);
    }
  }

  const handleSubmitOtp = async (e) => {
    e.preventDefault();
    setProgress(25);
    setLoading(true);

    try {
      const response = await fetch(`${BACKEND_URL}/api/auth/verifyOtp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: signupForm.email, otp: signupForm.otp, method: "Signup" })
      })

      setProgress(50);

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message);
        setProgress(75);
        setSignupForm({ userName: "", email: "", password: "", otp: "" });
        navigate("/login");
        setIsTrue(false);
      }
      else {
        if (data.errors && Array.isArray(data.errors)) {
          data.errors.forEach((error) => {
            toast.error(error.msg);
          });
        } else {
          toast.error(data.message || "Something went wrong");
        }
      }

    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
      setProgress(100);
    }
  }

  useEffect(() => {
    if (!isLogin) {
      navigate("/signup");
    } else {
      navigate("/home");
    }

  }, [isLogin]);

  return (
    <div className='p-2 mx-auto container lg:px-40 py-16'>

      {loading ? <Spinner /> :
        <form className="max-w-sm mx-auto" onSubmit={(e) => { isTrue ? handleSubmitOtp(e) : handleSubmit(e) }}>
          <h1 className='text-3xl font-bold text-center py-2'>
            <span className="text-blue-500">&lt;</span>SignUp <span className='ml-1'>
              <i className="fa-solid fa-key"></i>
            </span>
            <span className="text-blue-500"> Page /&gt;</span>
          </h1>
          <div className="mb-5">
            <label className="block mb-2 text-xl font-medium text-white dark:text-gray-900">Name</label>
            <input type="name" name='userName' className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-full focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-transparent dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Enter your name" value={signupForm.userName} onChange={onChange} disabled={isTrue} required />
          </div>
          <div className="mb-5">
            <label className="block mb-2 text-xl font-medium text-white dark:text-gray-900">Email</label>
            <input type="email" name='email' className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-full focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-transparent dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Enter your Email" value={signupForm.email} onChange={onChange} disabled={isTrue} required />
          </div>
          <div className="mb-5">
            <label className="block mb-2 text-xl font-medium text-white dark:text-gray-900">Password</label>
            <input type="password" name='password' className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-full focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-transparent dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder='Enter your Password' value={signupForm.password} onChange={onChange} disabled={isTrue} required />
          </div>

          {
            isTrue && (
              <div className="mb-5">
                <label className="block mb-2 text-xl font-medium text-white dark:text-gray-900">OTP</label>
                <input type="numeric" name='otp' className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-full focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-transparent dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder='Enter your OTP' value={signupForm.otp} onChange={onChange} required />
              </div>
            )
          }

          <div className='flex flex-col gap-1'>
            <button
              disabled={signupForm.userName.length < 3 || signupForm.email.length < 6 || signupForm.password.length < 6 || (isTrue && signupForm.otp.length < 6)}
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:bg-gray-400"
            >
              Submit
            </button>

            <span className='text-sm'>Already have an account <Link to="/login" className="text-blue-500">Login here</Link></span>
          </div>
        </form>
      }
    </div>
  )
}

export default Signup
