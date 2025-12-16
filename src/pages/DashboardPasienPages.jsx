import React, { useState } from "react";
import Header from "../components/Header";
import BookingDashboard from "../components/BookingDashboard";
import OrdersDashboard from "@/components/OrdersDashboard";
import Cart from "../components/Cart";

export default function DashboardPasienPages() {
  // MENU FLEXIBLE ✨ — tinggal tambah di sini
  const menu = [
    { key: "booking", label: "Booking Saya" },
    { key: "orders", label: "Riwayat Order" },
    {key:"cart", label:"Keranjang"}
    // nanti tinggal tambah:
    // { key: "profile", label: "Profil" },
    // { key: "payments", label: "Pembayaran" },
  ];

  const [activeMenu, setActiveMenu] = useState("booking");

  const renderContent = () => {
    switch (activeMenu) {
      case "booking":
        return <BookingDashboard />;
      case "orders":
        return <OrdersDashboard />;
         case "cart":
        return <Cart/>;
      default:
        return <div className="p-6">Menu tidak ditemukan.</div>;
    }
  };

  return (
    <>
      <Header />

      <div className="flex min-h-screen bg-gray-100">
        {/* SIDEBAR */}
        <div className="w-64 bg-white shadow-md p-4 border-r">
          <h2 className="text-xl font-bold mb-4">Dashboard Pasien</h2>

          <ul className="space-y-2">
            {menu.map((item) => (
              <li key={item.key}>
                <button
                  onClick={() => setActiveMenu(item.key)}
                  className={`w-full text-left p-3 rounded-lg transition ${
                    activeMenu === item.key
                      ? "bg-blue-600 text-white"
                      : "hover:bg-blue-100"
                  }`}
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* CONTENT */}
        <div className="flex-1 p-6">{renderContent()}</div>
      </div>
    </>
  );
}
