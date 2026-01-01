import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Quote, Star, BadgeCheck } from 'lucide-react';

const testimonialData = [
  {
    id: 1,
    name: "SAINEM WIYONO",
    avatar: "https://placehold.co/100x100/2563eb/ffffff?text=SW",
    testimonial: "Sangat membantu.. malam2 butuh obat, gak perlu keluar rumah. Pelayanannya cepat dan obatnya langsung diantar ke rumah. Recommended banget!",
    buttonText: "Beli Obat",
    buttonLink: "/medicine",
    rating: 5
  },
  {
    id: 2,
    name: "LINTANG ANINDHITYA INDRASWARI",
    avatar: "https://placehold.co/100x100/2563eb/ffffff?text=LA",
    testimonial: "Sangat Helpful!!! Terima kasih yaa, sangat menghemat waktu dan respon dokternya juga baik. Resep obatnya juga manjur sekali. Thank u ya 🥰 semoga kedepannya tambah keren lagi.",
    buttonText: "Chat dengan Dokter",
    buttonLink: "/booking",
    rating: 5
  },
  {
    id: 3,
    name: "AHKBAR FELAYATI",
    avatar: "https://placehold.co/100x100/2563eb/ffffff?text=AF",
    testimonial: "Menggunakan Halodoc untuk pemanggilan Home Service kesehatan. Sangat memuaskan, walau di proses perlu perubahan jasa medis, tetap dilayani dengan cepat, dan proses refund mudah & cepat. Semoga bisa dipertahankan 💕",
    buttonText: "Pesan Tes Lab",
    buttonLink: "/booking",
    rating: 5
  },
  {
    id: 4,
    name: "DEWI KARTIKA SARI",
    avatar: "https://placehold.co/100x100/2563eb/ffffff?text=DK",
    testimonial: "Klinik Dasi Dua sangat profesional dan ramah. Dokternya sabar menjelaskan kondisi kesehatan saya. Fasilitas bersih dan nyaman. Sangat direkomendasikan untuk keluarga!",
    buttonText: "Booking Dokter",
    buttonLink: "/booking",
    rating: 5
  },
  {
    id: 5,
    name: "BUDI SANTOSO",
    avatar: "https://placehold.co/100x100/2563eb/ffffff?text=BS",
    testimonial: "Pelayanan cepat dan tidak perlu antri lama. Aplikasinya mudah digunakan untuk booking jadwal. Staff klinik sangat helpful dan komunikatif.",
    buttonText: "Daftar Sekarang",
    buttonLink: "/register",
    rating: 5
  },
  {
    id: 6,
    name: "RATNA PERMATA",
    avatar: "https://placehold.co/100x100/2563eb/ffffff?text=RP",
    testimonial: "Sudah berlangganan di Klinik Dasi Dua selama 2 tahun. Kualitas pelayanan konsisten bagus. Harga terjangkau dengan kualitas premium. Terima kasih!",
    buttonText: "Lihat Layanan",
    buttonLink: "/layanan",
    rating: 5
  }
];

const StarRating = ({ rating }) => {
  return (
    <div className="flex items-center gap-0.5">
      {[...Array(5)].map((_, index) => (
        <Star
          key={index}
          className={`w-4 h-4 ${
            index < rating 
              ? 'fill-blue-500 text-blue-500' 
              : 'fill-gray-200 text-gray-200'
          }`}
        />
      ))}
    </div>
  );
};

const TestimonialCard = ({ testimonial }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mx-2 h-full flex flex-col relative overflow-hidden group hover:shadow-xl transition-shadow duration-300">
      <div className="absolute top-4 right-4 opacity-10 group-hover:opacity-20 transition-opacity duration-300">
        <Quote className="w-16 h-16 md:w-20 md:h-20 text-blue-600" />
      </div>
      
      <div className="flex items-center gap-4 mb-4 relative z-10">
        <div className="relative">
          <div className="w-14 h-14 md:w-16 md:h-16 rounded-full border-3 border-blue-500 p-0.5 bg-gradient-to-br from-blue-500 to-blue-700">
            <img
              src={testimonial.avatar}
              alt={testimonial.name}
              className="w-full h-full rounded-full object-cover"
            />
          </div>
          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
            <BadgeCheck className="w-3.5 h-3.5 text-white" />
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-gray-800 text-sm md:text-base truncate">
            {testimonial.name}
          </h4>
          <div className="flex items-center gap-2 mt-1">
            <StarRating rating={testimonial.rating} />
            <span className="text-xs text-blue-600 font-medium bg-blue-50 px-2 py-0.5 rounded-full">
              Verified
            </span>
          </div>
        </div>
      </div>
      
      <div className="flex-1 relative z-10">
        <Quote className="w-5 h-5 text-blue-500 mb-2 opacity-60" />
        <p className="text-gray-600 text-sm md:text-base leading-relaxed line-clamp-4">
          {testimonial.testimonial}
        </p>
      </div>
      
      <div className="mt-6 pt-4 border-t border-gray-100 relative z-10">
        <a
          href={testimonial.buttonLink}
          className="inline-flex items-center justify-center w-full px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-medium rounded-xl shadow-md hover:shadow-lg transform hover:scale-102 transition-all duration-300 hover:from-blue-700 hover:to-blue-800"
        >
          {testimonial.buttonText}
          <ChevronRight className="w-4 h-4 ml-1" />
        </a>
      </div>
    </div>
  );
};

const TestimonialCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [cardsToShow, setCardsToShow] = useState(3);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setCardsToShow(1);
      } else if (window.innerWidth < 1024) {
        setCardsToShow(2);
      } else {
        setCardsToShow(3);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const totalSlides = Math.ceil(testimonialData.length / cardsToShow);

  const goToSlide = useCallback((index) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex(index);
    setTimeout(() => setIsTransitioning(false), 500);
  }, [isTransitioning]);

  const nextSlide = useCallback(() => {
    const next = (currentIndex + 1) % totalSlides;
    goToSlide(next);
  }, [currentIndex, totalSlides, goToSlide]);

  const prevSlide = useCallback(() => {
    const prev = (currentIndex - 1 + totalSlides) % totalSlides;
    goToSlide(prev);
  }, [currentIndex, totalSlides, goToSlide]);

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      nextSlide();
    }, 4000);

    return () => clearInterval(interval);
  }, [isPaused, nextSlide]);

  const getVisibleTestimonials = () => {
    const start = currentIndex * cardsToShow;
    const items = [];
    for (let i = 0; i < cardsToShow; i++) {
      const index = (start + i) % testimonialData.length;
      items.push(testimonialData[index]);
    }
    return items;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 py-12 md:py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10 md:mb-14">
          <span className="inline-block px-4 py-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm font-semibold rounded-full mb-4">
            Testimonial
          </span>
          <h2 className="text-2xl md:text-4xl font-bold text-gray-800 dark:text-white mb-3">
            Kata Mereka tentang{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-700">
              Klinik Desidua
            </span>
          </h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto text-sm md:text-base">
            Ribuan pelanggan telah merasakan layanan kesehatan terbaik dari kami. Berikut adalah cerita mereka.
          </p>
        </div>

        <div
          className="relative"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <button
            onClick={prevSlide}
            disabled={isTransitioning}
            className="absolute left-0 md:-left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed border border-gray-100 dark:border-gray-700"
            aria-label="Previous testimonials"
          >
            <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
          </button>

          <button
            onClick={nextSlide}
            disabled={isTransitioning}
            className="absolute right-0 md:-right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed border border-gray-100 dark:border-gray-700"
            aria-label="Next testimonials"
          >
            <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
          </button>

          <div className="overflow-hidden px-8 md:px-12">
            <div
              className="flex transition-opacity duration-500 ease-in-out"
              style={{ opacity: isTransitioning ? 0.5 : 1 }}
            >
              <div className={`grid gap-4 md:gap-6 w-full ${
                cardsToShow === 1 ? 'grid-cols-1' : 
                cardsToShow === 2 ? 'grid-cols-2' : 
                'grid-cols-3'
              }`}>
                {getVisibleTestimonials().map((testimonial, idx) => (
                  <div key={`${testimonial.id}-${idx}`} className="h-full">
                    <TestimonialCard testimonial={testimonial} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 mt-8">
            {[...Array(totalSlides)].map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                disabled={isTransitioning}
                className={`transition-all duration-300 rounded-full ${
                  currentIndex === index
                    ? 'w-8 md:w-10 h-2.5 md:h-3 bg-gradient-to-r from-blue-600 to-blue-700 shadow-md'
                    : 'w-2.5 md:w-3 h-2.5 md:h-3 bg-gray-300 dark:bg-gray-600 hover:bg-blue-400'
                }`}
                aria-label={`Go to slide ${index + 1}`}
                aria-current={currentIndex === index ? 'true' : 'false'}
              />
            ))}
          </div>

          <div className="flex items-center justify-center mt-4">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-gray-800 rounded-full shadow-sm border border-gray-100 dark:border-gray-700">
              <span className="text-xs md:text-sm text-gray-500 dark:text-gray-400">
                {currentIndex + 1} / {totalSlides}
              </span>
              {isPaused && (
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
                  <span className="text-xs text-blue-500">Paused</span>
                </div>
              )}
            </div>
          </div>
        </div>

        
      </div>
    </div>
  );
};

export default TestimonialCarousel;