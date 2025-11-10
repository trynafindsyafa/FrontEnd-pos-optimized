# Laporan Praktikum Optimasi Performa React.js: Caching

**Nama:** [Nama Anda]
**NIM:** [NIM Anda]
**Mata Kuliah:** Pemrograman Front-End
[cite_start]**Dosen:** Bapak Nanang [cite: 781]
[cite_start]**Deadline:** 10 November 2025 [cite: 782]

---

## I. Implementasi Caching (Praktik 03)

Proyek Point of Sales (POS) ini dioptimalkan untuk menangani 10.000 data dummy. [cite_start]Optimasi kunci pada fungsi pencarian adalah implementasi **Custom In-Memory Cache** berbasis **Map** yang dimuat dan disimpan secara persisten menggunakan **`localStorage`**[cite: 580, 688].

[cite_start]Tujuan utama *caching* ini adalah menghindari filter ulang data yang sama berulang kali (misalnya, pengguna mencari "kopi" dua kali)[cite: 577, 578].

### Screenshot DevTools saat Cache Hit

[cite_start]*Sertakan tangkapan layar (screenshot) dari DevTools Anda.* Screenshot ini harus menunjukkan indikator **"✅ Hasil dari cache"** [cite: 681] di UI dan/atau hasil Profiler yang menunjukkan waktu render yang sangat cepat setelah *search term* yang sama diulang.



---

## II. Analisis: Manfaat Caching dan `localStorage`

### Apakah menggunakan cache atau `localStorage` menyebabkan aplikasi menjadi lebih baik? Kenapa?

**Ya, penggunaan *caching* (terutama yang dipersistenkan dengan `localStorage`) sangat menyebabkan aplikasi menjadi lebih baik.**

| Teknik | Manfaat | Alasan Teknis |
| :--- | :--- | :--- |
| [cite_start]**Custom Cache (Map)** [cite: 580] | **Meningkatkan Kecepatan & Responsivitas Sesi.** | [cite_start]*Cache* mengambil hasil pencarian dari memori (RAM) daripada harus memproses ulang seluruh array produk (10.000 data)[cite: 618, 619]. |
| [cite_start]**`localStorage`** [cite: 688] | **Memastikan Persistensi Data Antar Sesi.** | [cite_start]Tanpa `localStorage`, *cache* akan hilang setelah halaman di-refresh[cite: 687]. [cite_start]Dengan `localStorage`, hasil pencarian yang kompleks akan tetap tersedia (tersimpan secara persisten di *browser*) bahkan setelah *refresh* atau penutupan *browser*[cite: 518, 521]. |

**Kesimpulan:**

1.  [cite_start]**Penghematan Komputasi:** Menggunakan *cache* memotong kebutuhan aplikasi untuk melakukan komputasi berat (filtering array besar) berulang kali[cite: 577, 619].
2.  **Peningkatan UX:** Responsivitas aplikasi terasa jauh lebih cepat, terutama pada perangkat yang memiliki CPU terbatas. [cite_start]Ini menghasilkan pengalaman pengguna (*UX*) yang lebih baik[cite: 12, 621].

---

## III. Tugas Lanjutan (React Query)

*Ini adalah bagian tambahan yang diminta oleh modul:*

**Bandingkan waktu respons sebelum dan sesudah pakai React Query:**
[cite_start]*(Jawab di sini, contoh: Waktu respons untuk fetching data berkurang dari 300ms menjadi <50ms karena React Query secara otomatis menyajikan data yang di-*cache*)*[cite: 774].

**Jelaskan bagaimana React Query mengelola cache secara otomatis:**
[cite_start]*(Jawab di sini, jelaskan konsep seperti *stale-while-revalidate* dan *garbage collection*)*[cite: 775].

**Apa keuntungan menggunakan library (seperti React Query) daripada custom cache?**
[cite_start]*(Jawab di sini, sebutkan fitur *automatic invalidation*, *retry mechanism*, dan *state management* yang lebih komprehensif)*[cite: 776].

---