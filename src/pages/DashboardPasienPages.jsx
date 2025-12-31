import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import BookingDashboard from "../components/BookingDashboard";
import OrdersDashboard from "@/components/OrdersDashboard";
import Cart from "../components/Cart";
import { CalendarCheck, ClipboardList, ShoppingCart } from "lucide-react";
import { useLocation } from "react-router-dom";

export default function DashboardPasienPages() {
  const location = useLocation()
  const {active} = location.state || {}
  const menu = [
    { key: "booking", label: "Booking", icon: CalendarCheck },
    { key: "orders", label: "Orders", icon: ClipboardList },
    { key: "cart", label: "Cart", icon: ShoppingCart },
  ];

  const [activeMenu, setActiveMenu] = useState("booking");
  useEffect(() => {
  if (active) {
    setActiveMenu(active)
  }
}, [active])
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
        {/* SIDEBAR DESKTOP */}
        <aside className="hidden md:block w-64 bg-white shadow-md p-4 border-r">
          <h2 className="text-xl font-bold mb-4">Dashboard</h2>

          <ul className="space-y-2">
            {menu.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.key}>
                  <button
                    onClick={() => setActiveMenu(item.key)}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg transition ${
                      activeMenu === item.key
                        ? "bg-blue-600 text-white"
                        : "hover:bg-blue-100"
                    }`}
                  >
                    <Icon size={20} />
                    <span>{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </aside>

        {/* CONTENT */}
        <main className="flex-1 p-4 md:p-6 pb-20 md:pb-6">
          {renderContent()}
        </main>
      </div>

      {/* MOBILE BOTTOM NAV (ICON ONLY) */}
      <nav className="fixed bottom-0 left-0 right-0 md:hidden bg-white border-t shadow flex justify-around py-2">
        {menu.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.key}
              onClick={() => setActiveMenu(item.key)}
              className={`flex flex-col items-center justify-center p-2 rounded ${
                activeMenu === item.key
                  ? "text-blue-600"
                  : "text-gray-500"
              }`}
            >
              <Icon size={22} />
            </button>
          );
        })}
      </nav>
    </>
  );
}
