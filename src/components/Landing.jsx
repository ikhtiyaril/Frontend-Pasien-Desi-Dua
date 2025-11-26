import React from 'react'

const Landing = () => {
   return (
    <div className="w-full bg-linear-to-b from-blue-600 to-blue-800 text-white">
      {/* HERO SECTION */}
      <div className="max-w-7xl mx-auto px-6 py-20 flex flex-col md:flex-row items-center gap-12">
        
        {/* LEFT TEXT */}
        <div className="flex-1">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
            Your Health, <span className="text-blue-200">Connected in One App</span>
          </h1>
          <p className="text-blue-100 text-lg md:text-xl mb-8">
            A seamless digital clinic designed for easy consultations, online booking,
            medicine access, and trusted health education.
          </p>

          <div className="flex gap-4">
            <button className="px-6 py-3 bg-white text-blue-700 font-semibold rounded-xl shadow-md hover:opacity-90 transition">
              Start Your Journey
            </button>
            <button className="px-6 py-3 border border-white text-white font-semibold rounded-xl hover:bg-white hover:text-blue-700 transition">
              Explore Features
            </button>
          </div>
        </div>

        {/* RIGHT SIDE — Floating cards illustration */}
        <div className="flex-1 flex justify-center relative">
          <div className="bg-white text-blue-800 w-64 p-4 rounded-2xl shadow-xl absolute -top-6 -right-2 rotate-3">
            <p className="font-semibold">Live Consultation</p>
            <p className="text-sm opacity-70">Video call with certified doctors</p>
          </div>

          <div className="bg-white text-blue-800 w-64 p-4 rounded-2xl shadow-xl absolute bottom-0 right-10 -rotate-3">
            <p className="font-semibold">Booking Online</p>
            <p className="text-sm opacity-70">Real-time doctor schedules</p>
          </div>

          <div className="bg-white text-blue-800 w-64 p-4 rounded-2xl shadow-xl absolute top-16 left-2 rotate-6">
            <p className="font-semibold">Drug Marketplace</p>
            <p className="text-sm opacity-70">Trusted medical shopping</p>
          </div>

          <div className="bg-white text-blue-800 w-64 p-4 rounded-2xl shadow-xl absolute bottom-12 -left-6 -rotate-6">
            <p className="font-semibold">Get Education</p>
            <p className="text-sm opacity-70">Daily health insights</p>
          </div>
        </div>
      </div>

      {/* FEATURES SECTION */}
      <div className="bg-white text-blue-900 py-16">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-6">

          {/* CARD 1 */}
          <div className="p-6 rounded-2xl shadow-md border hover:shadow-lg transition">
            <h3 className="text-xl font-bold">Live Consultation</h3>
            <p className="text-sm mt-2 text-gray-600">
              Video call langsung dengan dokter pilihan Anda.
            </p>
          </div>

          {/* CARD 2 */}
          <div className="p-6 rounded-2xl shadow-md border hover:shadow-lg transition">
            <h3 className="text-xl font-bold">Booking Online</h3>
            <p className="text-sm mt-2 text-gray-600">
              Jadwal dokter real-time dan proses booking cepat.
            </p>
          </div>

          {/* CARD 3 */}
          <div className="p-6 rounded-2xl shadow-md border hover:shadow-lg transition">
            <h3 className="text-xl font-bold">Drug Marketplace</h3>
            <p className="text-sm mt-2 text-gray-600">
              Akses obat terpercaya dengan pengiriman cepat.
            </p>
          </div>

          {/* CARD 4 */}
          <div className="p-6 rounded-2xl shadow-md border hover:shadow-lg transition">
            <h3 className="text-xl font-bold">Get Education</h3>
            <p className="text-sm mt-2 text-gray-600">
              Artikel edukasi kesehatan terbaru setiap hari.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Landing