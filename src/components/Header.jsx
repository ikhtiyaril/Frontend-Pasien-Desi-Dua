import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Menu, X, Package, FileText, Loader2, ChevronDown, User, ShoppingCart } from "lucide-react";
import axios from "axios";

const API = import.meta.env.VITE_API_URL;

const Header = () => {
  const [userLog, setUserLog] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState({ products: [], articles: [] });
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const navigate = useNavigate();
  const searchRef = useRef(null);
  const debounceTimer = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setUserLog(!!token);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = async (query) => {
    if (!query.trim()) {
      setSearchResults({ products: [], articles: [] });
      setShowSearchResults(false);
      return;
    }

    setIsSearching(true);
    setShowSearchResults(true);

    try {
      const productsRes = await axios.get(`${API}/api/medicine/products`, {
        params: { q: query }
      });

      const articlesRes = await axios.get(`${API}/api/posts`, {
        params: { search: query, limit: 5 }
      });

      setSearchResults({
        products: productsRes.data.data || [],
        articles: articlesRes.data.data || []
      });
    } catch (err) {
      console.error("Search error:", err);
      setSearchResults({ products: [], articles: [] });
    } finally {
      setIsSearching(false);
    }
  };

  const onSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      handleSearch(value);
    }, 500);
  };

  const goToProduct = (productId) => {
    navigate("/medicine/detail", { state: { products_id: productId } });
    setShowSearchResults(false);
    setSearchQuery("");
  };

  const goToArticle = (articleId) => {
    navigate(`/article/${articleId}`);
    setShowSearchResults(false);
    setSearchQuery("");
  };

  return (
    <header className="bg-white border-b-2 border-blue-100 shadow-sm sticky top-0 z-50">
      {/* Top Bar */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex justify-between items-center text-xs sm:text-sm text-white">
            <div className="flex items-center gap-4">
              <span className="hidden sm:inline">📞 Hubungi Kami: 0800-123-4567</span>
              <span className="sm:hidden">📞 0811-8000-2350</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="hidden sm:inline">Jam Operasional: 24/7</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
        <div className="flex justify-between items-center gap-4">
          {/* LOGO */}
          <div
            className="flex items-center gap-2 cursor-pointer group"
            onClick={() => navigate("/")}
          >
           
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
                Desidua
              </h1>
            </div>
          </div>

          {/* DESKTOP SEARCH & MENU */}
          <div className="hidden lg:flex items-center gap-6 flex-1 justify-center max-w-3xl">
            {/* SEARCH BAR */}
            <div className="relative flex-1 max-w-xl" ref={searchRef}>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-500 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Cari obat, artikel kesehatan..."
                  value={searchQuery}
                  onChange={onSearchChange}
                  onFocus={() => searchQuery && setShowSearchResults(true)}
                  className="w-full pl-12 pr-10 py-3 rounded-xl border-2 border-blue-200 bg-blue-50/30 text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
                />
                {isSearching && (
                  <Loader2 className="absolute right-4 top-1/2 transform -translate-y-1/2 text-blue-500 w-5 h-5 animate-spin" />
                )}
              </div>

              {/* Search Results Dropdown */}
              {showSearchResults && searchQuery && (
                <div className="absolute top-full mt-2 w-full bg-white rounded-xl shadow-2xl border-2 border-blue-100 overflow-hidden max-h-[28rem] overflow-y-auto">
                  {searchResults.products.length === 0 && searchResults.articles.length === 0 && !isSearching && (
                    <div className="p-8 text-center text-gray-500">
                      <Search className="w-16 h-16 mx-auto mb-3 text-gray-300" />
                      <p className="font-medium">Tidak ada hasil ditemukan</p>
                      <p className="text-sm mt-1">Coba kata kunci lain</p>
                    </div>
                  )}

                  {/* Products Section */}
                  {searchResults.products.length > 0 && (
                    <div className="border-b-2 border-blue-50">
                      <div className="px-5 py-3 bg-gradient-to-r from-blue-50 to-blue-100/50 flex items-center gap-2 border-b border-blue-100">
                        <Package className="w-5 h-5 text-blue-600" />
                        <h3 className="text-sm font-bold text-blue-900">Produk Obat</h3>
                        <span className="ml-auto text-xs bg-blue-600 text-white px-2 py-1 rounded-full">
                          {searchResults.products.length}
                        </span>
                      </div>
                      {searchResults.products.slice(0, 5).map((product) => (
                        <div
                          key={product.id}
                          onClick={() => goToProduct(product.id)}
                          className="px-5 py-4 hover:bg-blue-50 cursor-pointer transition-all border-b border-gray-50 last:border-b-0 group"
                        >
                          <div className="flex items-center gap-4">
                            {product.image_url ? (
                              <img
                                src={product.image_url}
                                alt={product.name}
                                className="w-16 h-16 rounded-xl object-cover border-2 border-blue-100 group-hover:border-blue-300 transition-all"
                              />
                            ) : (
                              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center border-2 border-blue-200">
                                <Package className="w-8 h-8 text-blue-600" />
                              </div>
                            )}
                            <div className="flex-1">
                              <p className="font-bold text-gray-900 text-sm group-hover:text-blue-700 transition-colors">
                                {product.name}
                              </p>
                              <p className="text-xs text-gray-500 mt-0.5">
                                <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">
                                  {product.category?.name}
                                </span>
                              </p>
                              <p className="text-base font-bold text-blue-600 mt-1.5">
                                Rp {Number(product.price).toLocaleString()}
                              </p>
                            </div>
                            <ChevronDown className="w-5 h-5 text-blue-400 -rotate-90 group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Articles Section */}
                  {searchResults.articles.length > 0 && (
                    <div>
                      <div className="px-5 py-3 bg-gradient-to-r from-blue-50 to-blue-100/50 flex items-center gap-2 border-b border-blue-100">
                        <FileText className="w-5 h-5 text-blue-600" />
                        <h3 className="text-sm font-bold text-blue-900">Artikel Kesehatan</h3>
                        <span className="ml-auto text-xs bg-blue-600 text-white px-2 py-1 rounded-full">
                          {searchResults.articles.length}
                        </span>
                      </div>
                      {searchResults.articles.map((article) => (
                        <div
                          key={article.id}
                          onClick={() => goToArticle(article.id)}
                          className="px-5 py-4 hover:bg-blue-50 cursor-pointer transition-all border-b border-gray-50 last:border-b-0 group"
                        >
                          <div className="flex items-start gap-4">
                            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center flex-shrink-0 border-2 border-blue-200">
                              <FileText className="w-7 h-7 text-blue-600" />
                            </div>
                            <div className="flex-1">
                              <p className="font-bold text-gray-900 text-sm line-clamp-1 group-hover:text-blue-700 transition-colors">
                                {article.title}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                <span className="font-medium text-blue-600">{article.author?.name}</span>
                                {article.category?.name && (
                                  <>
                                    <span className="mx-1">•</span>
                                    <span>{article.category?.name}</span>
                                  </>
                                )}
                              </p>
                            </div>
                            <ChevronDown className="w-5 h-5 text-blue-400 -rotate-90 group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* DESKTOP NAVIGATION */}
          <nav className="hidden lg:flex items-center gap-1">
            <button
              onClick={() => navigate("/medicine")}
              className="px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all font-medium"
            >
              Toko Obat
            </button>
            <button
              onClick={() => navigate("/booking")}
              className="px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all font-medium"
            >
              Booking
            </button>
            <button
              onClick={() => navigate("/article")}
              className="px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all font-medium"
            >
              Artikel
            </button>
            
            {/* Information Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <button className="px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all font-medium flex items-center gap-1">
                Info
                <ChevronDown className={`w-4 h-4 transition-transform ${isHovered ? 'rotate-180' : ''}`} />
              </button>

              {isHovered && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border-2 border-blue-100 overflow-hidden">
                  <ul className="py-1">
                    {[
                      { label: "Tentang Kami", href: "/about" },
                      { label: "Desidua", href: "/desidua" },
                      { label: "Dokter Kami", href: "/dokter-kami" },
                      { label: "Layanan", href: "/layanan" },
                      { label: "Kontak", href: "/contact" },
                    ].map((item) => (
                      <li key={item.href}>
                        <a
                          href={item.href}
                          className="block px-4 py-2.5 text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all font-medium"
                        >
                          {item.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </nav>

          {/* DESKTOP ACTIONS */}
          <div className="hidden lg:flex items-center gap-2">
           
            
            {!userLog ? (
              <button
                className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg flex items-center gap-2"
                onClick={() => navigate("/login")}
              >
                <User className="w-4 h-4" />
                Masuk
              </button>
            ) : (
              <>
              <button  onClick={() => navigate("/dashboard",{state : {
                  active : 'cart'
                }}
              )}className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
              <ShoppingCart className="w-6 h-6" />
            </button>
              <button
                className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg flex items-center gap-2"
                onClick={() => navigate("/dashboard")}
              >
                <User className="w-4 h-4" />
                Dashboard
              </button>
              </>
            )}
          </div>

          {/* MOBILE HAMBURGER */}
          <button
            className="lg:hidden p-2 text-gray-700 hover:bg-blue-50 rounded-lg transition-all"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div className="lg:hidden bg-white border-t-2 border-blue-100 shadow-lg">
          <div className="px-4 py-4 space-y-3">
            {/* Mobile Search */}
            <div className="relative">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Cari obat atau artikel..."
                  value={searchQuery}
                  onChange={onSearchChange}
                  onFocus={() => searchQuery && setShowSearchResults(true)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-blue-200 bg-blue-50/30 text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-blue-500 focus:bg-white"
                />
              </div>

              {/* Mobile Search Results */}
              {showSearchResults && searchQuery && (
                <div className="absolute top-full mt-2 w-full bg-white rounded-xl shadow-2xl border-2 border-blue-100 overflow-hidden max-h-80 overflow-y-auto z-50">
                  {searchResults.products.length === 0 && searchResults.articles.length === 0 && !isSearching && (
                    <div className="p-6 text-center text-gray-500">
                      <Search className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                      <p className="text-sm">Tidak ada hasil</p>
                    </div>
                  )}

                  {searchResults.products.length > 0 && (
                    <div className="border-b-2 border-blue-50">
                      <div className="px-3 py-2 bg-gradient-to-r from-blue-50 to-blue-100/50 text-xs font-bold text-blue-900 flex items-center gap-2">
                        <Package className="w-4 h-4" />
                        Produk Obat
                      </div>
                      {searchResults.products.slice(0, 3).map((product) => (
                        <div
                          key={product.id}
                          onClick={() => {
                            goToProduct(product.id);
                            setMenuOpen(false);
                          }}
                          className="px-3 py-3 hover:bg-blue-50 cursor-pointer border-b border-gray-50"
                        >
                          <p className="font-semibold text-gray-900 text-sm">{product.name}</p>
                          <p className="text-xs text-blue-600 font-bold mt-1">
                            Rp {Number(product.price).toLocaleString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  {searchResults.articles.length > 0 && (
                    <div>
                      <div className="px-3 py-2 bg-gradient-to-r from-blue-50 to-blue-100/50 text-xs font-bold text-blue-900 flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        Artikel
                      </div>
                      {searchResults.articles.slice(0, 3).map((article) => (
                        <div
                          key={article.id}
                          onClick={() => {
                            goToArticle(article.id);
                            setMenuOpen(false);
                          }}
                          className="px-3 py-3 hover:bg-blue-50 cursor-pointer border-b border-gray-50"
                        >
                          <p className="font-semibold text-gray-900 text-sm line-clamp-2">
                            {article.title}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Mobile Navigation Links */}
            <div className="space-y-1 pt-2">
              <button
                onClick={() => {
                  navigate("/medicine");
                  setMenuOpen(false);
                }}
                className="w-full text-left px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all font-medium"
              >
                🏪 Toko Obat
              </button>
              <button
                onClick={() => {
                  navigate("/booking");
                  setMenuOpen(false);
                }}
                className="w-full text-left px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all font-medium"
              >
                📅 Booking Online
              </button>
              <button
                onClick={() => {
                  navigate("/article");
                  setMenuOpen(false);
                }}
                className="w-full text-left px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all font-medium"
              >
                📰 Artikel
              </button>

              {/* Mobile Info Links */}
              <div className="pt-2 border-t-2 border-blue-100">
                <p className="px-4 py-2 text-xs font-bold text-gray-500 uppercase">Informasi</p>
                {[
                  { label: "Tentang Kami", href: "/about" },
                  { label: "Dokter Kami", href: "/dokter-kami" },
                  { label: "Layanan", href: "/layanan" },
                  { label: "Kontak", href: "/contact" },
                ].map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    className="block px-4 py-2.5 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            </div>

            {/* Mobile Action Button */}
            <div className="pt-3 border-t-2 border-blue-100">
              {!userLog ? (
                <button
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-md flex items-center justify-center gap-2"
                  onClick={() => {
                    navigate("/login");
                    setMenuOpen(false);
                  }}
                >
                  <User className="w-5 h-5" />
                  Masuk / Daftar
                </button>
              ) : (
                <button
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-md flex items-center justify-center gap-2"
                  onClick={() => {
                    navigate("/dashboard");
                    setMenuOpen(false);
                  }}
                >
                  <User className="w-5 h-5" />
                  Dashboard
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;