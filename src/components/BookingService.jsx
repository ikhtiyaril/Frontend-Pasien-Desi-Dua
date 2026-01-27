import React from "react";
import { 
  ChevronRight, 
  Clock, 
  DollarSign, 
  Video, 
  Stethoscope,
  MapPin
} from "lucide-react";

export default function BookingService({ service, onSelect }) {
  const { 
    name, 
    description, 
    duration_minutes, 
    price, 
    is_live,
    image_url,
    article
  } = service;

  // Format currency helper
  const formattedPrice = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(price || 0);

  return (
    <button
      onClick={() => onSelect(service)}
      className="group relative w-full text-left bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:border-blue-300 transition-all duration-300 overflow-hidden flex flex-col sm:flex-row"
    >
      {/* Accent Line (Animated) */}
      <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-blue-600 scale-y-0 group-hover:scale-y-100 transition-transform origin-bottom duration-300 z-10 hidden sm:block" />
      
      {/* --- IMAGE SECTION --- */}
      <div className="relative w-full sm:w-40 h-40 sm:h-auto shrink-0 overflow-hidden bg-gray-100">
        <img
          src={image_url || "https://via.placeholder.com/150"}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        
        {/* Badge Overlay */}
        <div className="absolute top-3 left-3">
           <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold shadow-sm backdrop-blur-sm border border-white/20 text-white ${
            is_live 
              ? "bg-purple-600/90"
              : "bg-blue-600/90"
          }`}>
            {is_live ? <Video className="w-3 h-3" /> : <Stethoscope className="w-3 h-3" />}
            {is_live ? "Telemedisin" : "Tatap Muka"}
          </span>
        </div>
      </div>

      {/* --- CONTENT SECTION --- */}
      <div className="flex-1 p-5 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start gap-4">
            <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-700 transition-colors line-clamp-2">
              {name}
            </h3>
            <div className="shrink-0 text-blue-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all duration-300">
               <ChevronRight className="w-6 h-6" />
            </div>
          </div>
          
          <p className="mt-2 text-sm text-gray-500 leading-relaxed line-clamp-2">
            {description || "Layanan kesehatan profesional untuk kebutuhan medis Anda."}
          </p>
          <a href={`/article/${article.slug}`} className="mt-2 text-sm text-blue-500 leading-relaxed line-clamp-2">Info Lebih Lanjut</a>
        </div>

        {/* --- FOOTER INFO --- */}
        <div className="mt-5 pt-4 border-t border-gray-50 flex items-center justify-between gap-4">
          <div className="flex flex-wrap gap-3 sm:gap-6">
            <InfoPill 
              icon={<Clock className="w-4 h-4 text-gray-400" />} 
              label={`${duration_minutes} Menit`} 
            />
            {is_live === false && (
                <InfoPill 
                icon={<MapPin className="w-4 h-4 text-gray-400" />} 
                label="Klinik Utama" 
              />
            )}
          </div>

          <div className="text-right">
            <span className="block text-xs text-gray-400 font-medium">Biaya</span>
            <span className={`text-base sm:text-lg font-bold ${
              price === 0 ? "text-green-600" : "text-blue-700"
            }`}>
              {price === 0 ? "Gratis" : formattedPrice}
            </span>
          </div>
        </div>
      </div>
    </button>
  );
}

// Sub-component untuk Info kecil (Durasi, Lokasi, dll)
function InfoPill({ icon, label }) {
  return (
    <div className="flex items-center gap-1.5">
      {icon}
      <span className="text-sm font-medium text-gray-600">{label}</span>
    </div>
  );
}