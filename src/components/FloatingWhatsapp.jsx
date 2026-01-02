import { useEffect, useState } from "react";
import axios from "axios";
import { FaWhatsapp } from "react-icons/fa";

const API_URL = import.meta.env.VITE_API_URL;

export default function FloatingWhatsapp() {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClinicProfile = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/clinic-profile`);
        const clinicPhone = res.data?.contact?.phone || "";
        setPhone(clinicPhone);
      } catch (error) {
        console.error("Gagal ambil nomor WhatsApp:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchClinicProfile();
  }, []);

  if (loading || !phone) return null;

  const message = "Halo admin, saya ingin bertanya tentang layanan klinik";
  const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(
    message
  )}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 group"
    >
      <div className="flex items-center gap-3 bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-full shadow-lg transition-all duration-300">
        <FaWhatsapp size={26} />
        <span className="hidden md:block font-medium">
          Chat WhatsApp
        </span>
      </div>

      {/* glow / pulse */}
      <span className="absolute -inset-1 rounded-full bg-green-500 opacity-30 blur-lg animate-pulse -z-10"></span>
    </a>
  );
}
