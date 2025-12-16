import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import PromoCarousel from "./PromoCorousel";

const API_BASE = import.meta.env.VITE_API_URL;
const ITEMS_PER_PAGE_MOBILE = 6;

export default function ProductListing() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [selectedCategory, setSelectedCategory] = useState("");
  const [search, setSearch] = useState("");
  const [prescriptionFilter, setPrescriptionFilter] = useState("");

  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  const navigate = useNavigate();
  const isMobile = window.innerWidth < 768;

  /* ================= FETCH ================= */

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

  useEffect(() => {
    setPage(1);
  }, [search, selectedCategory, prescriptionFilter]);

  /* ================= FILTER ================= */

  const filteredProducts = products.filter((p) => {
    if (prescriptionFilter === "need") return p.is_prescription_required;
    if (prescriptionFilter === "no-need") return !p.is_prescription_required;
    return true;
  });

  const paginatedProducts = isMobile
    ? filteredProducts.slice(0, page * ITEMS_PER_PAGE_MOBILE)
    : filteredProducts;

  /* ================= CART ================= */

  const addToCart = async (productId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${API_BASE}/api/cart/add`,
        { product_id: productId, quantity: 1 },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert(res.data.message);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Gagal menambahkan ke keranjang");
    }
  };

  /* ================= UI ================= */

  return (
    <div className="min-h-screen bg-blue-50 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">

        {/* TITLE */}
        <h1 className="text-2xl md:text-3xl font-bold text-blue-700 mb-4">
          Daftar Produk Obat
        </h1>

        {/* FILTER */}
        <div className="bg-white p-4 rounded-xl shadow mb-6  top-16 z-10">
          <div className="flex flex-col md:flex-row gap-3">

            <input
              type="text"
              placeholder="Cari obat..."
              className="border p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-500"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <div className="flex gap-3 flex-col sm:flex-row w-full md:w-auto">

              <select
                className="border p-3 rounded-lg w-full sm:w-40"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="">Kategori</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>

              <select
                className="border p-3 rounded-lg w-full sm:w-40"
                value={prescriptionFilter}
                onChange={(e) => setPrescriptionFilter(e.target.value)}
              >
                <option value="">Semua</option>
                <option value="need">Resep</option>
                <option value="no-need">Non Resep</option>
              </select>

              <button
                onClick={fetchProducts}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
              >
                Cari
              </button>
            </div>
          </div>
        </div>

        {/* PROMO */}
        <PromoCarousel />

        {/* LOADING */}
        {loading && (
          <div className="text-center py-10 text-blue-600 font-medium">
            Loading produk...
          </div>
        )}

        {/* EMPTY */}
        {!loading && paginatedProducts.length === 0 && (
          <div className="text-center py-10 text-gray-500">
            Produk tidak ditemukan
          </div>
        )}

        {/* GRID */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {!loading &&
            paginatedProducts.map((item) => (
              <div
                key={item.id}
                onClick={() =>
                  navigate("/medicine/detail", {
                    state: { products_id: item.id },
                  })
                }
                className="bg-white rounded-xl shadow hover:shadow-lg transition p-3 cursor-pointer"
              >
                <div className="h-36 bg-blue-100 rounded-lg overflow-hidden relative flex items-center justify-center">
                  <img
                    src={item.image_url || "/no-image.png"}
                    alt={item.name}
                    className="h-full object-cover"
                  />

                  {item.is_prescription_required && (
                    <span className="absolute top-2 left-2 bg-red-100 text-red-600 text-xs px-2 py-1 rounded-lg">
                      Butuh Resep
                    </span>
                  )}
                </div>

                <h2 className="font-semibold text-sm mt-2 line-clamp-2">
                  {item.name}
                </h2>

                <p className="text-blue-600 font-bold mt-1 text-sm">
                  Rp {Number(item.price).toLocaleString("id-ID")}
                </p>

                <p
                  className={`text-xs mt-1 ${
                    item.stock > 0 ? "text-green-600" : "text-red-500"
                  }`}
                >
                  {item.stock > 0 ? `Stok: ${item.stock}` : "Stok Habis"}
                </p>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    addToCart(item.id);
                  }}
                  className="mt-3 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 text-sm"
                >
                  Tambah Keranjang
                </button>
              </div>
            ))}
        </div>

        {/* LOAD MORE MOBILE */}
        {isMobile &&
          paginatedProducts.length < filteredProducts.length && (
            <div className="flex justify-center mt-6">
              <button
                onClick={() => setPage((prev) => prev + 1)}
                className="px-6 py-3 bg-blue-600 text-white rounded-full shadow hover:bg-blue-700"
              >
                Muat Lebih Banyak
              </button>
            </div>
          )}
      </div>
    </div>
  );
}
