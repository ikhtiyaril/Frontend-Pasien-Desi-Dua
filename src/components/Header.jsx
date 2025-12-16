import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const [userLog, setUserLog] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setUserLog(!!token);
  }, []);

  return (
    <header className="bg-blue-600">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

        {/* LOGO */}
        <div
          className="text-white text-2xl font-semibold cursor-pointer"
          onClick={() => navigate("/")}
        >
          Desidua
        </div>

        {/* DESKTOP MENU */}
        <div className="hidden md:flex items-center space-x-6">
          <input
            type="text"
            placeholder="Cari Obat"
            className="px-4 py-2 rounded-full w-64 placeholder:text-white border-2 border-white bg-transparent text-white"
          />
          <button onClick={() => navigate("/medicine")} className="text-white">
            Toko Obat
          </button>
          <button onClick={() => navigate("/booking")} className="text-white">
            Booking Online
          </button>
          <button onClick={() => navigate("/article")} className="text-white">
            Blog/Edukasi
          </button>
          <button className="text-white">Layanan</button>
        </div>

        {/* DESKTOP ACTION */}
        <div className="hidden md:flex items-center space-x-4">
          {!userLog ? (
            <button
              className="bg-white text-blue-600 px-4 py-2 rounded-lg"
              onClick={() => navigate("/login")}
            >
              Masuk / Daftar
            </button>
          ) : (
            <button
              className="bg-white text-blue-600 px-4 py-2 rounded-lg"
              onClick={() => navigate("/dashboard")}
            >
              Dashboard User
            </button>
          )}

          <button className="bg-white text-blue-600 px-4 py-2 rounded-lg">
            Download Aplikasi
          </button>
        </div>

        {/* MOBILE HAMBURGER */}
        <button
          className="md:hidden text-white text-3xl"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>
      </div>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div className="md:hidden bg-blue-700 px-6 py-4 space-y-4">
          <input
            type="text"
            placeholder="Cari Obat"
            className="w-full px-4 py-2 rounded-full placeholder:text-white border border-white bg-transparent text-white"
          />

          <button onClick={() => navigate("/medicine")} className="block text-white w-full text-left">
            Toko Obat
          </button>
          <button onClick={() => navigate("/booking")} className="block text-white w-full text-left">
            Booking Online
          </button>
          <button onClick={() => navigate("/article")} className="block text-white w-full text-left">
            Blog/Edukasi
          </button>
          <button className="block text-white w-full text-left">
            Layanan
          </button>

          {!userLog ? (
            <button
              className="w-full bg-white text-blue-600 py-2 rounded-lg"
              onClick={() => navigate("/login")}
            >
              Masuk / Daftar
            </button>
          ) : (
            <button
              className="w-full bg-white text-blue-600 py-2 rounded-lg"
              onClick={() => navigate("/dashboard")}
            >
              Dashboard User
            </button>
          )}

          <button className="w-full bg-white text-blue-600 py-2 rounded-lg">
            Download Aplikasi
          </button>
        </div>
      )}
    </header>
  );
};

export default Header;
