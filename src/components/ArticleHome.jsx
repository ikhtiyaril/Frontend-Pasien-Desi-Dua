import { useEffect, useState } from "react";
import axios from "axios";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const API = import.meta.env.VITE_API_URL;

export default function ArticleHome() {
  const [articles, setArticles] = useState([]);
  const [highlightIndex, setHighlightIndex] = useState(0);

  const loadArticles = async () => {
    try {
      const res = await axios.get(`${API}/api/posts`);
      setArticles(res.data.data);
    } catch (err) {
      console.error("Failed loading:", err);
    }
  };

  // Auto Slide Hero Every 4 Seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setHighlightIndex((prev) =>
        articles.length > 1 ? (prev + 1) % articles.length : 0
      );
    }, 4000);
    return () => clearInterval(interval);
  }, [articles]);

  useEffect(() => {
    loadArticles();
  }, []);

  if (articles.length === 0)
    return (
      <div className="text-center py-20 text-gray-500">No articles yet...</div>
    );

  // Highlight Article
  const highlight = articles[highlightIndex];

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-12">
      {/* ========================= HERO / CAROUSEL ========================= */}
    

   <div className="space-y-6">
  <h2 className="text-xl font-semibold">Latest Articles</h2>

  <div className="grid md:grid-cols-3 gap-6">
    {articles.slice(0, 3).map((item, index) => (
      <div
        key={item.id}
        className="relative group"
      >
        <Card
          className={`cursor-pointer transition-all duration-300 group-hover:shadow-lg ${
            index === 2 ? "group-hover:-translate-x-3" : ""
          }`}
          onClick={() => (window.location.href = `/article/${item.slug}`)}
        >
          {item.thumbnail && (
            <img
              src={item.thumbnail}
              className="h-40 w-full object-cover rounded-t-lg"
            />
          )}

          <div className="p-4 space-y-2">
            <h3 className="font-semibold group-hover:text-blue-600 transition">
              {item.title}
            </h3>
            <p className="text-sm text-gray-600 line-clamp-3">
              {item.excerpt}
            </p>
          </div>
        </Card>

        {/* === Read More muncul hanya di item terakhir === */}
        {index === 2 && (
          <button
            onClick={() => (window.location.href = "/articles")}
            className="
              absolute top-1/2 -translate-y-1/2 right-0
              translate-x-10 opacity-0
              group-hover:translate-x-4 group-hover:opacity-100
              transition-all duration-300 ease-out
              bg-blue-600 text-white px-4 py-1.5 
              rounded-lg shadow-sm text-sm
            "
          >
            Read More →
          </button>
        )}
      </div>
    ))}
  </div>
</div>

     
        <div className="relative h-[380px] md:h-[460px] rounded-2xl overflow-hidden shadow-lg">
        <img
          src={highlight.thumbnail ?? "/placeholder.jpg"}
          className="w-full h-full object-cover"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-black/10 p-6 flex flex-col justify-end">
          <h1 className="text-white text-3xl md:text-4xl font-bold mb-2">
            {highlight.title}
          </h1>
          <p className="text-white/80 max-w-2xl text-sm md:text-base line-clamp-3">
            {highlight.excerpt}
          </p>

          <Button
            onClick={() => (window.location.href = `/article/${highlight.slug}`)}
            className="mt-4 bg-white/20 hover:bg-white/30 backdrop-blur-md"
          >
            Read Article
          </Button>
        </div>

        {/* Carousel Indicators */}
        <div className="absolute bottom-4 right-4 flex space-x-2">
          {articles.slice(0, 5).map((_, i) => (
            <div
              key={i}
              className={`h-2 w-2 rounded-full transition-all ${
                i === highlightIndex ? "bg-white" : "bg-white/40"
              }`}
            />
          ))}
        </div>
      </div>
      
    </div>
  );
}
