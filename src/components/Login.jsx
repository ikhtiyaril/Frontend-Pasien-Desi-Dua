import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Mail, Lock, AlertCircle, Clock, LogIn, Chrome } from "lucide-react";

const Login = () => {
  const [params] = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [lockUntil, setLockUntil] = useState(
    Number(localStorage.getItem("lock_until")) || null
  );
  const [remaining, setRemaining] = useState(0);

  // GOOGLE LOGIN CALLBACK
  useEffect(() => {
    const token = params.get("token");
    if (token) {
      localStorage.setItem("token", token);
      window.history.replaceState({}, "", "/login");
      window.location.href = "/";
    }
  }, [params]);

  // COUNTDOWN HANDLER
  useEffect(() => {
    if (!lockUntil) return;

    const interval = setInterval(() => {
      const diff = Math.floor((lockUntil - Date.now()) / 1000);

      if (diff <= 0) {
        localStorage.removeItem("lock_until");
        setLockUntil(null);
        setRemaining(0);
      } else {
        setRemaining(diff);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [lockUntil]);

  // LOGIN HANDLER
  const handleLogin = async (e) => {
    e.preventDefault();

    if (lockUntil) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/user/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await res.json();

      // BACKEND LOCK RESPONSE
      if (data.locked) {
        const lockTime = Date.now() + 5 * 60 * 1000;
        localStorage.setItem("lock_until", lockTime);
        setLockUntil(lockTime);
        setError(data.message);
        setLoading(false);
        return;
      }

      if (!res.ok) {
        setError(data.message || "Login gagal");
        setLoading(false);
        return;
      }

      // SUCCESS
      localStorage.removeItem("lock_until");
      localStorage.setItem("token", data.token);
      window.location.href = "/";

    } catch (err) {
      console.error(err);
      setError("Server error. Coba lagi nanti.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-8">
      {/* Container */}
      <div className="w-full max-w-md">
        {/* Logo/Brand Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-600 rounded-2xl mb-4 shadow-lg">
            <LogIn className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Selamat Datang</h1>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Login Terlebih dahulu Untuk Booking Online Dan Membeli Obat</h1>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
          {/* Lock Warning */}
          {lockUntil && (
            <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl mb-6">
              <Clock className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-red-900">Akun Terkunci</p>
                <p className="text-sm text-red-700 mt-1">
                  Coba lagi dalam <span className="font-semibold">{remaining} detik</span>
                </p>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && !lockUntil && (
            <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl mb-6">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                  <Mail className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  required
                  disabled={lockUntil}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@email.com"
                  className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed transition-all"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                  <Lock className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  required
                  disabled={lockUntil}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan password"
                  className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed transition-all"
                />
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading || lockUntil}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed text-white font-medium py-3 rounded-xl transition-colors shadow-lg hover:shadow-xl"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Memproses...</span>
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  <span>Masuk</span>
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">Atau masuk dengan</span>
            </div>
          </div>

          {/* Google Login */}
          <a
            href={`${import.meta.env.VITE_API_URL}/api/auth/google`}
            className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-50 text-gray-700 font-medium py-3 rounded-xl border-2 border-gray-300 transition-colors"
          >
            <Chrome className="w-5 h-5 text-red-500" />
            <span>Lanjutkan dengan Google</span>
          </a>

          {/* Footer Links */}
          <div className="mt-6 text-center">
            {!error ? (
              <p className="text-sm text-gray-600">
                Belum punya akun?{" "}
                <a href="/register" className="text-blue-600 hover:text-blue-700 font-medium hover:underline">
                  Daftar di sini
                </a>
              </p>
            ) : (
              <p className="text-sm text-gray-600">
                Lupa kata sandi?{" "}
                <a href="/recovery" className="text-blue-600 hover:text-blue-700 font-medium hover:underline">
                  Pulihkan di sini
                </a>
              </p>
            )}
          </div>
        </div>

        {/* Bottom Text */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Dengan masuk, Anda menyetujui{" "}
          <a href="/terms" className="text-blue-600 hover:underline">
            Syarat & Ketentuan
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;