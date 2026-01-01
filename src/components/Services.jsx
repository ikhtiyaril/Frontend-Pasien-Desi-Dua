import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { ChevronLeftIcon, ChevronRightIcon, SparklesIcon } from "@heroicons/react/24/solid";

export default function Services() {
  const [otherServices, setOtherServices] = useState([]);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const autoplayRef = useRef(null);

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    // Ambil semua layanan dari backend
    axios
      .get(`${API_URL}/api/service`)
      .then((res) => {
        const filtered = res.data.filter(
          (s) =>
            ![
              "Ibu & Kehamilan",
              "Reparasi Vagina",
              "Tumbuh Kembang Anak",
            ].includes(s.name)
        );
        setOtherServices(filtered);
      })
      .catch((err) => console.error("Gagal fetch services:", err));
  }, []);

  const prev = () =>
    setCarouselIndex((prevIdx) =>
      otherServices.length ? (prevIdx - 1 + otherServices.length) % otherServices.length : 0
    );
  const next = () =>
    setCarouselIndex((prevIdx) => (otherServices.length ? (prevIdx + 1) % otherServices.length : 0));

  // autoplay carousel
  useEffect(() => {
    if (!otherServices.length) return;
    autoplayRef.current = setInterval(() => {
      setCarouselIndex((i) => (i + 1) % otherServices.length);
    }, 4500);
    return () => clearInterval(autoplayRef.current);
  }, [otherServices.length]);

  // paths for images (put these files in public/images)
  const POLI_IMAGE = "Poli-Umum.jpg"; // requested image for carousel
  const IMG_PREGNANCY = "/images/pregnancy.jpg"; // optional: illustration for mother & pregnancy
  const IMG_REPAIR = "/images/repair.jpg"; // optional: illustration for vaginal repair / pelvic floor
  const IMG_CHILD = "/images/child-development.jpg"; // optional: child development illustration

  return (
    <div className="bg-gray-50 text-gray-800">
      {/* HERO with subtle image + shimmer */}
      <section
        className="relative bg-gradient-to-r from-blue-600 to-blue-400 text-white py-24 overflow-hidden"
        aria-label="Hero layanan"
      >
        <div className="absolute inset-0 opacity-10">
          <img src={POLI_IMAGE} alt="Poli Umum background" className="w-full h-full object-cover" />
        </div>
        <div className="relative max-w-6xl mx-auto px-6 text-center">
          <SparklesIcon className="w-12 h-12 mx-auto mb-4 text-white/90" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow-lg">Layanan Klinik Desidua</h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto drop-shadow-sm">
            Klinik ramah keluarga: komprehensif, berbasis bukti, dan peduli terhadap perjalanan ibu & anak — dari
            pemeriksaan rutin sampai intervensi spesialis.
          </p>
        </div>
      </section>

      {/* 3 Layanan Utama - lebih visual dan informatif */}
      <section className="py-16 max-w-7xl mx-auto px-6">
        <h2 className="text-3xl font-semibold text-blue-700 mb-8 text-center">Layanan Utama Kami</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {/* Ibu & Kehamilan */}
          <article className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition flex flex-col">
            <img src={IMG_PREGNANCY} alt="Ibu & Kehamilan" className="rounded-lg w-full h-44 object-cover mb-4" />
            <h3 className="text-xl font-semibold text-blue-700 mb-2">Ibu & Kehamilan</h3>
            <div className="prose text-sm text-gray-700">
              <p>
                Layanan antenatal komprehensif meliputi skrining risiko, pemeriksaan tekanan darah, pemeriksaan
                kebugaran janin, konseling nutrisi, serta manajemen komplikasi awal. Kami mengikuti prinsip-prinsip
                perawatan berbasis bukti untuk mengoptimalkan hasil perinatal dan pengalaman ibu selama kehamilan.
              </p>
              <p className="text-xs text-gray-500">(Rujukan ilmiah tersedia di bagian bawah.)</p>
            </div>
          </article>

          {/* Reparasi Vagina */}
          <article className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition flex flex-col">
            <img src={IMG_REPAIR} alt="Reparasi Vagina" className="rounded-lg w-full h-44 object-cover mb-4" />
            <h3 className="text-xl font-semibold text-blue-700 mb-2">Reparasi Vagina & Kesehatan Intim</h3>
            <div className="prose text-sm text-gray-700">
              <p>
                Penanganan gangguan panggul (mis. prolaps, robekan persalinan, disfungsi dasar panggul) dengan opsi
                konservatif (fisioterapi dasar panggul, pessary) sampai intervensi bedah rekonstruktif bila
                diperlukan. Pendekatan kami menekankan fungsi jangka panjang dan kualitas hidup.
              </p>
              <p className="text-xs text-gray-500">(Rujukan ilmiah tersedia di bagian bawah.)</p>
            </div>
          </article>

          {/* Tumbuh Kembang Anak */}
          <article className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition flex flex-col">
            <img src={IMG_CHILD} alt="Tumbuh Kembang Anak" className="rounded-lg w-full h-44 object-cover mb-4" />
            <h3 className="text-xl font-semibold text-blue-700 mb-2">Tumbuh Kembang Anak</h3>
            <div className="prose text-sm text-gray-700">
              <p>
                Pemantauan pertumbuhan menggunakan standar WHO, penilaian milestone perkembangan, konseling
                nutrisi, dan rujukan dini ke layanan perkembangan bila ditemukan keterlambatan. Intervensi dini dapat
                mengubah trajektori perkembangan anak secara signifikan.
              </p>
              <p className="text-xs text-gray-500">(Rujukan ilmiah tersedia di bagian bawah.)</p>
            </div>
          </article>
        </div>
      </section>

      {/* Layanan Umum / Lainnya + Carousel visual */}
      <section className="py-12 bg-blue-50">
        <div className="max-w-7xl mx-auto px-6 text-center mb-6">
          <h2 className="text-3xl font-semibold text-blue-700">Layanan Lainnya</h2>
          <p className="mt-4 text-gray-700 max-w-2xl mx-auto">
            Selain layanan utama, kami menyediakan layanan umum: pemeriksaan umum, imunisasi, konseling keluarga, dan
            skrining kesehatan berkala.
          </p>
        </div>

        {/* Carousel */}
        {otherServices.length > 0 ? (
          <div className="relative max-w-4xl mx-auto">
            <div className="overflow-hidden rounded-2xl shadow-lg bg-white">
              <div
                className="flex transition-transform duration-500"
                style={{ transform: `translateX(-${carouselIndex * 100}%)` }}
              >
                {otherServices.map((service) => (
                  <div key={service.id} className="flex-shrink-0 w-full p-8 flex gap-6 items-center">
                    {/* use the same Poli-Umum.jpg as requested */}
                    <img src={POLI_IMAGE} alt={service.name} className="w-40 h-32 object-cover rounded-lg shadow-sm" />
                    <div className="text-left">
                      <h3 className="text-xl font-semibold text-blue-700 mb-2">{service.name}</h3>
                      <p className="text-sm text-gray-700 truncate">{service.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation */}
            <button
              onClick={prev}
              className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-blue-700 text-white p-2 rounded-full shadow-lg hover:bg-blue-800 transition"
              aria-label="Previous"
            >
              <ChevronLeftIcon className="w-5 h-5" />
            </button>
            <button
              onClick={next}
              className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-blue-700 text-white p-2 rounded-full shadow-lg hover:bg-blue-800 transition"
              aria-label="Next"
            >
              <ChevronRightIcon className="w-5 h-5" />
            </button>

            {/* indicators */}
            <div className="flex gap-2 justify-center mt-4">
              {otherServices.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCarouselIndex(i)}
                  className={`w-3 h-3 rounded-full ${i === carouselIndex ? "bg-blue-700" : "bg-gray-300"}`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            <div className="rounded-2xl shadow-lg bg-white p-8">
              <p className="text-center text-gray-600">Tidak ada layanan lain yang ditemukan.</p>
            </div>
          </div>
        )}
      </section>

      <footer className="mt-12">
        <div className="h-24 bg-blue-700"></div>
      </footer>
    </div>
  );
}
