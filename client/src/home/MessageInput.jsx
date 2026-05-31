import { useState } from "react";
import axios from "axios";
import { FiSend } from "react-icons/fi";
import { useConversation } from "../zustand/useConversation";
import { toast } from "react-toastify";

const MessageInput = () => {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { messages, setMessages, selectedConversation } = useConversation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message) return;
    
    setLoading(true);
    try {
      const res = await axios.post(`/api/message/send/${selectedConversation._id}`, { message });
      if (res.data.success === false) throw new Error(res.data.message);
      
      setMessages([...messages, res.data]);
      setMessage("");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="px-4 my-3" onSubmit={handleSubmit}>
      <div className="w-full relative">
        <input
          type="text"
          className="border text-sm rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 text-white"
          placeholder="Send a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button type="submit" className="absolute inset-y-0 end-0 flex items-center pe-3 text-white hover:text-blue-400">
          {loading ? <span className="loading loading-spinner"></span> : <FiSend size={20} />}
        </button>
      </div>
    </form>
  );
};

export default MessageInput;
