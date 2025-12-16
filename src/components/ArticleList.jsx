import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

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
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-blue-700">Articles</h1>

      <div className="mb-4">
        <Input
          placeholder="Search articles..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border-blue-300 focus-visible:ring-blue-500"
        />
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="w-full h-28 rounded-xl" />
          ))}
        </div>
      ) : articles.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <Card
              key={article.id}
              className="shadow-sm hover:shadow-md transition cursor-pointer border-blue-100"
              onClick={() => navigate(`/article/${article.slug}`)}
            >
              {article.thumbnail && (
                <img
                  src={article.thumbnail}
                  alt={article.title}
                  className="w-full h-40 object-cover rounded-t-xl"
                />
              )}

              <CardContent className="p-4">
                <h2 className="text-lg font-semibold text-blue-600 mb-1">
                  {article.title}
                </h2>
                <p className="text-gray-500 text-sm mb-2">
                  By: {article.author?.name ?? "Unknown"} | Category: {article.category?.name ?? "Uncategorized"}
                </p>
                <p className="text-gray-700 text-sm line-clamp-3">
                  {article.excerpt || article.content?.blocks?.[0]?.data?.text || "No excerpt"}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No articles found.</p>
      )}

      {totalPages > 1 && (
        <div className="mt-8 flex justify-center items-center gap-3">
          <Button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            variant="outline"
            className="border-blue-300 text-blue-600"
          >
            Prev
          </Button>
          <span className="text-blue-700 font-medium">
            Page {page} of {totalPages}
          </span>
          <Button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            variant="outline"
            className="border-blue-300 text-blue-600"
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
