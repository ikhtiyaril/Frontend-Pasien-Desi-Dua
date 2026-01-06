import React, { useEffect, useState, useRef } from "react";
import { ChevronLeft, ChevronRight, Sparkles, CheckCircle } from "lucide-react";

export default function Services() {
  const [mainServices, setMainServices] = useState([]);
  const [otherServices, setOtherServices] = useState([]);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const autoplayRef = useRef(null);

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetch(`${API_URL}/api/clinic-profile`)
      .then(res => res.json())
      .then((data) => {
        const serviceCards = data.serviceCards || [];
        setMainServices(serviceCards);
      })
      .catch((err) => console.error("Gagal fetch clinic profile:", err));
  }, []);

  useEffect(() => {
    fetch(`${API_URL}/api/service`)
      .then(res => res.json())
      .then((data) => {
        const filtered = data.filter(
          (s) =>
            !["Ibu & Kehamilan", "Reparasi Vagina", "Tumbuh Kembang Anak"].includes(s.name)
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

  useEffect(() => {
    if (!otherServices.length) return;
    autoplayRef.current = setInterval(() => {
      setCarouselIndex((i) => (i + 1) % otherServices.length);
    }, 4500);
    return () => clearInterval(autoplayRef.current);
  }, [otherServices.length]);

  const POLI_IMAGE = "Poli-Umum.jpg";

  return (
    <div className="bg-white text-gray-800 min-h-screen">
      {/* HERO */}
      <section className="relative bg-blue-600 text-white py-20 md:py-28">
        <div className="absolute inset-0 bg-blue-700 opacity-10"></div>
        <div className="relative max-w-6xl mx-auto px-6 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 rounded-2xl mb-6">
            <img src="Desi Dua Putih.png" alt="" className="h-20 w-20" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Layanan Klinik Desidua</h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto text-blue-50">
            Klinik ramah keluarga: komprehensif, berbasis bukti, dan peduli terhadap perjalanan ibu & anak.
          </p>
        </div>
      </section>

      {/* Program Unggulan - Alternating Layout */}
      <section className="py-16 md:py-24 max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Program Unggulan Kami</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Layanan terbaik yang dirancang khusus untuk kesehatan dan kesejahteraan keluarga Anda
          </p>
        </div>

        <div className="space-y-20">
          {mainServices.map((service, index) => (
            <article 
              key={service.title}
              className={`flex flex-col ${
                index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
              } gap-8 md:gap-12 items-center`}
            >
              {/* Image Side */}
              <div className="w-full md:w-1/2">
                <div className="relative group">
                  <div className="absolute inset-0 bg-blue-600 rounded-3xl transform rotate-3 group-hover:rotate-6 transition-transform duration-300"></div>
                  <img
                    src={service.image || "/images/default-service.jpg"}
                    alt={service.title}
                    className="relative rounded-3xl w-full h-80 md:h-96 object-cover shadow-2xl"
                  />
                </div>
              </div>

              {/* Content Side */}
              <div className="w-full md:w-1/2 space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-semibold">
                  <CheckCircle className="w-4 h-4" />
                  Program Unggulan
                </div>
                
                <h3 className="text-3xl md:text-4xl font-bold text-gray-900">
                  {service.title}
                </h3>
                
                <div className="w-16 h-1 bg-blue-600 rounded-full"></div>
                
                <p className="text-gray-600 text-lg leading-relaxed">
                  {service.description}
                </p>

                <div className="pt-4">
                  <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors shadow-lg hover:shadow-xl">
                    Pelajari Lebih Lanjut
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Carousel Layanan Lain */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Layanan Lainnya</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Selain layanan utama, kami menyediakan berbagai layanan umum, pemeriksaan, imunisasi, dan konseling keluarga
            </p>
          </div>

          {otherServices.length > 0 ? (
            <div className="relative max-w-5xl mx-auto">
              {/* Carousel Container */}
              <div className="overflow-hidden rounded-2xl bg-white shadow-xl">
                <div
                  className="flex transition-transform duration-700 ease-in-out"
                  style={{ transform: `translateX(-${carouselIndex * 100}%)` }}
                >
                  {otherServices.map((service) => (
                    <div 
                      key={service.id} 
                      className="flex-shrink-0 w-full"
                    >
                      <div className="flex flex-col md:flex-row gap-8 p-8 md:p-12 items-center">
                        {/* Image */}
                        <div className="w-full md:w-2/5">
                          <div className="relative">
                            <div className="absolute inset-0 bg-blue-500 rounded-2xl transform -rotate-2"></div>
                            <img 
                              src={POLI_IMAGE} 
                              alt={service.name}
                              className="relative rounded-2xl w-full h-64 md:h-72 object-cover shadow-lg"
                            />
                          </div>
                        </div>

                        {/* Content */}
                        <div className="w-full md:w-3/5 space-y-4">
                          <div className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs font-semibold">
                            Layanan Umum
                          </div>
                          
                          <h3 className="text-2xl md:text-3xl font-bold text-gray-900">
                            {service.name}
                          </h3>
                          
                          <p className="text-gray-600 leading-relaxed">
                            {service.description}
                          </p>

                          <div className="flex items-center gap-3 pt-2">
                            <div className="flex items-center gap-1">
                              <CheckCircle className="w-5 h-5 text-blue-600" />
                              <span className="text-sm text-gray-700">Profesional</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <CheckCircle className="w-5 h-5 text-blue-600" />
                              <span className="text-sm text-gray-700">Terpercaya</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Navigation Buttons */}
              <button 
                onClick={prev}
                className="absolute top-1/2 -left-4 md:-left-6 transform -translate-y-1/2 w-12 h-12 bg-white hover:bg-blue-600 text-blue-600 hover:text-white rounded-full shadow-xl flex items-center justify-center transition-all duration-300 group"
                aria-label="Previous service"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              
              <button 
                onClick={next}
                className="absolute top-1/2 -right-4 md:-right-6 transform -translate-y-1/2 w-12 h-12 bg-white hover:bg-blue-600 text-blue-600 hover:text-white rounded-full shadow-xl flex items-center justify-center transition-all duration-300 group"
                aria-label="Next service"
              >
                <ChevronRight className="w-6 h-6" />
              </button>

              {/* Dots Indicator */}
              <div className="flex justify-center gap-2 mt-8">
                {otherServices.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCarouselIndex(index)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      index === carouselIndex 
                        ? 'w-8 bg-blue-600' 
                        : 'w-2 bg-gray-300 hover:bg-gray-400'
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="max-w-5xl mx-auto">
              <div className="rounded-2xl bg-white p-12 text-center shadow-xl">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-600">Tidak ada layanan lain yang tersedia saat ini.</p>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}