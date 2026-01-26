'use client';
import React, { useState } from 'react';

export default function TermsAndPrivacyPage() {
    const [activeTab, setActiveTab] = useState<'terms' | 'privacy'>('terms');

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-t-2xl shadow-lg p-6 sm:p-8 border-b-2 border-amber-500">
                    <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                        Kebijakan & Ketentuan
                    </h1>
                    <p className="text-gray-600">BUMDes Sumber Kalosi</p>
                </div>

                {/* Tab Navigation */}
                <div className="bg-white shadow-lg border-b border-gray-200">
                    <div className="flex">
                        <button
                            onClick={() => setActiveTab('terms')}
                            className={`flex-1 py-4 px-6 text-center font-semibold transition-all duration-200 ${activeTab === 'terms'
                                    ? 'bg-amber-500 text-white border-b-4 border-amber-600'
                                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                                }`}
                        >
                            📋 Syarat & Ketentuan
                        </button>
                        <button
                            onClick={() => setActiveTab('privacy')}
                            className={`flex-1 py-4 px-6 text-center font-semibold transition-all duration-200 ${activeTab === 'privacy'
                                    ? 'bg-amber-500 text-white border-b-4 border-amber-600'
                                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                                }`}
                        >
                            🔒 Kebijakan Privasi
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="bg-white rounded-b-2xl shadow-lg p-6 sm:p-10">
                    {activeTab === 'terms' ? (
                        <div className="prose prose-lg max-w-none text-gray-800">
                            <div className="mb-8">
                                <div className="flex items-start gap-4 mb-6 p-4 bg-amber-50 border-l-4 border-amber-500 rounded">
                                    <span className="text-3xl">ℹ️</span>
                                    <div>
                                        <h3 className="text-xl font-bold text-amber-900 mt-0 mb-2">Penerimaan Syarat</h3>
                                        <p className="text-gray-700 leading-relaxed mb-0">
                                            Dengan mengakses dan menggunakan website BUMDes Sumber Kalosi, Anda menyetujui untuk terikat oleh syarat dan ketentuan ini.
                                            Jika Anda tidak setuju, harap tidak menggunakan layanan kami.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="mb-8">
                                <div className="flex items-start gap-4 mb-4">
                                    <span className="text-2xl mt-1">🏪</span>
                                    <div className="flex-1">
                                        <h3 className="text-xl font-bold text-gray-900 mt-0 mb-3">Layanan Kami</h3>
                                        <p className="text-gray-700 leading-relaxed">
                                            BUMDes Sumber Kalosi menyediakan platform untuk informasi layanan desa dan pemesanan produk UMKM desa.
                                            Kami berhak mengubah atau menghentikan layanan kapan saja tanpa pemberitahuan sebelumnya.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="mb-8">
                                <div className="flex items-start gap-4 mb-4">
                                    <span className="text-2xl mt-1">💳</span>
                                    <div className="flex-1">
                                        <h3 className="text-xl font-bold text-gray-900 mt-0 mb-3">Pemesanan dan Pembayaran</h3>
                                        <div className="space-y-3">
                                            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                                                <span className="text-amber-600 font-bold">•</span>
                                                <p className="text-gray-700 leading-relaxed mb-0">Semua pemesanan yang dilakukan melalui website akan dikonfirmasi melalui WhatsApp.</p>
                                            </div>
                                            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                                                <span className="text-amber-600 font-bold">•</span>
                                                <p className="text-gray-700 leading-relaxed mb-0">Harga yang tercantum dapat berubah sewaktu-waktu.</p>
                                            </div>
                                            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                                                <span className="text-amber-600 font-bold">•</span>
                                                <p className="text-gray-700 leading-relaxed mb-0">Pembayaran dilakukan sesuai metode yang disepakati (COD atau Transfer) setelah konfirmasi pesanan.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mb-8">
                                <div className="flex items-start gap-4 mb-4">
                                    <span className="text-2xl mt-1">🚚</span>
                                    <div className="flex-1">
                                        <h3 className="text-xl font-bold text-gray-900 mt-0 mb-3">Pengiriman</h3>
                                        <p className="text-gray-700 leading-relaxed">
                                            Layanan pengiriman kurir hanya tersedia untuk area yang terjangkau oleh tim kurir BUMDes atau mitra kami.
                                            Biaya pengiriman akan diinformasikan saat konfirmasi pesanan.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="mb-8">
                                <div className="flex items-start gap-4 mb-4">
                                    <span className="text-2xl mt-1">👤</span>
                                    <div className="flex-1">
                                        <h3 className="text-xl font-bold text-gray-900 mt-0 mb-3">Tanggung Jawab Pengguna</h3>
                                        <p className="text-gray-700 leading-relaxed">
                                            Anda bertanggung jawab atas keakuratan data yang Anda berikan (Nama, No HP, Alamat).
                                            Penyalahgunaan platform untuk tindakan ilegal atau merugikan orang lain dilarang keras.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="mb-8">
                                <div className="flex items-start gap-4 mb-4">
                                    <span className="text-2xl mt-1">©️</span>
                                    <div className="flex-1">
                                        <h3 className="text-xl font-bold text-gray-900 mt-0 mb-3">Hak Kekayaan Intelektual</h3>
                                        <p className="text-gray-700 leading-relaxed">
                                            Seluruh konten dalam website ini (teks, gambar, logo) adalah milik BUMDes Sumber Kalosi atau pemilik hak cipta masing-masing.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="prose prose-lg max-w-none text-gray-800">
                            <div className="mb-8">
                                <div className="flex items-start gap-4 mb-6 p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
                                    <span className="text-3xl">👋</span>
                                    <div>
                                        <h3 className="text-xl font-bold text-blue-900 mt-0 mb-2">Pendahuluan</h3>
                                        <p className="text-gray-700 leading-relaxed mb-0">
                                            Selamat datang di BUMDes Sumber Kalosi. Kami menghargai privasi Anda dan berkomitmen untuk melindungi informasi pribadi Anda.
                                            Kebijakan Privasi ini menjelaskan bagaimana kami mengumpulkan, menggunakan, dan melindungi data Anda saat Anda menggunakan layanan website dan WhatsApp kami.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="mb-8">
                                <div className="flex items-start gap-4 mb-4">
                                    <span className="text-2xl mt-1">📝</span>
                                    <div className="flex-1">
                                        <h3 className="text-xl font-bold text-gray-900 mt-0 mb-3">Informasi yang Kami Kumpulkan</h3>
                                        <p className="text-gray-700 leading-relaxed mb-4">
                                            Kami dapat mengumpulkan informasi berikut untuk memproses pesanan dan meningkatkan layanan kami:
                                        </p>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                                                <span className="text-blue-600">✓</span>
                                                <span className="text-gray-700 font-medium">Nama Lengkap</span>
                                            </div>
                                            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                                                <span className="text-blue-600">✓</span>
                                                <span className="text-gray-700 font-medium">Nomor Telepon (WhatsApp)</span>
                                            </div>
                                            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                                                <span className="text-blue-600">✓</span>
                                                <span className="text-gray-700 font-medium">Alamat Pengiriman</span>
                                            </div>
                                            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                                                <span className="text-blue-600">✓</span>
                                                <span className="text-gray-700 font-medium">Detail Pesanan</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mb-8">
                                <div className="flex items-start gap-4 mb-4">
                                    <span className="text-2xl mt-1">🎯</span>
                                    <div className="flex-1">
                                        <h3 className="text-xl font-bold text-gray-900 mt-0 mb-3">Penggunaan Informasi</h3>
                                        <p className="text-gray-700 leading-relaxed mb-4">
                                            Informasi yang kami kumpulkan digunakan untuk:
                                        </p>
                                        <div className="space-y-3">
                                            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                                                <span className="text-blue-600 font-bold">•</span>
                                                <p className="text-gray-700 leading-relaxed mb-0">Memproses dan mengirimkan pesanan Anda.</p>
                                            </div>
                                            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                                                <span className="text-blue-600 font-bold">•</span>
                                                <p className="text-gray-700 leading-relaxed mb-0">Mengirimkan notifikasi status pesanan melalui WhatsApp.</p>
                                            </div>
                                            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                                                <span className="text-blue-600 font-bold">•</span>
                                                <p className="text-gray-700 leading-relaxed mb-0">Menghubungi Anda jika terjadi kendala pada layanan.</p>
                                            </div>
                                            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                                                <span className="text-blue-600 font-bold">•</span>
                                                <p className="text-gray-700 leading-relaxed mb-0">Peningkatan kualitas layanan BUMDes Sumber Kalosi.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mb-8">
                                <div className="flex items-start gap-4 mb-4">
                                    <span className="text-2xl mt-1">🔐</span>
                                    <div className="flex-1">
                                        <h3 className="text-xl font-bold text-gray-900 mt-0 mb-3">Keamanan Data</h3>
                                        <div className="p-4 bg-green-50 border-l-4 border-green-500 rounded">
                                            <p className="text-gray-700 leading-relaxed mb-2">
                                                Kami menerapkan langkah-langkah keamanan yang wajar untuk melindungi data pribadi Anda dari akses, penggunaan, atau pengungkapan yang tidak sah.
                                            </p>
                                            <p className="text-gray-700 leading-relaxed mb-0">
                                                Kami tidak menjual atau membagikan data pribadi Anda kepada pihak ketiga untuk tujuan pemasaran tanpa izin Anda.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mb-8">
                                <div className="flex items-start gap-4 mb-4">
                                    <span className="text-2xl mt-1">🔄</span>
                                    <div className="flex-1">
                                        <h3 className="text-xl font-bold text-gray-900 mt-0 mb-3">Perubahan Kebijakan</h3>
                                        <p className="text-gray-700 leading-relaxed">
                                            Kami dapat memperbarui Kebijakan Privasi ini dari waktu ke waktu. Setiap perubahan akan diposting di halaman ini.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="mb-8">
                                <div className="flex items-start gap-4 mb-4">
                                    <span className="text-2xl mt-1">📞</span>
                                    <div className="flex-1">
                                        <h3 className="text-xl font-bold text-gray-900 mt-0 mb-3">Kontak Kami</h3>
                                        <p className="text-gray-700 leading-relaxed">
                                            Jika Anda memiliki pertanyaan tentang Kebijakan Privasi ini, silakan hubungi kami melalui halaman Kontak atau kantor BUMDes Sumber Kalosi.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Footer */}
                    <div className="border-t-2 border-gray-200 pt-6 mt-8">
                        <div className="flex items-center justify-between flex-wrap gap-4">
                            <p className="text-sm text-gray-500">
                                <span className="font-semibold">Terakhir diperbarui:</span> {new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
                            </p>
                            <p className="text-sm text-gray-400">
                                © 2025 BUMDes Sumber Kalosi
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}