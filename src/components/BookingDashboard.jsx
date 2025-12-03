import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function BookingDashboard() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const API = import.meta.env.VITE_API_URL;

  const token = localStorage.getItem("token"); // atau sesuaikan env Anda
const navigation = useNavigate()
  useEffect(() => {
   console.log( `${API}/api/booking/me`)
    const fetchBookings = async () => {
      try {
        const res = await axios.get(`${API}/api/booking/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setBookings(res.data.data);
      } catch (err) {
        console.error("Error fetch bookings:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

const handleJoin = async (booking_id)=> {
    console.log(booking_id)
    const res = await axios.get(`${API}/api/call/${booking_id}`,{
        headers : {
            Authorization : `Bearer ${token}`
        }
    })
    const tokenRoom = res.token
    navigation('/video-call',{tokenRoom})
}

  if (loading)
    return (
      <div className="p-4 text-center text-gray-600 animate-pulse">
        Loading your bookings...
      </div>
    );

  if (!bookings)
    return (
      <div className="p-6 text-center text-gray-500">
        Kamu belum punya pesanan, masih kosong kayak dompet akhir bulan.
      </div>
    );

  return (
    <div className="p-5 max-w-2xl mx-auto space-y-4">
      <h1 className="text-xl font-bold mb-4">Your Bookings</h1>

      {bookings.map((b) => (
        <div
          key={b.id}
          className="border border-gray-200 shadow-sm rounded-xl p-4 bg-white hover:shadow-md transition"
        >
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">{b.Service?.name}</h2>
            <span
              className={`px-3 py-1 text-sm rounded-full ${
                b.status === "confirmed"
                  ? "bg-green-100 text-green-600"
                  : b.status === "pending"
                  ? "bg-yellow-100 text-yellow-700"
                  : b.status === "cancelled"
                  ? "bg-red-100 text-red-600"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {b.status}
            </span>
           
          </div>

          <div className="mt-2 text-sm text-gray-600 space-y-1">
            <p>
              <strong>Doctor:</strong>{" "}
              {b.Doctor ? b.Doctor.name : "— Tidak butuh dokter"}
            </p>

            {b.time_start && (
              <p>
                <strong>Schedule:</strong>{" "}
                {(b.time_start)} -{" "}
                {(b.time_end)}
              </p>
            )}

            <p>
              <strong>Price:</strong>{" "}
              {b.Service?.price ? `Rp ${b.Service.price}` : "-"}
            </p>
          </div>

           {b.Service.is_live &&(
                <button onClick={()=>handleJoin(b.id)} className="bg-blue-500 text-white rounded-lg inline-block p-1 px-4 text-lg">
                    <p>Join</p>
                    </button>
            )
            }
        </div>
        
      ))}
      
    </div>
  );
}
