import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  ArrowLeft,
  Mail,
  Phone,
  CheckCircle,
  XCircle,
  Calendar,
  Clock,
  Award,
  Stethoscope,
  GraduationCap,
  Star,
  MapPin,
  Loader2,
  AlertCircle,
  User,
  CalendarCheck,
  Info
} from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL;

export default function DetailDoctor({ id }) {
  const navigate = useNavigate();

  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState("");
  const [blockedTimes, setBlockedTimes] = useState([]);
  const [loadingSchedule, setLoadingSchedule] = useState(false);

  useEffect(() => {
    fetchDoctor();
  }, [id]);

  useEffect(() => {
    if (selectedDate) fetchSchedule();
  }, [selectedDate]);

  const fetchDoctor = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/doctor/detail/${id}`);
      setDoctor(res.data.data);
    } catch (error) {
      console.error("Gagal mengambil detail dokter:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSchedule = async () => {
    setLoadingSchedule(true);
    try {
      const res = await axios.get(
        `${API_URL}/api/blocked-time/doctor/${id}/date/${selectedDate}`
      );
      setBlockedTimes(res.data);
    } catch (err) {
      console.error("Gagal ambil jadwal dokter:", err);
    } finally {
      setLoadingSchedule(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-16 h-16 text-blue-600 animate-spin" />
          <p className="text-gray-600 font-medium">Memuat detail dokter...</p>
        </div>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center">
            <AlertCircle className="w-12 h-12 text-blue-400" />
          </div>
          <p className="text-gray-600 font-medium">Data dokter tidak ditemukan</p>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-2 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all"
          >
            Kembali
          </button>
        </div>
      </div>
    );
  }

  const timeSlots = generateTimeSlots("08:00", "17:00", 30);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-8 shadow-lg">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-white hover:text-blue-100 transition-colors mb-4 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/20"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Kembali ke Daftar Dokter</span>
          </button>
          <h1 className="text-2xl sm:text-3xl font-bold">Profil Dokter</h1>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl border-2 border-blue-100 overflow-hidden">
          
          {/* Doctor Profile Section */}
          <div className="bg-gradient-to-br from-blue-50 to-slate-100 p-6 sm:p-8">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Avatar */}
              <div className="flex-shrink-0">
                <div className="relative">
                  <div className="w-40 h-40 rounded-2xl overflow-hidden border-4 border-white shadow-xl">
                    {doctor.avatar ? (
                      <img
                        src={doctor.avatar}
                        alt={doctor.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center">
                        <Stethoscope className="w-20 h-20 text-white" />
                      </div>
                    )}
                  </div>
                  {/* Status Badge */}
                  <div className={`absolute -bottom-2 -right-2 px-3 py-1 rounded-full border-4 border-white flex items-center gap-1.5 shadow-lg ${
                    doctor.isActive ? "bg-green-500" : "bg-red-500"
                  }`}>
                    {doctor.isActive ? (
                      <CheckCircle className="w-4 h-4 text-white" />
                    ) : (
                      <XCircle className="w-4 h-4 text-white" />
                    )}
                    <span className="text-xs font-bold text-white">
                      {doctor.isActive ? "Aktif" : "Tidak Aktif"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Doctor Info */}
              <div className="flex-1 space-y-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {doctor.name}
                  </h1>
                  <div className="flex items-center gap-2 mb-3">
                    <GraduationCap className="w-5 h-5 text-blue-600" />
                    <p className="text-lg text-blue-600 font-semibold">
                      {doctor.specialization || "Dokter Umum"}
                    </p>
                  </div>
                  {/* Rating */}
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${
                            i < 5 ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600 font-medium">5.0 (120 Reviews)</span>
                  </div>
                </div>

                {/* Contact Info Grid */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="bg-white rounded-xl p-4 border-2 border-blue-100 shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Mail className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs text-gray-500 font-medium mb-0.5">Email</p>
                        <p className="text-sm font-semibold text-gray-900 truncate">
                          {doctor.email}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-4 border-2 border-blue-100 shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Phone className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs text-gray-500 font-medium mb-0.5">Telepon</p>
                        <p className="text-sm font-semibold text-gray-900 truncate">
                          085X-XXXX-XXXX
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-white rounded-xl p-3 border-2 border-blue-100 text-center">
                    <Award className="w-6 h-6 text-blue-600 mx-auto mb-1" />
                    <p className="text-lg font-bold text-gray-900">10+</p>
                    <p className="text-xs text-gray-600">Tahun</p>
                  </div>
                  <div className="bg-white rounded-xl p-3 border-2 border-blue-100 text-center">
                    <User className="w-6 h-6 text-blue-600 mx-auto mb-1" />
                    <p className="text-lg font-bold text-gray-900">500+</p>
                    <p className="text-xs text-gray-600">Pasien</p>
                  </div>
                  <div className="bg-white rounded-xl p-3 border-2 border-blue-100 text-center">
                    <Star className="w-6 h-6 text-blue-600 mx-auto mb-1" />
                    <p className="text-lg font-bold text-gray-900">4.8</p>
                    <p className="text-xs text-gray-600">Rating</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bio Section */}
          <div className="p-6 sm:p-8 border-t-2 border-blue-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center">
                <Info className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Tentang Dokter</h2>
            </div>
            <div className="bg-blue-50 rounded-xl p-6 border-2 border-blue-100">
              <p className="text-gray-700 leading-relaxed text-lg">
                {doctor.bio ||
                  "Dokter berpengalaman yang berkomitmen memberikan pelayanan medis terbaik dengan pendekatan profesional dan empatik. Fokus pada kesehatan pasien dengan treatment yang komprehensif dan personal."}
              </p>
            </div>
          </div>

          {/* Schedule Section */}
          <div className="p-6 sm:p-8 border-t-2 border-blue-100 bg-slate-50">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Jadwal Praktik</h2>
            </div>

            {/* Date Picker */}
            <div className="bg-white rounded-xl p-6 border-2 border-blue-100 shadow-sm mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Pilih Tanggal Konsultasi
              </label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-400 w-5 h-5" />
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border-2 border-blue-200 rounded-xl focus:outline-none focus:border-blue-500 bg-blue-50/30 transition-all text-gray-800"
                  min={new Date().toISOString().split("T")[0]}
                />
              </div>
            </div>

            {/* Loading Schedule */}
            {loadingSchedule && (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-3" />
                <p className="text-gray-600 font-medium">Memuat jadwal dokter...</p>
              </div>
            )}

            {/* Time Slots */}
            {!loadingSchedule && selectedDate && (
              <div className="bg-white rounded-xl p-6 border-2 border-blue-100 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <Clock className="w-5 h-5 text-blue-600" />
                  <h3 className="font-bold text-gray-900">Waktu Tersedia</h3>
                </div>
                
                {/* Legend */}
                <div className="flex flex-wrap items-center gap-4 mb-6 p-4 bg-blue-50 rounded-xl">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-500 rounded"></div>
                    <span className="text-sm text-gray-700 font-medium">Tersedia</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-red-500 rounded"></div>
                    <span className="text-sm text-gray-700 font-medium">Tidak Tersedia</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                  {timeSlots.map((time) => {
                    const isBlocked = blockedTimes.some(
                      (b) => time >= b.time_start && time < b.time_end
                    );

                    return (
                      <div
                        key={time}
                        className={`relative text-center px-4 py-3 rounded-xl border-2 font-semibold transition-all ${
                          isBlocked
                            ? "bg-red-50 text-red-600 border-red-200 cursor-not-allowed"
                            : "bg-green-50 text-green-700 border-green-200 cursor-pointer hover:bg-green-100 hover:border-green-300 hover:shadow-md"
                        }`}
                      >
                        <Clock className="w-4 h-4 mx-auto mb-1" />
                        <span className="text-sm">{time}</span>
                        {isBlocked && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <XCircle className="w-6 h-6 text-red-400" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {timeSlots.filter(time => 
                  !blockedTimes.some(b => time >= b.time_start && time < b.time_end)
                ).length === 0 && (
                  <div className="text-center py-8">
                    <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600 font-medium">Tidak ada waktu tersedia untuk tanggal ini</p>
                  </div>
                )}
              </div>
            )}

            {/* Empty State - No Date Selected */}
            {!selectedDate && !loadingSchedule && (
              <div className="bg-white rounded-xl p-12 border-2 border-dashed border-blue-200 text-center">
                <Calendar className="w-16 h-16 text-blue-300 mx-auto mb-4" />
                <p className="text-gray-600 font-medium mb-2">Pilih tanggal untuk melihat jadwal</p>
                <p className="text-sm text-gray-500">Tentukan tanggal konsultasi Anda</p>
              </div>
            )}
          </div>

          {/* CTA Section */}
          <div className="p-6 sm:p-8 bg-gradient-to-r from-blue-600 to-blue-700 border-t-2 border-blue-700">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-white">
                <h3 className="text-xl font-bold mb-1">Siap Berkonsultasi?</h3>
                <p className="text-blue-100 text-sm">Jadwalkan konsultasi Anda dengan {doctor.name}</p>
              </div>
              <button
                onClick={() => navigate("/booking")}
                className="w-full sm:w-auto px-8 py-4 bg-white text-blue-600 rounded-xl font-bold hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group"
              >
                <CalendarCheck className="w-5 h-5" />
                Buat Janji Konsultasi
                <ArrowLeft className="w-5 h-5 rotate-180 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>

        {/* Additional Info Cards */}
        <div className="grid md:grid-cols-3 gap-6 mt-8">
          <div className="bg-white rounded-2xl p-6 border-2 border-blue-100 shadow-sm hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center mb-4">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Jam Operasional</h3>
            <p className="text-gray-600 text-sm">Senin - Jumat: 08:00 - 16:00</p>
          </div>

          <div className="bg-white rounded-2xl p-6 border-2 border-blue-100 shadow-sm hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center mb-4">
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Lokasi Praktik</h3>
            <p className="text-gray-600 text-sm">Klinik Desidua / Online Consultation</p>
          </div>

          <div className="bg-white rounded-2xl p-6 border-2 border-blue-100 shadow-sm hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center mb-4">
              <Award className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Pengalaman</h3>
            <p className="text-gray-600 text-sm">10+ Tahun Praktik Medis</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================
   HELPER: GENERATE TIME SLOT
========================= */
function generateTimeSlots(start, end, interval) {
  const slots = [];
  let [h, m] = start.split(":").map(Number);
  const [endH, endM] = end.split(":").map(Number);

  while (h < endH || (h === endH && m < endM)) {
    const hh = String(h).padStart(2, "0");
    const mm = String(m).padStart(2, "0");
    slots.push(`${hh}:${mm}`);

    m += interval;
    if (m >= 60) {
      m = 0;
      h++;
    }
  }

  return slots;
}