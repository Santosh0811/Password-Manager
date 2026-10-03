import React, { useState } from 'react'
import { useContext } from 'react';
import { Link } from "react-router-dom";
import { toast } from 'react-toastify';
import PasskeyContext from '../context/PasskeyContext';

const Navbar = () => {
    const { BACKEND_URL, setProgress, isLogin, userInfo, navigate, setUserInfo, setIsLogin, setPasswordData } = useContext(PasskeyContext);
    const [showPassword, setShowPassword] = useState(false);
    const [password, setPassword] = useState("");
    const [modalOpen, setModalOpen] = useState(false);

    const handleChangePassword = async () => {
        try {
            const response = await fetch(`${BACKEND_URL}/api/passkey/changePasswordInside`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ password }),
                credentials: "include"
            });

            const data = await response.json();

            if (response.ok) {
                toast.success(data.message);
                setPassword("");
            } else {
                if (data.errors && Array.isArray(data.errors)) {
                    data.errors.forEach((error) => {
                        toast.error(error.msg);
                    });
                } else {
                    toast.error(data.message || "Something went wrong");
                }
            }
        } catch (error) {
            console.log("Something went Wrong in password change");
            toast.error("Something went Wrong");
        }
    };

    const handleLogout = async () => {
        try {
            const response = await fetch(`${BACKEND_URL}/api/auth/logout`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include"
            }
            );

            const data = await response.json();

            if (response.ok) {
                setUserInfo(null);
                setIsLogin(false);
                setPasswordData([]);
                navigate("/");
                toast.success(data.message || "Logged out successfully");
            } else {
                if (data.errors && Array.isArray(data.errors)) {
                    data.errors.forEach((error) => {
                        toast.error(error.msg);
                    });
                } else {
                    toast.error(data.message || "Something went wrong");
                }
            }

        } catch (error) {
            console.log("Logout error:", error);
            toast.error("Something went wrong during logout");
        }
    };

    return (
        <nav className='bg-slate-800 text-white'>
            <div className="mycontainer flex justify-between items-center px-4 py-5 h-14">
                <div className="logo font-bold text-xl">
                    <Link to="/">
                        <span className="text-blue-500">&lt;</span>
                        Password
                        <span className='ml-1'>
                            <i className="fa-solid fa-key"></i>
                        </span>
                        <span className="text-blue-500 ml-1">Manager /&gt;</span>
                    </Link>
                </div>

                <div className='flex flex-row gap-6'>
                    <a href="https://github.com/Santosh0811" target="_blank" rel="noopener noreferrer" className="text-white fs-4"
                    >
                        <i className="fa-brands fa-github"></i>
                    </a>

                    {isLogin ? (
                        <div className='flex flex-row gap-6'>
                            <b onClick={() => setModalOpen(true)} style={{ color: "white", cursor: "pointer" }}><i className="fa-solid fa-user"></i></b>

                            <b onClick={handleLogout} style={{ color: "white", cursor: "pointer" }}><i className="fa-solid fa-right-from-bracket"></i></b>
                        </div>
                    ) : (
                        <div className='flex flex-row gap-6'>
                            <Link className="btn btn-primary" to="/login" role="button"><i className="fa-solid fa-right-to-bracket"></i></Link>

                            <Link className="btn btn-primary" to="/signup" role="button"><i className="fa-solid fa-user-plus"></i></Link>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal Toggle */}
            {modalOpen && (
                <div className="overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full">
                    <div className="relative p-4 w-full max-w-2xl max-h-full flex justify-center items-center">
                        <div className="relative bg-white rounded-lg shadow dark:bg-black opacity-95">
                            {/* Modal Header */}
                            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                    User Profile
                                </h3>
                                <button
                                    type="button"
                                    className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                                    onClick={() => setModalOpen(false)}
                                >
                                    <i className="fa-solid fa-x"></i>
                                    <span className="sr-only">Close modal</span>
                                </button>
                            </div>
                            {/* Modal Body */}
                            <div className="p-4 md:p-5 space-y-6">
                                <h2 className="text-2xl font-semibold">User Details</h2>
                                <table className="min-w-full table-auto border border-gray-300 shadow-md">
                                    <tbody>
                                        <tr className="border-b">
                                            <th className="px-4 py-2 text-left font-medium border">Name</th>
                                            <td className="px-4 py-2">{userInfo.userName}</td>
                                        </tr>
                                        <tr className="border-b">
                                            <th className="px-4 py-2 text-left font-medium border">Email</th>
                                            <td className="px-4 py-2">{userInfo.email}</td>
                                        </tr>
                                        <tr className="border-b">
                                            <th className="px-4 py-2 text-left font-medium border">Account Created Time</th>
                                            <td className="px-4 py-2">{new Date(userInfo.createdAt).toLocaleString("en-IN", {
                                                timeZone: "Asia/Kolkata"
                                            })}</td>
                                        </tr>
                                        <tr className="border-b">
                                            <th className="px-4 py-2 text-left font-medium border">Updated Time</th>
                                            <td className="px-4 py-2">{new Date(userInfo.updatedAt).toLocaleString("en-IN", {
                                                timeZone: "Asia/Kolkata"
                                            })}</td>
                                        </tr>
                                    </tbody>
                                </table>

                                {/* Change Password Section */}
                                <h4 className="text-xl font-semibold mt-6">Change Password</h4>
                                <table className="min-w-full table-auto border border-gray-300 shadow-md">
                                    <tbody>
                                        <tr>
                                            <th className="px-4 py-2 text-left font-medium border">New Password</th>
                                            <td className="px-4 py-2 relative flex flex-col gap-2">
                                                <div>
                                                    <input
                                                        type={showPassword ? 'text' : 'password'}
                                                        className="w-full px-2 py-1 border border-gray-300 text-black rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10 bg-white/80"
                                                        name="password"
                                                        value={password}
                                                        onChange={(e) => setPassword(e.target.value)}
                                                        required
                                                    />

                                                    <span className="absolute right-[1.75em] top-[0.80em] cursor-pointer text-black" onClick={() => setShowPassword(prev => !prev)}>
                                                        <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                                                    </span>
                                                </div>

                                                <button
                                                    disabled={password.length < 5}
                                                    type="button"
                                                    className="px-2 py-1 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:bg-gray-400"
                                                    onClick={handleChangePassword}
                                                >
                                                    Update Password
                                                </button>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    )
}

export default Navbar
