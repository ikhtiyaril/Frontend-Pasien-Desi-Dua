import React, { useState } from "react";
import { User, Mail, Phone, Lock, Eye, EyeOff, CheckCircle, XCircle, AlertCircle, UserPlus, MailOpen } from "lucide-react";

const Register = () => {
  const [step, setStep] = useState("register");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [captchaAnswer, setCaptchaAnswer] = useState("");
  const [captcha, setCaptcha] = useState(generateCaptcha());

  function generateCaptcha() {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    return { num1, num2, answer: num1 + num2 };
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const passwordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const getPasswordStrengthText = () => {
    const strength = passwordStrength(formData.password);
    if (!formData.password) return { text: "", color: "" };
    if (strength <= 1) return { text: "Lemah", color: "text-red-600" };
    if (strength === 2) return { text: "Cukup", color: "text-yellow-600" };
    if (strength === 3) return { text: "Baik", color: "text-blue-600" };
    return { text: "Kuat", color: "text-green-600" };
  };

  const passwordRequirements = [
    { text: "Minimal 8 karakter", met: formData.password.length >= 8 },
    { text: "Huruf besar & kecil", met: /[a-z]/.test(formData.password) && /[A-Z]/.test(formData.password) },
    { text: "Mengandung angka", met: /[0-9]/.test(formData.password) },
    { text: "Karakter khusus (!@#$)", met: /[^A-Za-z0-9]/.test(formData.password) },
  ];

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    // Validasi password match
    if (formData.password !== formData.confirmPassword) {
      setError("Password dan konfirmasi password tidak cocok");
      return;
    }

    // Validasi password strength
    if (passwordStrength(formData.password) < 3) {
      setError("Password harus memenuhi minimal 3 kriteria keamanan");
      return;
    }

    // Validasi captcha
    if (parseInt(captchaAnswer) !== captcha.answer) {
      setError("Jawaban captcha salah");
      setCaptcha(generateCaptcha());
      setCaptchaAnswer("");
      return;
    }

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/user/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            password: formData.password,
          }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setStep("sent");
    } catch (err) {
      setError(err.message);
      setCaptcha(generateCaptcha());
      setCaptchaAnswer("");
    }
  };

  const strengthText = getPasswordStrengthText();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-8">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4 shadow-lg">
            {step === "register" ? (
              <UserPlus className="w-8 h-8 text-white" />
            ) : (
              <MailOpen className="w-8 h-8 text-white" />
            )}
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {step === "register" ? "Buat Akun Baru" : "Cek Email Anda"}
          </h1>
          <p className="text-gray-600">
            {step === "register"
              ? "Daftar untuk mulai menggunakan layanan KlinikCare"
              : "Email verifikasi telah dikirim"}
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
          {step === "register" && (
            <div className="space-y-5">
              {/* Name Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nama Lengkap
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2">
                    <User className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    name="name"
                    placeholder="Masukkan nama lengkap"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    required
                  />
                </div>
              </div>

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
                    name="email"
                    type="email"
                    placeholder="nama@email.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    required
                  />
                </div>
              </div>

              {/* Phone Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  No. Telepon
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2">
                    <Phone className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    name="phone"
                    type="tel"
                    placeholder="+62 xxx xxxx xxxx"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    required
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
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Buat password yang kuat"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-11 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>

                {/* Password Strength Indicator */}
                {formData.password && (
                  <div className="mt-2">
                    <div className="flex gap-1 mb-2">
                      {[1, 2, 3, 4].map((level) => (
                        <div
                          key={level}
                          className={`h-1 flex-1 rounded-full transition-colors ${
                            passwordStrength(formData.password) >= level
                              ? level === 1
                                ? "bg-red-500"
                                : level === 2
                                ? "bg-yellow-500"
                                : level === 3
                                ? "bg-blue-500"
                                : "bg-green-500"
                              : "bg-gray-200"
                          }`}
                        />
                      ))}
                    </div>
                    <p className={`text-xs font-medium ${strengthText.color}`}>
                      Kekuatan: {strengthText.text}
                    </p>
                  </div>
                )}

                {/* Password Requirements */}
                {formData.password && (
                  <div className="mt-3 space-y-1">
                    {passwordRequirements.map((req, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs">
                        {req.met ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : (
                          <XCircle className="w-4 h-4 text-gray-300" />
                        )}
                        <span className={req.met ? "text-green-700" : "text-gray-500"}>
                          {req.text}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Confirm Password Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Konfirmasi Password
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2">
                    <Lock className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Ketik ulang password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full pl-11 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>

                {/* Password Match Indicator */}
                {formData.confirmPassword && (
                  <div className="mt-2 flex items-center gap-2">
                    {formData.password === formData.confirmPassword ? (
                      <>
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-xs text-green-700">Password cocok</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-4 h-4 text-red-500" />
                        <span className="text-xs text-red-700">Password tidak cocok</span>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Captcha */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Verifikasi Keamanan
                </label>
                <div className="flex gap-3 items-center">
                  <div className="flex-1 flex items-center justify-center bg-gray-100 border-2 border-gray-300 rounded-xl py-4 px-4">
                    <span className="text-2xl font-bold text-gray-700 select-none">
                      {captcha.num1} + {captcha.num2} = ?
                    </span>
                  </div>
                  <input
                    type="number"
                    placeholder="?"
                    value={captchaAnswer}
                    onChange={(e) => setCaptchaAnswer(e.target.value)}
                    className="w-20 py-3 px-4 text-center border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-lg font-semibold"
                    required
                  />
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              {/* Register Button */}
              <button
                onClick={handleRegister}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-xl transition-colors shadow-lg hover:shadow-xl"
              >
                <UserPlus className="w-5 h-5" />
                <span>Daftar Sekarang</span>
              </button>

              {/* Login Link */}
              <p className="text-center text-sm text-gray-600 mt-4">
                Sudah punya akun?{" "}
                <a href="/login" className="text-blue-600 hover:text-blue-700 font-medium hover:underline">
                  Masuk di sini
                </a>
              </p>
            </div>
          )}

          {step === "sent" && (
            <div className="text-center space-y-6">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Email Verifikasi Terkirim!
                </h3>
                <p className="text-gray-600">
                  Kami telah mengirim email verifikasi ke
                </p>
                <p className="font-semibold text-blue-600 mt-1">{formData.email}</p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <p className="text-sm text-gray-700">
                  Silakan cek inbox atau folder spam Anda dan klik link verifikasi untuk mengaktifkan akun.
                </p>
              </div>

              <a
                href={`mailto:${formData.email}`}
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors"
              >
                <MailOpen className="w-5 h-5" />
                <span>Buka Email</span>
              </a>

              <p className="text-sm text-gray-600">
                Tidak menerima email?{" "}
                <button className="text-blue-600 hover:text-blue-700 font-medium hover:underline">
                  Kirim ulang
                </button>
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        {step === "register" && (
          <p className="text-center text-sm text-gray-500 mt-6">
            Dengan mendaftar, Anda menyetujui{" "}
            <a href="/terms" className="text-blue-600 hover:underline">
              Syarat & Ketentuan
            </a>{" "}
            kami
          </p>
        )}
      </div>
    </div>
  );
};

export default Register;