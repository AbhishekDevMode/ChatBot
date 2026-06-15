import React, { useEffect, useState } from 'react'
import { FaSearch } from 'react-icons/fa'
import axios from 'axios';
import { toast } from 'react-toastify'
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom'
import { IoArrowBackSharp } from 'react-icons/io5';
import { BiLogOut } from "react-icons/bi";
import userConversation from '../../zustand/useConversation';
import { useSocketContext } from '../../context/SocketContext';
import ProfileModal from './ProfileModal';

const Sidebar = ({ onSelectUser }) => {

    const navigate = useNavigate();
    const { authUser, setAuthUser } = useAuth();
    const [searchInput, setSearchInput] = useState('');
    const [searchUser, setSearchuser] = useState([]);
    const [chatUser, setChatUser] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedUserId, setSetSelectedUserId] = useState(null);
    const [newMessageUsers, setNewMessageUsers] = useState('');
    const {messages , setMessage, selectedConversation ,  setSelectedConversation} = userConversation();
    const { onlineUser , socket} = useSocketContext();
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

    const nowOnline = chatUser.map((user)=>(user._id));
    //chats function
    const isOnline = nowOnline.map(userId => onlineUser.includes(userId));

    useEffect(() => {
        const handleNewMessage = (newMessage) => {
            setNewMessageUsers(newMessage);
        };
        socket?.on("newMessage", handleNewMessage);
        return () => socket?.off("newMessage", handleNewMessage);
    }, [socket, messages]);

    //show user with u chatted
    useEffect(() => {
        const chatUserHandler = async () => {
            setLoading(true)
            try {
                const chatters = await axios.get(`/api/user/currentchatters`)
                const data = chatters.data;
                if (data.success === false) {
                    setLoading(false)
                    console.log(data.message);
                }
                setLoading(false)
                setChatUser(data)

            } catch (error) {
                setLoading(false)
                console.log(error);
            }
        }
        chatUserHandler()
    }, [])
    
    //show user from the search result
    const handelSearchSubmit = async (e) => {
        e.preventDefault();
        setLoading(true)
        try {
            const search = await axios.get(`/api/user/search?search=${searchInput}`);
            const data = search.data;
            if (data.success === false) {
                setLoading(false)
                console.log(data.message);
            }
            setLoading(false)
            if (data.length === 0) {
                toast.info("User Not Found")
            } else {
                setSearchuser(data)
            }
        } catch (error) {
            setLoading(false)
            console.log(error);
        }
    }

    //show which user is selected
    const handelUserClick = (user) => {
        onSelectUser(user);
        setSelectedConversation(user);
        setSetSelectedUserId(user._id);
        setNewMessageUsers('')
    }

    //back from search result
    const handSearchback = () => {
        setSearchuser([]);
        setSearchInput('')
    }

    //logout
    const handelLogOut = async () => {

        const confirmlogout = window.prompt("type 'UserName' To LOGOUT");
        if (confirmlogout === authUser.username) {
            setLoading(true)
            try {
                const logout = await axios.post('/api/auth/logout')
                const data = logout.data;
                if (data?.success === false) {
                    setLoading(false)
                    console.log(data?.message);
                }
                toast.info(data?.message)
                localStorage.removeItem('chatapp')
                setAuthUser(null)
                setLoading(false)
                navigate('/login')
            } catch (error) {
                setLoading(false)
                console.log(error);
            }
        } else {
            toast.info("LogOut Cancelled")
        }

    }

    
    return (
        <div className='h-full flex flex-col w-auto'>
            <ProfileModal isOpen={isProfileModalOpen} onClose={() => setIsProfileModalOpen(false)} />
            
            {/* Header / Search */}
            <div className='flex items-center justify-between gap-3 mb-4'>
                <form onSubmit={handelSearchSubmit} className='flex-1 flex items-center glass-input rounded-full px-1 py-1'>
                    <input
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        type='text'
                        className='w-full bg-transparent outline-none px-3 text-sm placeholder-gray-400'
                        placeholder='Search users...'
                    />
                    <button className='btn btn-circle btn-sm bg-sky-500 hover:bg-sky-400 border-none text-white'>
                        <FaSearch size={14}/>
                    </button>
                </form>
                <div className="relative group">
                    <img
                        onClick={() => setIsProfileModalOpen(true)}
                        src={authUser?.profilepic}
                        className='h-10 w-10 rounded-full object-cover border-2 border-sky-400 cursor-pointer transition-transform duration-300 transform group-hover:scale-110 shadow-lg' 
                        alt="Profile"
                    />
                    <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-500 border-2 border-gray-900 rounded-full"></div>
                </div>
            </div>
            
            <div className='divider my-0 h-[1px] bg-gray-700 opacity-30'></div>
            
            {/* User List */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden pr-1 -mr-1 mt-2 space-y-1">
                {searchUser?.length > 0 ? (
                    <>
                        <div className="flex items-center gap-2 mb-2 px-1">
                            <button onClick={handSearchback} className='p-1.5 rounded-full hover:bg-gray-700 text-gray-300 transition-colors'>
                                <IoArrowBackSharp size={20} />
                            </button>
                            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Search Results</span>
                        </div>
                        {searchUser.map((user, index) => (
                            <div
                                key={user._id}
                                onClick={() => handelUserClick(user)}
                                className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200 group
                                    ${selectedUserId === user?._id ? 'bg-sky-500 bg-opacity-20 border border-sky-500 border-opacity-30' : 'hover:bg-gray-800 hover:bg-opacity-50'} 
                                `}>
                                <div className={`avatar ${isOnline[index] ? 'online':''}`}>
                                    <div className="w-10 h-10 rounded-full shadow-sm">
                                        <img src={user.profilepic} alt={user.username} className="object-cover" />
                                    </div>
                                </div>
                                <div className='flex flex-col flex-1 min-w-0'>
                                    <p className={`font-semibold truncate ${selectedUserId === user?._id ? 'text-sky-300' : 'text-gray-200 group-hover:text-white'}`}>
                                        {user.username}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </>
                ) : (
                    <>
                        {chatUser.length === 0 ? (
                            <div className='flex flex-col items-center justify-center h-full text-center px-4'>
                                <span className="text-4xl mb-3">👋</span>
                                <h1 className='font-bold text-lg text-gray-300 mb-1'>It's quiet here</h1>
                                <p className='text-sm text-gray-500'>Search for a user to start chatting.</p>
                            </div>
                        ) : (
                            <>
                                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-2 mb-2 block mt-2">Recent Chats</span>
                                {chatUser.map((user, index) => (
                                    <div
                                        key={user._id}
                                        onClick={() => handelUserClick(user)}
                                        className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200 group
                                            ${selectedUserId === user?._id ? 'bg-sky-500 bg-opacity-20 border border-sky-500 border-opacity-30' : 'hover:bg-gray-800 hover:bg-opacity-50'} 
                                        `}>

                                        <div className={`avatar ${isOnline[index] ? 'online':''}`}>
                                            <div className="w-10 h-10 rounded-full shadow-sm">
                                                <img src={user.profilepic} alt={user.username} className="object-cover" />
                                            </div>
                                        </div>
                                        <div className='flex flex-col flex-1 min-w-0'>
                                            <p className={`font-semibold truncate ${selectedUserId === user?._id ? 'text-sky-300' : 'text-gray-200 group-hover:text-white'}`}>
                                                {user.username}
                                            </p>
                                        </div>
                                        {newMessageUsers.receiverId === authUser._id && newMessageUsers.senderId === user._id && (
                                            <div className="w-3 h-3 rounded-full bg-sky-500 shadow-[0_0_8px_rgba(14,165,233,0.8)]"></div>
                                        )}
                                    </div>
                                ))}
                            </>
                        )}
                    </>
                )}
            </div>
            
            {/* Footer / Logout */}
            <div className='mt-3 pt-3 border-t border-gray-700 border-opacity-30 flex items-center justify-between px-1'>
                <button 
                    onClick={handelLogOut} 
                    className='flex items-center gap-2 px-3 py-2 text-gray-400 hover:text-red-400 hover:bg-red-400 hover:bg-opacity-10 rounded-lg transition-colors group'
                    title="Logout"
                >
                    <BiLogOut size={22} className="group-hover:-translate-x-1 transition-transform" />
                    <span className='text-sm font-medium'>Logout</span>
                </button>
            </div>
        </div>
    )
}

export default Sidebar