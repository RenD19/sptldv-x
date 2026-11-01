# Panduan Mengatur Google Apps Script

Media ini memakai **dua server Apps Script yang terpisah**. Masing-masing punya Google Sheet sendiri
dan alamat (URL `/exec`) sendiri.

| | Server KUIS | Server KRITIK & SARAN |
|---|---|---|
| Google Sheet | misalnya "Skor Nilai Optimum" | misalnya "Kritik dan Saran SPtLDV" |
| File di Apps Script | `Code.gs` ← `server/Code.gs`<br>`core.gs` ← `js/core.js` | `Code.gs` ← `server/Saran.gs` |
| Sheet yang dibuat otomatis | Siswa, Sesi, Skor, Jejak | Saran |
| Diisi ke `js/config.js` | `ENDPOINT` | `SARAN_ENDPOINT` |

Daftar isi:
[A. Persiapan](#a-persiapan) ·
[B. Server kuis](#b-memasang-server-kuis) ·
[C. Server kritik & saran](#c-memasang-server-kritik--saran) ·
[D. Memindahkan server lama ke susunan dua file](#d-memindahkan-server-kuis-lama-ke-susunan-dua-file) ·
[E. Memperbarui kode](#e-memperbarui-kode-setelah-terpasang) ·
[F. Pengaturan KONFIG](#f-pengaturan-konfig-kuis) ·
[G. Sebelum dan sesudah kuis](#g-sebelum-dan-sesudah-kuis) ·
[H. Memecahkan masalah](#h-memecahkan-masalah)

---

## A. Persiapan

1. **Pilih akun Google pemilik server.** Server berjalan atas nama akun ini, dan semua data siswa masuk ke Drive akun ini.
   - Akun Gmail pribadi: pilihan "Siapa saja" (Anyone) pada langkah penerapan pasti tersedia.
   - Akun Google Workspace sekolah: admin sekolah kadang membatasi akses hanya untuk pengguna di dalam domain.
     Bila pilihan **"Siapa saja"** tidak muncul, siswa yang tidak masuk dengan akun sekolah tidak bisa mengirim skor.
     Mintalah admin membukanya, atau gunakan akun pribadi.
2. **Cara menyalin isi file dari GitHub dengan utuh:** buka file di repositori (misalnya `server/Code.gs`) →
   klik ikon **Copy raw file** (dua kotak bertumpuk) di kanan atas isi file. Seluruh isi tersalin tanpa nomor baris.
   Jangan memblok teks dengan tetikus, karena bagian bawah file yang panjang mudah tertinggal.

---

## B. Memasang server kuis

### B1. Buat Sheet dan buka editor

1. Buka https://sheets.new → beri nama, misalnya **Skor Nilai Optimum**.
   Gunakan Sheet baru khusus materi ini, bukan Sheet materi lain.
2. Menu **Ekstensi → Apps Script**. Editor terbuka di tab baru.
3. Klik judul **Proyek tanpa judul** di kiri atas → ganti, misalnya **Server Kuis Nilai Optimum** → **Ganti nama**.

### B2. Atur zona waktu dan runtime

Kolom `waktu` di sheet memakai zona waktu proyek, jadi atur ke WITA.

1. Klik ikon **roda gigi (Setelan project)** di menu kiri.
2. Centang **Tampilkan file manifes "appsscript.json" di editor**.
3. Kembali ke **Editor** (ikon `< >`), buka `appsscript.json`, pastikan isinya seperti ini:
   ```json
   {
     "timeZone": "Asia/Makassar",
     "dependencies": {},
     "exceptionLogging": "STACKDRIVER",
     "runtimeVersion": "V8"
   }
   ```
   Yang penting: `"timeZone": "Asia/Makassar"` dan `"runtimeVersion": "V8"`. Simpan (Ctrl+S).

### B3. Tempel dua file kode

1. **Code.gs**: klik `Code.gs` → Ctrl+A → Delete → tempel seluruh isi **`server/Code.gs`**.
2. **core.gs**: klik **+** di samping tulisan **File** → **Skrip** → ketik `core` → Enter
   (editor menambahkan `.gs` sendiri). Hapus isi bawaannya, lalu tempel seluruh isi **`js/core.js`**.
3. Tekan **Ctrl+S**. Harus ada tiga file: `appsscript.json`, `Code.gs`, `core.gs`.

> Urutan `Code.gs` dan `core.gs` di daftar file tidak berpengaruh.
> `core.gs` jangan disunting di editor; bila soal diubah, ubah `js/core.js` lalu tempel ulang seluruhnya.

### B4. Jalankan `siapkan` dan beri izin

1. Buka `Code.gs`. Di bar atas, pada daftar fungsi, pilih **siapkan** → klik **▶ Jalankan**.
2. Muncul **Otorisasi diperlukan** → **Tinjau izin** → pilih akun Anda.
3. Muncul **"Google belum memverifikasi aplikasi ini"**. Ini wajar untuk skrip buatan sendiri.
   Klik **Lanjutan** → **Buka Server Kuis Nilai Optimum (tidak aman)** → **Izinkan**.
4. Log eksekusi menampilkan: *Siap. Isi sheet "Siswa" …*
5. Kembali ke tab Sheet. Sekarang ada sheet **Siswa, Sesi, Skor, Jejak** dengan judul kolom.

### B5. Isi daftar siswa

Di sheet **Siswa**, mulai baris 2:

| kelas | absen | nama | pin |
|---|---|---|---|
| X Al Fattah | 1 | Ahmad Fauzi | 0412 |
| X Al Fattah | 2 | Nur Aisyah | 7730 |

- Kolom **kelas** dan **pin** sudah diformat teks oleh `siapkan`, jadi PIN berawalan 0 tetap utuh.
- Spasi dan huruf besar/kecil pada kelas diabaikan: "X Al Fattah" sama dengan "XALFATTAH".
- Bila sheet Siswa dibiarkan kosong, server berjalan dalam **mode terbuka**: siapa pun bisa masuk
  dengan kelas + absen + nama tanpa PIN. Cocok untuk uji coba, tidak untuk penilaian.

### B6. Periksa kecocokan CORE

1. Pilih fungsi **ujiCek** → **▶ Jalankan**.
2. Log menampilkan `cek() server : 2026-11-01.3:db139415` (angka bisa berbeda bila `core.js` sudah diubah).
3. Catat kode itu. Halaman siswa nanti harus menghasilkan kode yang sama.

Bila muncul `ReferenceError: CORE is not defined`, berarti `core.gs` belum ada, kosong, atau belum disimpan.

### B7. Terbitkan sebagai aplikasi web

1. Klik **Terapkan (Deploy)** di kanan atas → **Penerapan baru**.
2. Klik ikon **roda gigi** di samping "Pilih jenis" → **Aplikasi web**.
3. Isi:
   - Deskripsi: misalnya `Kuis nilai optimum v1`
   - **Jalankan sebagai: Saya** (email Anda)
   - **Yang memiliki akses: Siapa saja**
4. Klik **Terapkan**. Bila diminta izin lagi, ulangi langkah B4 no. 2–3.
5. Salin **URL aplikasi web**, yang berakhiran **`/exec`**.
   Jangan memakai URL berakhiran `/dev`, karena hanya bisa dibuka oleh Anda sendiri.

### B8. Uji URL di peramban

Tempel URL `/exec` di tab baru. Harus tampil kira-kira:

```json
{"ok":true,"layanan":"optimum","versi":"2026-11-01.3","cek":"2026-11-01.3:db139415"}
```

Nilai `cek` harus sama dengan hasil `ujiCek` di B6. Pembukaan pertama bisa memakan beberapa detik
karena server menghitung kode cek, lalu menyimpannya selama 6 jam.

### B9. Hubungkan ke halaman

1. Di GitHub, buka `js/config.js` → ikon **pensil** → tempel URL ke `ENDPOINT`:
   ```js
   window.OPTIMUM_CONFIG={ENDPOINT:"https://script.google.com/macros/s/AKfy…/exec",SARAN_ENDPOINT:"",MATERI:"optimum"};
   ```
2. **Commit changes**. Naikkan juga penanda `?v=` di `index.html` dan `kuis.html` (lihat README).
3. Tunggu 1–2 menit, lalu buka `kuis.html` di alamat GitHub Pages.
   Harus tampil **"✔ Halaman dan server cocok (versi …)"**.

### B10. Uji coba sebelum dipakai siswa

1. Tambahkan satu baris siswa uji di sheet Siswa, misalnya kelas `UJI`, absen `99`, nama `Guru`, PIN `0000`.
2. Masuk ke kuis dengan data itu, jawab beberapa langkah, tutup tab, buka lagi → harus bisa melanjutkan.
3. Selesaikan dan kirim. Periksa: sheet **Skor** terisi satu baris, **Sesi** dan **Jejak** juga.
4. Hapus baris uji dari **Siswa, Sesi, Skor, Jejak** (klik kanan nomor baris → Hapus baris).
   Ini penting karena `MAKS_PERCOBAAN:1` mencatat percobaan per siswa.

---

## C. Memasang server kritik & saran

Server ini terpisah agar data saran tidak bercampur dengan data nilai.

1. Buka https://sheets.new → beri nama, misalnya **Kritik dan Saran SPtLDV**.
2. **Ekstensi → Apps Script** → ganti nama proyek, misalnya **Server Saran SPtLDV**.
3. Atur `appsscript.json` seperti B2 (zona waktu `Asia/Makassar`, runtime `V8`).
4. Klik `Code.gs` → Ctrl+A → Delete → tempel seluruh isi **`server/Saran.gs`** → Ctrl+S.
   Proyek ini **tidak** memerlukan `core.gs`.
5. Pilih fungsi **siapkan** → **▶ Jalankan** → beri izin seperti B4.
   Sheet **Saran** muncul dengan kolom `waktu | nama | kritik_saran`.
6. **Terapkan → Penerapan baru → Aplikasi web**: Jalankan sebagai **Saya**, akses **Siapa saja** → **Terapkan**.
   Salin URL `/exec`.
7. Uji URL di peramban → harus tampil `{"ok":true,"layanan":"saran"}`.
8. Tempel URL ke `SARAN_ENDPOINT` di `js/config.js` (bukan ke `ENDPOINT`) → Commit.
9. Buka `index.html` → **💬 Kritik & Saran** → kirim satu saran uji → periksa sheet Saran → hapus baris uji.

Pengaman yang sudah ada: batas 30 kiriman per menit dari semua pengguna, jeda 30 detik per perangkat,
jebakan robot tersembunyi, dan teks berawalan `=`, `+`, `-`, `@` tidak dibaca sebagai rumus oleh Sheet.

---

## D. Memindahkan server kuis lama ke susunan dua file

Lakukan ini **satu kali** bila server kuis sudah terpasang dengan `Code.gs` lama (yang masih memuat blok
"CORE BERSAMA"). Kerjakan di luar jam kuis.

1. Buka proyek Apps Script kuis yang sudah ada.
2. Buat file **core.gs** (B3 no. 2) dan tempel isi `js/core.js`.
3. Ganti seluruh isi **Code.gs** dengan `server/Code.gs` yang baru.
   Pastikan tidak ada lagi baris `var CORE=(function(){` di `Code.gs`.
4. Bila sebelumnya Anda mengubah nilai di `KONFIG` (misalnya `BATAS_MENIT`), ubah lagi di `Code.gs` yang baru.
5. Ctrl+S → jalankan **ujiCek** → kode cek harus **sama** dengan sebelumnya, karena isi CORE tidak berubah.
6. **Terapkan → Kelola penerapan** → ikon **pensil** → Versi: **Versi baru** → **Terapkan**.
   URL `/exec` tetap sama, jadi `js/config.js` tidak perlu diubah.

Data di sheet Siswa, Sesi, Skor, dan Jejak tidak tersentuh.

---

## E. Memperbarui kode setelah terpasang

| Yang berubah | Yang dilakukan di Apps Script |
|---|---|
| `server/Code.gs` (misalnya KONFIG) | Tempel ulang ke `Code.gs` → Simpan → terbitkan **Versi baru** |
| `js/core.js` (soal/penilaian) | Tempel ulang **seluruhnya** ke `core.gs` → Simpan → `ujiCek` → terbitkan **Versi baru** → unggah `core.js` ke GitHub dan naikkan `?v=` |
| `server/Saran.gs` | Tempel ulang ke `Code.gs` proyek saran → Simpan → terbitkan **Versi baru** |
| File lain di `js/`, `css/`, HTML | Tidak perlu menyentuh Apps Script |

Cara menerbitkan **Versi baru** (URL tetap):
**Terapkan → Kelola penerapan** → pilih penerapan aktif → ikon **pensil** → kolom Versi: **Versi baru** → **Terapkan**.

> Jangan memakai **Penerapan baru** untuk pembaruan. Itu menghasilkan URL baru,
> sehingga `js/config.js` harus diubah dan siswa yang sedang mengerjakan terputus.

Bila `core.js` diubah, siswa yang sedang mengerjakan dengan versi lama tidak dapat melanjutkan.
Perbarui hanya ketika tidak ada kuis yang berlangsung.

---

## F. Pengaturan KONFIG kuis

Bagian atas `Code.gs`:

| Kunci | Bawaan | Arti |
|---|---|---|
| `ID_SPREADSHEET` | `''` | Kosongkan bila skrip dibuat dari dalam Sheet (cara di panduan ini) |
| `BATAS_MENIT` | `60` | Batas waktu sejak siswa pertama kali masuk |
| `TOLERANSI_MENIT` | `3` | Kelonggaran pengiriman setelah batas waktu |
| `MAKS_PERCOBAAN` | `1` | Berapa kali satu siswa boleh mengerjakan |
| `IZIN_LANJUT` | `true` | Siswa yang keluar boleh masuk lagi (soal sama), ditandai di Skor |
| `SIMPAN_PROGRES` | `true` | Jawaban sementara disimpan agar siswa tidak mengulang dari awal |
| `MIN_DETIK_PER_LANGKAH` | `3` | Di bawah ini ditandai "terlalu-cepat" (tidak ditolak) |
| `MAKS_SALAH_PIN` | `5` | Salah PIN berturut-turut sebelum dikunci sementara |
| `KUNCI_MENIT` | `10` | Lama penguncian setelah salah PIN |
| `MAKS_PERISTIWA` | `200` | Batas panjang jejak jawaban |

Setelah mengubah KONFIG di editor Apps Script, salin juga perubahannya ke `server/Code.gs` di GitHub
agar salinan di repositori tetap sama dengan yang terpasang.

---

## G. Sebelum dan sesudah kuis

**Sebelum kuis**
- Buka `kuis.html` → pastikan "✔ Halaman dan server cocok".
- Pastikan sheet Siswa lengkap dan baris uji sudah dihapus.
- Bagikan tautan `…/kuis.html` beserta PIN masing-masing siswa.

**Setelah kuis**
- Nilai ada di sheet **Skor** (kolom `nilai` 0–100, rincian per tipe dan level, `perlu_diperkuat`, `catatan`).
- Untuk mengolah tanpa mengubah data asli: **File → Buat salinan** atau unduh **File → Download → .xlsx**.
- Bila ingin menutup kuis: **Terapkan → Kelola penerapan → Arsipkan**, atau kosongkan `ENDPOINT`.
  Kuis berikutnya untuk kelas lain dapat memakai server yang sama.

---

## H. Memecahkan masalah

| Gejala | Penyebab yang mungkin | Perbaikan |
|---|---|---|
| `ReferenceError: CORE is not defined` | `core.gs` belum dibuat, kosong, atau belum disimpan | Ulangi B3 no. 2, lalu Ctrl+S |
| Kode cek server ≠ `__api.CORE.cek()` | `core.gs` tidak sama dengan `js/core.js`, atau versi baru belum diterbitkan | Tempel ulang `core.js` utuh → Versi baru. Di halaman, naikkan `?v=` lalu muat ulang dengan Ctrl+Shift+R |
| Halaman: "Tidak dapat terhubung" | URL `/dev`, akses bukan "Siapa saja", atau URL salah salin | Pakai URL `/exec`; periksa Kelola penerapan → akses |
| Membuka URL `/exec` meminta login Google | Akses penerapan bukan "Siapa saja" | Kelola penerapan → pensil → akses **Siapa saja** → Versi baru |
| Pilihan "Siapa saja" tidak ada | Akun Workspace dibatasi admin | Minta admin membuka, atau pakai akun pribadi |
| Perubahan kode tidak berpengaruh | Lupa menerbitkan **Versi baru** | Lihat bagian E |
| Siswa melihat "Kamu sudah mengerjakan kuis ini." | `MAKS_PERCOBAAN:1`; percobaan dihitung dari baris siswa itu di sheet **Sesi** | Bila memang perlu mengulang, hapus baris siswa itu di **Sesi**. Siswa akan mendapat soal baru; baris lamanya di Skor tetap ada |
| Siswa melihat "Waktu kuismu sebelumnya sudah habis. Minta gurumu membuka kembali." | Siswa keluar dan batas waktu terlewati sebelum mengirim | Sama seperti di atas: hapus baris siswa itu di **Sesi** agar ia bisa mulai lagi |
| Siswa melihat "Halaman kuis tidak sama versinya dengan server." | Kode cek berbeda (lihat baris kedua tabel ini) | Samakan `core.gs` dengan `js/core.js`, terbitkan Versi baru, minta siswa memuat ulang |
| PIN berawalan 0 ditolak | Kolom pin bukan format teks | Jalankan `siapkan` lagi (aman), lalu ketik ulang PIN |
| Banyak siswa gagal kirim bersamaan | Apps Script membatasi jumlah eksekusi serentak per akun | Skor yang gagal tersimpan di peramban siswa dan dikirim ulang; minta siswa menekan kirim lagi beberapa detik kemudian |
| Kolom `waktu` selisih beberapa jam | Zona waktu proyek belum WITA | Ulangi B2 |

Untuk melihat galat dari sisi server: di editor Apps Script, buka menu kiri **Eksekusi**.
Setiap permintaan siswa tercatat di sana beserta pesan galatnya.
