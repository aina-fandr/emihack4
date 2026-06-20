import { useState } from 'react';

export default function SearchBar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="transition-all duration-300">
      {!isOpen ? (
        <button 
          onClick={() => setIsOpen(true)}
          className="bg-black/80 backdrop-blur-md hover:bg-slate-800 p-4 rounded-2xl shadow-2xl border border-slate-700 flex items-center justify-center transition transform hover:scale-105"
        >
          <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
      ) : (
        <div className="bg-black/80 backdrop-blur-md rounded-2xl px-4 py-3 shadow-2xl border border-slate-700 flex items-center gap-3 w-80 md:w-96 animate-fade-in">
          <svg onClick={() => setIsOpen(false)} className="w-5 h-5 text-blue-400 cursor-pointer" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input 
            type="text" 
            placeholder="Commencer à chercher..." 
            className="w-full bg-transparent text-sm font-medium text-white placeholder-slate-400 focus:outline-none"
            autoFocus
          />
        </div>
      )}
    </div>
  );
}