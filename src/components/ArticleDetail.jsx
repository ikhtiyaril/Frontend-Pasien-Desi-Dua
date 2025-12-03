import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const API = import.meta.env.VITE_API_URL;

export default function ArticleDetail() {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchArticle = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API}/api/posts/${slug}`);
      if (res.data.success) {
        console.log(res.data.data)
        setArticle(res.data.data);
      } else {
        setError("Article not found");
      }
    } catch (err) {
      console.error("Failed to fetch article:", err);
      setError("Failed to fetch article");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticle();
  }, [slug]);

  if (loading) return <p className="p-6 text-gray-500">Loading...</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-2">{article.title}</h1>
      <div className="text-gray-500 mb-4 text-sm">
        By {article.author?.name ?? "Unknown"} | Category:{" "}
        {article.category?.name ?? "Uncategorized"} | Published:{" "}
        {article.published_at
          ? new Date(article.published_at).toLocaleDateString()
          : "Draft"}
      </div>

      {/* Thumbnail */}
      {article.thumbnail && (
        <img
          src={article.thumbnail}
          alt={article.title}
          className="w-full rounded mb-6"
        />
      )}

      {/* Article content from Editor.js */}
      <div className="prose max-w-full">
        {article.content?.blocks?.map((block, index) => {
          switch (block.type) {
            case "paragraph":
              return <p key={index}>{block.data.text}</p>;
            case "header":
              const Tag = `h${block.data.level}`;
              return <Tag key={index}>{block.data.text}</Tag>;
            case "list":
              if (block.data.style === "ordered") {
                return (
                  <ol key={index} className="list-decimal ml-6">
                    {block.data.items.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ol>
                );
              } else {
                return (
                  <ul key={index} className="list-disc ml-6">
                    {block.data.items.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                );
              }
            case "image":
              return (
                <img
                  key={index}
                  src={block.data.file.url}
                  alt={block.data.caption || "Article Image"}
                  className="my-4 rounded"
                />
              );
            default:
              return null;
          }
        })}
      </div>
    </div>
  );
}
