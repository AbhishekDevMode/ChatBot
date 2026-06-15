import React, { useEffect, useState } from 'react';
import Sidebar from './components/Sidebar';
import MessageContainer from './components/MessageContainer';

const Home = () => {

  const [selectedUser , setSelectedUser] = useState(null);
  const [isSidebarVisible , setIsSidebarVisible]= useState(true);

  const handelUserSelect=(user)=>{
    setSelectedUser(user);
    setIsSidebarVisible(false);
  }
  const handelShowSidebar=()=>{
    setIsSidebarVisible(true);
    setSelectedUser(null);
  }

  return (
    <div className='flex justify-between w-[95%] md:w-full md:max-w-5xl h-[95vh] md:h-[85vh] rounded-2xl glass-panel overflow-hidden mx-auto my-auto'>
      <div className={`w-full md:w-1/3 py-2 px-2 flex flex-col ${isSidebarVisible ? '' : 'hidden md:flex'}`}>
        <Sidebar onSelectUser={handelUserSelect}/>
      </div>
      
      <div className={`divider divider-horizontal mx-0 w-[1px] bg-gray-700 opacity-30 md:flex ${isSidebarVisible ? '' : 'hidden'} ${selectedUser ? 'block' : 'hidden'}`}></div>
      
      <div className={`flex-auto ${selectedUser ? '' : 'hidden md:flex'} bg-gray-900 bg-opacity-40 backdrop-blur-md relative`}>
        <MessageContainer onBackUser={handelShowSidebar}/>
      </div>
    </div>
  );
};

export default Home;
