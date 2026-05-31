import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useConversation } from "../zustand/useConversation";
import MessageInput from "./MessageInput";
import { useAuth } from "../zustand/useAuth";

const MessageContainer = () => {
  const { selectedConversation, setSelectedConversation, messages, setMessages } = useConversation();
  const { authUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const lastMessageRef = useRef();

  useEffect(() => {
    // Unmount cleanup
    return () => setSelectedConversation(null);
  }, [setSelectedConversation]);

  useEffect(() => {
    const getMessages = async () => {
      if (!selectedConversation) return;
      setLoading(true);
      try {
        const res = await axios.get(`/api/message/${selectedConversation._id}`);
        if (res.data.success === false) throw new Error(res.data.message);
        setMessages(res.data);
      } catch (error) {
        console.error(error.message);
      } finally {
        setLoading(false);
      }
    };
    getMessages();
  }, [selectedConversation, setMessages]);

  useEffect(() => {
    setTimeout(() => {
      lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }, [messages]);

  if (!selectedConversation) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <div className="px-4 text-center sm:text-lg md:text-xl text-gray-200 font-semibold flex flex-col items-center gap-2">
          <p>Welcome 👋 {authUser?.username} ❄</p>
          <p>Select a chat to start messaging</p>
        </div>
      </div>
    );
  }

  return (
    <div className="md:min-w-[450px] flex flex-col h-full w-full">
      {/* Header */}
      <div className="bg-gray-800 px-4 py-2 mb-2">
        <span className="label-text text-gray-400">To:</span> <span className="text-white font-bold">{selectedConversation.username}</span>
      </div>

      <div className="flex-1 overflow-auto px-4">
        {loading && <div className="text-center mt-4"><span className="loading loading-spinner"></span></div>}
        
        {!loading && messages.length === 0 && (
          <p className="text-center text-gray-300 mt-4">Send a message to start the conversation</p>
        )}

        {!loading && messages.length > 0 && messages.map((message) => {
          const fromMe = message.senderId === authUser._id;
          const chatClassName = fromMe ? "chat-end" : "chat-start";
          const bubbleBgColor = fromMe ? "bg-blue-500" : "bg-gray-700";
          const profilePic = fromMe ? authUser.profilePic : selectedConversation.profilePic;

          return (
            <div key={message._id} className={`chat ${chatClassName}`} ref={lastMessageRef}>
              <div className="chat-image avatar">
                <div className="w-10 rounded-full">
                  <img alt="avatar" src={profilePic || "https://avatar.iran.liara.run/public"} />
                </div>
              </div>
              <div className={`chat-bubble text-white ${bubbleBgColor} pb-2`}>
                {message.message}
              </div>
            </div>
          );
        })}
      </div>

      <MessageInput />
    </div>
  );
};

export default MessageContainer;
