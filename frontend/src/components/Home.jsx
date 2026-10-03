import React, { useState, useEffect, useContext } from 'react';
import Spinner from './Spinner';
import Table from './Table';
import Panel from './Panel';
import PasskeyContext from '../context/PasskeyContext';
import { toast } from 'react-toastify';

const Home = () => {
    const { isLogin, checkLogin, navigate, loading, setLoading, passwordData, fetchPassword } = useContext(PasskeyContext);

    const copyText = (text) => {
        navigator.clipboard.writeText(text);
        toast.success('Copied to Clipboard');
    };

    useEffect(() => {
        fetchPassword();
        checkLogin();
    }, []);

    useEffect(() => {
        if (isLogin) {
            navigate("/home");
        } else {
            navigate("/");
        }

    }, [isLogin]);

    return (
        <div className="flex flex-col items-center w-full pt-2">
            <h1 className="text-3xl font-bold text-center">
                <span className="text-blue-500">&lt;</span>Password <span className='ml-1'>
                    <i className="fa-solid fa-key"></i>
                </span>
                <span className="text-blue-500"> Manager /&gt;</span>
            </h1>
            <h2 className='text-blue-900 text-lg text-center'>Your own Password Manager</h2>

            <Panel />

            <div className="w-full max-w-5xl px-4">
                <h2 className="font-bold text-2xl py-4">
                    Your Password
                </h2>

                {loading ? (
                    <Spinner />
                ) : (
                    <div>
                        {passwordData.length === 0 && 'No Password to display'}
                        {passwordData.length > 0 && <Table />}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Home;
