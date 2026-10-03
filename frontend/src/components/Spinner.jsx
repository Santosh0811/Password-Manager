import React from 'react'

const Spinner = () => {
    return (
        <>
            <div className="animate-pulse">
                <h1 className="h-8 bg-gray-500 rounded w-1/3 mx-auto"></h1>
                <h2 className='h-8 bg-gray-500 rounded w-1/2 mx-auto'></h2>
                <div className="text-black flex flex-col p-4 gap-8 items-center">
                    <div className='h-8 bg-gray-500 rounded-full w-full'></div>
                    <div className="flex flex-col md:flex-row w-full justify-between gap-8">
                        <div className='bg-gray-500 rounded-full w-full h-8 p-4 py-1 pr-80'></div>
                        <div className='bg-gray-500 rounded-full w-full h-8 p-4 py-1'></div>
                    </div>
                    <div className='h-8 bg-blue-300 mx-auto rounded-full w-1/3'></div>
                </div>

                <div>
                    <table className="w-full rounded-xl overflow-hidden mb-16">
                        <thead className='h-8 bg-blue-800 text-white'>
                            <tr>
                                <th className='bg-gray-500'></th>
                                <th className='bg-gray-500'></th>
                                <th className='bg-gray-500'></th>
                                <th className='bg-gray-500'></th>
                            </tr>
                        </thead>
                        <tbody className='bg-blue-200'>
                            <tr>
                                <td className='h-8 bg-gray-500'></td>
                                <td className='h-8 bg-gray-500'></td>
                                <td className='h-8 bg-gray-500'></td>
                                <td className='h-8 bg-gray-500'></td>
                            </tr>
                            <tr>
                                <td className='h-8 bg-gray-500'></td>
                                <td className='h-8 bg-gray-500'></td>
                                <td className='h-8 bg-gray-500'></td>
                                <td className='h-8 bg-gray-500'></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    )
}

export default Spinner
