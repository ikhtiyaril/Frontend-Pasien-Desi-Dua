import { useEffect, useState } from "react";
import axios from "axios";
import { Navigate, useNavigate } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_URL; 

export default function ProductListing() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [selectedCategory, setSelectedCategory] = useState("");
  const [search, setSearch] = useState("");
  const [prescriptionFilter, setPrescriptionFilter] = useState("");

  const [loading, setLoading] = useState(true);
  const navigate = useNavigate()
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/api/medicine/products`, {
        params: {
          category: selectedCategory,
          q: search,
        },
      });
      setProducts(res.data.data || []);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/categories`);
      setCategories(res.data.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  // apply filter prescription locally
  const filteredProducts = products.filter((p) => {
    if (prescriptionFilter === "need") return p.is_prescription_required;
    if (prescriptionFilter === "no-need") return !p.is_prescription_required;
    return true;
  });

  return (
    <div className="min-h-screen bg-blue-50 p-6">
      <div className="max-w-6xl mx-auto">

        {/* TITLE */}
        <h1 className="text-3xl font-bold text-blue-700 mb-6">
          Daftar Produk Obat
        </h1>

        {/* FILTER SECTION */}
        <div className="bg-white p-4 rounded-xl shadow mb-6 flex flex-col md:flex-row gap-4">

          {/* Search */}
          <input
            type="text"
            placeholder="Cari obat…"
            className="border p-3 rounded-lg w-full"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && fetchProducts()}
          />

          {/* Category Filter */}
          <select
            className="border p-3 rounded-lg w-full md:w-48"
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              fetchProducts();
            }}
          >
            <option value="">Semua Kategori</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Prescription Filter */}
          <select
            className="border p-3 rounded-lg w-full md:w-48"
            value={prescriptionFilter}
            onChange={(e) => setPrescriptionFilter(e.target.value)}
          >
            <option value="">Semua Produk</option>
            <option value="need">Butuh Resep</option>
            <option value="no-need">Tidak Butuh Resep</option>
          </select>

          {/* Button Search */}
          <button
            onClick={fetchProducts}
            className="bg-blue-600 text-white px-6 rounded-lg font-medium hover:bg-blue-700"
          >
            Cari
          </button>
        </div>

        {/* LOADING */}
        {loading && (
          <div className="text-center py-10 text-blue-600 font-medium">
            Loading produk…
          </div>
        )}

        {/* EMPTY STATE */}
        {!loading && filteredProducts.length === 0 && (
          <div className="text-center py-10 text-gray-500">
            Produk tidak ditemukan.
          </div>
        )}

        {/* PRODUCT GRID */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {!loading &&
            filteredProducts.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl shadow hover:shadow-lg transition p-3"
              >
                {/* Image */}
                <div className="w-full h-36 bg-blue-100 rounded-lg flex items-center justify-center overflow-hidden">
                  <img
                    src={item.image_url || "/no-image.png"}
                    className="h-full object-cover"
                    alt={item.name}
                  />
                </div>

                <h2 className="font-semibold text-md mt-3 text-gray-800 line-clamp-2">
                  {item.name}
                </h2>

                <p className="text-blue-600 font-bold mt-1">
                  Rp {Number(item.price).toLocaleString("id-ID")}
                </p>

                {/* Stock */}
                <p
                  className={`mt-1 text-sm ${
                    item.stock > 0 ? "text-green-600" : "text-red-500"
                  }`}
                >
                  {item.stock > 0
                    ? `Stok: ${item.stock}`
                    : "Stok Habis"}
                </p>

                {/* Prescription Label */}
                {item.is_prescription_required && (
                  <span className="inline-block bg-red-100 text-red-600 text-xs mt-2 px-2 py-1 rounded-lg">
                    Butuh Resep
                  </span>
                )}

                {/* Button Detail */}
                <button
                  onClick={() => navigate("/medicine/detail", { state: { products_id: item.id } })}
                  className="mt-3 block bg-blue-600 text-white text-center py-2 rounded-lg hover:bg-blue-700 p-3"
                >
                  Lihat Detail
                </button>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
