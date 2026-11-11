# Program Linear: dari Contoh Kontekstual ke Nilai Optimum

Media pembelajaran Matematika Kelas X (Fase E) untuk bab Sistem Pertidaksamaan Linear Dua Variabel,
terdiri atas tiga materi berurutan dan satu halaman kuis:

| No. | Halaman | Isi | Bagian berskor |
|---|---|---|---|
| 1 | **`sistem-ptldv.html`** | Daerah Penyelesaian SPtLDV: tab **Belajar**, **Latihan Mandiri**, **Kuis** | Kuis (server sendiri) |
| 2 | **`balik-ptldv.html`** | Menyusun Sistem Pertidaksamaan dari Daerah Penyelesaian: tab **Belajar**, **Latihan Mandiri**, **Kuis** | Kuis (server sendiri) |
| 3 | **`index.html`** | Contoh Kontekstual ke Nilai Optimum: tab **Belajar**, **Latihan Mandiri**, tombol **💬 Kritik & Saran** | tidak ada |
| – | **`kuis.html`** | Kuis Nilai Optimum saja | Kuis (server kuis optimum) |

Ketiga halaman materi memiliki **menu urutan materi** yang sama di kepala halaman
(1 Daerah Penyelesaian · 2 Menyusun dari DP · 3 Nilai Optimum); halaman yang sedang dibuka ditandai biru.
Bila latihan/kuis berskor sedang berjalan atau skor belum terkirim, siswa diminta konfirmasi sebelum pindah halaman lewat menu.

Halaman materi tidak menautkan ke `kuis.html`, jadi guru membagikan tautan kuis sendiri saat kuis dimulai.

## Isi folder

```
sptldv-x/
├── sistem-ptldv.html     MATERI 1: Daerah Penyelesaian (file mandiri: CSS + JS + CORE + maskot Plus di dalamnya)
├── balik-ptldv.html      MATERI 2: Menyusun dari DP (file mandiri: CSS + JS + CORE + maskot Plus di dalamnya)
├── index.html            MATERI 3: Nilai Optimum, tab Belajar + Latihan Mandiri + Kritik & Saran
├── kuis.html             halaman KUIS Nilai Optimum: tab Kuis saja
├── .nojekyll             berkas kosong; membuat GitHub Pages menyajikan file apa adanya
├── README.md             berkas ini
├── PANDUAN-APPS-SCRIPT.md  panduan lengkap memasang kedua server Apps Script
├── css/
│   └── gaya.css          seluruh tampilan, disusun dalam lapisan (@layer)
├── js/
│   ├── config.js         PENGATURAN: alamat server kuis dan server saran  ← biasanya hanya file ini yang diubah
│   ├── core.js           CORE BERSAMA: pembangkit soal + penilai; ditempel utuh ke core.gs di Apps Script
│   ├── komponen.js       komponen bersama: bidang koordinat, maskot Plus (termasuk gambarnya), penampil langkah soal
│   ├── petunjuk.js       teks petunjuk khusus Latihan: nama rumus yang eksplisit + petunjuk lanjutan
│   ├── penyelesaian.js   penyelesaian bertahap (KaTeX) setelah jawaban benar atau 🔑 Lihat jawaban
│   ├── belajar-data.js   teks materi tab Belajar (Bagian 1 dan Bagian 2)
│   ├── belajar.js        perilaku tab Belajar
│   ├── latihan.js        perilaku tab Latihan Mandiri
│   ├── kuis.js           perilaku tab Kuis (masuk, simpan progres, kirim skor)
│   ├── saran.js          tombol dan form Kritik & Saran
│   └── main.js           pengatur tab (dipakai kedua halaman)
└── server/               SALINAN kode server; dipasang di Google Apps Script, BUKAN dijalankan GitHub
    ├── Code.gs           server kuis (pasangannya: js/core.js sebagai core.gs)
    └── Saran.gs          server kritik & saran (proyek Apps Script terpisah)
```

### Ingin mengubah sesuatu? Buka file ini

