import Footer from "@/components/Footer";
import Header from "@/components/Header";
import React from "react";
// Opsional: Jika Anda menggunakan lucide-react atau heroicons, Anda bisa menambahkan ikon untuk bagian kontak.
// Contoh: import { Mail, Phone, MapPin } from 'lucide-react';

export default function PrivacyPolicy() {
  // Format tanggal yang lebih profesional
  const formattedDate = new Date().toLocaleDateString("id-ID", {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-700 font-sans">
      {/* Menggunakan Komponen Header yang diimpor untuk konsistensi */}

      <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8">
        {/* Page Title Header */}
        <div className="max-w-4xl mx-auto text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
            Kebijakan Privasi
          </h1>
          <p className="mt-2 text-lg text-blue-600 font-medium">
            Klinik Desidua
          </p>
          <div className="mt-4 inline-block bg-blue-50 px-4 py-1.5 rounded-full text-sm text-blue-700 font-medium">
            Terakhir diperbarui: {formattedDate}
          </div>
        </div>

        {/* Main Content Card */}
        <article className="max-w-4xl mx-auto bg-white shadow-sm border border-slate-200 rounded-2xl p-8 sm:p-12 space-y-10">
          {/* Section 1 */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900 flex items-center">
              <span className="text-blue-600 mr-2">1.</span> Pendahuluan
            </h2>
            <p className="leading-relaxed">
              Kebijakan Privasi ini menjelaskan bagaimana <strong>Klinik Desidua</strong>
              (&quot;Kami&quot;) mengumpulkan, menggunakan, menyimpan, dan melindungi
              data pribadi pengguna (&quot;Pengguna&quot;) dalam penggunaan aplikasi,
              website, dan layanan kesehatan yang Kami sediakan.
            </p>
            <p className="leading-relaxed">
              Kami berkomitmen untuk menjaga kerahasiaan dan keamanan data pribadi
              Pengguna sesuai dengan peraturan perundang-undangan yang berlaku di
              Indonesia, termasuk Undang-Undang Perlindungan Data Pribadi.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-900 flex items-center">
              <span className="text-blue-600 mr-2">2.</span> Data yang Kami Kumpulkan
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-slate-800">2.1 Data Identitas</h3>
                <ul className="list-disc list-outside pl-5 space-y-2 marker:text-blue-600">
                  <li>Nama lengkap</li>
                  <li>Tanggal lahir</li>
                  <li>Jenis kelamin</li>
                  <li>Nomor Induk Kependudukan (NIK) (jika diperlukan)</li>
                </ul>
              </div>

              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-slate-800">2.2 Data Kontak</h3>
                <ul className="list-disc list-outside pl-5 space-y-2 marker:text-blue-600">
                  <li>Nomor telepon</li>
                  <li>Alamat email</li>
                  <li>Alamat tempat tinggal</li>
                </ul>
              </div>

              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-slate-800">2.3 Data Kesehatan</h3>
                <ul className="list-disc list-outside pl-5 space-y-2 marker:text-blue-600">
                  <li>Keluhan dan riwayat kesehatan</li>
                  <li>Hasil pemeriksaan</li>
                  <li>Diagnosis dan catatan medis</li>
                  <li>Resep dan riwayat obat</li>
                </ul>
              </div>

              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-slate-800">2.4 Data Teknis</h3>
                <ul className="list-disc list-outside pl-5 space-y-2 marker:text-blue-600">
                  <li>Alamat IP</li>
                  <li>Informasi perangkat dan browser</li>
                  <li>Log aktivitas aplikasi</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 3 */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900 flex items-center">
              <span className="text-blue-600 mr-2">3.</span> Penggunaan Data
            </h2>
            <p className="leading-relaxed">Kami menggunakan data yang dikumpulkan untuk tujuan berikut:</p>
            <ul className="list-disc list-outside pl-5 space-y-2 marker:text-blue-600 leading-relaxed">
              <li>Menyediakan layanan medis dan administrasi klinik.</li>
              <li>Mengelola rekam medis pasien secara aman.</li>
              <li>Memfasilitasi penjadwalan janji temu dan konsultasi.</li>
              <li>Memproses transaksi pembayaran dan penagihan.</li>
              <li>Meningkatkan kualitas layanan dan pengembangan sistem internal.</li>
              <li>Memenuhi kewajiban hukum dan regulasi yang berlaku.</li>
            </ul>
          </section>

          {/* Section 4 */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900 flex items-center">
              <span className="text-blue-600 mr-2">4.</span> Keamanan dan Penyimpanan Data
            </h2>
            <p className="leading-relaxed">
              Kami menerapkan langkah-langkah keamanan teknis dan organisasi yang
              ketat dan wajar untuk melindungi data pribadi dari akses tidak sah, kehilangan,
              penyalahgunaan, atau pengungkapan.
            </p>
            <p className="leading-relaxed">
              Data disimpan pada server yang aman (menggunakan enkripsi standar industri) dan hanya dapat diakses oleh
              tenaga medis dan staf yang berwenang dan telah terikat kewajiban kerahasiaan.
            </p>
          </section>

          {/* Section 5 */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900 flex items-center">
              <span className="text-blue-600 mr-2">5.</span> Pembagian Data kepada Pihak Ketiga
            </h2>
            <p className="leading-relaxed">
              <strong>Kami tidak menjual atau menyewakan data pribadi Pengguna kepada pihak mana pun.</strong>
            </p>
            <p className="leading-relaxed">Data dapat dibagikan secara terbatas hanya jika diperlukan kepada:</p>
            <ul className="list-disc list-outside pl-5 space-y-2 marker:text-blue-600 leading-relaxed">
              <li>Tenaga medis dan staf internal Klinik Desidua untuk keperluan pelayanan.</li>
              <li>Penyedia layanan pihak ketiga yang terpercaya (seperti payment gateway atau penyedia server cloud) yang terikat kontrak kerahasiaan.</li>
              <li>Pihak berwenang atau aparat hukum jika diwajibkan oleh peraturan perundang-undangan.</li>
            </ul>
          </section>

          {/* Section 6 */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900 flex items-center">
              <span className="text-blue-600 mr-2">6.</span> Hak Pengguna
            </h2>
            <p className="leading-relaxed">Sebagai pemilik data, Anda memiliki hak untuk:</p>
            <ul className="list-disc list-outside pl-5 space-y-2 marker:text-blue-600 leading-relaxed">
              <li>Meminta akses ke salinan data pribadi Anda yang kami simpan.</li>
              <li>Memperbarui atau memperbaiki data yang tidak akurat.</li>
              <li>Meminta penghapusan data sesuai dengan ketentuan hukum yang berlaku.</li>
              <li>Menarik persetujuan penggunaan data tertentu di masa mendatang.</li>
            </ul>
          </section>

<section className="space-y-4">
  <h2 className="text-2xl font-bold text-slate-900 flex items-center">
    <span className="text-blue-600 mr-2">7.</span> Data Akun Google
  </h2>

  <p className="leading-relaxed">
    Aplikasi Klinik Desidua memungkinkan pengguna untuk melakukan pendaftaran
    dan masuk (login) menggunakan akun Google.
  </p>

  <p className="leading-relaxed">
    Dalam proses tersebut, kami hanya mengakses data dasar dari akun Google
    pengguna, yaitu:
  </p>

  <ul className="list-disc list-outside pl-5 space-y-2 marker:text-blue-600">
    <li>Nama pengguna</li>
    <li>Alamat email</li>
    <li>Foto profil (jika tersedia)</li>
  </ul>

  <p className="leading-relaxed">
    Data ini digunakan semata-mata untuk keperluan autentikasi, pembuatan akun,
    dan keamanan akses pengguna ke layanan Klinik Desidua.
  </p>

  <p className="leading-relaxed">
    Klinik Desidua tidak mengakses, membaca, menyimpan, atau memproses data lain
    dari akun Google pengguna seperti email, kontak, atau konten pribadi.
  </p>

  <p className="leading-relaxed">
    Data akun Google pengguna tidak dibagikan kepada pihak ketiga dan hanya
    disimpan selama akun pengguna aktif. Pengguna dapat meminta penghapusan
    data akun mereka kapan saja melalui kontak resmi Klinik Desidua.
  </p>

<p className="leading-relaxed">
    Data Akun Google:
Desidua memungkinkan pengguna melakukan pendaftaran dan masuk (login) menggunakan akun Google. Dalam proses tersebut, kami hanya mengakses data dasar dari akun Google pengguna, yaitu: nama pengguna, alamat email, dan foto profil (jika tersedia). Data ini hanya digunakan untuk autentikasi, pembuatan akun, dan keamanan akses. 

Desidua TIDAK mengakses, membaca, menyimpan, atau memproses email pengguna melalui Gmail API, dan tidak memiliki kemampuan untuk membaca, mengirim, atau menghapus email dalam akun Google pengguna.

  </p>

  <p className="leading-relaxed">
   Retensi dan Penghapusan Data:
Data pengguna disimpan selama akun aktif dan/atau sampai pengguna meminta penghapusan. Untuk permintaan penghapusan data, silakan hubungi kami di desiduaapotek@gmail.com. Permintaan akan diproses dalam jangka waktu maksimal 30 hari sejak verifikasi identitas user, kecuali jika terdapat kewajiban hukum yang mengharuskan penyimpanan lebih lama.

  </p>



   <p className="leading-relaxed">






    Pihak Ketiga:
Kami dapat membagikan data yang diperlukan kepada penyedia layanan tepercaya untuk mendukung operasi layanan, termasuk (tetapi tidak terbatas pada): penyedia pembayaran (mis. Xendit), penyedia hosting dan infrastruktur (mis. Vercel atau provider VPS), serta penyedia layanan email (mis. SendGrid). Semua pihak ketiga tersebut terikat oleh perjanjian yang membatasi penggunaan data hanya untuk tujuan yang disetujui.

  </p>
</section>

          {/* Section 7 & 8 combined for better flow */}
          <section className="space-y-8">
             <div className="space-y-4">
              <h2 className="text-2xl font-bold text-slate-900 flex items-center">
                <span className="text-blue-600 mr-2">8.</span> Cookies dan Teknologi Serupa
              </h2>
              <p className="leading-relaxed">
                Aplikasi atau website Kami dapat menggunakan cookies atau teknologi
                serupa untuk mengingat preferensi Anda, meningkatkan pengalaman pengguna, dan untuk keperluan analisis
                sistem agar layanan kami berjalan lebih efisien.
              </p>
            </div>

            <div className="space-y-4 pt-4 border-t border-slate-100">
              <h2 className="text-2xl font-bold text-slate-900 flex items-center">
                <span className="text-blue-600 mr-2">8.</span> Perubahan Kebijakan Privasi
              </h2>
              <p className="leading-relaxed">
                Kebijakan Privasi ini dapat diperbarui dari waktu ke waktu untuk mencerminkan perubahan dalam praktik kami atau peraturan yang berlaku. Perubahan signifikan akan diinformasikan melalui notifikasi di aplikasi atau website Klinik Desidua. Kami menyarankan Anda untuk meninjau halaman ini secara berkala.
              </p>
            </div>
          </section>

          {/* Section 9: Contact - Redesigned */}
          <section className="pt-8 mt-8 border-t-2 border-slate-100">
            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center">
               <span className="text-blue-600 mr-2">9.</span> Kontak Kami
            </h2>
            <p className="mb-6 leading-relaxed">
              Jika Anda memiliki pertanyaan, komentar, atau permintaan terkait Kebijakan Privasi ini atau pengelolaan data Anda, silakan hubungi kami melalui:
            </p>
            
            <div className="bg-blue-50/80 rounded-xl p-6 sm:p-8 border border-blue-100 grid md:grid-cols-3 gap-6 text-sm sm:text-base">
              <div className="space-y-2">
                <h3 className="font-bold text-blue-800 mb-1">Alamat Klinik</h3>
                <p className="text-slate-700 leading-snug">
                  Ruko Victory Square No. 11,<br />
                  Jalan Buaran Raya, Kec. Serpong,<br />
                  Tangerang Selatan 15310
                </p>
              </div>
              <div className="space-y-2">
                 <h3 className="font-bold text-blue-800 mb-1">Email</h3>
                 <a href="mailto:desiduaapotek@gmail.com" className="text-blue-600 hover:text-blue-800 hover:underline transition">
                   desiduaapotek@gmail.com
                 </a>
              </div>
              <div className="space-y-2">
                 <h3 className="font-bold text-blue-800 mb-1">Telepon / WhatsApp</h3>
                 <a href="tel:+6281180002350" className="text-blue-600 hover:text-blue-800 hover:underline transition">
                   0811-8000-2350
                 </a>
              </div>
            </div>
          </section>

        </article>
      </main>

      {/* Menggunakan Komponen Footer yang diimpor */}
     
    </div>
  );
}