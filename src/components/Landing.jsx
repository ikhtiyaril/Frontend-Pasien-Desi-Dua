import React,{useEffect,useState} from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios'
 

const Landing = () => {
const [userLog, setUserLog] = useState(false);

  const [clinicData,setClinicData] = useState(null)
const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const token = localStorage.getItem("token");
    setUserLog(!!token);

    const fetchClinic = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/clinic-profile`);
        if (res.data) setClinicData(res.data);
      } catch (err) {
        console.error("Failed to fetch clinic data:", err);
      }
    };

    fetchClinic();
  }, []);

  const navigation = useNavigate()
  return (
    <div className="w-full bg-linear-to-b from-blue-600 to-blue-800 text-white">
      
      {/* HERO SECTION */}
      <div className="max-w-7xl mx-auto px-6 py-20 flex flex-col md:flex-row items-center gap-12">
        
        {/* LEFT TEXT */}
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-4">
            
            <span className="text-blue-200">{clinicData?.shortDescription || 'Connected in One App'}</span>
          </h1>

          <p className="text-blue-100 text-base sm:text-lg md:text-xl mb-8">
            {clinicData?.longDescription || `A seamless digital clinic designed for easy consultations, online
            booking, medicine access, and trusted health education.`}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 sm:justify-center md:justify-start">
            <button onClick={()=>navigation('/booking')} className="px-6 py-3 bg-white text-blue-700 font-semibold rounded-xl shadow-md hover:opacity-90 transition">
              Booking Sekarang
            </button>
            <button onClick={()=>navigation('/about-us')} className="px-6 py-3 border border-white text-white font-semibold rounded-xl hover:bg-white hover:text-blue-700 transition">
              Siapa Kami?
            </button>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex-1 relative hidden md:flex justify-center">
          {/* Desktop floating cards */}
          <div className="bg-white text-blue-800 w-64 p-4 rounded-2xl shadow-xl absolute -top-6 -right-2 rotate-3">
            <p className="font-semibold">Live Consultation</p>
            <p className="text-sm opacity-70">
              Video call with certified doctors
            </p>
          </div>

          <div className="bg-white text-blue-800 w-64 p-4 rounded-2xl shadow-xl absolute bottom-0 right-10 -rotate-3">
            <p className="font-semibold">Booking Online</p>
            <p className="text-sm opacity-70">
              Real-time doctor schedules
            </p>
          </div>

          <div className="bg-white text-blue-800 w-64 p-4 rounded-2xl shadow-xl absolute top-16 left-2 rotate-6">
            <p className="font-semibold">Drug Marketplace</p>
            <p className="text-sm opacity-70">
              Trusted medical shopping
            </p>
          </div>

          <div className="bg-white text-blue-800 w-64 p-4 rounded-2xl shadow-xl absolute bottom-12 -left-6 -rotate-6">
            <p className="font-semibold">Get Education</p>
            <p className="text-sm opacity-70">
              Daily health insights
            </p>
          </div>
        </div>

      
      </div>

      {/* FEATURES SECTION */}
      <div className="bg-white text-blue-900 py-16">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {[
            ["Live Consultation", "Video call langsung dengan dokter pilihan Anda.","/booking"],
            ["Booking Online", "Jadwal dokter real-time dan proses booking cepat.","/booking"],
            ["Drug Marketplace", "Akses obat terpercaya dengan pengiriman cepat.","/medicine"],
            ["Get Education", "Artikel edukasi kesehatan terbaru setiap hari.","/article"],
          ].map(([title, desc,link]) => (
            <div
              key={title}
              onClick={()=>navigation(link)}
              className="p-6 rounded-2xl shadow-md border hover:shadow-lg transition"
            >
              <h3 className="text-xl font-bold">{title}</h3>
              <p className="text-sm mt-2 text-gray-600">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Landing;
