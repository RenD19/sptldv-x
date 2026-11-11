# Catatan Revisi sptldv-x · 12 November 2026

Dasar revisi adalah cabang **RenD19-Gabung-Patch-1** (versi 11 November). Cabang ini **belum digabung ke `main`**,
jadi GitHub Pages masih menampilkan versi lama. Setelah file revisi diunggah, gabungkan cabangnya ke `main`.

## Yang tidak berubah (aman untuk kuis yang sudah berjalan)
- `js/core.js`, `server/Code.gs`, `server/Saran.gs`, dan `js/config.js` tidak diubah.
- Bagian CORE di `sistem-ptldv.html` dan `balik-ptldv.html` tidak diubah.
- Kode `cek` halaman tetap sama, jadi **tidak perlu menempel ulang apa pun di Apps Script**.
  - Nilai Optimum `2026-11-01.3:db139415`
  - Materi 1 `2026-10-25.1:b9b95080`
  - Materi 2 `2026-10-28.2:b54c61dc`

## File yang diunggah ke GitHub
File baru
- `css/token.css` · token warna, ukuran huruf, sudut, jarak, bayangan untuk semua halaman
- `css/materi-ptldv.css` · tampilan Materi 1 dan 2 (sebelumnya disalin di `<style>` kedua halaman)
- `css/tka.css`, `js/tka-soal.js`, `js/tka.js`, `tka.html` · halaman Latihan TKA

File yang diganti
- `index.html`, `kuis.html`, `sistem-ptldv.html`, `balik-ptldv.html`
- `css/gaya.css`
- `js/belajar.js`, `js/komponen.js`, `js/kuis.js`, `js/latihan.js`, `js/saran.js`
- `README.md`

Penanda versi `?v=` sudah dinaikkan menjadi `2026-11-12.1`.

## Paket A · Tampilan
1. Form masuk kuis (`kuis.html`) sekarang rapi: label di atas kotak isian, kotak selebar layar.
2. Pemilih bagian di tab Belajar `index.html` sudah bergaya sama dengan Materi 1 dan 2.
3. Maskot Plus tidak lagi menutupi bidang koordinat atau teks. Saat menunjuk teks yang tidak muat di sampingnya,
   Plus tetap di pojok dan menunjuk dengan panah. Di ponsel Plus tetap di pojok; sorotan jingga tetap tampil.
4. Tabel ringkasan contoh kontekstual muat di layar ponsel.
5. Tombol "✕" diganti tulisan **Sembunyikan** / **👋 Munculkan Plus**.
6. **💬 Kritik & Saran** menjadi tombol biasa di kanan, tidak lagi menyerupai tab.
7. `kuis.html` memiliki tautan kembali ke materi. Bidang koordinat kosong disembunyikan sebelum kuis dimulai
   dan setelah selesai (di keempat halaman yang punya kuis).

## Paket C · Teks antarmuka
- Istilah tombol diseragamkan, yaitu **🎲 Soal baru**, **↺ Ulangi soal**, **↺ Putar ulang** (tab Belajar),
  **Mulai soal**, **Masuk kuis**, **Buka Latihan Mandiri**. Tanda panah ➜ di akhir tombol dihapus.
- Level untuk siswa ditulis **Dasar / Terapan / Menantang**. Kode LOTS/MOTS/HOTS, kata kerja operasional,
  dan sumber materi hanya tampil di **mode guru** (tambahkan `?guru` di akhir alamat).
- Pesan galat sekarang memberi jalan keluar, misalnya "Belum tersambung ke penyimpanan nilai. Periksa internet, lalu muat ulang halaman ini."
- Petunjuk masuk kuis diringkas menjadi 3 poin.
- Tanda titik dua di dekat angka dihapus dari teks siswa (sekitar 55 tempat, sebagian besar di Materi 2),
  misalnya "Uji (2, 4): 4 > 2" menjadi "Uji (2, 4) memberi 4 > 2".

## Paket B · Sistem gaya
- Semua warna memakai token dari `css/token.css` (165 kode warna diganti; tersisa nol di `gaya.css` dan `materi-ptldv.css`).
- Sudut membulat dirapikan menjadi 4 ukuran, ukuran huruf menjadi 5 ukuran.
- Cincin fokus keyboard yang sama untuk semua tombol, chip, pilihan, dan kotak isian; efek sorot pada tombol.

## Paket D · Fitur TKA
- **`tka.html` Latihan Soal TKA** (menu nomor 4)
  - 15 soal dalam tiga bentuk soal TKA, yaitu pilihan ganda, pilih semua yang benar, dan Benar/Salah.
  - Soal grup dengan bacaan yang tetap terlihat di samping soal (Bu Hasnah, kapal feri Bajoe, gambar DP).
  - Level kognitif TKA (Pemahaman, Aplikasi, Penalaran) dan kode tugas kecil T1–T11 pada setiap soal.
  - **Mode Latihan**: setiap soal langsung diperiksa, dengan pembahasan dan tugas kecil yang perlu dilatih.
  - **Mode Simulasi**: 3 menit per soal, pindah soal, tandai ragu, hasil di akhir.
  - Pilihan **Yakin / Ragu / Menebak** sebelum memeriksa; layar hasil menampilkan "yakin tetapi salah".
  - Skor ganda, yaitu cara TKA (benar penuh) dan poin latihan (parsial).
  - Paket singkat 8 soal atau paket lengkap 15 soal. Semua kunci sudah diperiksa dengan perhitungan.
  - Tanpa server, sehingga kunci dapat dilihat siswa yang membuka kode. Pakai untuk latihan, bukan penilaian.
- **Latihan Mandiri tanpa bantuan** di ketiga halaman materi: 💡 Petunjuk dan 📍 Di mana salahku? disembunyikan,
  🔑 Lihat jawaban tetap muncul setelah dua kali salah.
- Garis selidik yang bisa digeser sudah ada di tab Belajar Nilai Optimum, jadi tidak ditambah lagi.

## Pemeriksaan yang sudah dijalankan
- `CORE.cek()` di keempat halaman sama persis dengan versi sebelum revisi.
- `PL.Petunjuk.uji()` dan `PL.Penyelesaian.uji()` masih "aman".
- Semua layar Belajar dilalui sampai akhir (150 + 74 + 96 langkah) tanpa galat; Latihan diacak 12 kali per halaman.
- Latihan TKA diuji di laptop dan ponsel, mode Latihan dan Simulasi, termasuk penskoran parsial.
