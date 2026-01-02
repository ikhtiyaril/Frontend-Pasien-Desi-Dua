// src/pages/VerifyEmail.jsx
import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Footer from "@/components/Footer";
import Header from "@/components/Header";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("loading"); // loading, success, error
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = searchParams.get("token");
    const email = searchParams.get("email");

    if (!token || !email) {
      setStatus("error");
      setMessage("Token atau email tidak ditemukan");
      return;
    }

    const verifyEmail = async () => {
      try {
        const res = await axios.get(
          `${API_URL}/api/user/register/verify?token=${token}&email=${encodeURIComponent(email)}`
        );

        if (res.data.success) {
          setStatus("success");
          setMessage(res.data.message);

          // redirect ke dashboard setelah 3 detik
          setTimeout(() => {
            navigate("/dashboard");
          }, 3000);
        } else {
          setStatus("error");
          setMessage(res.data.message || "Verifikasi gagal");
        }
      } catch (err) {
        setStatus("error");
        setMessage(err.response?.data?.message || "Terjadi kesalahan server");
      }
    };

    verifyEmail();
  }, [searchParams, navigate]);

  return (
    <>
    <Header/>
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-xl shadow-md max-w-md w-full text-center">
        {status === "loading" && (
          <div>
            <h2 className="text-2xl font-semibold mb-4 text-gray-700">
              Memverifikasi akun...
            </h2>
            <p className="text-gray-500">Mohon tunggu sebentar</p>
          </div>
        )}

        {status === "success" && (
          <div>
            <h2 className="text-2xl font-semibold mb-4 text-green-600">
              {message}
            </h2>
            <p className="text-gray-500">
              Kamu akan diarahkan ke dashboard dalam beberapa detik...
            </p>
          </div>
        )}

        {status === "error" && (
          <div>
            <h2 className="text-2xl font-semibold mb-4 text-red-600">
              {message}
            </h2>
            <p className="text-gray-500">
              Cek kembali link verifikasi atau minta email verifikasi ulang
            </p>
          </div>
        )}
      </div>
    </div>
    <Footer/>
    </>
  );
}
