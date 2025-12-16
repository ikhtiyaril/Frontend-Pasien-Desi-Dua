import { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL;

export default function PromoCarousel() {
  const [products, setProducts] = useState([]);
  const [index, setIndex] = useState(0);
  const [expandedId, setExpandedId] = useState(null);


  const shuffleArray = (arr) => [...arr].sort(() => Math.random() - 0.5);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/medicine/products`);
      const data = res.data.data || [];
      setProducts(shuffleArray(data).slice(0, 8));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (!products.length) return;
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % products.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [products]);

  if (!products.length) return null;

  return (
    <div className="w-full bg-gradient-to-r from-blue-50 to-white py-5">
      
      <div className="relative w-full overflow-hidden">
        <div
          className="flex transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {products.map((item) => (
            <div
              key={item.id}
              className="min-w-full "
            >
              <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-lg p-8 grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                
                {/* GRID 1 – FOTO */}
                <div className="flex justify-center">
                  <img
                    src={item.image_url || "/no-image.png"}
                    alt={item.name}
                    className="w-60 h-60 object-cover rounded-xl bg-blue-50"
                  />
                </div>

                {/* GRID 2 – NAMA & DESKRIPSI */}
              <div>
  <h3 className="text-2xl font-semibold text-gray-800 mb-3">
    {item.name}
  </h3>

  <p className="text-gray-600 leading-relaxed">
    {expandedId === item.id
      ? item.description
      : item.description?.slice(0, 150)}

    {item.description?.length > 150 && (
      <span
        onClick={() =>
          setExpandedId(expandedId === item.id ? null : item.id)
        }
        className="text-blue-600 font-medium cursor-pointer ml-1 hover:underline"
      >
        {expandedId === item.id ? " Show less" : " Read more"}
      </span>
    )}
  </p>
</div>


                {/* GRID 3 – DETAIL & KERANJANG */}
                <div className="flex flex-col items-center md:items-end gap-4">
                  
                  {/* Logo Placeholder */}
                  <img
                    src="/info.png"
                    alt="Logo"
                    className="w-8 h-8 object-contain opacity-60"
                  />

                  <p className="text-xl font-bold text-blue-600">
                    Rp {Number(item.price).toLocaleString("id-ID")}
                  </p>

                  {item.is_prescription_required && (
                    <p className="text-red-500 text-sm text-center md:text-right">
                      *Butuh resep dokter
                    </p>
                  )}

                  <button className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition">
                    <img
                      src="/cart.png"
                      alt="Keranjang"
                      className="w-5 h-5 filter invert sepia saturate-500 hue-rotate-180"
                    />
                    Masukkan Keranjang
                  </button>
                </div>

              </div>
            </div>
          ))}
        </div>

        {/* DOT NAVIGATION */}
        <div className="flex justify-center mt-6 gap-2">
          {products.map((_, i) => (
            <span
              key={i}
              onClick={() => setIndex(i)}
              className={`w-3 h-3 rounded-full cursor-pointer transition ${
                index === i ? "bg-blue-600" : "bg-gray-300"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
