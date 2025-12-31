import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

/**
 * MedicineSection Component
 * Menampilkan daftar obat & suplemen berbasis kategori
 * Data diambil dari backend (Sequelize + Express)
 */
export default function MedicineLanding() {
  const navigate = useNavigate();
  const [medicines, setMedicines] = useState([]);
  const [category, setCategory] = useState(1);
  const [loading, setLoading] = useState(false);
  const [categories,setCategories]= useState([])

  const API_BASE_URL = import.meta.env.VITE_API_URL;


  const categoriess = [
    { id: 1, label: "Vitamin & Suplemen" },
    { id: 2, label: "Kecantikan & Perawatan Diri" },
    { id: 3, label: "Kesehatan Seksual" },
  ];

const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE_URL}/api/categories`);
      console.log(res.data.data)
      setCategories(res.data.data);
    } catch (err) {
      console.error("Failed to fetch categories:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMedicines = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE_URL}/api/medicine/products`);
      console.log(res.data.data)
      setMedicines(res.data.data);
    } catch (err) {
      console.error("Failed to fetch medicines:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedicines();
    fetchCategories();
  }, [category]);

  const formatCurrency = (value) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);

  return (
    <section className="max-w-7xl mx-auto px-6 py-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Beli Obat & Suplemen Kesehatan
        </h2>

        <button
          onClick={() => navigate("/medicine")}
          className="text-blue-600 font-medium hover:underline"
        >
          Lihat Semua Kategori Obat →
        </button>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-3 flex-wrap mb-8">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setCategory(cat.id)}
            className={`px-4 py-2 rounded-full border transition
              ${
                category === cat.id
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-blue-600 border-blue-200 hover:bg-blue-50"
              }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <p className="text-center text-gray-500">Memuat data...</p>
      ) : medicines.length === 0 ? (
        <p className="text-center text-gray-500">
          Produk tidak ditemukan.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {medicines.map((item) => (
            <div
              key={item.id}
                onClick={() =>
                  navigate("/medicine/detail", {
                    state: { products_id: item.id },
                  })
                }
              className="bg-white rounded-xl border border-blue-100 shadow-sm hover:shadow-md transition"
            >
              {/* Image */}
              <div className="h-40 bg-blue-50 flex items-center justify-center rounded-t-xl">
                <img
                  src={item.image_url || "/placeholder.png"}
                  alt={item.name}
                  className="h-28 object-contain"
                />
              </div>

              {/* Body */}
              <div className="p-4 space-y-2">
                <h3 className="font-semibold text-gray-800 line-clamp-2">
                  {item.name}
                </h3>

                <p className="text-sm text-gray-500">
                  {item.category?.name}
                </p>

                <p className="font-bold text-blue-600">
                  {formatCurrency(item.price)}
                </p>

                
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="text-center mt-10">
        <button
          onClick={() => navigate("/medicine")}
          className="text-blue-600 font-medium hover:underline"
        >
          Lihat Semua Obat Vitamin & Suplemen →
        </button>
      </div>
    </section>
  );
}
