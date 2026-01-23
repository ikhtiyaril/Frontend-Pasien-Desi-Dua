import Footer from "@/components/Footer";
import Header from "@/components/Header";
import React from "react";

export default function TermsOfServicePages() {
  const lastUpdated = new Date().toLocaleDateString("id-ID", {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Daftar navigasi untuk memudahkan scrolling
  const navItems = [
    { id: "pendahuluan", label: "1. Pendahuluan" },
    { id: "definisi", label: "2. Definisi" },
    { id: "ruang-lingkup", label: "3. Ruang Lingkup" },
    { id: "akun", label: "4. Akun & Tanggung Jawab" },
    { id: "usia", label: "5. Ketentuan Usia" },
    { id: "konsultasi", label: "6. Konsultasi Medis" },
    { id: "resep", label: "7. Resep & Obat" },
    { id: "pembayaran", label: "8. Pembayaran & Refund" },
    { id: "pembatalan", label: "9. Pembatalan" },
    { id: "larangan", label: "10. Larangan" },
    { id: "penangguhan", label: "11. Penangguhan Akun" },
    { id: "privasi", label: "12. Privasi & Rekam Medis" },
    { id: "haki", label: "13. Hak Kekayaan Intelektual" },
    { id: "tanggung-jawab", label: "14. Batasan Tanggung Jawab" },
    { id: "ganti-rugi", label: "15. Ganti Rugi" },
    { id: "force-majeure", label: "16. Force Majeure" },
    { id: "perubahan", label: "17. Perubahan Ketentuan" },
    { id: "hukum", label: "18. Hukum & Sengketa" },
    { id: "kontak", label: "20. Kontak" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-700 font-sans tracking-tight">
      <Header />

      {/* Hero Section */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4">
            Syarat & Ketentuan Layanan
          </h1>
          <div className="flex items-center gap-4 text-sm font-medium">
            <span className="text-blue-600 px-3 py-1 bg-blue-50 rounded-full">Klinik Desidua</span>
            <span className="text-slate-400">Terakhir diperbarui: {lastUpdated}</span>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-12 flex flex-col lg:flex-row gap-12">
        {/* Sidebar Navigation - Sticky on Desktop */}
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <div className="sticky top-24 space-y-1">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 px-3">Navigasi Dokumen</p>
            {navItems.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className="block px-3 py-2 text-sm font-medium text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
              >
                {item.label}
              </a>
            ))}
          </div>
        </aside>

        {/* Content Area */}
        <div className="flex-grow max-w-3xl">
          <article className="prose prose-slate prose-blue max-w-none space-y-12">
            
            {/* 1. Pendahuluan */}
            <section id="pendahuluan" className="scroll-mt-24 space-y-4">
              <h2 className="text-2xl font-bold text-slate-900 leading-tight">1. Pendahuluan</h2>
              <p className="text-lg leading-relaxed">
                Dokumen ini (&quot;Ketentuan&quot;) mengatur akses dan penggunaan aplikasi,
                situs web, serta layanan digital yang disediakan oleh <span className="font-semibold text-slate-900">Klinik
                Desidua</span> (&quot;Kami&quot;, &quot;Klinik&quot;). Dengan mengakses atau menggunakan
                layanan Kami, Anda selaku pengguna (&quot;Pengguna&quot;) menyatakan telah
                membaca, memahami, dan menyetujui seluruh isi Ketentuan ini.
              </p>
            </section>

            {/* 2. Definisi */}
            <section id="definisi" className="scroll-mt-24 space-y-4">
              <h2 className="text-2xl font-bold text-slate-900">2. Definisi</h2>
              <p>Untuk kejelasan, istilah-istilah dalam Ketentuan ini memiliki arti:</p>
              <ul className="grid gap-3 list-none p-0">
                {[
                  { term: "Pengguna", desc: "Individu atau entitas yang mendaftar atau menggunakan layanan." },
                  { term: "Layanan", desc: "Seluruh fitur pada aplikasi/desidua termasuk booking, konsultasi online, pemesanan obat, pembayaran, dan konten edukasi." },
                  { term: "Tenaga Medis", desc: "Dokter atau tenaga kesehatan berlisensi yang bekerja sama dengan Klinik." },
                  { term: "Payment Gateway", desc: "Penyedia layanan pembayaran pihak ketiga (mis. Tripay)." }
                ].map((def, i) => (
                  <li key={i} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:gap-4">
                    <strong className="text-blue-700 sm:w-32 flex-shrink-0">{def.term}</strong>
                    <span className="text-slate-600">{def.desc}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* 3. Ruang Lingkup */}
            <section id="ruang-lingkup" className="scroll-mt-24 space-y-4">
              <h2 className="text-2xl font-bold text-slate-900">3. Ruang Lingkup Layanan</h2>
              <p className="leading-relaxed">
                Klinik Desidua menyediakan layanan berikut: sistem booking janji temu
                dokter (offline), konsultasi online (video call & chat), pembelian
                obat umum dan obat khusus (dengan resep dokter), pemrosesan
                pembayaran online melalui Tripay, notifikasi layanan, riwayat
                transaksi, penyimpanan rekam medis digital, dan publikasi artikel
                edukasi. Rincian fitur dapat berubah sesuai pembaruan produk.
              </p>
            </section>

            {/* 4. Akun */}
            <section id="akun" className="scroll-mt-24 space-y-4">
              <h2 className="text-2xl font-bold text-slate-900">4. Akun dan Tanggung Jawab Pengguna</h2>
              <p>
                Untuk menggunakan beberapa layanan, Pengguna wajib membuat akun dan
                login. Pengguna bertanggung jawab penuh atas kebenaran informasi yang
                diberikan dan menjaga kerahasiaan kredensial (username, password).
                Setiap aktivitas yang terjadi melalui akun Pengguna dianggap sebagai
                tanggung jawab pemilik akun.
              </p>
              <div className="bg-blue-50/50 p-4 rounded-lg border border-blue-100 text-sm">
                Jenis akun yang tersedia: <strong>Pasien, Dokter, dan Admin</strong>. Pengguna dilarang
                memberikan akses akun kepada pihak lain tanpa persetujuan tertulis.
              </div>
            </section>

            {/* 5. Usia */}
            <section id="usia" className="scroll-mt-24 space-y-4">
              <h2 className="text-2xl font-bold text-slate-900">5. Ketentuan Usia dan Persetujuan Orang Tua</h2>
              <p>
                Pengguna di bawah usia 18 (delapan belas) tahun hanya boleh menggunakan
                layanan dengan persetujuan dan atau pengawasan orang tua/wali. Dengan
                mendaftar, orang tua/wali menyatakan setuju atas penggunaan data dan
                layanan bagi anaknya sesuai Ketentuan ini.
              </p>
            </section>

            {/* 6. Konsultasi */}
            <section id="konsultasi" className="scroll-mt-24 space-y-4">
              <h2 className="text-2xl font-bold text-slate-900">6. Ketentuan Konsultasi dan Informasi Medis</h2>
              <p>
                Semua keputusan medis akhir berada di tangan tenaga medis yang
                memberikan layanan. Konsultasi online melalui chat atau video call
                bersifat penilaian awal berdasarkan informasi dan gejala yang Anda
                sampaikan. Konsultasi online <strong>tidak</strong> menggantikan
                pemeriksaan medis tatap muka ketika diperlukan.
              </p>
              <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-r-xl">
                <h4 className="text-red-900 font-bold mb-2 flex items-center gap-2">
                  <span className="text-xl">⚠️</span> PERINGATAN DARURAT
                </h4>
                <p className="text-red-800 m-0">
                  Jika mengalami kondisi darurat atau nyeri hebat, segera hubungi layanan
                  darurat setempat — jangan mengandalkan konsultasi online.
                </p>
              </div>
              <p className="text-sm italic">
                Pengguna wajib memberikan informasi yang jujur, lengkap, dan akurat.
                Klinik tidak bertanggung jawab atas keputusan atau hasil yang muncul
                akibat informasi tidak lengkap atau tidak benar dari Pengguna.
              </p>
            </section>

            {/* 7. Resep */}
            <section id="resep" className="scroll-mt-24 space-y-4">
              <h2 className="text-2xl font-bold text-slate-900">7. Resep, Pembelian & Pengiriman Obat</h2>
              <p>
                Obat khusus hanya dapat ditebus dengan resep yang sah dari Tenaga
                Medis Klinik Desidua. Klinik berhak menolak pemesanan obat apabila
                terdapat indikasi penyalahgunaan, ketidaksesuaian resep, atau alasan
                medis lain. Pengiriman obat diselenggarakan melalui mitra pengiriman. Risiko
                keterlambatan pengiriman di luar kendali Klinik menjadi tanggung jawab
                mitra pengiriman sesuai ketentuan mereka.
              </p>
            </section>

            {/* 8. Pembayaran */}
            <section id="pembayaran" className="scroll-mt-24 space-y-4">
              <h2 className="text-2xl font-bold text-slate-900">8. Pembayaran, Harga, dan Refund</h2>
              <p>
                Semua pembayaran diproses melalui Tripay sebagai payment gateway
                pihak ketiga. Harga layanan dan produk dapat berubah sewaktu-waktu.
              </p>
              <div className="bg-slate-900 text-slate-100 p-6 rounded-xl">
                <p className="font-semibold text-blue-400 mb-2">Kebijakan Refund:</p>
                <p className="m-0 text-sm leading-relaxed">
                  Secara umum, kebijakan kami adalah <strong>tidak ada jaminan refund</strong>. Pengguna
                  dapat mengajukan permohonan pengembalian dana; keputusan dan kebijakan
                  pengembalian dana sepenuhnya menjadi wewenang pemilik aplikasi (owner).
                </p>
              </div>
            </section>

            {/* 9 - 11 */}
            <section id="pembatalan" className="scroll-mt-24 space-y-4">
              <h2 className="text-2xl font-bold text-slate-900">9. Kebijakan Pembatalan & Penjadwalan</h2>
              <p>Ketentuan pembatalan janji temu dan aturan penjadwalan akan dijelaskan pada halaman booking. Biaya pembatalan (jika ada) akan diinformasikan sebelum konfirmasi.</p>
            </section>

            <section id="larangan" className="scroll-mt-24 space-y-4">
              <h2 className="text-2xl font-bold text-slate-900">10. Pembatasan dan Larangan Penggunaan</h2>
              <ul className="list-disc pl-5 space-y-1">
                <li>Menyalahgunakan akun milik orang lain.</li>
                <li>Mengunggah konten yang melanggar hukum, pornografi, kebencian, atau fitnah.</li>
                <li>Mencoba mengakses sistem secara tidak sah (hacking) atau menggandakan layanan.</li>
              </ul>
            </section>

            <section id="penangguhan" className="scroll-mt-24 space-y-4">
              <h2 className="text-2xl font-bold text-slate-900">11. Penangguhan dan Penghapusan Akun</h2>
              <p>Klinik memiliki hak untuk menangguhkan atau menghapus akun Pengguna apabila ditemukan data palsu, penyalahgunaan layanan, atau aktivitas yang merugikan pihak lain.</p>
            </section>

            {/* 12 - 14 */}
            <section id="privasi" className="scroll-mt-24 space-y-4">
              <h2 className="text-2xl font-bold text-slate-900">12. Privasi dan Rekam Medis</h2>
              <p>Pengelolaan data pribadi dan rekam medis Pengguna diatur dalam Kebijakan Privasi kami. Data medis dikategorikan sebagai data sensitif dan akan disimpan serta dilindungi sesuai peraturan yang berlaku.</p>
            </section>

            <section id="haki" className="scroll-mt-24 space-y-4">
              <h2 className="text-2xl font-bold text-slate-900">13. Hak Kekayaan Intelektual</h2>
              <p>Seluruh konten, merek dagang, logo, desain, dan materi pada aplikasi merupakan milik Klinik Desidua atau pemegang lisensinya.</p>
            </section>

            <section id="tanggung-jawab" className="scroll-mt-24 space-y-4 border-t pt-8">
              <h2 className="text-2xl font-bold text-slate-900">14. Batasan Tanggung Jawab</h2>
              <p>Klinik Desidua tidak bertanggung jawab atas kerugian tidak langsung atau kehilangan keuntungan. Besaran tanggung jawab dibatasi hingga jumlah total yang dibayarkan Pengguna ke Klinik dalam 12 bulan terakhir.</p>
            </section>

            {/* 15 - 19 */}
            <div className="grid md:grid-cols-2 gap-8 pt-8">
              <section id="ganti-rugi" className="scroll-mt-24 space-y-2">
                <h3 className="font-bold text-slate-900 underline decoration-blue-500 decoration-2 underline-offset-4">15. Ganti Rugi</h3>
                <p className="text-sm">Pengguna setuju untuk membebaskan Klinik dari klaim yang timbul karena pelanggaran Ketentuan ini.</p>
              </section>
              <section id="force-majeure" className="scroll-mt-24 space-y-2">
                <h3 className="font-bold text-slate-900 underline decoration-blue-500 decoration-2 underline-offset-4">16. Force Majeure</h3>
                <p className="text-sm">Klinik tidak bertanggung jawab atas kegagalan akibat kejadian di luar kendali wajar (bencana alam, gangguan teknis luas).</p>
              </section>
              <section id="perubahan" className="scroll-mt-24 space-y-2">
                <h3 className="font-bold text-slate-900 underline decoration-blue-500 decoration-2 underline-offset-4">17. Perubahan Ketentuan</h3>
                <p className="text-sm">Klinik dapat memperbarui Ketentuan ini kapan saja. Penggunaan lanjut dianggap sebagai penerimaan perubahan.</p>
              </section>
              <section id="hukum" className="scroll-mt-24 space-y-2">
                <h3 className="font-bold text-slate-900 underline decoration-blue-500 decoration-2 underline-offset-4">18. Hukum & Sengketa</h3>
                <p className="text-sm">Diatur sesuai hukum Republik Indonesia dan diselesaikan di pengadilan wilayah kedudukan Klinik.</p>
              </section>
            </div>

            <section className="space-y-4">
              <h2 className="text-xl font-bold text-slate-900 italic">19. Ketentuan Lain-lain</h2>
              <p className="text-sm">Jika ada ketentuan yang dinyatakan tidak sah, ketentuan lain tetap berlaku penuh. Kegagalan Klinik menegakkan haknya tidak berarti melepaskan hak tersebut.</p>
            </section>

            {/* 20. Contact Section */}
            <section id="kontak" className="scroll-mt-24 pt-12">
              <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-3xl p-8 text-white shadow-xl shadow-blue-200">
                <h2 className="text-2xl font-bold mb-6 text-white">20. Kontak & Informasi Perusahaan</h2>
                <div className="grid md:grid-cols-2 gap-8 items-start">
                  <div className="space-y-4 text-blue-50">
                    <p className="font-bold text-white text-lg">Klinik Desidua</p>
                    <p className="leading-relaxed">
                      Ruko Victory Square No. 11, Jalan Buaran Raya,<br />
                      Kec. Serpong, Tangerang Selatan 15310
                    </p>
                  </div>
                  <div className="flex flex-col gap-3">
                    <a href="mailto:desiduaapotek@gmail.com" className="flex items-center gap-3 bg-white/10 hover:bg-white/20 p-3 rounded-xl transition-colors">
                      <span className="text-blue-200 uppercase text-[10px] font-bold tracking-widest w-12">Email</span>
                      <span className="font-medium">desiduaapotek@gmail.com</span>
                    </a>
                    <a href="https://wa.me/6281180002350" className="flex items-center gap-3 bg-white/10 hover:bg-white/20 p-3 rounded-xl transition-colors">
                      <span className="text-blue-200 uppercase text-[10px] font-bold tracking-widest w-12">WA</span>
                      <span className="font-medium">0811-8000-2350</span>
                    </a>
                  </div>
                </div>
              </div>
              <p className="mt-8 text-sm text-slate-500 text-center max-w-2xl mx-auto italic">
                Dokumen ini disusun untuk memberikan kepastian hak dan kewajiban bagi
                Pengguna dan Klinik. Jika Anda membutuhkan versi resmi untuk keperluan
                legal, kami rekomendasikan untuk berkonsultasi dengan penasihat hukum.
              </p>
            </section>

          </article>
        </div>
      </main>

      <Footer />
    </div>
  );
}