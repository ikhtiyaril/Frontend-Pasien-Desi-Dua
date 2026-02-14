import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import FloatingPayment from "./FloatingPayment";

export default function OrdersDashboard({ initialFetch = true }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(initialFetch);
  const [error, setError] = useState("");
  const [payment, setPayment] = useState(null);
  const [expandedId, setExpandedId] = useState(null); // Untuk accordion detail

  const API = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (initialFetch) fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API}/api/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(res.data?.orders || []);
    } catch (err) {
      setError("Gagal mengambil daftar order.");
    } finally {
      setLoading(false);
    }
  };

  const handlePay = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API}/api/payment/session`, {
        params: { type: "order", id },
        headers: { Authorization: `Bearer ${token}` },
      });
      setPayment(response.data.session.session_data.data);
    } catch (err) {
      alert("Gagal memproses pembayaran");
    }
  };

  const formatCurrency = (v) => 
    new Number(v).toLocaleString("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 });

  // Badge untuk Status Logistik
  const statusBadge = (status) => {
    const config = {
      pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
      processing: "bg-blue-100 text-blue-700 border-blue-200",
      delivered: "bg-indigo-100 text-indigo-700 border-indigo-200",
      completed: "bg-green-100 text-green-700 border-green-200",
      cancelled: "bg-red-100 text-red-700 border-red-200",
    };
    return `px-2.5 py-0.5 rounded-full text-xs font-semibold border ${config[status] || "bg-gray-100"}`;
  };

  // Badge untuk Status Pembayaran
  const paymentBadge = (status) => {
    const config = {
      PAID: "text-green-600 bg-green-50",
      UNPAID: "text-orange-600 bg-orange-50",
      EXPIRED: "text-gray-500 bg-gray-50",
      FAILED: "text-red-600 bg-red-50",
    };
    return `text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded ${config[status] || ""}`;
  };

  if (loading) return <div className="p-10 text-center text-gray-400">Memuat pesanan...</div>;

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Riwayat Pesanan</h1>
          <p className="text-sm text-gray-500">Pantau status pengiriman dan pembayaran Anda</p>
        </div>
        <button onClick={fetchOrders} className="p-2 bg-white border rounded-lg hover:shadow-sm transition">
          🔄
        </button>
      </div>

      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            {/* --- HEADER CARD --- */}
            <div className="p-4 flex flex-wrap items-center justify-between gap-4 border-b border-gray-50">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-mono font-bold text-indigo-600">{order.order_code}</span>
                  <span className={statusBadge(order.status)}>{order.status}</span>
                </div>
                <p className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleDateString('id-ID', { dateStyle: 'long' })}</p>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-xs text-gray-400 uppercase">Total Tagihan</p>
                  <p className="font-bold text-gray-800">{formatCurrency(order.total_price)}</p>
                </div>
                <button 
                  onClick={() => setExpandedId(expandedId === order.id ? null : order.id)}
                  className="text-gray-400 hover:text-gray-600 p-1"
                >
                  {expandedId === order.id ? "▲" : "▼"}
                </button>
              </div>
            </div>

            {/* --- QUICK INFO (Visible) --- */}
            <div className="px-4 py-3 bg-white flex flex-col md:flex-row md:items-center justify-between gap-3">
               <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="font-medium">💳 Pembayaran:</span>
                  <span className={paymentBadge(order.payment_status)}>{order.payment_status}</span>
                  <span className="text-gray-300">|</span>
                  <span className="font-medium">📦 Kurir:</span>
                  <span className="capitalize">{order.ekspedition || '-'}</span>
               </div>
               
               {order.payment_status === "UNPAID" && order.status === "pending" && (
                 <button
                   onClick={() => handlePay(order.id)}
                   className="bg-indigo-600 text-white px-6 py-1.5 rounded-lg text-sm font-medium hover:bg-indigo-700 transition"
                 >
                   Bayar Sekarang
                 </button>
               )}
            </div>

            {/* --- EXPANDED DETAILS --- */}
            {expandedId === order.id && (
              <div className="p-4 bg-gray-50 border-t border-gray-100 grid grid-cols-1 md:grid-cols-3 gap-6 animate-fadeIn">
                
                {/* 1. Produk */}
                <div className="md:col-span-1">
                  <h4 className="text-xs font-bold uppercase text-gray-400 mb-2">Item Pesanan</h4>
                  <div className="space-y-2">
                    {order.items?.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-sm">
                        <span className="text-gray-700">{item.product?.name} <small className="text-gray-400">x{item.quantity}</small></span>
                        <span className="font-medium">{formatCurrency(item.price)}</span>
                      </div>
                    ))}
                    <div className="border-t pt-2 mt-2 flex justify-between text-sm font-bold text-gray-800">
                      <span>Ongkos Kirim</span>
                      <span>{formatCurrency(order.shipping_cost || 0)}</span>
                    </div>
                  </div>
                </div>

                {/* 2. Pengiriman & Resi */}
                <div>
                  <h4 className="text-xs font-bold uppercase text-gray-400 mb-2">Informasi Pengiriman</h4>
                  <div className="bg-white p-3 rounded-lg border border-gray-200 text-sm space-y-2">
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase">No. Resi</p>
                      <p className="font-mono font-bold text-indigo-600">{order.no_resi || "Belum tersedia"}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase">Metode Pembayaran</p>
                      <p className="font-medium uppercase">{order.payment_method || "Belum dipilih"}</p>
                    </div>
                  </div>
                </div>

                {/* 3. Alamat Lengkap */}
                <div>
                  <h4 className="text-xs font-bold uppercase text-gray-400 mb-2">Alamat Tujuan</h4>
                  <div className="text-sm text-gray-600 leading-relaxed">
                    <p className="font-bold text-gray-800 mb-1">{order.user?.name || 'Penerima'}</p>
                    <p>{order.address_detail}</p>
                    <p>{order.village}, {order.district}</p>
                    <p>{order.regency}, {order.province}</p>
                  </div>
                </div>

              </div>
            )}
          </div>
        ))}
      </div>

      {payment && <FloatingPayment payment={payment} onClose={() => setPayment(null)} />}
    </div>
  );
}