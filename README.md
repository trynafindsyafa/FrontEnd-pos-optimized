# Laporan Praktikum Optimasi Performa React.js

**Topik:** Optimasi Performa melalui Caching (Studi Kasus POS App)

**Nama:** [Ezar Athilla Musyafa]
**NIM:** [V3424091]
**Mata Kuliah:** Pemrograman Front-End

---

## I. Implementasi Caching (Custom Cache)

Aplikasi Point of Sales (POS) ini dibangun untuk memproses dan memfilter **10.000 data produk**. Optimasi caching diimplementasikan untuk mencegah pemanggilan fungsi filtering yang berat berulang kali saat pengguna mengetik *search term* yang sama.

Teknik yang digunakan:
1.  **In-Memory Cache:** Menggunakan objek `Map` untuk menyimpan hasil filtering produk terbaru di memori (RAM).
2.  **Persistensi:** Menggunakan `localStorage` untuk menyimpan `Map` secara persisten, sehingga hasil filtering tidak hilang saat halaman di-*refresh*.
3.  **Memoization:** Menggunakan `useMemo` di `App.jsx` untuk memastikan fungsi filtering hanya dipanggil ulang ketika `searchTerm` benar-benar berubah.

### A. Screenshot DevTools saat Cache Hit

Pada DevTools Profiler, interaksi pertama (Cache Miss) menunjukkan waktu komputasi yang terukur (misalnya, 30-80ms) karena 10.000 data harus diproses. Namun, saat interaksi kedua (Cache Hit) dengan kata kunci yang sama terjadi, waktu komputasi fungsi filter di *Profiler* mendekati 0ms, karena data diambil dari `Map`.

[Sertakan Screenshot DevTools Profiler Anda di sini, yang menunjukkan dua interaksi pencarian dengan kata kunci yang sama dan menunjukkan waktu render/komputasi yang sangat cepat (hampir nol) pada interaksi kedua.]

---

## II. Analisis Manfaat Caching

### Jelaskan “Apakah menggunakan cache atau `localStorage` menyebabkan aplikasi menjadi lebih baik? Kenapa?”

**Ya, menggunakan Caching (dengan bantuan `localStorage`) secara signifikan membuat aplikasi menjadi lebih baik dan lebih responsif.**

**Alasan Utamanya:**

1.  **Penghematan Komputasi (CPU):** *Custom Cache* berbasis `Map` yang kita implementasikan berfungsi sebagai memori jangka pendek. Saat *cache hit* terjadi, aplikasi menghindari pemanggilan ulang fungsi `filterProducts` yang memakan waktu (iterasi 10.000 data). Komputasi yang mahal diganti dengan pembacaan data instan dari RAM.
2.  **Persistensi dan Konsistensi UX:** Penggunaan **`localStorage`** memastikan bahwa hasil *cache* tidak hilang ketika pengguna melakukan *refresh* halaman (F5). Ini meningkatkan *User Experience* (UX) karena aplikasi terasa lebih cepat dan "mengingat" pekerjaan sebelumnya, mengurangi waktu *loading* atau *re-calculation* yang tidak perlu setelah *refresh*.

---

## III. Perbandingan dengan React Query (Konsep Tugas Modul)

### A. Bandingkan waktu respons sebelum dan sesudah pakai React Query

Meskipun kita menggunakan *Custom Cache*, konsepnya mirip dengan caching pada React Query, namun dengan lingkup yang lebih luas (*data fetching*).

| Skenario | Waktu Respons (Simulasi) | Penjelasan |
| :--- | :--- | :--- |
| **Awal (Tanpa Cache)** | Tinggi (300ms-1 detik) | Aplikasi harus menunggu *response* dari *server* dan memproses *data* (filtering) setiap kali *query* data yang sama dipanggil. |
| **Sesudah Pakai React Query** | Rendah (<50ms) | React Query menampilkan **data lama (stale)** yang tersimpan di *cache* secara instan, dan melakukan *fetching* data baru dari *server* di latar belakang (*revalidation*). |

### B. Jelaskan bagaimana React Query mengelola cache secara otomatis

React Query (TanStack Query) mengelola *cache* secara otomatis menggunakan strategi **Stale-While-Revalidate (SWR)** dan sistem manajemen *state* terintegrasi:

1.  **Status Data:** Data memiliki dua status utama, **`fresh`** dan **`stale`** (kadaluwarsa). Data yang baru di-*fetch* dianggap `fresh` untuk waktu singkat (`staleTime`).
2.  **Revalidation Otomatis:** Ketika data menjadi `stale`, React Query akan **secara otomatis** melakukan *re-fetching* (pengambilan ulang data) di latar belakang ketika:
    * Jendela browser di-*focus* kembali.
    * Komponen yang menggunakan *query* di-*mount*.
    * Koneksi jaringan dipulihkan.
3.  **Garbage Collection:** Query yang tidak lagi digunakan oleh komponen mana pun di-*deactivate*. Setelah jangka waktu tertentu (`cacheTime`, *default* 5 menit), data *cache* akan dibersihkan (*garbage collected*) untuk menghemat memori.

### C. Apa keuntungan menggunakan Library (misalnya React Query) daripada Custom Cache?

Meskipun *Custom Cache* kita berhasil mengatasi masalah *filtering*, React Query menawarkan keuntungan signifikan dalam mengelola *data fetching* secara umum:

| Keuntungan React Query | Penjelasan |
| :--- | :--- |
| **Stale-While-Revalidate (SWR)** | Menyediakan UX yang lebih baik; pengguna melihat data instan dari *cache* sambil menunggu *update* data terbaru dari *server* di latar belakang. |
| **Penanganan Asinkron Otomatis** | Secara otomatis menyediakan *state* `isLoading`, `isError`, `isFetching`, dan *retry mechanism* bawaan tanpa perlu kode `useEffect` atau `useState` yang kompleks. |
| **Cache Invalidation & Update** | Memungkinkan data di-*invalidate* (dinyatakan `stale`) dengan mudah, memaksa *re-fetch* data yang relevan setelah operasi *mutation* (POST, PUT, DELETE) dilakukan. |
| **State Global Terpusat** | Berfungsi sebagai sumber *state* server global di seluruh aplikasi tanpa perlu Redux atau *Context* tambahan untuk data *server*. |