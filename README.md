# Program Linear: dari Contoh Kontekstual ke Nilai Optimum

Media pembelajaran Matematika Kelas X (Fase E), terbagi menjadi dua halaman:

- **`index.html`** (halaman materi): tab **Belajar**, **Latihan Mandiri**, dan tombol **💬 Kritik & Saran**.
- **`kuis.html`** (halaman kuis): **Kuis** saja. Skor disetor ke Google Sheet lewat Google Apps Script.

Halaman materi tidak menautkan ke kuis, jadi guru membagikan tautan kuis sendiri saat kuis dimulai.

## Isi folder

```
media-nilai-optimum/
├── index.html            halaman MATERI: tab Belajar + Latihan Mandiri + Kritik & Saran
├── kuis.html             halaman KUIS: tab Kuis saja
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

Setiap tab memakai wadahnya sendiri (`#tab-belajar`, `#tab-latihan`, `#tab-kuis`).
Mode aktif ditulis di `<body data-mode="belajar|latihan|kuis">`, jadi aturan khusus satu mode cukup ditulis seperti ini:

```css
@layer mode {
  body[data-mode="kuis"] .tab-view .kartu { border-left: 4px solid var(--amber); }
  #tab-kuis[data-tahap="masuk"] .plane { opacity: .6; }
}
```

## Menerbitkan di GitHub Pages (tanpa perintah terminal)

1. **Buat akun** di https://github.com (gratis), lalu masuk.
2. **Buat repositori baru.** Klik tombol **+** di kanan atas → **New repository**.
   - Repository name: misalnya `nilai-optimum` (huruf kecil, tanpa spasi).
   - Pilih **Public**. GitHub Pages gratis hanya untuk repositori publik.
   - Klik **Create repository**.
3. **Unggah file.** Di halaman repositori, klik **uploading an existing file**
   (atau **Add file → Upload files**).
   - Buka folder `media-nilai-optimum` di komputer, pilih **semua isinya**
     (`index.html`, `kuis.html`, `.nojekyll`, folder `css`, `js`, `server`, `README.md`, dan `PANDUAN-APPS-SCRIPT.md`),
     lalu seret ke halaman GitHub. Jangan menyeret folder induknya, agar `index.html` berada di akar repositori.
   - Bila `.nojekyll` tidak ikut (file berawalan titik kadang tersembunyi), buat sendiri:
     **Add file → Create new file**, beri nama `.nojekyll`, biarkan kosong, lalu **Commit**.
   - Klik **Commit changes**.
4. **Aktifkan Pages.** Buka **Settings** → **Pages** (menu kiri).
   - Source: **Deploy from a branch**.
   - Branch: **main**, folder **/ (root)** → **Save**.
5. **Tunggu 1–2 menit**, lalu muat ulang halaman Settings → Pages.
   Alamatnya muncul seperti `https://namaakun.github.io/nilai-optimum/`.
   - Materi: `https://namaakun.github.io/nilai-optimum/` (bisa juga `…/#latihan` untuk langsung ke Latihan Mandiri)
   - Kuis: `https://namaakun.github.io/nilai-optimum/kuis.html`

## Menghubungkan ke Google Sheet

Ada **dua** server Apps Script yang terpisah, masing-masing dengan Google Sheet sendiri:

| Server | File di Apps Script | Diisi ke `js/config.js` |
|---|---|---|
| Kuis | `Code.gs` (dari `server/Code.gs`) **+** `core.gs` (dari `js/core.js`) | `ENDPOINT` |
| Kritik & saran | `Code.gs` (dari `server/Saran.gs`) | `SARAN_ENDPOINT` |

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

Klik dua kali `index.html` (materi) atau `kuis.html` (kuis). Keduanya berjalan langsung dari folder tanpa server.
Rumus KaTeX memerlukan internet; tanpa internet, rumus tampil sebagai teks biasa.
