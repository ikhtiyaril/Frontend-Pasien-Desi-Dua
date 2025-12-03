import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API = import.meta.env.VITE_API_URL;

export default function ArticleList() {
  const navigate = useNavigate();
  const [articles, setArticles] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API}/api/posts`, {
        params: { page, limit, search },
      });

      if (res.data.success) {
        setArticles(res.data.data);
        setTotal(res.data.total);
      }
    } catch (err) {
      console.error("Failed to fetch articles:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, [page, search]);

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Articles</h1>

      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search articles..."
          className="border p-2 w-full rounded"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Article List */}
      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : articles.length > 0 ? (
        <div className="space-y-4">
          {articles.map((article) => (
            <div
              key={article.id}
              className="border p-4 rounded-lg shadow-sm bg-white cursor-pointer hover:bg-gray-50 transition"
              onClick={() => navigate(`/article/${article.slug}`)}
            >
              <h2 className="text-xl font-semibold mb-1">{article.title}</h2>
              <p className="text-gray-500 text-sm mb-2">
                By: {article.author?.name ?? "Unknown"} | Category:{" "}
                {article.category?.name ?? "Uncategorized"}
              </p>
              <p className="text-gray-700">
                {article.excerpt ||
                  article.content?.blocks?.[0]?.data?.text ||
                  "No excerpt"}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No articles found.</p>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex justify-center items-center space-x-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          >
            Prev
          </button>
          <span>
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