| Yang ingin diubah | File |
|---|---|
| Alamat server kuis atau server saran | `js/config.js` |
| Menampilkan lagi tombol "Kuis ➜" di Latihan Mandiri | `css/gaya.css`, hapus baris `body[data-halaman="materi"] [data-aksi="ke-kuis"]` |
| Teks materi, contoh, Pertanyaan Diskusi | `js/belajar-data.js` |
| Teks petunjuk di Latihan Mandiri (nama rumus, petunjuk lanjutan) | `js/petunjuk.js` |
| Langkah penyelesaian yang muncul setelah menjawab | `js/penyelesaian.js` |
| Gambar atau kalimat maskot Plus | `js/komponen.js`, bagian `Maskot "Plus"` |
| Tampilan yang hanya berlaku di satu mode | `css/gaya.css`, bagian `@layer mode` |
| Perilaku tombol atau alur satu tab | `js/belajar.js`, `js/latihan.js`, atau `js/kuis.js` |
| Aturan kuis (batas waktu, percobaan, PIN) | `server/Code.gs`, bagian `KONFIG` (lalu salin ke Apps Script) |
| Soal, kunci, cara menilai | `js/core.js` **lalu** tempel ulang ke `core.gs` di Apps Script (lihat "Aturan penting") |
| Menu urutan materi (nama, urutan, tautan) | blok `<nav class="nav-materi">` di **ketiga** halaman materi: `sistem-ptldv.html`, `balik-ptldv.html`, `index.html` |
| Tampilan menu urutan materi | `css/gaya.css` (bagian `.nav-materi`) **dan** salinannya di `<style>` `sistem-ptldv.html` serta `balik-ptldv.html` |
| Apa pun di Materi 1 atau Materi 2 (teks, soal, alamat server) | langsung di `sistem-ptldv.html` atau `balik-ptldv.html` (tidak memakai `css/` dan `js/`) |
| Teks tab Belajar Materi 1 / Materi 2 | data `EX` di `sistem-ptldv.html` / `balik-ptldv.html` (cari `var EX=[`); contoh kontekstual di `CK_A` … `CK_E` |
| Pilihan tipe dan level Latihan Mandiri | objek `PAGE` di masing-masing halaman |
| Mesin tab Belajar, maskot Plus, soal LOTS/HOTS, petunjuk, 🔑, penyelesaian | blok `MODUL BERSAMA` — isinya **sama persis** di kedua halaman; ubah di keduanya |

Setiap tab memakai wadahnya sendiri (`#tab-belajar`, `#tab-latihan`, `#tab-kuis`).
Mode aktif ditulis di `<body data-mode="belajar|latihan|kuis">`, jadi aturan khusus satu mode cukup ditulis seperti ini:

```css
@layer mode {
  body[data-mode="kuis"] .tab-view .kartu { border-left: 4px solid var(--amber); }
  #tab-kuis[data-tahap="masuk"] .plane { opacity: .6; }
}
```

## Tab Belajar dan Latihan Mandiri di Materi 1 dan Materi 2

Kedua halaman memakai format yang sama dengan Materi 3 (`index.html`):

- **Belajar**: menu bagian bergrup, "Layar x dari y · langkah a dari b", bagian muncul bertahap bersama maskot Plus,
  tabel uji titik dapat diketuk untuk menandai titiknya di grafik.
  - Materi 1: konsep A–C (garis batas, daerah penyelesaian, DP sistem) + contoh kontekstual A–C + rangkuman + 6 kasus "temukan kesalahan".
  - Materi 2: konsep D–E (dari Rangkuman 2) + contoh kontekstual D–E + rangkuman + 9 kasus "temukan kesalahan".
  - Contoh kontekstual A–E bersumber dari PDF *Pembahasan Contoh Kontekstual SPtLDV* (sama dengan Bagian 1 di `index.html`).
- **Latihan Mandiri** (tanpa skor, tidak ke server): pilih **Tipe** dan **Level** mengikuti dokumen *Susunan Kategori Soal*.
  - Materi 1 = Tipe 1 · Menggambar DP; Materi 2 = Tipe 2 · Sistem dari DP.
  - **MOTS** memakai alur langkah interaktif (tabel titik, geser titik, arsir; atau dua titik, persamaan, uji titik, tanda).
  - **LOTS** dan **HOTS** berupa soal langkah singkat (pilihan, isian, ketuk titik), diadaptasi dari `js/core.js`.
  - Bantuan: 💡 Petunjuk bertahap (petunjuk paling rinci terbuka setelah mencoba sekali), 📍 Di mana salahku?,
    🔑 Lihat jawaban setelah 2 kali salah, penyelesaian bertahap (KaTeX), dan panel "🎉 Soal selesai" berisi pembahasan.
