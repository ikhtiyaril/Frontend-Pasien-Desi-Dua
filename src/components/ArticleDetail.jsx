import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Footer from "./Footer";
import Header from "./Header";

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

 

  const blocks = article?.content?.blocks ?? [];

  return (
    <>
    <Header/>
       {loading && (
        <p className="p-6 text-gray-500 text-center text-lg animate-pulse">
          Memuat artikel...
        </p>
      )}

      {error && (
        <p className="p-6 text-red-500 text-center font-semibold">
          {error}
        </p>
      )}
        {!loading && !error && article && (
    <div className="p-6 max-w-4xl mx-auto bg-white shadow-lg rounded-2xl my-10 border border-gray-100">
      {/* HEADER: Judul & Meta */}
      <header className="mb-8">
        <h1 className="text-4xl font-extrabold mb-4 text-gray-900 leading-tight">
          {article.title}
        </h1>
        <div className="flex items-center gap-3 text-sm text-gray-500 border-b pb-6">
          <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full font-medium">
            {article.category?.name ?? "Kesehatan"}
          </span>
          <span>•</span>
          <span>Oleh <strong>{article.author?.name ?? "Tim Medis"}</strong></span>
          <span>•</span>
          <span>{article.published_at ? new Date(article.published_at).toLocaleDateString('id-ID', { dateStyle: 'long' }) : "Draft"}</span>
        </div>
      </header>

      {/* THUMBNAIL */}
      {article.thumbnail && (
        <div className="mb-10 overflow-hidden rounded-2xl shadow-sm">
          <img
            src={article.thumbnail}
            alt={article.title}
            className="w-full h-auto object-cover hover:scale-105 transition-transform duration-500"
          />
        </div>
      )}

      {/* CONTENT RENDERER */}
      <article className="prose prose-lg prose-slate max-w-full leading-relaxed text-gray-800">
        {blocks.length === 0 ? (
          <p className="text-gray-400 italic">Konten tidak tersedia.</p>
        ) : (
          blocks.map((block) => {
            switch (block.type) {
              case "paragraph":
                return (
                  <p 
                    key={block.id} 
                    className="mb-5 text-gray-700 leading-8"
                    dangerouslySetInnerHTML={{ __html: block.data.text }} 
                  />
                );

              case "header":
                const Tag = `h${block.data.level}`;
                const headerStyle = 
                  block.data.level === 2 ? "text-3xl font-bold mt-10 mb-5 text-gray-900 border-l-4 border-blue-500 pl-4" : 
                  "text-2xl font-semibold mt-8 mb-4 text-gray-800";
                
                return (
                  <Tag 
                    key={block.id} 
                    className={headerStyle}
                    dangerouslySetInnerHTML={{ __html: block.data.text }} 
                  />
                );

              case "list":
                const ListTag = block.data.style === "ordered" ? "ol" : "ul";
                const listClass = block.data.style === "ordered" ? "list-decimal" : "list-disc";
                
                return (
                  <ListTag key={block.id} className={`${listClass} ml-8 mb-8 space-y-3`}>
                    {block.data.items.map((item, i) => {
                      // PENANGANAN KHUSUS LIST:
                      // Jika item adalah string, gunakan langsung.
                      // Jika item adalah object (dari Editor.js nested list), ambil properti 'content'.
                      const itemContent = typeof item === "string" ? item : item.content;
                      
                      return (
                        <li 
                          key={i} 
                          className="pl-2 text-gray-700"
                          dangerouslySetInnerHTML={{ __html: itemContent }} 
                        />
                      );
                    })}
                  </ListTag>
                );

              case "image":
                return (
                  <figure key={block.id} className="my-10 bg-gray-50 p-2 rounded-xl border">
                    <img
                      src={block.data?.file?.url}
                      alt={block.data.caption || "Ilustrasi Medis"}
                      className="rounded-lg mx-auto shadow-sm"
                    />
                    {block.data.caption && (
                      <figcaption className="text-center text-sm text-gray-500 mt-4 italic">
                        {block.data.caption}
                      </figcaption>
                    )}
                  </figure>
                );

              case "quote":
                return (
                  <blockquote
                    key={block.id}
                    className="border-l-4 border-blue-400 pl-6 italic text-gray-600 my-10 bg-blue-50/50 py-4 rounded-r-xl"
                  >
                    <p className="text-xl" dangerouslySetInnerHTML={{ __html: block.data.text }} />
                    {block.data.caption && (
                      <cite className="block text-sm font-bold text-gray-400 mt-2 not-italic">
                        — {block.data.caption}
                      </cite>
                    )}
                  </blockquote>
                );

              case "delimiter":
                return (
                  <hr key={block.id} className="my-12 border-t-2 border-gray-100 border-dashed" />
                );

              default:
                return null;
            }
          })
        )}
      </article>
     
    </div>)}
     <Footer/>
    </>
  );
}