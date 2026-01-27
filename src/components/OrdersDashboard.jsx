import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import FloatingPayment from "./FloatingPayment";

/**
 * Props:
 * - optional: initialFetch (boolean) => true by default
 * - optional: pageSize (number) => if later mau paginate
 */
export default function OrdersDashboard({ initialFetch = true, pageSize = 20 }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(initialFetch);
  const [error, setError] = useState("");
  const [payment, setPayment] = useState(null)
  const API = import.meta.env.VITE_API_URL; // contoh: "http://localhost:5000/api"

  useEffect(() => {
    if (!initialFetch) return;
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token"); // pastikan token disimpan saat login
      const res = await axios.get(`${API}/api/orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data && res.data.orders) {
        setOrders(res.data.orders);
      } else {
        setOrders([]);
      }
    } catch (err) {
      console.error(err);
      setError("Gagal mengambil daftar order. Coba reload halaman.");
    } finally {
      setLoading(false);
    }
  };
const handlePay = async(id)=>{
    const token = await localStorage.getItem('token')
    console.log("TESTING")
    console.log(token,id)
    const response = await axios.get(
  `${API}/api/payment/session`,
  {
    params: { type: "order", id },
    headers: { Authorization: `Bearer ${token}` }
  }
);
 console.log(response.data)
setPayment(response.data.session.session_data.data);


  }
  
  const formatCurrency = (value) => {
    try {
      // safe convert decimal string -> number
      const num = Number(value);
      return num.toLocaleString("id-ID", { style: "currency", currency: "IDR" });
    } catch {
      return value;
    }
  };

  const statusBadge = (status) => {
    const base = "px-3 py-1 rounded-full text-sm font-medium";
    switch (status) {
      case "pending":
        return `${base} bg-yellow-100 text-yellow-800`;
      case "paid":
        return `${base} bg-blue-100 text-blue-800`;
      case "cancelled":
        return `${base} bg-red-100 text-red-800`;
      case "delivered":
        return `${base} bg-green-100 text-green-800`;
      default:
        return `${base} bg-gray-100 text-gray-800`;
    }
  };

  if (loading) {
    return (
      <div className="w-full flex justify-center items-center py-12">
        <div className="text-gray-500">Loading orders…</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded">
          {error}
        </div>
        <div className="mt-3">
          <button
            onClick={fetchOrders}
            className="px-4 py-2 bg-gray-800 text-white rounded hover:opacity-90"
          >
            Coba lagi
          </button>
        </div>
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center">
        <div className="text-gray-500 mb-4">Belum ada order.</div>
        <Link to="/shop" className="inline-block px-4 py-2 bg-indigo-600 text-white rounded">
          Mulai belanja
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Riwayat Order</h2>
        <button
          onClick={fetchOrders}
          className="text-sm px-3 py-1 bg-gray-100 rounded hover:bg-gray-200"
        >
          Refresh
        </button>
      </div>

      <div className="space-y-3">
        {orders.map((order) => (
          <div
            key={order.id}
            className="border rounded-lg p-4 flex flex-col md:flex-row md:items-center md:justify-between bg-white shadow-sm"
          >
            <div className="flex-1">
              <div className="flex items-start gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="font-medium">Order #{order.id}</h3>
                    <span className={statusBadge(order.status)}>{order.status}</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    Dibuat: {new Date(order.createdAt).toLocaleString()}
                  </p>
                </div>

                <div className="text-right">
                  <div className="text-sm text-gray-500">Total</div>
                  <div className="text-lg font-semibold">
                    {formatCurrency(order.total_price)}
                  </div>
                </div>
              </div>

              {/* Ringkasan item (1-2 item preview) */}
              <div className="mt-3">
                <div className="text-sm text-gray-600">
                  {order.items && order.items.length > 0 ? (
                    <>
                      <span className="font-medium">{order.items.length}</span> item •{" "}
                      <span>{order.items.slice(0, 2).map(i => i.product?.name || "Produk").join(", ")}
                        {order.items.length > 2 ? ` +${order.items.length - 2} lainnya` : ""}
                      </span>
                    </>
                  ) : (
                    <span className="text-gray-400">Tidak ada item tercatat</span>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-4 md:mt-0 md:ml-4 flex items-center gap-2">
              
              {order.status === "pending" && (
                <button
                  onClick={() => handlePay(order.id)}
                  className="px-3 py-2 text-sm border rounded hover:bg-gray-50"
                >
                  Bayar
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
      {payment && (
               <FloatingPayment
                        payment={payment}
                        onClose={() => setPayment(null)}
                      />
            )
      
            }
    </div>
  );
}