- **Kuis** tidak berubah: CORE, jejak jawaban, dan server sama seperti sebelumnya (kode `cek` halaman tetap).

## Menerbitkan di GitHub Pages (tanpa perintah terminal)

1. **Buat akun** di https://github.com (gratis), lalu masuk.
2. **Buat repositori baru.** Klik tombol **+** di kanan atas → **New repository**.
   - Repository name: misalnya `nilai-optimum` (huruf kecil, tanpa spasi).
   - Pilih **Public**. GitHub Pages gratis hanya untuk repositori publik.
   - Klik **Create repository**.
3. **Unggah file.** Di halaman repositori, klik **uploading an existing file**
   (atau **Add file → Upload files**).
   - Buka folder `sptldv-x` di komputer, pilih **semua isinya**
     (`index.html`, `kuis.html`, `sistem-ptldv.html`, `balik-ptldv.html`, `.nojekyll`, folder `css`, `js`, `server`, `README.md`, dan `PANDUAN-APPS-SCRIPT.md`),
     lalu seret ke halaman GitHub. Jangan menyeret folder induknya, agar `index.html` berada di akar repositori.
   - Bila `.nojekyll` tidak ikut (file berawalan titik kadang tersembunyi), buat sendiri:
     **Add file → Create new file**, beri nama `.nojekyll`, biarkan kosong, lalu **Commit**.
   - Klik **Commit changes**.
4. **Aktifkan Pages.** Buka **Settings** → **Pages** (menu kiri).
   - Source: **Deploy from a branch**.
   - Branch: **main**, folder **/ (root)** → **Save**.
5. **Tunggu 1–2 menit**, lalu muat ulang halaman Settings → Pages.
   Alamatnya muncul seperti `https://namaakun.github.io/nilai-optimum/`.
   - Materi 1: `https://namaakun.github.io/nilai-optimum/sistem-ptldv.html`
   - Materi 2: `https://namaakun.github.io/nilai-optimum/balik-ptldv.html`
   - Materi 3: `https://namaakun.github.io/nilai-optimum/` (bisa juga `…/#latihan` untuk langsung ke Latihan Mandiri)
   - Kuis Nilai Optimum: `https://namaakun.github.io/nilai-optimum/kuis.html`

## Menghubungkan ke Google Sheet

Ada **empat** server Apps Script yang terpisah, masing-masing dengan Google Sheet sendiri:

| Server | File di Apps Script | Alamat diisi ke |
|---|---|---|
| Kuis Nilai Optimum | `Code.gs` (dari `server/Code.gs`) **+** `core.gs` (dari `js/core.js`) | `js/config.js` → `ENDPOINT` |
| Kritik & saran | `Code.gs` (dari `server/Saran.gs`) | `js/config.js` → `SARAN_ENDPOINT` |
| Kuis Materi 1 (`MATERI:"sistem"`) | proyek Apps Script milik `sistem-ptldv.html` (tidak disimpan di repositori ini) | `sistem-ptldv.html`, bagian `PENGATURAN` (`window.PTLDV_CONFIG`) |
| Kuis Materi 2 (`MATERI:"balik"`) | proyek Apps Script milik `balik-ptldv.html` (tidak disimpan di repositori ini) | `balik-ptldv.html`, bagian `PENGATURAN` (`window.PTLDV_CONFIG`) |

Alamat server Materi 1 dan Materi 2 sudah terisi dan tidak berubah karena dipindah ke GitHub Pages.
Bila suatu saat CORE di `sistem-ptldv.html` atau `balik-ptldv.html` diubah, `Code.gs` server masing-masing juga harus diperbarui
(kedua halaman ini menyimpan CORE di dalam file HTML-nya sendiri).

