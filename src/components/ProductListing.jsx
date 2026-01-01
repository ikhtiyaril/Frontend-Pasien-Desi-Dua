import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import PromoCarousel from "./PromoCorousel";
import { 
  Search, 
  ShoppingCart, 
  Filter, 
  Grid3x3,
  List,
  Star,
  Package,
  AlertCircle,
  Loader2,
  ChevronDown,
  Heart,
  Eye,
  TrendingUp
} from "lucide-react";

const API_BASE = import.meta.env.VITE_API_URL;
const ITEMS_PER_PAGE_MOBILE = 12;

export default function ProductListing() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [search, setSearch] = useState("");
  const [prescriptionFilter, setPrescriptionFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("newest");

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

  /* ================= FILTER & SORT ================= */
  const filteredProducts = products.filter((p) => {
    if (prescriptionFilter === "need") return p.is_prescription_required;
    if (prescriptionFilter === "no-need") return !p.is_prescription_required;
    return true;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "price-low") return a.price - b.price;
    if (sortBy === "price-high") return b.price - a.price;
    if (sortBy === "name") return a.name.localeCompare(b.name);
    return 0;
  });

  const paginatedProducts = isMobile
    ? sortedProducts.slice(0, page * ITEMS_PER_PAGE_MOBILE)
    : sortedProducts;

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-50">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-8 sm:py-12 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold mb-2">Toko Obat Online</h1>
              <p className="text-blue-100">Temukan obat dan produk kesehatan terpercaya</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/30">
                <p className="text-xs text-blue-100">Total Produk</p>
                <p className="text-2xl font-bold">{products.length}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Search & Filter Section */}
        <div className="bg-white rounded-2xl shadow-lg border-2 border-blue-100 p-4 sm:p-6 mb-6  top-4 z-20">
          <div className="flex flex-col gap-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Cari obat, vitamin, suplemen..."
                className="w-full pl-12 pr-4 py-3.5 border-2 border-blue-200 rounded-xl focus:outline-none focus:border-blue-500 bg-blue-50/30 transition-all text-gray-800 placeholder:text-gray-400"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* Filters Row */}
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Category Filter */}
              <div className="relative flex-1">
                <select
                  className="w-full appearance-none border-2 border-blue-200 rounded-xl px-4 py-3 pr-10 focus:outline-none focus:border-blue-500 bg-white transition-all cursor-pointer"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="">Semua Kategori</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-400 w-5 h-5 pointer-events-none" />
              </div>

              {/* Prescription Filter */}
              <div className="relative flex-1">
                <select
                  className="w-full appearance-none border-2 border-blue-200 rounded-xl px-4 py-3 pr-10 focus:outline-none focus:border-blue-500 bg-white transition-all cursor-pointer"
                  value={prescriptionFilter}
                  onChange={(e) => setPrescriptionFilter(e.target.value)}
                >
                  <option value="">Semua Jenis</option>
                  <option value="need">Perlu Resep</option>
                  <option value="no-need">Tanpa Resep</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-400 w-5 h-5 pointer-events-none" />
              </div>

              {/* Sort Filter */}
              <div className="relative flex-1">
                <select
                  className="w-full appearance-none border-2 border-blue-200 rounded-xl px-4 py-3 pr-10 focus:outline-none focus:border-blue-500 bg-white transition-all cursor-pointer"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="newest">Terbaru</option>
                  <option value="price-low">Harga Terendah</option>
                  <option value="price-high">Harga Tertinggi</option>
                  <option value="name">Nama A-Z</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-400 w-5 h-5 pointer-events-none" />
              </div>

              {/* Search Button */}
              <button
                onClick={fetchProducts}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 whitespace-nowrap"
              >
                <Search className="w-5 h-5" />
                <span className="hidden sm:inline">Cari</span>
              </button>
            </div>

            {/* View Mode Toggle - Desktop Only */}
            <div className="hidden sm:flex items-center justify-between pt-2 border-t border-blue-100">
              <p className="text-sm text-gray-600">
                Menampilkan <span className="font-semibold text-blue-600">{paginatedProducts.length}</span> dari{" "}
                <span className="font-semibold">{filteredProducts.length}</span> produk
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-lg transition-all ${
                    viewMode === "grid"
                      ? "bg-blue-600 text-white"
                      : "bg-blue-50 text-blue-600 hover:bg-blue-100"
                  }`}
                >
                  <Grid3x3 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-lg transition-all ${
                    viewMode === "list"
                      ? "bg-blue-600 text-white"
                      : "bg-blue-50 text-blue-600 hover:bg-blue-100"
                  }`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Promo Carousel */}
        <div className="mb-6">
          <PromoCarousel />
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-16 h-16 text-blue-600 animate-spin mb-4" />
            <p className="text-gray-600 font-medium">Memuat produk...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && paginatedProducts.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center mb-4">
              <Package className="w-12 h-12 text-blue-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Produk Tidak Ditemukan</h3>
            <p className="text-gray-500 text-center max-w-md">
              Coba ubah filter pencarian atau kata kunci Anda
            </p>
          </div>
        )}

        {/* Product Grid */}
        {!loading && viewMode === "grid" && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
            {paginatedProducts.map((item) => (
              <div
                key={item.id}
                className="group bg-white rounded-2xl border-2 border-blue-100 overflow-hidden hover:border-blue-400 hover:shadow-xl transition-all duration-300 cursor-pointer"
                onClick={() =>
                  navigate("/medicine/detail", {
                    state: { products_id: item.id },
                  })
                }
              >
                {/* Image Container */}
                <div className="relative h-40 sm:h-48 bg-gradient-to-br from-blue-50 to-slate-100 overflow-hidden">
                  <img
                    src={item.image_url || "/no-image.png"}
                    alt={item.name}
                    className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-300"
                  />
                  
                  {/* Badges */}
                  <div className="absolute top-2 left-2 flex flex-col gap-1">
                    {item.is_prescription_required && (
                      <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-lg font-semibold shadow-md flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        Resep
                      </span>
                    )}
                    {item.stock < 10 && item.stock > 0 && (
                      <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-lg font-semibold shadow-md">
                        Stok Terbatas
                      </span>
                    )}
                  </div>

                  {/* Quick Actions */}
                  <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                      className="p-2 bg-white rounded-full shadow-lg hover:bg-blue-50 transition-colors"
                    >
                      <Heart className="w-4 h-4 text-blue-600" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                      className="p-2 bg-white rounded-full shadow-lg hover:bg-blue-50 transition-colors"
                    >
                      <Eye className="w-4 h-4 text-blue-600" />
                    </button>
                  </div>

                  {/* Overlay on Hover */}
                  <div className="absolute inset-0 bg-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                </div>

                {/* Product Info */}
                <div className="p-3 sm:p-4">
                  <h2 className="font-bold text-gray-900 text-sm sm:text-base line-clamp-2 mb-2 group-hover:text-blue-700 transition-colors min-h-[2.5rem]">
                    {item.name}
                  </h2>

                  {/* Rating - Dummy */}
                  <div className="flex items-center gap-1 mb-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${
                            i < 4 ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-gray-500">(4.0)</span>
                  </div>

                  {/* Price */}
                  <div className="mb-3">
                    <p className="text-lg sm:text-xl font-bold text-blue-600">
                      Rp {Number(item.price).toLocaleString("id-ID")}
                    </p>
                  </div>

                  {/* Stock Status */}
                  <div className="mb-3">
                    {item.stock > 0 ? (
                      <div className="flex items-center gap-1.5 text-xs text-green-600">
                        <div className="w-2 h-2 bg-green-500 rounded-full" />
                        <span className="font-medium">Stok: {item.stock}</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 text-xs text-red-600">
                        <div className="w-2 h-2 bg-red-500 rounded-full" />
                        <span className="font-medium">Stok Habis</span>
                      </div>
                    )}
                  </div>

                  {/* Add to Cart Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(item.id);
                    }}
                    disabled={item.stock === 0}
                    className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Keranjang
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Product List View */}
        {!loading && viewMode === "list" && (
          <div className="space-y-4">
            {paginatedProducts.map((item) => (
              <div
                key={item.id}
                className="group bg-white rounded-2xl border-2 border-blue-100 overflow-hidden hover:border-blue-400 hover:shadow-xl transition-all duration-300 cursor-pointer"
                onClick={() =>
                  navigate("/medicine/detail", {
                    state: { products_id: item.id },
                  })
                }
              >
                <div className="flex flex-col sm:flex-row gap-4 p-4">
                  {/* Image */}
                  <div className="relative w-full sm:w-48 h-48 bg-gradient-to-br from-blue-50 to-slate-100 rounded-xl overflow-hidden flex-shrink-0">
                    <img
                      src={item.image_url || "/no-image.png"}
                      alt={item.name}
                      className="w-full h-full object-contain p-4"
                    />
                    {item.is_prescription_required && (
                      <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-lg font-semibold shadow-md">
                        Perlu Resep
                      </span>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h2 className="font-bold text-xl text-gray-900 mb-2 group-hover:text-blue-700 transition-colors">
                        {item.name}
                      </h2>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < 4 ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-500">(4.0)</span>
                      </div>
                      <p className="text-2xl font-bold text-blue-600 mb-2">
                        Rp {Number(item.price).toLocaleString("id-ID")}
                      </p>
                      <div className="flex items-center gap-2">
                        {item.stock > 0 ? (
                          <span className="text-sm text-green-600 font-medium">
                            Stok Tersedia: {item.stock}
                          </span>
                        ) : (
                          <span className="text-sm text-red-600 font-medium">Stok Habis</span>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-3 mt-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart(item.id);
                        }}
                        disabled={item.stock === 0}
                        className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        <ShoppingCart className="w-5 h-5" />
                        Tambah ke Keranjang
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Load More Button - Mobile */}
        {isMobile && paginatedProducts.length < sortedProducts.length && !loading && (
          <div className="flex justify-center mt-8">
            <button
              onClick={() => setPage((prev) => prev + 1)}
              className="px-8 py-3.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
            >
              <ChevronDown className="w-5 h-5" />
              Muat Lebih Banyak
            </button>
          </div>
        )}
      </div>
    </div>
  );
}