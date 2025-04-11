'use client';
import Image from 'next/image';

export default function AboutUsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 py-16 px-6 md:px-20">
      <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-xl p-8 md:p-14 relative">
        <div className="mb-10 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-indigo-700 mb-4">Tentang AltarGive</h1>
          <p className="text-gray-600 text-lg">Sebuah platform sokongan rohani generasi 2025</p>
        </div>

        <div className="text-gray-800 space-y-6 text-justify text-md leading-relaxed">
          <p>
            <strong>AltarGive</strong> merupakan sebuah sistem yang dibangunkan oleh  <strong>Nerowork Service</strong> sebagai inisiatif untuk menyokong dan memudahkan perjalanan projek-projek anjuran <strong>PMMR SIB Keliangau</strong>. Platform ini diwujudkan bagi membantu menguruskan kutipan dana, penyertaan komuniti, dan penglibatan belia dalam pelbagai aktiviti yang dijalankan secara aktif.
          </p>
          <p>
            <strong>PMMR SIB Keliangau</strong> bermula dari sebuah perkampungan sederhana yang terletak di kawasan Manggatal, Kota Kinabalu, Sabah. Komuniti ini terdiri daripada ramai anak muda yang berdedikasi dan aktif dalam pelbagai aktiviti rohani, sosial, dan kemasyarakatan. Dengan semangat kesatuan dan cinta akan pembangunan rohani generasi muda, PMMR terus berkembang menjadi sebuah gerakan yang penuh semangat dan harapan.
          </p>
          <p>
            Melalui <strong>AltarGive</strong>, segala bentuk sumbangan dan penyertaan dapat diurus secara lebih sistematik dan telus, sekaligus membuka peluang kepada lebih ramai pihak untuk bersama-sama menyokong visi dan misi PMMR dalam menjana impak positif kepada generasi masa kini dan akan datang.
          </p>
        </div>

        <div className="mt-10 text-center">
          <Image
            src="/pmmr.jpg"
            alt="PMMR Image"
            width={800}
            height={400}
            className="rounded-xl mx-auto shadow-lg object-cover"
          />
        </div>

        <div className="mt-10 text-center">
          <p className="text-sm text-gray-500">© 2025 AltarGive — Dibangunkan oleh Nerowork Service</p>
        </div>
      </div>
    </div>
  );
}
