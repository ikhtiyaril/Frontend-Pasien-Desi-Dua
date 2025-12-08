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
        setArticle(res.data.data);
      } else {
        setError("Artikel tidak ditemukan");
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Gagal memuat artikel");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticle();
  }, [slug]);

  if (loading) return <p className="p-6 text-gray-500">Loading...</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;

  const blocks = article?.content?.blocks ?? [];

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* TITLE */}
      <h1 className="text-4xl font-bold mb-2">{article.title}</h1>

      {/* META */}
      <div className="text-gray-500 mb-4 text-sm">
        By {article.author?.name ?? "Unknown"} | Category:{" "}
        {article.category?.name ?? "Uncategorized"} | Published:{" "}
        {article.published_at
          ? new Date(article.published_at).toLocaleDateString()
          : "Draft"}
      </div>

      {/* THUMBNAIL */}
      <img
        src={article.thumbnail ?? "/placeholder.jpg"}
        alt={article.title}
        className="w-full rounded mb-6"
      />

      {/* CONTENT */}
      <div className="prose prose-neutral max-w-full leading-relaxed">
        {blocks.length === 0 && (
          <p className="text-gray-400">Artikel ini belum memiliki konten.</p>
        )}

        {blocks.map((block, index) => {
          switch (block.type) {
            case "paragraph":
              return (
                <p key={index} dangerouslySetInnerHTML={{ __html: block.data.text }} />
              );

            case "header":
              const Tag = `h${block.data.level}`;
              return (
                <Tag key={index} className="font-semibold mt-6">
                  {block.data.text}
                </Tag>
              );

            case "list":
              if (block.data.style === "ordered") {
                return (
                  <ol key={index} className="list-decimal ml-6">
                    {block.data.items.map((item, i) => (
                      <li key={i} dangerouslySetInnerHTML={{ __html: item }} />
                    ))}
                  </ol>
                );
              }
              return (
                <ul key={index} className="list-disc ml-6">
                  {block.data.items.map((item, i) => (
                    <li key={i} dangerouslySetInnerHTML={{ __html: item }} />
                  ))}
                </ul>
              );

            case "image":
              return (
                <div key={index} className="my-4 text-center">
                  <img
                    src={block.data?.file?.url}
                    alt={block.data.caption || "Image"}
                    className="rounded"
                  />
                  {block.data.caption && (
                    <p className="text-sm text-gray-500 mt-1">
                      {block.data.caption}
                    </p>
                  )}
                </div>
              );

            case "quote":
              return (
                <blockquote
                  key={index}
                  className="border-l-4 pl-4 italic text-gray-700 my-4"
                >
                  {block.data.text}
                  {block.data.caption && (
                    <cite className="block mt-1 text-sm text-gray-500">
                      — {block.data.caption}
                    </cite>
                  )}
                </blockquote>
              );

            case "delimiter":
              return (
                <div key={index} className="my-6 text-center">
                  <div className="text-2xl">•••</div>
                </div>
              );

            case "code":
              return (
                <pre
                  key={index}
                  className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm overflow-x-auto"
                >
                  <code>{block.data.code}</code>
                </pre>
              );

            default:
              return <div key={index} />;
          }
        })}
      </div>
    </div>
  );
}
