import React, { useEffect } from "react";

const TikTokTestimoni = () => {
  useEffect(() => {
    // Load TikTok embed script
    const script = document.createElement('script');
    script.src = 'https://www.tiktok.com/embed.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <section className="w-full bg-white py-20 px-4">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Testimoni Pasien Kami
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Dengar langsung pengalaman pasien kami yang telah merasakan pelayanan terbaik
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

          {/* LEFT - TikTok Testimonials */}
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Testimoni 1 */}
            <div className="bg-white rounded-3xl shadow-sm border border-blue-100 overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="aspect-[9/16] bg-white flex items-center justify-center">
               <blockquote className="tiktok-embed" cite="https://www.tiktok.com/@tyakmala/video/7200722787131018522" data-video-id="7200722787131018522" data-embed-from="embed_page">
                <section>
                     <a target="_blank" title="@tyakmala" href="https://www.tiktok.com/@tyakmala?refer=embed">@tyakmala</a> 
                     <p>Replying to @warszawski warga tangsel absen coba, siapa aja alumninya dokter della? Hehe emang udah seterkenal itu sih dokter della ini 🥲 super baik, warm, nenangin, gaull, seruuu ! Buat aku yg takut sama RS apalagi operasi, sebelum lahiran sampai lahiran diajak becanda mulu, padahal waktu lahiran kondisi aku dan baby drop, tapi dokternya super nenangin 🫶🏻 <a title="masyaallahtabarakkallah" target="_blank" href="https://www.tiktok.com/tag/masyaallahtabarakkallah?refer=embed">#masyaallahtabarakkallah</a> 
                     <a title="sharingmombaby" target="_blank" href="https://www.tiktok.com/tag/sharingmombaby?refer=embed">#sharingmombaby</a> <a title="momlife" target="_blank" href="https://www.tiktok.com/tag/momlife?refer=embed">#momlife</a> 
                     <a title="parenting" target="_blank" href="https://www.tiktok.com/tag/parenting?refer=embed">#parenting</a> <a title="hamildenganmiom" target="_blank" href="https://www.tiktok.com/tag/hamildenganmiom?refer=embed">#hamildenganmiom</a> 
                     </p> 
                     <a target="_blank" title="♬ original sound - Tya Kemala - Tyakmala" href="https://www.tiktok.com/music/original-sound-Tya-Kemala-7200722807741860635?refer=embed">♬ original sound - Tya Kemala - Tyakmala</a> 
                     </section> </blockquote> 
                     <script async src="https://www.tiktok.com/embed.js"></script>

              </div>
              <div className="p-6 border-t border-blue-50">
                <p className="text-gray-700 leading-relaxed">
                  "Pelayanan dokter sangat detail, ramah, dan bikin tenang selama kehamilan."
                </p>
              </div>
            </div>

            {/* Testimoni 2 */}
            <div className="bg-white rounded-3xl shadow-sm border border-blue-100 overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="aspect-[9/16] bg-white flex items-center justify-center">
               <blockquote class="tiktok-embed" cite="https://www.tiktok.com/@bennifebriyanto/video/7033334520346578202" data-video-id="7033334520346578202" data-embed-from="embed_page" >
                <section>
                     <a target="_blank" title="@bennifebriyanto" href="https://www.tiktok.com/@bennifebriyanto?refer=embed">@bennifebriyanto</a>
                      <p>Balas @encauhuyy <a title="fypシ" target="_blank" href="https://www.tiktok.com/tag/fyp%E3%82%B7?refer=embed">#fypシ</a> <a title="kehamilan" target="_blank" href="https://www.tiktok.com/tag/kehamilan?refer=embed">#kehamilan</a>
                       <a title="metodeeracs" target="_blank" href="https://www.tiktok.com/tag/metodeeracs?refer=embed">#metodeeracs</a>
                       </p>
                        <a target="_blank" title="♬ Dj BonBon Remix - 𝐝𝐞𝐞_𝐩𝐢𝐧𝐤𝐲 ’" href="https://www.tiktok.com/music/Dj-BonBon-Remix-7016480699205045018?refer=embed">♬ Dj BonBon Remix - 𝐝𝐞𝐞_𝐩𝐢𝐧𝐤𝐲 ’</a> 
                        </section> 
                        </blockquote>
                         <script async src="https://www.tiktok.com/embed.js"></script>
              </div>
              <div className="p-6 border-t border-blue-50">
                <p className="text-gray-700 leading-relaxed">
                  "Konsultasi jelas, edukatif, dan sangat profesional. Recommended!"
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT - Doctor Profile */}
          <div className="bg-white rounded-3xl shadow-lg border border-blue-100 p-8 sticky top-8">
            <div className="flex flex-col items-center text-center">
              <div className="w-36 h-36 rounded-full overflow-hidden border-4 border-blue-500 mb-6 shadow-md">
                <div className="w-full h-full bg-blue-50 flex items-center justify-center">
                <img src="Saverina.jpg" alt="" />
                </div>
              </div>

              <h3 className="text-xl font-bold text-gray-900 mb-1">
                dr. Severina Adella Tobing, Sp.OG
              </h3>
              <p className="text-blue-600 font-semibold mb-1">
                Dokter Spesialis Kebidanan & Kandungan
              </p>
              <p className="text-sm text-gray-500">
                Brawijaya Hospital Depok
              </p>
            </div>

            <div className="mt-8 pt-8 border-t border-blue-50 space-y-6 text-sm text-gray-700">
              <p className="leading-relaxed">
                dr. Severina Adella Tobing, Sp.OG adalah dokter spesialis obstetri
                dan ginekologi lulusan <span className="font-semibold text-blue-700">Universitas Sriwijaya</span>,
                serta anggota <span className="font-semibold text-blue-700">IDI</span> dan <span className="font-semibold text-blue-700">POGI</span>.
              </p>

              <div>
                <h4 className="font-bold text-blue-700 mb-3 text-base flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Layanan & Keahlian
                </h4>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    <span>Antenatal Care (Pemeriksaan Kehamilan)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    <span>Deteksi Dini Komplikasi Kehamilan</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    <span>Persalinan Normal & SC (Sectio Caesaria)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    <span>Pemeriksaan Organ Reproduksi Wanita</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    <span>Pemasangan KB</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    <span>Deteksi Dini Kanker Serviks (Pap Smear, IVA)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    <span>Konseling Kehamilan Sehat</span>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-blue-700 mb-3 text-base flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  Pendidikan
                </h4>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    <span>Kedokteran Umum – Universitas Sriwijaya</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    <span>Spesialis Obstetri & Ginekologi – Universitas Sriwijaya</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default TikTokTestimoni;