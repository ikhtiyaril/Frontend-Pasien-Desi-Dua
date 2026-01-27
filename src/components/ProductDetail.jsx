// ProductDetail.jsx
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { ShoppingCart, Heart, Share2, Star, Package, Shield, Truck, ArrowLeft } from "lucide-react";

const API = import.meta.env.VITE_API_URL;

export default function ProductDetail() {
  const location = useLocation();
  const navigate = useNavigate();
  const { products_id } = location.state || {};

  const [product, setProduct] = useState(null);
  const [accessInfo, setAccessInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (!products_id) {
      navigate("/");
      return;
    }

    const fetchProduct = async () => {
      try {
        const res = await axios.get(`${API}/api/medicine/products/${products_id}`);
        setProduct(res.data.data);

        if (res.data.data.is_prescription_required) {
          const token = localStorage.getItem("token");
          const accessRes = await axios.get(
            `${API}/api/medicine/products/${products_id}/check-access`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setAccessInfo(accessRes.data);
        }

        setLoading(false);
      } catch (err) {
        console.error(err);
        alert("Error fetching product");
        setLoading(false);
      }
    };

    fetchProduct();
  }, [products_id]);

  const addToCart = async (productId, qty = 1) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${API}/api/cart/add`,
        { product_id: productId, quantity: qty },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(res.data.message);
      return res.data.data;
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Gagal menambahkan ke keranjang");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-blue-900 font-medium">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-50 flex items-center justify-center">
        <div className="text-center">
          <Package className="w-20 h-20 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Product not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-blue-100 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-blue-700 hover:text-blue-900 transition-colors font-medium"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="hidden sm:inline">Back to Products</span>
            <span className="sm:hidden">Back</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left Column - Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="bg-white rounded-2xl shadow-lg border border-blue-100 overflow-hidden aspect-square">
              {product.image_url ? (
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-full object-contain p-8"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-blue-50 to-slate-100 flex items-center justify-center">
                  <Package className="w-32 h-32 text-blue-300" />
                </div>
              )}
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-white rounded-xl p-4 shadow-sm border border-blue-100 flex flex-col items-center text-center">
                <Shield className="w-6 h-6 text-blue-600 mb-2" />
                <p className="text-xs text-gray-700 font-medium">100% Original</p>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm border border-blue-100 flex flex-col items-center text-center">
                <Truck className="w-6 h-6 text-blue-600 mb-2" />
                <p className="text-xs text-gray-700 font-medium">Free Shipping</p>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm border border-blue-100 flex flex-col items-center text-center">
                <Package className="w-6 h-6 text-blue-600 mb-2" />
                <p className="text-xs text-gray-700 font-medium">Easy Returns</p>
              </div>
            </div>
          </div>

          {/* Right Column - Product Info */}
          <div className="space-y-6">
            {/* Product Title & Actions */}
            <div>
              <div className="flex items-start justify-between gap-4 mb-3">
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
                  {product.name}
                </h1>
                <div className="flex gap-2">
                  <button className="p-2 rounded-full hover:bg-blue-50 transition-colors">
                    <Heart className="w-6 h-6 text-gray-400 hover:text-red-500" />
                  </button>
                  <button className="p-2 rounded-full hover:bg-blue-50 transition-colors">
                    <Share2 className="w-6 h-6 text-gray-400 hover:text-blue-600" />
                  </button>
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < 5 ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">5.0 (120 reviews)</span>
              </div>

              {/* Category Badge */}
              <span className="inline-block px-4 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                {product.category?.name}
              </span>
            </div>

            {/* Price */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 shadow-lg">
              <p className="text-blue-100 text-sm font-medium mb-1">Price</p>
              <p className="text-4xl font-bold text-white">
                Rp {Number(product.price).toLocaleString()}
              </p>
            </div>

            {/* Stock & Prescription Info */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-xl p-4 border border-blue-100 shadow-sm">
                <p className="text-gray-600 text-sm mb-1">Stock Status</p>
                <p className={`font-bold text-lg ${product.stock > 0 ? "text-green-600" : "text-red-600"}`}>
                  {product.stock > 0 ? `${product.stock} Available` : "Out of Stock"}
                </p>
              </div>
              <div className="bg-white rounded-xl p-4 border border-blue-100 shadow-sm">
                <p className="text-gray-600 text-sm mb-1">Prescription</p>
                <p className={`font-bold text-lg ${product.is_prescription_required ? "text-orange-600" : "text-green-600"}`}>
                  {product.is_prescription_required ? "Required" : "Not Required"}
                </p>
              </div>
            </div>

            {/* Access Info Alert */}
            {product.is_prescription_required && accessInfo && (
              <div className={`rounded-xl p-4 border-2 ${
                accessInfo.allow 
                  ? "bg-green-50 border-green-200 text-green-800" 
                  : "bg-orange-50 border-orange-200 text-orange-800"
              }`}>
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  <p className="font-medium">
                    {accessInfo.allow
                      ? "✓ You have access to purchase this prescription medicine."
                      : accessInfo.reason}
                  </p>
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="bg-white rounded-xl p-5 border border-blue-100 shadow-sm">
              <label className="text-gray-700 font-medium mb-3 block">Quantity</label>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 rounded-lg bg-blue-100 text-blue-700 font-bold hover:bg-blue-200 transition-colors"
                  disabled={product.stock === 0}
                >
                  −
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, Math.min(product.stock, parseInt(e.target.value) || 1)))}
                  className="w-20 h-10 text-center border-2 border-blue-200 rounded-lg font-semibold text-gray-800 focus:outline-none focus:border-blue-500"
                  disabled={product.stock === 0}
                />
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="w-10 h-10 rounded-lg bg-blue-100 text-blue-700 font-bold hover:bg-blue-200 transition-colors"
                  disabled={product.stock === 0}
                >
                  +
                </button>
                <span className="text-sm text-gray-500 ml-2">Max: {product.stock}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => addToCart(product.id, quantity)}
                disabled={product.stock === 0}
                className="flex-1 flex items-center justify-center gap-2 py-4 bg-white border-2 border-blue-600 text-blue-600 font-bold rounded-xl hover:bg-blue-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              >
                <ShoppingCart className="w-5 h-5" />
                Add to Cart
              </button>
              <button
                disabled={product.stock === 0}
               onClick={()=> {
                navigate("/cart") 
                addToCart(product.id, quantity)
              }}
                className="flex-1 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                Buy Now
              </button>
            </div>

            {/* Description */}
            <div className="bg-white rounded-xl p-6 border border-blue-100 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Product Description</h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {product.description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}