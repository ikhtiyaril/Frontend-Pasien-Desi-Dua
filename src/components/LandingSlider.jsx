import React, { useState, useEffect, useCallback,useNavigate } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import axios from 'axios';

const PromoCarousel = () => {
  const [bannerCards, setBannerCards] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL; // pakai env Vite
  const totalSlides = bannerCards.length;

  // Fetch bannerCards dari backend
  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/clinic-profile`); // endpoint backend
        if (res.data && res.data.bannerCards) {
          setBannerCards(res.data.bannerCards);
        }
      } catch (err) {
        console.error('Failed to fetch banner cards:', err);
      }
    };

    fetchBanner();
  }, [API_URL]);

  const goToSlide = useCallback((index) => {
    if (isTransitioning || totalSlides === 0) return;
    setIsTransitioning(true);
    setCurrentSlide(index);
    setTimeout(() => setIsTransitioning(false), 500);
  }, [isTransitioning, totalSlides]);

  const nextSlide = useCallback(() => {
    if(totalSlides === 0) return;
    goToSlide((currentSlide + 1) % totalSlides);
  }, [currentSlide, totalSlides, goToSlide]);

  const prevSlide = useCallback(() => {
    if(totalSlides === 0) return;
    goToSlide((currentSlide - 1 + totalSlides) % totalSlides);
  }, [currentSlide, totalSlides, goToSlide]);

  useEffect(() => {
    if (isPaused || totalSlides === 0) return;

    const interval = setInterval(nextSlide, 3000);
    return () => clearInterval(interval);
  }, [isPaused, nextSlide, totalSlides]);

  const handleMouseEnter = () => setIsPaused(true);
  const handleMouseLeave = () => setIsPaused(false);

  if (totalSlides === 0) return <div>Loading banners...</div>;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center p-4 md:p-8">
      <div 
        className="relative w-full overflow-hidden rounded-2xl shadow-2xl"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div 
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {bannerCards.map((banner, index) => (
            <div key={index} className="w-full flex-shrink-0">
              <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-6 md:p-10">
                <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10">
                  <div className="w-full md:w-1/2 order-2 md:order-1">
                    <h2 className="text-2xl md:text-4xl font-bold text-white mb-3 md:mb-4 leading-tight">
                      {banner.title}
                    </h2>
                    <p className="text-sm md:text-base text-blue-100 mb-6 md:mb-8 leading-relaxed">
                      {banner.description}
                    </p>
                  </div>
                  <div className="w-full md:w-1/2 order-1 md:order-2">
                    <div className="relative rounded-xl overflow-hidden shadow-2xl transform hover:scale-102 transition-transform duration-300">
                      <img
                        src={banner.image}
                        alt={banner.title}
                        className="w-full h-48 md:h-64 object-cover"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Prev/Next buttons */}
        <button
          onClick={prevSlide}
          disabled={isTransitioning}
          className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-white/90 hover:bg-white text-blue-600 rounded-full shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed z-20"
        >
          <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
        </button>
        <button
          onClick={nextSlide}
          disabled={isTransitioning}
          className="absolute right-3 md:right-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-white/90 hover:bg-white text-blue-600 rounded-full shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed z-20"
        >
          <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
        </button>

        {/* Dots */}
        <div className="absolute bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 md:gap-3 z-20">
          {bannerCards.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              disabled={isTransitioning}
              className={`transition-all duration-300 rounded-full ${
                currentSlide === index
                  ? 'w-8 md:w-10 h-2.5 md:h-3 bg-white shadow-lg'
                  : 'w-2.5 md:w-3 h-2.5 md:h-3 bg-white/50 hover:bg-white/75'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PromoCarousel;
