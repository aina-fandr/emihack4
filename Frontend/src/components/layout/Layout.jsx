import { useState } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

export default function Layout({ children, currentTab, setCurrentTab }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="h-screen w-screen bg-[#0f172a] text-white font-sans overflow-hidden select-none relative">
      <Navbar 
        currentTab={currentTab} 
        setCurrentTab={setCurrentTab}
        setSidebarOpen={setSidebarOpen}
      />
      <Sidebar isOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <main className="h-full w-full">
        {children}
      </main>
    </div>
  );
}