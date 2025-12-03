// ProductDetail.jsx
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const API = import.meta.env.VITE_API_URL;

export default function ProductDetail() {
  const location = useLocation();
  const navigate = useNavigate();
  const { products_id } = location.state || {};

  const [product, setProduct] = useState(null);
  const [accessInfo, setAccessInfo] = useState(null);
  const [loading, setLoading] = useState(true);

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


const addToCart = async (productId, quantity = 1) => {
  try {
    const token = localStorage.getItem("token"); // ambil token dari localStorage
    const res = await axios.post(
      `${API}/api/cart/add`,
      { product_id: productId, quantity },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // misal mau kasih notifikasi
    alert(res.data.message);
    return res.data.data; // kembalikan data item cart

  } catch (err) {
    console.error(err);
    alert(err.response?.data?.message || "Gagal menambahkan ke keranjang");
  }
};

  if (loading) return <div className="p-6 text-center">Loading...</div>;
  if (!product) return <div className="p-6 text-center">Product not found</div>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <button
        className="mb-6 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition"
        onClick={() => navigate(-1)}
      >
        &larr; Back
      </button>

      <div className="flex flex-col md:flex-row gap-8 bg-white shadow-lg rounded-xl border border-gray-200 overflow-hidden">
        {/* Image */}
        <div className="md:w-1/3 bg-gray-50 flex items-center justify-center p-4">
          {product.image_url ? (
            <img src={product.image_url} alt={product.name} className="w-full h-auto rounded-lg object-contain" />
          ) : (
            <div className="w-full h-64 bg-gray-200 rounded-lg"></div>
          )}
        </div>

        {/* Product Info */}
        <div className="md:w-2/3 p-6 flex flex-col justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{product.name}</h1>
            
            <div className="flex items-center mb-4">
              {/* Dummy Rating */}
              <div className="flex items-center text-yellow-400 mr-2">
                <span>★★★★☆</span>
              </div>
              <span className="text-gray-500 text-sm">(120 reviews)</span>
            </div>

            <p className="text-gray-600 mb-2">
              <span className="font-semibold">Category:</span> {product.category?.name}
            </p>
            <p className="text-2xl font-bold text-green-600 mb-2">
              Rp {Number(product.price).toLocaleString()}
            </p>
            <p className={`mb-2 ${product.stock > 0 ? "text-gray-700" : "text-red-500"}`}>
              <span className="font-semibold">Stock:</span> {product.stock > 0 ? product.stock : "Out of stock"}
            </p>
            <p className="mb-4 text-gray-600">
              <span className="font-semibold">Prescription Required:</span> {product.is_prescription_required ? "Yes" : "No"}
            </p>

            <div className="mb-6">
              <h2 className="font-semibold text-lg mb-2">Description:</h2>
              <p className="text-gray-700 whitespace-pre-line">{product.description}</p>
            </div>

            {product.is_prescription_required && accessInfo && (
              <div className="p-4 bg-yellow-100 text-yellow-800 rounded mb-6">
                {accessInfo.allow
                  ? "You have access to this prescription medicine."
                  : accessInfo.reason}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col md:flex-row gap-4">
            <button
              className={`flex-1 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition ${
                product.stock === 0 ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={product.stock === 0}
              onClick={()=>addToCart(product.id)}
            >
              Add to Cart
            </button>
            <button
              className="flex-1 py-3 border border-blue-600 text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition"
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
