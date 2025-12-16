import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import PromoCarousel from "./PromoCorousel";
import { Search, Layers, Pill, ChevronLeft, ChevronRight } from "lucide-react";

const API_BASE = import.meta.env.VITE_API_URL;
const ITEMS_PER_PAGE = 6;

export default function ProductListingMobile() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [prescriptionFilter, setPrescriptionFilter] = useState("");

  const [showCategory, setShowCategory] = useState(false);
  const [showPrescription, setShowPrescription] = useState(false);

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
    fetchProducts();
  }, [search, selectedCategory, prescriptionFilter]);

  /* ================= FILTER ================= */

  const filteredProducts = products.filter((p) => {
    if (prescriptionFilter === "need") return p.is_prescription_required;
    if (prescriptionFilter === "no-need") return !p.is_prescription_required;
    return true;
  });

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);

  const paginatedProducts = isMobile
    ? filteredProducts.slice(
        (page - 1) * ITEMS_PER_PAGE,
        page * ITEMS_PER_PAGE
      )
    : filteredProducts;

  /* ================= CART ================= */

  const addToCart = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${API_BASE}/api/cart/add`,
        { product_id: id, quantity: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Berhasil ditambahkan ke keranjang");
    } catch {
      alert("Gagal menambahkan ke keranjang");
    }
  };

  /* ================= UI ================= */

  return (
    <div className="min-h-screen bg-blue-50 p-4">
      <div className="max-w-6xl mx-auto">

        {/* SEARCH BAR MOBILE */}
        <div className="bg-white p-3 rounded-xl shadow mb-5  top-16 z-10 md:hidden">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 flex-1 bg-gray-100 rounded-lg px-3 py-2">
              <Search size={18} className="text-gray-500" />
              <input
                type="text"
                placeholder="Cari obat..."
                className="bg-transparent outline-none text-sm w-full"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <button
              onClick={() => {
                setShowCategory(!showCategory);
                setShowPrescription(false);
              }}
              className="p-2 bg-gray-100 rounded-lg"
            >
              <Layers size={18} />
            </button>

            <button
              onClick={() => {
                setShowPrescription(!showPrescription);
                setShowCategory(false);
              }}
              className="p-2 bg-gray-100 rounded-lg"
            >
              <Pill size={18} />
            </button>
          </div>

          {showCategory && (
            <div className="mt-3">
              <select
                className="w-full border p-2 rounded-lg text-sm"
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setShowCategory(false);
                }}
              >
                <option value="">Semua Kategori</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {showPrescription && (
            <div className="mt-3">
              <select
                className="w-full border p-2 rounded-lg text-sm"
                value={prescriptionFilter}
                onChange={(e) => {
                  setPrescriptionFilter(e.target.value);
                  setShowPrescription(false);
                }}
              >
                <option value="">Semua Produk</option>
                <option value="need">Butuh Resep</option>
                <option value="no-need">Non Resep</option>
              </select>
            </div>
          )}
        </div>

        <PromoCarousel />

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
                className="bg-white p-3 rounded-xl shadow cursor-pointer"
              >
                <div className="relative h-32 bg-blue-100 rounded-lg overflow-hidden">
                  <img
                    src={item.image_url || "/no-image.png"}
                    className="w-full h-full object-cover"
                    alt={item.name}
                  />

                  {item.is_prescription_required && (
                    <span className="absolute top-2 left-2 bg-red-100 text-red-600 text-xs px-2 py-1 rounded-lg">
                      Butuh Resep
                    </span>
                  )}
                </div>

                <h2 className="text-sm font-semibold mt-2 line-clamp-2">
                  {item.name}
                </h2>

                <p className="text-blue-600 font-bold text-sm mt-1">
                  Rp {Number(item.price).toLocaleString("id-ID")}
                </p>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    addToCart(item.id);
                  }}
                  className="mt-2 w-full bg-blue-600 text-white py-2 rounded-lg text-sm"
                >
                  Tambah Keranjang
                </button>
              </div>
            ))}
        </div>

        {/* PAGINATION MOBILE */}
        {isMobile && totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-6">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="p-2 bg-white rounded-full shadow disabled:opacity-40"
            >
              <ChevronLeft />
            </button>

            <span className="text-sm font-medium">
              {page} / {totalPages}
            </span>

            <button
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="p-2 bg-white rounded-full shadow disabled:opacity-40"
            >
              <ChevronRight />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
