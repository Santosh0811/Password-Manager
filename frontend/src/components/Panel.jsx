import React, { useContext, useState } from 'react'
import PasskeyContext from '../context/PasskeyContext';
import { toast } from 'react-toastify';

const Panel = () => {
    const { BACKEND_URL, fetchPassword, form, setForm, isUpdate, setIsUpdate, id, setId } = useContext(PasskeyContext);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleSavePassword = async (e) => {
        e.preventDefault();

        if (!form.site || !form.username || !form.password) {
            toast.info("Please fill out all fields.");
            return;
        }

        try {
            const response = await fetch(`${BACKEND_URL}/api/passkey/addPassword`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ site: form.site, username: form.username, password: form.password })
            }
            );

            const data = await response.json();

            if (response.ok) {
                toast.success(data.message);
                setForm({ site: "", username: "", password: "" });
                setIsUpdate(false);
                setId("");
                setIsPasswordVisible(false);
                await fetchPassword();
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
            console.log("Failed to Save Bookmark ", error);
        }
    }

    const handleUpdatePassword = async (e) => {
        e.preventDefault();

        if (!id) {
            toast.error("Missing bookmark id");
            return;
        }

        if (!form.site || !form.username || !form.password) {
            toast.info("Please fill out all fields.");
            return;
        }

        try {
            const response = await fetch(`${BACKEND_URL}/api/passkey/updatePassword/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(form)
            }
            );

            const data = await response.json();

            if (response.ok) {
                toast.success(data.message);
                setIsUpdate(false);
                setId("");
                setForm({ site: "", username: "", password: "" });
                setIsPasswordVisible(false);
                await fetchPassword();
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
            console.log("Error while updating a Password", error);
        }
    };

    return (
        <div className="w-full max-w-2xl px-4 py-2">
            <form onSubmit={(e) => isUpdate ? handleUpdatePassword(e) : handleSavePassword(e)}>
                <div className="text-black flex flex-col gap-8">
                    <input
                        value={form.site}
                        onChange={handleChange}
                        placeholder='Enter Website URL'
                        className='rounded-full border border-blue-500 w-full p-4 py-1'
                        type="text"
                        name="site"
                    />
                    <input
                        value={form.username}
                        onChange={handleChange}
                        placeholder='Enter Username'
                        className='rounded-full border border-blue-500 w-full p-4 py-1'
                        type="text"
                        name="username"
                    />

                    <div className="relative w-full">
                        <input
                            value={form.password}
                            onChange={handleChange}
                            placeholder='Enter Password'
                            className='rounded-full border border-blue-500 w-full p-4 py-1 pr-8'
                            type={isPasswordVisible ? 'text' : 'password'}
                            name="password"
                        />
                        <span className="absolute right-[1px] top-[1px] cursor-pointer" onClick={() => setIsPasswordVisible(prev => !prev)}>
                            <i className={`fas ${isPasswordVisible ? 'fa-eye-slash p-2' : 'fa-eye p-2'}`}></i>
                        </span>
                    </div>

                    <div className="flex items-center justify-center gap-4">
                        <button
                            type="submit"
                            disabled={
                                form.site.length < 6 ||
                                form.username.length < 6 ||
                                form.password.length < 6
                            }
                            className="flex justify-center items-center gap-2 bg-blue-400 hover:bg-blue-300 rounded-full px-8 py-2 border border-blue-900 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-blue-400"
                        >
                            <i className="fa-solid fa-file-circle-plus"></i>
                            {isUpdate ? "Update Password" : "Save Password"}
                        </button>

                        <button
                            type='button'
                            className="flex justify-center items-center gap-2 bg-blue-400 hover:bg-blue-300 rounded-full px-8 py-2 border border-blue-900"
                            onClick={() => {
                                setForm({ site: "", username: "", password: "" });
                                setIsUpdate(false);
                                setId("");
                                setIsPasswordVisible(false);
                            }}
                        >
                            <i className="fa-solid fa-x"></i>
                            Cancel
                        </button>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default Panel
