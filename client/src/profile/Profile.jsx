import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { IoArrowBackSharp, IoCamera } from 'react-icons/io5';

const Profile = () => {
    const { authUser, setAuthUser } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [previewImg, setPreviewImg] = useState(authUser?.profilepic);

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Preview the image locally
        const reader = new FileReader();
        reader.onload = () => {
            setPreviewImg(reader.result);
        };
        reader.readAsDataURL(file);

        // Upload the image
        const formData = new FormData();
        formData.append('profilepic', file);

        setLoading(true);
        try {
            const res = await axios.put('/api/user/profile-pic', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (res.data.success) {
                const updatedUser = res.data.user;
                // Update local storage and context
                localStorage.setItem('chatapp', JSON.stringify(updatedUser));
                setAuthUser(updatedUser);
                toast.success(res.data.message);
            } else {
                toast.error(res.data.message);
                setPreviewImg(authUser?.profilepic); // revert preview on error
            }
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || 'Error uploading profile picture');
            setPreviewImg(authUser?.profilepic); // revert preview on error
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='flex flex-col items-center justify-center min-w-96 mx-auto'>
            <div className='w-full p-6 rounded-lg shadow-md bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-0'>
                <div className='flex items-center gap-4 mb-6'>
                    <button onClick={() => navigate('/')} className='bg-sky-600 rounded-full p-2 text-white hover:bg-sky-700'>
                        <IoArrowBackSharp size={24} />
                    </button>
                    <h1 className='text-3xl font-semibold text-center text-gray-300'>Profile</h1>
                </div>

                <div className='flex flex-col items-center gap-6'>
                    <div className='relative'>
                        <div className={`avatar ${loading ? 'opacity-50' : ''}`}>
                            <div className="w-32 rounded-full ring ring-sky-500 ring-offset-base-100 ring-offset-2">
                                <img src={previewImg} alt='Profile' className='object-cover' />
                            </div>
                        </div>
                        
                        <label htmlFor='profile-upload' className='absolute bottom-0 right-0 bg-sky-600 p-2 rounded-full text-white cursor-pointer hover:bg-sky-700 transition-colors'>
                            {loading ? <span className='loading loading-spinner loading-xs'></span> : <IoCamera size={20} />}
                        </label>
                        <input 
                            id='profile-upload' 
                            type='file' 
                            accept='image/*' 
                            className='hidden' 
                            onChange={handleImageChange}
                            disabled={loading}
                        />
                    </div>

                    <div className='w-full bg-gray-800 p-4 rounded-lg bg-opacity-50 space-y-4'>
                        <div>
                            <span className='text-gray-400 text-sm'>Full Name</span>
                            <p className='text-white text-lg font-semibold'>{authUser?.fullname}</p>
                        </div>
                        <div>
                            <span className='text-gray-400 text-sm'>Username</span>
                            <p className='text-white text-lg font-semibold'>@{authUser?.username}</p>
                        </div>
                        <div>
                            <span className='text-gray-400 text-sm'>Email</span>
                            <p className='text-white text-lg font-semibold'>{authUser?.email}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
