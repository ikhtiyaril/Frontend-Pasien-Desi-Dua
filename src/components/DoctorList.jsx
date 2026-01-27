import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { 
  Search, 
  Stethoscope, 
  Award, 
  Clock, 
  Star,
  ChevronRight,
  Filter,
  UserCheck,
  Loader2,
  Users,
  GraduationCap,
  Heart,
  Calendar
} from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL;

export default function DoctorList() {
  const navigate = useNavigate();

  const [doctors, setDoctors] = useState([]);
  const [search, setSearch] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/doctor`);
      setDoctors(res.data.data || []);
    } catch (error) {
      console.error("Gagal ambil data dokter:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredDoctors = doctors.filter((doctor) => {
    const byName = doctor.name
      ?.toLowerCase()
      .includes(search.toLowerCase());

    const bySpec = specialization
      ? doctor.specialization === specialization
      : true;

    return byName && bySpec;
  });

  const specializationList = [
    ...new Set(
      doctors
        .map((d) => d.specialization)
        .filter(Boolean)
    ),
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-700 text-white overflow-hidden relative">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00em0wLTEwYzAtMi4yMS0xLjc5LTQtNC00cy00IDEuNzktNCA0IDEuNzkgNCA0IDQgNC0xLjc5IDQtNHptLTEwIDBjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00eiIvPjwvZz48L2c+PC9zdmc+')] opacity-10"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16 relative z-10">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full border border-white/30 mb-6">
              <Stethoscope className="w-5 h-5" />
              <span className="text-sm font-semibold">Tim Medis Profesional</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              Tim Dokter Kami
            </h1>
            <p className="text-lg sm:text-xl text-blue-100 max-w-2xl mx-auto">
              Dokter profesional berpengalaman dengan pendekatan medis modern dan humanis untuk kesehatan Anda
            </p>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-white shadow-md border-b-2 border-blue-100 -mt-8 relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Users className="w-5 h-5 text-blue-600" />
                <p className="text-2xl font-bold text-blue-700">{doctors.length}+</p>
              </div>
              <p className="text-sm text-gray-600">Dokter Berpengalaman</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Award className="w-5 h-5 text-blue-600" />
                <p className="text-2xl font-bold text-blue-700">10+</p>
              </div>
              <p className="text-sm text-gray-600">Tahun Pengalaman</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Heart className="w-5 h-5 text-blue-600" />
                <p className="text-2xl font-bold text-blue-700">1000+</p>
              </div>
              <p className="text-sm text-gray-600">Pasien Puas</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Clock className="w-5 h-5 text-blue-600" />
                <p className="text-2xl font-bold text-blue-700">24/7</p>
              </div>
              <p className="text-sm text-gray-600">Siap Melayani</p>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Search & Filter */}
        <div className="bg-white rounded-2xl shadow-lg border-2 border-blue-100 p-4 sm:p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Cari nama dokter..."
                className="w-full pl-12 pr-4 py-3 border-2 border-blue-200 rounded-xl focus:outline-none focus:border-blue-500 bg-blue-50/30 transition-all"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* Specialization Filter */}
            <div className="relative md:w-72">
              <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-400 w-5 h-5" />
              <select
                className="w-full pl-12 pr-4 py-3 border-2 border-blue-200 rounded-xl focus:outline-none focus:border-blue-500 bg-white appearance-none cursor-pointer transition-all"
                value={specialization}
                onChange={(e) => setSpecialization(e.target.value)}
              >
                <option value="">Semua Spesialisasi</option>
                {specializationList.map((spec, index) => (
                  <option key={index} value={spec}>
                    {spec}
                  </option>
                ))}
              </select>
              <ChevronRight className="absolute right-4 top-1/2 transform -translate-y-1/2 rotate-90 text-blue-400 w-5 h-5 pointer-events-none" />
            </div>
          </div>

          {/* Results Info */}
          <div className="mt-4 pt-4 border-t border-blue-100">
            <p className="text-sm text-gray-600">
              Menampilkan <span className="font-semibold text-blue-600">{filteredDoctors.length}</span> dari{" "}
              <span className="font-semibold">{doctors.length}</span> dokter
            </p>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-16 h-16 text-blue-600 animate-spin mb-4" />
            <p className="text-gray-600 font-medium">Memuat data dokter...</p>
          </div>
        ) : filteredDoctors.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center mb-4">
              <Users className="w-12 h-12 text-blue-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Dokter Tidak Ditemukan</h3>
            <p className="text-gray-500 text-center max-w-md">
              Coba ubah filter pencarian atau kata kunci Anda
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDoctors.map((doctor) => (
              <div
                key={doctor.id}
                onClick={() => navigate(`/doctor/${doctor.id}`)}
                className="group bg-white rounded-2xl border-2 border-blue-100 overflow-hidden hover:border-blue-400 hover:shadow-xl transition-all duration-300 cursor-pointer"
              >
                {/* Card Header with Avatar */}
                <div className="relative bg-gradient-to-br from-blue-50 to-slate-100 p-6">
                  <div className="flex items-start gap-4">
                    {/* Avatar */}
                    <div className="relative flex-shrink-0">
                      <div className="w-20 h-20 rounded-2xl overflow-hidden border-4 border-white shadow-lg group-hover:scale-105 transition-transform">
                        {doctor.avatar ? (
                          <img
                            src={doctor.avatar}
                            alt={doctor.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center">
                            <Stethoscope className="w-10 h-10 text-white" />
                          </div>
                        )}
                      </div>
                      {/* Status Badge */}
                      <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
                        <UserCheck className="w-4 h-4 text-white" />
                      </div>
                    </div>

                    {/* Doctor Info */}
                    <div className="flex-1 min-w-0">
                      <h2 className="font-bold text-lg text-gray-900 mb-1 group-hover:text-blue-700 transition-colors">
                        {doctor.name}
                      </h2>
                      <div className="flex items-center gap-2 mb-2">
                        <GraduationCap className="w-4 h-4 text-blue-600 flex-shrink-0" />
                        <p className="text-sm text-blue-600 font-medium truncate">
                          {doctor.specialization || "Dokter Umum"}
                        </p>
                      </div>
                      {/* Rating */}
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < 5 ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200"
                            }`}
                          />
                        ))}
                        <span className="text-xs text-gray-500 ml-1">(5.0)</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6 space-y-4">
                  {/* Bio */}
                  <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
                    {doctor.bio ||
                      "Dokter berpengalaman di Desidua Klinik dengan pendekatan profesional dan empatik dalam memberikan pelayanan kesehatan terbaik."}
                  </p>

                  {/* Info Grid */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-blue-50 rounded-xl p-3 border border-blue-100">
                      <div className="flex items-center gap-2 mb-1">
                        <Award className="w-4 h-4 text-blue-600" />
                        <p className="text-xs text-gray-600">Pengalaman</p>
                      </div>
                      <p className="text-sm font-bold text-gray-900">10+ Tahun</p>
                    </div>
                    <div className="bg-green-50 rounded-xl p-3 border border-green-100">
                      <div className="flex items-center gap-2 mb-1">
                        <Clock className="w-4 h-4 text-green-600" />
                        <p className="text-xs text-gray-600">Status</p>
                      </div>
                      <p className="text-sm font-bold text-green-700">
                        {doctor.isActive ? "Tersedia" : "Tidak Tersedia"}
                      </p>
                    </div>
                  </div>

                  {/* Action Button */}
                  <button className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 group-hover:gap-3">
                    <Calendar className="w-5 h-5" />
                    Lihat Profil & Jadwal
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-16 mt-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Butuh Konsultasi Segera?
          </h2>
          <p className="text-lg text-blue-100 mb-8">
            Tim dokter kami siap membantu Anda 24/7. Jadwalkan konsultasi sekarang!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={()=>navigate('/booking')} className="px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl">
              Konsultasi Sekarang
            </button>
            <button onClick={()=>navigate('/contact')} className="px-8 py-4 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-400 transition-all border-2 border-white/30">
              Hubungi Kami
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}