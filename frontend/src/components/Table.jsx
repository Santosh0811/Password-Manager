import React from 'react'
import { useContext } from 'react'
import PasskeyContext from '../context/PasskeyContext'
import Swal from 'sweetalert2'
import { toast } from 'react-toastify'

const Table = () => {
    const { passwordData, setForm, setIsUpdate, setId, fetchPassword, BACKEND_URL } = useContext(PasskeyContext);

    const copyText = async (text) => {
        try {
            await navigator.clipboard.writeText(text);
            toast.success("Copied to Clipboard");
        } catch (error) {
            console.error("Copy failed:", error);
            toast.error("Failed to copy");
        }
    };

    const handlePasswordDelete = async ({ id, site }) => {
        const result = await Swal.fire({
            title: `Delete ${site} Password?`,
            text: "You won't be able to recover it!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Delete',
            cancelButtonText: 'Cancel',
        })

        if (result.isConfirmed) {
            try {
                const response = await fetch(`${BACKEND_URL}/api/passkey/deletePassword/${id}`, {
                    method: "DELETE",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include"
                })

                const data = await response.json();

                if (response.ok) {
                    await fetchPassword();
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
                console.log("Failed to delete Bookmark", error);
            }
        }
    }

    return (
        <table className="table-auto w-full rounded-xl overflow-hidden lg:mb-16 mb-4">
            <thead className='bg-blue-800 text-white'>
                <tr>
                    <th className='py-2'>Site</th>
                    <th className='py-2'>Username</th>
                    <th className='py-2'>Password</th>
                    <th className='py-2'>Action</th>
                </tr>
            </thead>
            <tbody className='bg-blue-200'>
                {passwordData.map((item) => (
                    <tr key={item._id}>
                        
                        <td className="text-center py-2 border border-white lg:w-44">
                            <div className="flex items-center justify-center gap-2 px-2 lg:max-w-[170px] max-w-[120px] mx-auto">
                                <a
                                    href={item.site}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="truncate max-w-[140px] block"
                                >
                                    {item.site}
                                </a>

                                <i
                                    className="fa-solid fa-copy cursor-pointer flex-shrink-0"
                                    onClick={() => copyText(item.site)}
                                ></i>
                            </div>
                        </td>

                        <td className="text-center py-2 border border-white lg:w-44">
                            <div className="flex items-center justify-center gap-2 px-2 lg:max-w-[170px] max-w-[120px] mx-auto">
                                <span className="truncate">
                                    {item.username}
                                </span>

                                <i
                                    className="fa-solid fa-copy cursor-pointer flex-shrink-0"
                                    onClick={() => copyText(item.username)}
                                ></i>
                            </div>
                        </td>

                        <td className='text-center w-32 py-2 border border-white'>
                            {"*".repeat(6)}
                            <i className="fa-solid fa-copy ml-2 cursor-pointer" onClick={() => copyText(item.password)}></i>
                        </td>

                        <td className='text-center w-28 py-2 border border-white'>

                            <i className="fa-solid fa-pen-to-square cursor-pointer" onClick={() => {
                                setForm({ site: item.site, username: item.username, password: item.password });
                                setIsUpdate(true);
                                setId(item._id);
                            }}></i>

                            <i className="fa-solid fa-trash cursor-pointer ml-2" onClick={() => handlePasswordDelete({ id: item._id, site: item.site })}></i>

                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    )
}

export default Table
