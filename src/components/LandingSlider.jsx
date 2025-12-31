import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const promoData = [
  {
    id: 1,
    imageUrl: 'https://placehold.co/600x400/3b82f6/ffffff?text=Vitamins+50%25+Off',
    title: 'Vitamin Discount 50%',
    description: 'Get healthy with our premium vitamins at half price! Limited time offer for your wellness journey.',
    buttonText: 'Shop Now',
    buttonLink: '#vitamins'
  },
  {
    id: 2,
    imageUrl: 'https://placehold.co/600x400/2563eb/ffffff?text=Buy+1+Get+1',
    title: 'Buy 1 Get 1 Beauty',
    description: 'Double your beauty essentials! Buy any beauty product and get one absolutely free.',
    buttonText: 'Claim Offer',
    buttonLink: '#beauty'
  },
  {
    id: 3,
    imageUrl: 'https://placehold.co/600x400/1d4ed8/ffffff?text=Medicine+Rp+100K',
    title: 'Medicine Rp 100.000',
    description: 'All essential medicines starting from Rp 100.000. Quality healthcare accessible for everyone.',
    buttonText: 'Browse Now',
    buttonLink: '#medicine'
  }
];

const PromoCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const totalSlides = promoData.length;

  const goToSlide = useCallback((index) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide(index);
    setTimeout(() => setIsTransitioning(false), 500);
  }, [isTransitioning]);

  const nextSlide = useCallback(() => {
    goToSlide((currentSlide + 1) % totalSlides);
  }, [currentSlide, totalSlides, goToSlide]);

  const prevSlide = useCallback(() => {
    goToSlide((currentSlide - 1 + totalSlides) % totalSlides);
  }, [currentSlide, totalSlides, goToSlide]);

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      nextSlide();
    }, 3000);

    return () => clearInterval(interval);
  }, [isPaused, nextSlide]);

  const handleMouseEnter = () => setIsPaused(true);
  const handleMouseLeave = () => setIsPaused(false);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center p-4 md:p-8">
      <div 
        className="relative w-full  overflow-hidden rounded-2xl shadow-2xl"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div 
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {promoData.map((promo) => (
            <div
              key={promo.id}
              className="w-full flex-shrink-0"
            >
              <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-6 md:p-10">
                <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10">
                  <div className="w-full md:w-1/2 order-2 md:order-1">
                    <span className="inline-block px-3 py-1 mb-4 text-xs font-semibold tracking-wider text-blue-600 bg-white rounded-full uppercase">
                      Special Offer
                    </span>
                    
                    <h2 className="text-2xl md:text-4xl font-bold text-white mb-3 md:mb-4 leading-tight">
                      {promo.title}
                    </h2>
                    
                    <p className="text-sm md:text-base text-blue-100 mb-6 md:mb-8 leading-relaxed">
                      {promo.description}
                    </p>
                    
                    <a
                      href={promo.buttonLink}
                      className="inline-flex items-center px-6 py-3 md:px-8 md:py-4 bg-white text-blue-600 font-semibold text-sm md:text-base rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 hover:bg-blue-50"
                    >
                      {promo.buttonText}
                      <ChevronRight className="ml-2 w-4 h-4 md:w-5 md:h-5" />
                    </a>
                  </div>
                  
                  <div className="w-full md:w-1/2 order-1 md:order-2">
                    <div className="relative rounded-xl overflow-hidden shadow-2xl transform hover:scale-102 transition-transform duration-300">
                      <div className="absolute inset-0 bg-gradient-to-t from-blue-900/20 to-transparent z-10" />
                      <img
                        src={promo.imageUrl}
                        alt={promo.title}
                        className="w-full h-48 md:h-64 object-cover"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={prevSlide}
          disabled={isTransitioning}
          className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-white/90 hover:bg-white text-blue-600 rounded-full shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed z-20"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
        </button>

        <button
          onClick={nextSlide}
          disabled={isTransitioning}
          className="absolute right-3 md:right-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-white/90 hover:bg-white text-blue-600 rounded-full shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed z-20"
          aria-label="Next slide"
        >
          <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
        </button>

        <div className="absolute bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 md:gap-3 z-20">
          {promoData.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              disabled={isTransitioning}
              className={`transition-all duration-300 rounded-full ${
                currentSlide === index
                  ? 'w-8 md:w-10 h-2.5 md:h-3 bg-white shadow-lg'
                  : 'w-2.5 md:w-3 h-2.5 md:h-3 bg-white/50 hover:bg-white/75'
              }`}
              aria-label={`Go to slide ${index + 1}`}
              aria-current={currentSlide === index ? 'true' : 'false'}
            />
          ))}
        </div>

        <div className="absolute top-4 right-4 md:top-6 md:right-6 z-20">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-full">
            <span className="text-xs md:text-sm font-medium text-white">
              {currentSlide + 1} / {totalSlides}
            </span>
            {isPaused && (
              <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
            )}
          </div>
        </div>

        <div className="absolute bottom-0 left-0 w-full h-1 bg-white/20 z-20">
          <div 
            className="h-full bg-white transition-all duration-300 ease-linear"
            style={{ 
              width: isPaused ? `${((currentSlide + 1) / totalSlides) * 100}%` : '0%',
              animation: isPaused ? 'none' : 'progress 3s linear infinite'
            }}
          />
        </div>

        <style>{`
          @keyframes progress {
            from { width: 0%; }
            to { width: 100%; }
          }
        `}</style>
      </div>
    </div>
  );
};

export default PromoCarousel;