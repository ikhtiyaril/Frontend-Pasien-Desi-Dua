import React from 'react';
import { useNavigate } from 'react-router-dom';

const Header = () => {

  const navigation = useNavigate()

  return (
    <header className="bg-blue-600 py-4">
        
      <div className="flex justify-start items-center px-4">
        {/* Logo */}
        <div className="text-white text-2xl font-semibold" onClick={()=>navigation("/")}>Desi Dua</div>
<div className="max-w-7xl mx-auto flex justify-evenly items-center px-4 gap-5">
        {/* Search Bar */}
        <div className="flex items-center space-x-4">
          <input
            type="text"
            placeholder="Cari Obat"
            className="px-4 py-2 rounded-full w-64 placeholder:text-white border-2 border-white"
          />
          <button className="text-white font-medium">Toko Obat</button>
          <button className="text-white font-medium">Booking Online</button>
          <button className="text-white font-medium">Blog/Edukasi</button>
          <button className="text-white font-medium">Layanan</button>
         
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-4">
          <button className="bg-white text-blue-500 px-4 py-2 rounded-lg" onClick={()=>navigation('/login')}>Masuk / Daftar</button>
          <button className="bg-white text-blue-500 px-4 py-2 rounded-lg">Download Aplikasi</button>
        </div>
      </div>
      </div>
    </header>
  );
};

export default Header;
