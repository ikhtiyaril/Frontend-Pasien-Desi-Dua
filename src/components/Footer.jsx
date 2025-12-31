export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t mt-12">
      <div className="max-w-7xl mx-auto px-6 py-12 grid md:grid-cols-4 gap-10">
        
        {/* Logo & Desc */}
        <div className="space-y-3">
          <h2 className="text-2xl font-semibold text-blue-700">
            Desidua Klinik
          </h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            Layanan kesehatan terpercaya dengan tenaga profesional
            dan fasilitas modern untuk kebutuhan medis Anda.
          </p>
        </div>

        {/* Navigation */}
        <div>
          <h3 className="font-semibold mb-4">Navigation</h3>
          <ul className="space-y-2 text-gray-600 text-sm">
            <li className="hover:text-blue-600 cursor-pointer">Home</li>
            <li className="hover:text-blue-600 cursor-pointer">Dokter</li>
            <li className="hover:text-blue-600 cursor-pointer">Artikel</li>
            <li className="hover:text-blue-600 cursor-pointer">Kontak</li>
          </ul>
        </div>

        {/* Info Klinik */}
        <div>
          <h3 className="font-semibold mb-4">Informasi Klinik</h3>
          <ul className="space-y-3 text-gray-600 text-sm">
            <li>
              <strong>Alamat:</strong> Ruko victory square no 11, Jalan Buaran Raya, Kec. Serpong, Tangerang Selatan 15310
            </li>
            <li>
              <strong>Jam Operasional:</strong><br />
              Senin–Sabtu: 08.00–20.00
            </li>
            <li>
              <strong>WhatsApp:</strong> <span className="text-blue-600">+62 811-8000-2350</span>
            </li>
            <li> <strong>Email:</strong> <br/>
            desiduaapotek@gmail.com</li>
          </ul>
        </div>

        {/* Social Media */}
        <div>
          <h3 className="font-semibold mb-4">Ikuti Kami</h3>
          <div className="flex space-x-4">
            
            {/* IG */}
            <a className="hover:opacity-70 cursor-pointer">
              <svg
                className="w-6 h-6 text-gray-700"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M7 2C4.24 2 2 4.24 2 7v10c0 2.76 2.24 5 5 5h10c2.76 0 5-2.24 5-5V7c0-2.76-2.24-5-5-5H7zm10 2c1.66 0 3 1.34 3 3v10c0 1.66-1.34 3-3 3H7c-1.66 0-3-1.34-3-3V7c0-1.66 1.34-3 3-3h10zm-5 3a5 5 0 100 10 5 5 0 000-10zm6.5-.25a1.25 1.25 0 110 2.5 1.25 1.25 0 010-2.5z" />
              </svg>
            </a>

            {/* FB */}
            <a className="hover:opacity-70 cursor-pointer">
              <svg
                className="w-6 h-6 text-gray-700"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M22 12a10 10 0 10-11.5 9.9v-7h-2v-2.9h2v-2.2c0-2 1.2-3.1 3-3.1.9 0 1.8.1 1.8.1v2h-1c-1 0-1.3.6-1.3 1.2v2h2.4L16 14.9h-2.5v7A10 10 0 0022 12z" />
              </svg>
            </a>

            {/* YouTube */}
            <a className="hover:opacity-70 cursor-pointer">
              <svg
                className="w-7 h-7 text-gray-700"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M10 15l5.19-3L10 9v6zm12-3c0-2.5-.2-4.1-.5-5.1-.3-1-1-1.8-2-2C18.6 4.4 12 4.4 12 4.4s-6.6 0-7.5.5c-1 .3-1.7 1-2 2C2.2 7.9 2 9.5 2 12s.2 4.1.5 5.1c.3 1 1 1.8 2 2 .9.5 7.5.5 7.5.5s6.6 0 7.5-.5c1-.3 1.7-1 2-2 .3-1 .5-2.6.5-5.1z" />
              </svg>
            </a>

          </div>
        </div>
      </div>

      <div className="border-t py-4 text-center text-sm text-gray-600">
        © {new Date().getFullYear()} Desi Dua Klinik — All rights reserved.
      </div>
    </footer>
  );
}
