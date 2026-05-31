import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "../zustand/useAuth";
import { useConversation } from "../zustand/useConversation";
import { FiLogOut, FiSearch } from "react-icons/fi";

const Sidebar = () => {
  const [search, setSearch] = useState("");
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const { setAuthUser } = useAuth();
  const { selectedConversation, setSelectedConversation } = useConversation();

  useEffect(() => {
    const getConversations = async () => {
      setLoading(true);
      try {
        const res = await axios.get("/api/user/currentchatters");
        if (res.data.success === false) {
          toast.error(res.data.message);
        } else {
          setConversations(res.data);
        }
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };
    getConversations();
  }, []);

  const handleLogout = async () => {
    try {
      const res = await axios.post("/api/auth/logout");
      if (res.data.success === false) {
        toast.error(res.data.message);
        return;
      }
      localStorage.removeItem("chatapp");
      setAuthUser(null);
      setSelectedConversation(null);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!search) return;
    try {
      const res = await axios.get(`/api/user/search?search=${search}`);
      if (res.data.length > 0) {
        setConversations(res.data);
      } else {
        toast.info("No user found");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="border-r border-gray-500 p-4 flex flex-col w-64">
      <form onSubmit={handleSearch} className="flex items-center gap-2">
        <input 
          type="text" 
          placeholder="Search..." 
          className="input input-bordered rounded-full w-full" 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button type="submit" className="btn btn-circle bg-gray-900 text-white hover:bg-gray-700">
          <FiSearch size={20} />
        </button>
      </form>
      <div className="divider px-3"></div>
      
      <div className="flex-1 overflow-auto">
        {loading ? (
          <span className="loading loading-spinner mx-auto"></span>
        ) : (
          conversations.map((c) => (
            <div 
              key={c._id} 
              className={`flex gap-2 items-center hover:bg-gray-700 rounded p-2 py-1 cursor-pointer
                ${selectedConversation?._id === c._id ? "bg-gray-800 text-white" : "text-gray-200"}
              `}
              onClick={() => setSelectedConversation(c)}
            >
              <div className="avatar online">
                <div className="w-12 rounded-full">
                  <img src={c.profilePic || "https://avatar.iran.liara.run/public"} alt="user avatar" />
                </div>
              </div>
              <div className="flex flex-col flex-1">
                <div className="flex gap-3 justify-between">
                  <p className="font-bold text-gray-200">{c.username}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="mt-auto">
        <button className="flex items-center gap-2 text-white hover:text-red-500 mt-2" onClick={handleLogout}>
          <FiLogOut size={24} /> Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
