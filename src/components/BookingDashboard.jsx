import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import FloatingPayment from "./FloatingPayment";

export default function BookingDashboard() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState("offline");
  const [page, setPage] = useState(1);
  const [payment,setPayment] = useState(null)
  const ITEMS_PER_PAGE = 7;

  const API = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");
  const navigation = useNavigate();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await axios.get(`${API}/api/booking/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBookings(res.data.data || []);
      } catch (err) {
        console.error("Error fetch bookings:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  


  // 🔹 HANDLE JOIN TELEMEDICINE
  const handleJoin = async (booking_id) => {
    try {
      const res = await axios.get(`${API}/api/call/${booking_id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const tokenRoom = res.data.token;
      navigation("/video-call", { state: { tokenRoom } });
    } catch (err) {
      console.log(err);
    }
  };

   const handlePay = async (id) => {
    try {
    const token = await localStorage.getItem("token");

      const res = await axios.get(`${API}/api/payment/session`, {
        params: { type: "booking", id },
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("HANDLE PAY ONCLICK")
console.log(res.data)
      setPayment(res.data.session.session_data);
    } catch (err) {
      console.log("Payment error:", err);
    }
  };
  // FILTER: Offline / Live
  const filteredBookings =
    activeTab === "offline"
      ? bookings.filter((b) => !b.Service?.is_live)
      : bookings.filter((b) => b.Service?.is_live);

  const totalPages = Math.ceil(filteredBookings.length / ITEMS_PER_PAGE);
  const paginatedData = filteredBookings.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  const statusBadge = (status) => {
    const base = "px-3 py-1 text-xs rounded-full font-medium";

    switch (status) {
      case "pending":
        return `${base} bg-yellow-100 text-yellow-700`;
      case "confirmed":
        return `${base} bg-green-100 text-green-700`;
      case "cancelled":
        return `${base} bg-red-100 text-red-700`;
      case "completed":
        return `${base} bg-blue-100 text-blue-700`;
      default:
        return `${base} bg-gray-100 text-gray-600`;
    }
  };

  if (loading)
    return (
      <div className="w-full flex justify-center items-center py-10 text-gray-500">
        Loading bookings…
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-4">
      <h2 className="text-xl font-semibold">Riwayat Booking</h2>

      {/* TABS */}
      <div className="flex gap-3 mb-4">
        <button
          className={`px-4 py-2 rounded-lg font-medium transition ${
            activeTab === "offline"
              ? "bg-blue-600 text-white"
              : "bg-white border text-gray-700 hover:bg-gray-100"
          }`}
          onClick={() => {
            setActiveTab("offline");
            setPage(1);
          }}
        >
          Offline Booking
        </button>

        <button
          className={`px-4 py-2 rounded-lg font-medium transition ${
            activeTab === "live"
              ? "bg-blue-600 text-white"
              : "bg-white border text-gray-700 hover:bg-gray-100"
          }`}
          onClick={() => {
            setActiveTab("live");
            setPage(1);
          }}
        >
          Telemedicine
        </button>
      </div>

      {/* KOSONG */}
      {paginatedData.length === 0 ? (
        <div className="text-center text-gray-500 py-10">
          Belum ada booking di kategori ini.
        </div>
      ) : (
        paginatedData.map((b) => (
          <div
            key={b.id}
            className="border rounded-lg p-4 bg-white shadow-sm flex flex-col md:flex-row justify-between"
          >
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-semibold">{b.Service?.name}</h3>
                <span className={statusBadge(b.status)}>{b.status}</span>
              </div>

              <p className="text-sm text-gray-500 mt-1">
                Dibuat: {new Date(b.createdAt).toLocaleString()}
              </p>

              <div className="mt-2 text-sm text-gray-600 space-y-1">
                <p>
                  <strong>Dokter:</strong>{" "}
                  {b.Doctor ? b.Doctor.name : "— Tidak butuh dokter"}
                </p>

                {b.time_start && (
                  <p>
                    <strong>Jadwal:</strong> {b.time_start} - {b.time_end}
                  </p>
                )}

                <p>
                  <strong>Harga:</strong>{" "}
                  {b.Service?.price
                    ? `Rp ${b.Service.price.toLocaleString("id-ID")}`
                    : "-"}
                </p>
              </div>
            </div>

            {/* BUTTON GROUP */}
            <div className="mt-4 md:mt-0 flex flex-col md:flex-row items-center gap-2 w-full md:w-auto">

              
              {b.status === "pending" && (
                <button
                  onClick={()=>handlePay(b.id)}
                  className="px-3 py-2 text-sm border rounded hover:bg-gray-50 w-full md:w-auto"
                >
                  Bayar
                </button>
              )}

              {/* JOIN TELEMEDICINE */}
              {b.Service?.is_live && b.payment_status === 'PAID' && b.status === 'confirmed' && (
                <button
                  onClick={() => handleJoin(b.id)}
                  className="
                    px-4 py-2 bg-indigo-600 w-full md:w-auto text-center text-white rounded-lg hover:bg-indigo-700 text-sm
                  "
                >
                  Join Telemedicine
                </button>
              )}
            </div>
          </div>
        ))
      )}

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className={`px-3 py-1 border rounded ${
              page === 1
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-gray-100"
            }`}
          >
            Prev
          </button>

          <span className="px-3 py-1 text-gray-700 font-semibold">
            Page {page} / {totalPages}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            className={`px-3 py-1 border rounded ${
              page === totalPages
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-gray-100"
            }`}
          >
            Next
          </button>
        </div>
      )}

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
