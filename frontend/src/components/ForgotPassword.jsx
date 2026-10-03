import React, { useEffect, useContext, useState } from 'react'
import PasskeyContext from '../context/PasskeyContext';
import Spinner from './Spinner';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

const ForgotPassword = () => {
    const [forgotForm, setForgotForm] = useState({ email: "", password: "", otp: "" });

    const { isTrue, setIsTrue, loading, setLoading, BACKEND_URL, isLogin, navigate } = useContext(PasskeyContext);
    const [isOtpTrue, setIsOtpTrue] = useState(false);

    const onChange = (e) => {
        setForgotForm({ ...forgotForm, [e.target.name]: e.target.value })
    }

    const handleForgotPassword = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);
            const response = await fetch(`${BACKEND_URL}/api/auth/forgotpassword`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: forgotForm.email })
            })

            const data = await response.json();

            if (response.ok) {
                setIsTrue(true);
                toast.success(data.message);
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
            console.log("Something went Wrong");
        } finally {
            setLoading(false);
        }
    }

    const handleVerifyOtp = async (e) => {
        e.preventDefault()

        try {
            setLoading(true);
            const response = await fetch(`${BACKEND_URL}/api/auth/verifyOtp`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: forgotForm.email, otp: forgotForm.otp, method: "ForgotPassword" })
            })

            const data = await response.json();

            if (response.ok) {
                setIsOtpTrue(true);
                toast.success(data.message);
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
            console.log("Something went wrong", error);
        } finally {
            setLoading(false);
        }
    }

    const handleChangePassword = async (e) => {
        e.preventDefault();

        if (!forgotForm.password) {
            return toast.error("Password is empty");
        }

        try {
            setLoading(true);
            const response = await fetch(`${BACKEND_URL}/api/auth/changePasswordOutside`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: forgotForm.email, newPassword: forgotForm.password })
            })

            const data = await response.json();

            if (response.ok) {
                setForgotForm({ email: "", password: "", otp: "" });
                toast.success(data.message);
                navigate("/login");
                setIsTrue(false);
                setIsOtpTrue(false);
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
            console.log("Something went Wrong", error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (!isLogin) {
            navigate("/forgotPassword");
        } else {
            navigate("/home");
        }

    }, [isLogin]);

    return (
        <div className='p-2 mx-auto container lg:px-40 py-16'>

            {loading ? <Spinner /> :
                <form className="max-w-sm mx-auto" onSubmit={(e) => { isOtpTrue ? handleChangePassword(e) : (isTrue ? handleVerifyOtp(e) : handleForgotPassword(e)) }}>
                    <h1 className='text-2xl font-bold text-center py-2'>
                        <span className="text-blue-500">&lt;</span>Forgot Password <span className='ml-1'>
                            <i className="fa-solid fa-key"></i>
                        </span>
                        <span className="text-blue-500"> Page /&gt;</span>
                    </h1>
                    <div className="mb-5">
                        <label htmlFor="email" className="block mb-2 text-xl font-medium text-white dark:text-gray-900">Email</label>
                        <input type="email" id="email" name='email' className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-full focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-transparent dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Enter your Email" value={forgotForm.email} onChange={onChange} disabled={isTrue} required />
                    </div>

                    {
                        isTrue && (
                            <div className="mb-5">
                                <label className="block mb-2 text-xl font-medium text-white dark:text-gray-900">OTP</label>
                                <input type="text" name='otp' className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-full focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-transparent dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder='Enter your OTP' value={forgotForm.otp} onChange={onChange} disabled={isOtpTrue} required />
                            </div>
                        )
                    }

                    {
                        isOtpTrue && (
                            <div className="mb-5">
                                <label htmlFor="password" className="block mb-2 text-xl font-medium text-white dark:text-gray-900">Password</label>
                                <input type="password" id="password" name='password' className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-full focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-transparent dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder='Enter your Password' value={forgotForm.password} onChange={onChange} required />
                            </div>
                        )
                    }

                    <div className='flex flex-col gap-1'>
                        <button
                            disabled={forgotForm.email.length < 6 || (isTrue && forgotForm.otp.length < 6) || (isOtpTrue && forgotForm.password.length < 6)}
                            type="submit"
                            className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:bg-gray-400"
                        >
                            Submit
                        </button>

                        <span className='text-sm'>Back to Login page <Link to="/login" className="text-blue-500">Login here</Link></span>
                    </div>
                </form>
            }
        </div>
    )
}

export default ForgotPassword