Langkah demi langkah ada di **[PANDUAN-APPS-SCRIPT.md](PANDUAN-APPS-SCRIPT.md)**. Setelah selesai, `js/config.js` berisi:

```js
window.OPTIMUM_CONFIG={ENDPOINT:"https://script.google.com/macros/s/…kuis…/exec",SARAN_ENDPOINT:"https://script.google.com/macros/s/…saran…/exec",MATERI:"optimum"};
```

Bila `ENDPOINT` kosong, Kuis berjalan dalam **mode uji** (bisa dikerjakan, skor tidak disetor).
Bila `SARAN_ENDPOINT` kosong, form Kritik & Saran tampil tetapi isinya tidak dikirim.

## Memeriksa bahwa halaman dan server sama

Ada tiga cara, dan ketiganya harus menunjukkan kode yang sama, misalnya `2026-11-01.3:db139415`:

- Di editor Apps Script, jalankan `ujiCek`, lalu lihat Log.
- Buka URL `/exec` kuis di peramban, lalu lihat nilai `"cek"`.
- Di halaman siswa, tekan F12 → Console, lalu ketik `__api.CORE.cek()`.

Halaman masuk kuis juga menampilkan **"✔ Halaman dan server cocok"** bila keduanya sama.

## Aturan penting

- **`js/core.js` dan file `core.gs` di Apps Script harus persis sama.**
  Repositori hanya menyimpan satu salinan (`js/core.js`); `server/Code.gs` tidak lagi memuat CORE.
  Bila `core.js` diubah: buka `core.gs` di editor Apps Script → pilih semua (Ctrl+A) → tempel seluruh isi `core.js` →
  Simpan → terbitkan versi baru (Deploy → Kelola penerapan → pensil → Versi baru → Terapkan),
  lalu unggah `core.js` ke GitHub. Jangan menyunting `core.gs` sebagian di editor.
  Lakukan sebelum kuis dimulai: siswa yang sedang mengerjakan dengan versi lama tidak dapat melanjutkan.
- **Setiap memperbarui file di GitHub, naikkan penanda versi** di `index.html` **dan** `kuis.html`
  (misalnya `?v=2026-11-01.6` → `?v=2026-11-05.1` pada semua baris `<link>` dan `<script>`).
  Tanpa ini, peramban siswa bisa tetap memakai salinan lama.
  Cara cepat di GitHub: buka `index.html` → pensil → tekan Ctrl+F untuk mencari `?v=` → ubah semuanya → Commit.
  `sistem-ptldv.html` dan `balik-ptldv.html` tidak memakai penanda versi karena semua isinya ada di satu file.
- Skor tertunda tiap materi disimpan di peramban dengan kunci terpisah
  (`ptldv-skor-tertunda-sistem`, `ptldv-skor-tertunda-balik`, `optimum-skor-tertunda-optimum`), jadi ketiganya tidak saling menimpa
  meskipun berada di satu situs GitHub Pages.
- Urutan `<script>` jangan diubah:
  - `index.html`: `config → core → komponen → petunjuk → penyelesaian → belajar-data → belajar → latihan → saran → main`
  - `kuis.html`: `config → core → komponen → kuis → main`
- Repositori bersifat publik, jadi isi `server/` dapat dibaca orang lain. Ini aman:
  kunci rahasia server dibuat otomatis dan disimpan di Script Properties, bukan di file.
  Daftar siswa dan PIN hanya ada di Google Sheet.

## Pemeriksaan mandiri di konsol

Buka `index.html`, tekan F12 → Console, lalu ketik:

- `PL.Petunjuk.uji()` → harus `"Semua petunjuk lanjutan aman."`
- `PL.Penyelesaian.uji()` → harus `"Semua penyelesaian aman."`

Jalankan keduanya setiap kali `core.js`, `petunjuk.js`, atau `penyelesaian.js` diubah.

## Mencoba di komputer sendiri

Klik dua kali `sistem-ptldv.html`, `balik-ptldv.html`, `index.html` (materi) atau `kuis.html` (kuis).
Semuanya berjalan langsung dari folder tanpa server, dan menu urutan materi berpindah antarhalaman di folder yang sama.
Rumus KaTeX memerlukan internet; tanpa internet, rumus tampil sebagai teks biasa.
