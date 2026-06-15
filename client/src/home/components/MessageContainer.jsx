import React, { useEffect, useState, useRef } from "react";
import userConversation from "../../zustand/useConversation";
import { useAuth } from "../../context/AuthContext";
import { TiMessages } from "react-icons/ti";
import { IoArrowBackSharp, IoSend } from "react-icons/io5";
import { FaHeart, FaRegHeart, FaTrash } from "react-icons/fa";
import axios from "axios";
import { useSocketContext } from "../../context/SocketContext";
import notify from "../../assets/sound/notification.mp3";
import { toast } from 'react-toastify';

const MessageContainer = ({ onBackUser }) => {
  const {
    messages,
    selectedConversation,
    setMessage,
    setSelectedConversation
  } = userConversation();
  const { socket } = useSocketContext();
  const { authUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendData, setSnedData] = useState("");
  const lastMessageRef = useRef(null);

  useEffect(() => {
    if (!socket) return;
    const handleNewMessage = (newMessage) => {
      if (
        newMessage.senderId === selectedConversation._id ||
        newMessage.receiverId === selectedConversation?._id
      ) {
        const sound = new Audio(notify);
        sound.play().catch((err) => console.log("Audio error", err));
        setMessage((prevMessages) => [...prevMessages, newMessage]);
      }
    };

    const handleMessageDeleted = (deletedMessageId) => {
      setMessage((prevMessages) => prevMessages.filter(msg => msg._id !== deletedMessageId));
    };

    const handleMessageLiked = ({ messageId, likes }) => {
      setMessage((prevMessages) => prevMessages.map(msg => 
        msg._id === messageId ? { ...msg, likes } : msg
      ));
    };

    socket.on("newMessage", handleNewMessage);
    socket.on("messageDeleted", handleMessageDeleted);
    socket.on("messageLiked", handleMessageLiked);
    
    return () => {
      socket.off("newMessage", handleNewMessage);
      socket.off("messageDeleted", handleMessageDeleted);
      socket.off("messageLiked", handleMessageLiked);
    };
  }, [socket, selectedConversation?._id, setMessage]);

  useEffect(() => {
    setTimeout(() => {
      lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 50);
  }, [messages]);

  useEffect(() => {
    return () => setSelectedConversation(null);
  }, [setSelectedConversation]);

  useEffect(() => {
    const getMessages = async () => {
      setLoading(true);
      try {
        const get = await axios.get(
          `/api/message/${selectedConversation?._id}`
        );
        const data = await get.data;
        if (data.success === false) {
          setLoading(false);
          console.log(data.message);
        }
        setLoading(false);
        setMessage(data);
      } catch (error) {
        setLoading(false);
        console.log(error);
      }
    };

    if (selectedConversation?._id) getMessages();
  }, [selectedConversation?._id, setMessage]);

  const handelMessages = (e) => {
    setSnedData(e.target.value);
  };

  const handelSubmit = async (e) => {
    e.preventDefault();
    if (!sendData.trim()) return;
    setSending(true);
    try {
      const res = await axios.post(
        `/api/message/send/${selectedConversation?._id}`,
        { message: sendData }
      );
      const data = await res.data;
      if (data.success === false) {
        setSending(false);
        console.log(data.message);
      }
      setSending(false);
      setSnedData("");
      setMessage([...messages, data]);
    } catch (error) {
      setSending(false);
      console.log(error);
    }
  };

  const handleDeleteMessage = async (messageId) => {
    try {
      const res = await axios.delete(`/api/message/single/${messageId}`);
      if (res.data.success) {
        setMessage(messages.filter(msg => msg._id !== messageId));
        toast.success("Message deleted");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to delete message");
    }
  };

  const handleLikeMessage = async (messageId) => {
    try {
      const res = await axios.post(`/api/message/like/${messageId}`);
      if (res.data.success) {
        setMessage(messages.map(msg => 
          msg._id === messageId ? { ...msg, likes: res.data.likes } : msg
        ));
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to like message");
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-gray-900 bg-opacity-30">
      {selectedConversation === null ? (
        <div className="flex flex-col items-center justify-center w-full h-full text-center p-6 glass-panel rounded-2xl m-4 md:m-0">
          <div className="bg-sky-500 bg-opacity-20 p-6 rounded-full mb-6">
            <TiMessages className="text-6xl text-sky-400" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">Welcome, {authUser.username}! 👋</h2>
          <p className="text-gray-400 max-w-md">Select a conversation from the sidebar or search for a new user to start chatting.</p>
        </div>
      ) : (
        <div className="flex flex-col h-full relative">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-gray-900 bg-opacity-60 backdrop-blur-md border-b border-gray-700 border-opacity-40 z-10">
            <div className="flex items-center gap-3">
              <button
                onClick={() => onBackUser(true)}
                className="md:hidden p-2 rounded-full hover:bg-gray-800 text-gray-300 transition-colors"
              >
                <IoArrowBackSharp size={22} />
              </button>
              <div className="relative">
                <img
                  className="rounded-full w-10 h-10 object-cover border border-sky-500 border-opacity-30"
                  src={selectedConversation?.profilepic}
                  alt={selectedConversation?.username}
                />
              </div>
              <div className="flex flex-col">
                <span className="text-white font-semibold">{selectedConversation?.username}</span>
                <span className="text-xs text-sky-400">Online</span>
              </div>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto px-4 py-6 scrollbar space-y-2">
            {loading ? (
              <div className="flex w-full h-full items-center justify-center">
                <span className="loading loading-spinner text-sky-500"></span>
              </div>
            ) : messages?.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full opacity-50">
                <span className="text-4xl mb-3">💬</span>
                <p className="text-gray-300">Say hello to {selectedConversation?.username}!</p>
              </div>
            ) : (
              messages?.map((message) => {
                const isMe = message.senderId === authUser._id;
                const hasLiked = message.likes && message.likes.includes(authUser._id);
                return (
                  <div key={message?._id} ref={lastMessageRef} className={`chat ${isMe ? "chat-end" : "chat-start"} mb-2 group relative`}>
                    <div className="chat-image avatar hidden md:block">
                      <div className="w-8 rounded-full">
                        <img 
                          src={isMe ? authUser.profilepic : selectedConversation.profilepic} 
                          alt="avatar" 
                        />
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end">
                      <div className={`chat-bubble shadow-md text-sm md:text-base relative group-hover:pr-10 transition-all ${
                        isMe 
                          ? "bg-sky-600 text-white" 
                          : "bg-gray-800 text-gray-200"
                      }`}>
                        {message?.message}
                        
                        {/* Actions (Like & Delete) visible on hover */}
                        <div className={`absolute top-1/2 -translate-y-1/2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity ${isMe ? 'right-full mr-2' : 'left-full ml-2'}`}>
                           <button 
                             onClick={() => handleLikeMessage(message._id)}
                             className="p-1.5 rounded-full bg-gray-700 hover:bg-gray-600 text-pink-500 transition-colors"
                             title="Like"
                           >
                             {hasLiked ? <FaHeart size={12} /> : <FaRegHeart size={12} />}
                           </button>
                           {isMe && (
                             <button 
                               onClick={() => handleDeleteMessage(message._id)}
                               className="p-1.5 rounded-full bg-gray-700 hover:bg-red-600 text-red-400 hover:text-white transition-colors"
                               title="Delete"
                             >
                               <FaTrash size={12} />
                             </button>
                           )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 mt-1">
                        <div className="chat-footer text-[10px] opacity-60 text-gray-400">
                          {new Date(message?.createdAt).toLocaleTimeString("en-IN", { hour: "numeric", minute: "numeric" })}
                        </div>
                        {/* Likes Counter Badge */}
                        {message.likes && message.likes.length > 0 && (
                          <div className="flex items-center gap-1 bg-gray-800 px-1.5 py-0.5 rounded-full border border-gray-700">
                            <FaHeart className="text-pink-500" size={10} />
                            <span className="text-[10px] text-gray-300">{message.likes.length}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Input Area */}
          <div className="p-3 md:p-4 bg-gray-900 bg-opacity-60 backdrop-blur-md border-t border-gray-700 border-opacity-40">
            <form onSubmit={handelSubmit} className="flex gap-2">
              <div className="flex-1 relative flex items-center">
                <input
                  value={sendData}
                  onChange={handelMessages}
                  required
                  id="message"
                  type="text"
                  placeholder="Type a message..."
                  className="w-full glass-input rounded-full py-3 px-5 text-sm outline-none pr-12 focus:border-sky-500"
                />
              </div>
              <button 
                type="submit"
                disabled={sending || !sendData.trim()}
                className="bg-sky-500 hover:bg-sky-400 disabled:opacity-50 disabled:bg-gray-700 text-white rounded-full w-12 h-12 flex items-center justify-center transition-all shadow-lg transform hover:scale-105"
              >
                {sending ? (
                  <span className="loading loading-spinner loading-xs"></span>
                ) : (
                  <IoSend size={20} className="ml-1" />
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageContainer;
