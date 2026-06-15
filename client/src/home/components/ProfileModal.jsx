import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import { IoCloseSharp } from "react-icons/io5";

const ProfileModal = ({ isOpen, onClose }) => {

    const { authUser, setAuthUser } = useAuth();
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(authUser?.profilepic);
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            toast.error('Please select an image first');
            return;
        }

        setLoading(true);
        const formData = new FormData();
        formData.append('profilepic', selectedFile);

        try {
            const res = await axios.put('/api/user/profile-pic', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (res.data.success) {
                toast.success('Profile picture updated!');
              
                const updatedUser = { ...authUser, profilepic: res.data.user.profilepic };
                localStorage.setItem('chatapp', JSON.stringify(updatedUser));
                setAuthUser(updatedUser);
                onClose();
            } else {
                toast.error(res.data.message);
            }
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || 'Error uploading image');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-70 backdrop-blur-sm transition-opacity duration-300">
            <div className="glass-panel p-8 rounded-3xl w-80 relative flex flex-col items-center transform transition-all duration-300 scale-100 opacity-100">
                <button 
                    onClick={onClose} 
                    className="absolute top-4 right-4 text-gray-400 hover:text-white bg-gray-800 hover:bg-gray-700 rounded-full p-1.5 transition-colors"
                >
                    <IoCloseSharp size={20} />
                </button>

                <h2 className="text-xl font-bold text-white mb-6 tracking-wide">Profile</h2>
                
                <div className="flex flex-col items-center mb-6 w-full group">
                    <div className="relative mb-4">
                        <img 
                            src={previewUrl} 
                            alt="Profile Preview" 
                            className="w-32 h-32 rounded-full object-cover border-4 border-sky-500 shadow-[0_0_15px_rgba(14,165,233,0.3)] transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 rounded-full bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                            <span className="text-white text-xs font-semibold">Edit</span>
                        </div>
                    </div>
                    <label 
                        htmlFor="profilepic-upload" 
                        className="w-full text-center py-2.5 bg-gray-800 hover:bg-gray-700 text-sky-400 border border-sky-500 border-opacity-30 rounded-xl cursor-pointer transition-colors shadow-sm"
                    >
                        <span className="text-sm font-semibold">Choose New Image</span>
                    </label>
                    <input 
                        id="profilepic-upload" 
                        type="file" 
                        accept="image/*" 
                        onChange={handleFileChange} 
                        className="hidden"
                    />
                </div>

                <div className="text-center w-full mb-8">
                    <p className="text-xl font-bold text-white">{authUser?.fullname}</p>
                    <p className="text-sm text-sky-400 font-medium">@{authUser?.username}</p>
                </div>

                <div className="flex w-full gap-3">
                    <button 
                        onClick={onClose}
                        className="flex-1 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 font-medium transition-colors"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={handleUpload}
                        disabled={loading || !selectedFile}
                        className="flex-1 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-medium transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? <span className="loading loading-spinner loading-sm"></span> : 'Save'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProfileModal;
