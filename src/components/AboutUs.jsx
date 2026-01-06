import React from "react";
import { 
  Heart, 
  Shield, 
  Users, 
  Award, 
  Target, 
  CheckCircle, 
  Sparkles,
  Baby,
  Stethoscope,
  BookOpen,
  Clock,
  MapPin
} from "lucide-react";

import { useNavigate } from "react-router-dom";

export default function AboutUs() {
const navigate = useNavigate()


  return (
    <div className="bg-gradient-to-br from-blue-50 via-white to-slate-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 to-blue-700 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00em0wLTEwYzAtMi4yMS0xLjc5LTQtNC00cy00IDEuNzktNCA0IDEuNzkgNCA0IDQgNC0xLjc5IDQtNHptLTEwIDBjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00eiIvPjwvZz48L2c+PC9zdmc+')] opacity-10"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24 relative z-10">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full border border-white/30 mb-6">
              <Heart className="w-5 h-5" />
              <span className="text-sm font-semibold">Kesehatan Ibu & Anak</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Klinik Desidua
            </h1>
            <p className="text-lg sm:text-xl max-w-3xl mx-auto text-blue-100 leading-relaxed">
              Melindungi dan mendukung kehidupan sejak awal dengan layanan kesehatan yang profesional, aman, dan penuh perhatian
            </p>
          </div>

          {/* Hero Image */}
        <div className="relative max-w-5xl mx-auto">
  {/* Gradient Overlay */}
  <div className="absolute inset-0 bg-gradient-to-t from-blue-700/40 via-blue-600/10 to-transparent rounded-3xl pointer-events-none" />

  <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden border border-white/40">
    <div className="aspect-video relative">
      <img
        src="Footage-3-DD.jpeg"
        alt="Dokter Severina Adella"
        className="absolute inset-0  w-full h-full object-cover"
      />
    </div>
  </div>
</div>

        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white shadow-md relative z-20 -mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="bg-white rounded-2xl border-2 border-blue-100 shadow-xl p-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <p className="text-3xl font-bold text-blue-700">1000+</p>
                <p className="text-sm text-gray-600 mt-1">Pasien Puas</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <Award className="w-8 h-8 text-white" />
                </div>
                <p className="text-3xl font-bold text-blue-700">5+</p>
                <p className="text-sm text-gray-600 mt-1">Tahun Berpengalaman</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <Stethoscope className="w-8 h-8 text-white" />
                </div>
                <p className="text-3xl font-bold text-blue-700">15+</p>
                <p className="text-sm text-gray-600 mt-1">Tenaga Medis</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <Clock className="w-8 h-8 text-white" />
                </div>
                <p className="text-3xl font-bold text-blue-700">24/7</p>
                <p className="text-sm text-gray-600 mt-1">Layanan Darurat</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filosofi & Visi Misi */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 bg-blue-100 px-4 py-2 rounded-full">
                <Sparkles className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-semibold text-blue-700">Filosofi Kami</span>
              </div>
              
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
                Filosofi & Visi Misi
              </h2>
              
              <div className="prose prose-lg">
                <p className="text-gray-700 leading-relaxed">
                  Nama <span className="font-bold text-blue-700">Desidua</span> terinspirasi dari lapisan endometrium yang menebal sebagai persiapan kehamilan, berfungsi melindungi dan memberi nutrisi bagi embrio. Filosofi ini tercermin dalam setiap layanan kami: memberikan perlindungan, dukungan, dan stimulasi optimal untuk kesehatan perempuan dan anak.
                </p>
              </div>

              <div className="space-y-4">
                <div className="bg-white rounded-xl p-6 border-2 border-blue-100 shadow-sm">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Target className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-2">Visi</h3>
                      <p className="text-gray-600">
                        Menjadi klinik terpercaya yang mendukung kesehatan ibu dan anak di setiap tahap kehidupan.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 border-2 border-blue-100 shadow-sm">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Heart className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-2">Misi</h3>
                      <p className="text-gray-600">
                        Memberikan layanan holistik berbasis ilmu, edukasi keluarga, perawatan pasca persalinan, pemulihan kesehatan reproduksi, dan tumbuh kembang anak secara optimal.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Image Side */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-blue-700/20 rounded-3xl transform rotate-3"></div>
              <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden border-4 border-blue-100">
                <div className="aspect-[4/3] bg-gradient-to-br from-blue-100 via-blue-50 to-slate-100 flex items-center justify-center relative">
                  
      <img
        src="Footage-2-DD.jpeg"
        alt="Dokter Severina Adella"
        className="absolute inset-0  w-full h-full object-cover"
      />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sejarah */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Image Side */}
            <div className="order-2 lg:order-1 relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-blue-700/20 rounded-3xl transform -rotate-3"></div>
              <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden border-4 border-blue-100">
                <div className=" realative aspect-[4/3] bg-gradient-to-br from-slate-100 via-blue-50 to-blue-100 flex items-center justify-center">
                  <img
        src="Footage-4-DD.jpeg"
        alt="Dokter Severina Adella"
        className="absolute inset-0  w-full h-full object-cover"
      />
                </div>
              </div>
            </div>

            <div className="order-1 lg:order-2 space-y-6">
              <div className="inline-flex items-center gap-2 bg-blue-100 px-4 py-2 rounded-full">
                <BookOpen className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-semibold text-blue-700">Sejarah Kami</span>
              </div>
              
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
                Sejarah & Latar Belakang
              </h2>
              
              <div className="prose prose-lg">
                <p className="text-gray-700 leading-relaxed mb-4">
                  Klinik Desidua didirikan untuk memberikan layanan kesehatan yang aman, nyaman, dan profesional bagi ibu dan anak. Filosofi nama Desidua mengingatkan kami akan pentingnya perlindungan dan dukungan sejak awal kehidupan.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  Dengan pengalaman bertahun-tahun, kami terus berkomitmen memberikan perawatan terbaik dan perhatian penuh kepada setiap pasien yang datang ke klinik kami.
                </p>
              </div>

              <div className="flex items-start gap-4 bg-blue-50 rounded-xl p-6 border-2 border-blue-100">
                <MapPin className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">Lokasi Strategis</h4>
                  <p className="text-gray-600 text-sm">
                    Mudah dijangkau dengan fasilitas lengkap untuk kenyamanan Anda dan keluarga
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Layanan Unggulan */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-slate-50">
        <div className="grid md:grid-cols-3 gap-8">

  {/* Service Card 1 */}
  <div className="group bg-white rounded-2xl border-2 border-blue-100 overflow-hidden hover:border-blue-400 hover:shadow-xl transition-all duration-300">
    <div className="relative h-48 overflow-hidden">
      <img
        src="Ibu-Hamil.webp"
        alt="Ibu dan Kehamilan"
        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
      />
      <div className="absolute inset-0 bg-gradient-to-br from-blue-700/30 to-transparent"></div>
    </div>
    <div className="p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-3">
        Ibu & Kehamilan
      </h3>
      <p className="text-gray-600 leading-relaxed">
        Pemeriksaan kehamilan, konsultasi reproduksi, serta perawatan pasca persalinan dengan pendekatan holistik dan aman.
      </p>
      <div className="mt-4 flex items-center text-blue-600 font-semibold text-sm group-hover:gap-2 transition-all">
        <span>Pelajari Lebih Lanjut</span>
        <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
      </div>
    </div>
  </div>

  {/* Service Card 2 */}
  <div className="group bg-white rounded-2xl border-2 border-blue-100 overflow-hidden hover:border-blue-400 hover:shadow-xl transition-all duration-300">
    <div className="relative h-48 overflow-hidden">
      <img
        src="Rekon-Vagina.jpg"
        alt="Kesehatan Intim"
        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
      />
      <div className="absolute inset-0 bg-gradient-to-br from-blue-700/30 to-transparent"></div>
    </div>
    <div className="p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-3">
        Kesehatan Intim
      </h3>
      <p className="text-gray-600 leading-relaxed">
        Vaginoplasti (Vaginoplasty) dan perawatan kesehatan intim untuk memulihkan fungsi, kenyamanan, dan kepercayaan diri perempuan.
      </p>
      <div className="mt-4 flex items-center text-blue-600 font-semibold text-sm group-hover:gap-2 transition-all">
        <span>Pelajari Lebih Lanjut</span>
        <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
      </div>
    </div>
  </div>

  {/* Service Card 3 */}
  <div className="group bg-white rounded-2xl border-2 border-blue-100 overflow-hidden hover:border-blue-400 hover:shadow-xl transition-all duration-300">
    <div className="relative h-48 overflow-hidden">
      <img
        src="Tumbuh-Kembang.webp"
        alt="Tumbuh Kembang Anak"
        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
      />
      <div className="absolute inset-0 bg-gradient-to-br from-blue-700/30 to-transparent"></div>
    </div>
    <div className="p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-3">
        Tumbuh Kembang Anak
      </h3>
      <p className="text-gray-600 leading-relaxed">
        Pemantauan dan stimulasi perkembangan anak, edukasi orang tua untuk mendukung pertumbuhan optimal sejak dini.
      </p>
      <div className="mt-4 flex items-center text-blue-600 font-semibold text-sm group-hover:gap-2 transition-all">
        <span>Pelajari Lebih Lanjut</span>
        <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
      </div>
    </div>
  </div>

</div>

      </section>

      {/* Tim Profesional */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 bg-blue-100 px-4 py-2 rounded-full">
                <Users className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-semibold text-blue-700">Tim Kami</span>
              </div>
              
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
                Tim Profesional
              </h2>
              
              <p className="text-gray-700 leading-relaxed text-lg">
                Klinik Desidua didukung oleh dokter, bidan, dan tenaga medis berpengalaman yang berkomitmen memberikan pelayanan terbaik. Setiap anggota tim kami mengutamakan perhatian personal untuk setiap pasien.
              </p>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 rounded-xl p-4 border-2 border-blue-100">
                  <Stethoscope className="w-8 h-8 text-blue-600 mb-2" />
                  <p className="font-bold text-gray-900">Dokter Spesialis</p>
                  <p className="text-sm text-gray-600">Berpengalaman & Tersertifikasi</p>
                </div>
                <div className="bg-blue-50 rounded-xl p-4 border-2 border-blue-100">
                  <Heart className="w-8 h-8 text-blue-600 mb-2" />
                  <p className="font-bold text-gray-900">Bidan Terlatih</p>
                  <p className="text-sm text-gray-600">Ramah & Profesional</p>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-blue-700/20 rounded-3xl transform rotate-3"></div>
              <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden border-4 border-blue-100">
                <div className="aspect-[4/3] bg-gradient-to-br from-blue-100 via-slate-50 to-blue-200 flex items-center justify-center">
                  <div className="text-center p-8">
                    <img
        src="Saverina.jpg"
        alt="Dokter Severina Adella"
        className="absolute inset-0  w-full h-full object-cover"
      />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Kenapa Memilih Kami */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-blue-700 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0YzAtMi4yMS0xLjc5LTQtNC00cy00IDEuNzktNCA0IDEuNzkgNCA0IDQgNC0xLjc5IDQtNHptMC0xMGMwLTIuMjEtMS43OS00LTQtNHMtNCAxLjc5LTQgNCAxLjc5IDQgNCA0IDQtMS43OSA0LTR6bS0xMCAwYzAtMi4yMS0xLjc5LTQtNC00cy00IDEuNzktNCA0IDEuNzkgNCA0IDQgNC0xLjc5IDQtNHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-50"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Kenapa Memilih Kami?
            </h2>
            <p className="text-blue-100 text-lg max-w-2xl mx-auto">
              Komitmen kami adalah memberikan pelayanan kesehatan terbaik dengan pendekatan personal
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {[
              {
                icon: Shield,
                title: "Lingkungan Aman & Nyaman",
                desc: "Klinik yang aman, nyaman, dan ramah keluarga dengan fasilitas modern"
              },
              {
                icon: Heart,
                title: "Pendekatan Holistik",
                desc: "Personalisasi perawatan untuk setiap pasien dengan perhatian penuh"
              },
              {
                icon: BookOpen,
                title: "Edukasi Pasien",
                desc: "Edukasi orang tua dan pasien sebagai bagian integral dari pelayanan"
              },
              {
                icon: Target,
                title: "Fokus Kesehatan Optimal",
                desc: "Fokus pada kesehatan reproduksi dan tumbuh kembang anak yang optimal"
              }
            ].map((item, idx) => (
              <div 
                key={idx}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border-2 border-white/20 hover:bg-white/20 transition-all group"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <item.icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                    <p className="text-blue-100 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Siap Memulai Perjalanan Kesehatan Anda?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Hubungi kami untuk konsultasi atau jadwalkan kunjungan Anda hari ini
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={()=>navigate('/booking')} className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl">
              Konsultasi Sekarang
            </button>
            <button onClick={()=>navigate('/contact')} className="px-8 py-4 bg-white border-2 border-blue-600 text-blue-600 rounded-xl font-semibold hover:bg-blue-50 transition-all">
              Hubungi Kami
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}