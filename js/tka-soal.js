/* ==========================================================================
   tka-soal.js · BANK SOAL LATIHAN TKA (Program Linear, Kelas X)
   Dipakai oleh tka.html (js/tka.js). Tidak terhubung ke server: kunci ada di sini.

   Bentuk soal mengikuti Kerangka Asesmen TKA SMA:
     pg   = pilihan ganda (satu jawaban)                    kunci: indeks opsi
     mcma = pilihan ganda kompleks, pilih semua yang benar   kunci: daftar indeks opsi
     kat  = pilihan ganda kompleks kategori (Benar/Salah)    kunci: indeks kolom per pernyataan
   level : 'Pemahaman' | 'Aplikasi' | 'Penalaran'  (level kognitif TKA)
   tugas : kode tugas kecil T1–T11 (lihat TUGAS di bawah)
   Aturan teks siswa: tidak memakai tanda titik dua di dekat angka.
   ========================================================================== */
window.TKA_SOAL=(function(){
'use strict';

var TUGAS={
  T1:{nama:'Membaca cerita dan menandai besaran',latih:'index.html#latihan',tempat:'Nilai Optimum · Latihan Tipe 3'},
  T2:{nama:'Menetapkan variabel',latih:'index.html#latihan',tempat:'Nilai Optimum · Latihan Tipe 3'},
  T3:{nama:'Mengubah kata kunci menjadi tanda',latih:'index.html#latihan',tempat:'Nilai Optimum · Latihan Tipe 3'},
  T4:{nama:'Menyusun dan menyederhanakan sistem',latih:'index.html#latihan',tempat:'Nilai Optimum · Latihan Tipe 3'},
  T5:{nama:'Mencari titik potong dengan tabel x | y',latih:'sistem-ptldv.html',tempat:'Materi 1 · Daerah Penyelesaian'},
  T6:{nama:'Menggambar DP dan menguji titik',latih:'sistem-ptldv.html',tempat:'Materi 1 · Daerah Penyelesaian'},
  T7:{nama:'Menentukan titik pojok (eliminasi)',latih:'balik-ptldv.html',tempat:'Materi 2 · Menyusun dari DP'},
  T8:{nama:'Menyusun fungsi tujuan',latih:'index.html#latihan',tempat:'Nilai Optimum · Latihan Tipe 4'},
  T9:{nama:'Menguji titik pojok atau garis selidik',latih:'index.html#latihan',tempat:'Nilai Optimum · Latihan Tipe 4'},
  T10:{nama:'Menjawab sesuai bentuk soal TKA',latih:'tka.html',tempat:'Latihan TKA'},
  T11:{nama:'Memeriksa kewajaran jawaban',latih:'index.html#latihan',tempat:'Nilai Optimum · Latihan Tipe 3–4'}
};

var GRUP={
  A:{judul:'Usaha kue Bu Hasnah',
     isi:'<p>Bu Hasnah membuat dua jenis kue di rumahnya di Watampone, yaitu <b>barongko</b> dan <b>bolu peca</b>. Biaya membuat satu kotak barongko Rp30.000,00 dan satu kotak bolu peca Rp20.000,00. Modal harian Bu Hasnah Rp1.200.000,00. Karena keterbatasan tenaga, Bu Hasnah dapat membuat paling banyak 50 kotak kue setiap hari. Laba satu kotak barongko Rp8.000,00 dan laba satu kotak bolu peca Rp6.000,00.</p>'
        +'<p>Misalkan x adalah banyak kotak barongko dan y adalah banyak kotak bolu peca yang dibuat dalam sehari.</p>'},
  B:{judul:'Kapal feri di Pelabuhan Bajoe',
     isi:'<p>Sebuah kapal feri di Pelabuhan Bajoe memuat mobil dan truk. Luas dek untuk kendaraan 600&nbsp;m². Satu mobil memerlukan 10&nbsp;m² dan satu truk memerlukan 30&nbsp;m². Kapal dapat memuat paling banyak 30 kendaraan. Tarif penyeberangan satu mobil Rp500.000,00 dan satu truk Rp1.500.000,00.</p>'
        +'<p>Misalkan x adalah banyak mobil dan y adalah banyak truk dalam satu kali penyeberangan.</p>'},
  C:{judul:'Gambar daerah penyelesaian',
     isi:'<p>Daerah yang diarsir pada gambar berikut dibatasi oleh garis yang melalui (0, 6) dan (6, 0), garis yang melalui (0, 2) dan (4, 0), sumbu X, dan sumbu Y.</p>',
     gambar:{maks:7,garis:[[[0,6],[6,0],'(1)'],[[0,2],[4,0],'(2)']],dp:[[4,0],[6,0],[0,6],[0,2]]}}
};

var SOAL=[
/* ---------------- Grup A · Bu Hasnah ---------------- */
{id:'A1',grup:'A',level:'Pemahaman',bentuk:'pg',tugas:['T2','T3','T4'],
 tanya:'Sistem pertidaksamaan yang sesuai dengan keadaan usaha Bu Hasnah adalah ….',
 opsi:['3x + 2y ≥ 120; x + y ≤ 50; x ≥ 0; y ≥ 0','3x + 2y ≤ 120; x + y ≤ 50; x ≥ 0; y ≥ 0','2x + 3y ≤ 120; x + y ≤ 50; x ≥ 0; y ≥ 0','3x + 2y ≤ 120; x + y ≥ 50; x ≥ 0; y ≥ 0','3x + 2y ≤ 120; x + y ≤ 50'],
 kunci:1,
 bahas:'Modal 30.000x + 20.000y ≤ 1.200.000. Bagi kedua ruas dengan 10.000 sehingga 3x + 2y ≤ 120. "Paling banyak 50 kotak" berarti x + y ≤ 50. Banyak kotak tidak mungkin negatif, jadi x ≥ 0 dan y ≥ 0. Pilihan terakhir kehilangan syarat itu.'},
{id:'A2',grup:'A',level:'Pemahaman',bentuk:'kat',tugas:['T6'],
 tanya:'Tentukan <b>Benar</b> atau <b>Salah</b> untuk setiap rencana produksi berikut, apakah dapat dilaksanakan Bu Hasnah.',
 kolom:['Benar','Salah'],
 pernyataan:['10 kotak barongko dan 30 kotak bolu peca','30 kotak barongko dan 20 kotak bolu peca','20 kotak barongko dan 30 kotak bolu peca','0 kotak barongko dan 55 kotak bolu peca'],
 kunci:[0,1,0,1],
 bahas:'Substitusikan ke 3x + 2y ≤ 120 dan x + y ≤ 50. Rencana (10, 30) memberi 90 dan 40, keduanya memenuhi. Rencana (30, 20) memberi 130, lebih dari 120. Rencana (20, 30) memberi tepat 120 dan 50, tetap memenuhi karena tandanya ≤. Rencana (0, 55) melebihi 50 kotak.'},
{id:'A3',grup:'A',level:'Aplikasi',bentuk:'mcma',tugas:['T5','T7'],
 tanya:'Pilih <b>semua</b> titik yang merupakan titik pojok daerah penyelesaian sistem pada usaha Bu Hasnah.',
 opsi:['(0, 0)','(40, 0)','(0, 60)','(20, 30)','(0, 50)','(50, 0)'],
 kunci:[0,1,3,4],
 bahas:'Tabel x | y untuk 3x + 2y = 120 memberi (0, 60) dan (40, 0). Untuk x + y = 50 memberi (0, 50) dan (50, 0). Eliminasi kedua persamaan memberi x = 20 dan y = 30. Titik (0, 60) dan (50, 0) berada di luar daerah penyelesaian, jadi bukan titik pojok.'},
{id:'A4',grup:'A',level:'Aplikasi',bentuk:'pg',tugas:['T8','T9'],
 tanya:'Laba maksimum yang dapat diperoleh Bu Hasnah dalam sehari adalah ….',
 opsi:['Rp300.000,00','Rp320.000,00','Rp340.000,00','Rp380.000,00','Rp400.000,00'],
 kunci:2,
 bahas:'Fungsi tujuan f(x, y) = 8.000x + 6.000y. Nilai di titik pojok f(40, 0) = 320.000, f(0, 50) = 300.000, dan f(20, 30) = 160.000 + 180.000 = 340.000. Nilai terbesar 340.000 di (20, 30).'},
{id:'A5',grup:'A',level:'Penalaran',bentuk:'kat',tugas:['T9'],
 tanya:'Tentukan <b>Benar</b> atau <b>Salah</b> untuk setiap pernyataan berikut.',
 kolom:['Benar','Salah'],
 pernyataan:['Laba Bu Hasnah paling besar bila ia hanya membuat barongko, karena laba per kotak barongko lebih besar.','Pada rencana yang memberi laba maksimum, modal terpakai seluruhnya dan kapasitas 50 kotak terpenuhi.','Jika laba bolu peca naik menjadi Rp12.000,00 per kotak (laba barongko tetap), rencana terbaik berubah menjadi membuat 50 kotak bolu peca saja.'],
 kunci:[1,0,0],
 bahas:'Laba per kotak lebih besar tidak menjamin laba total terbesar, karena barongko juga lebih mahal sehingga modal cepat habis. Di (20, 30) kedua batas terpakai penuh (3·20 + 2·30 = 120 dan 20 + 30 = 50). Dengan laba bolu 12.000, f(0, 50) = 600.000 lebih besar daripada f(20, 30) = 520.000 dan f(40, 0) = 320.000.'},
{id:'A6',grup:'A',level:'Penalaran',bentuk:'pg',tugas:['T9'],
 tanya:'Daerah penyelesaian tetap seperti pada usaha Bu Hasnah. Fungsi tujuan diubah menjadi f(x, y) = ax + by dengan a dan b bilangan positif. Apakah nilai maksimum f dicapai di titik (20, 30)?<br>Putuskan apakah informasi berikut cukup untuk menjawab pertanyaan itu.<br>(1) a = 7.000 dan b = 6.000.<br>(2) a lebih besar daripada b.',
 opsi:['Pernyataan (1) SAJA cukup, tetapi pernyataan (2) SAJA tidak cukup.','Pernyataan (2) SAJA cukup, tetapi pernyataan (1) SAJA tidak cukup.','DUA pernyataan BERSAMA-SAMA cukup, tetapi SATU pernyataan SAJA tidak cukup.','Pernyataan (1) SAJA cukup dan pernyataan (2) SAJA juga cukup.','Pernyataan (1) dan pernyataan (2) tidak cukup.'],
 kunci:0,
 bahas:'Dengan (1), f(20, 30) = 320.000 lebih besar daripada f(40, 0) = 280.000 dan f(0, 50) = 300.000, jadi informasi (1) cukup. Informasi (2) tidak cukup, misalnya a = 10.000 dan b = 6.000 membuat maksimum pindah ke (40, 0). Titik (20, 30) menjadi titik maksimum bila b ≤ a ≤ 1,5b.'},
{id:'A7',grup:'A',level:'Penalaran',bentuk:'kat',tugas:['T7','T9'],
 tanya:'Andi mengerjakan soal laba maksimum Bu Hasnah. Ia hanya menguji titik pojok (0, 0), (40, 0), dan (0, 50), lalu menyimpulkan laba maksimum Rp320.000,00 dengan membuat 40 kotak barongko. Tentukan <b>Benar</b> atau <b>Salah</b> untuk setiap pernyataan tentang pekerjaan Andi.',
 kolom:['Benar','Salah'],
 pernyataan:['Andi melewatkan titik potong garis 3x + 2y = 120 dan x + y = 50.','Jawaban Andi pasti benar karena semua titik pada sumbu sudah diuji.','Jika garis selidik 8.000x + 6.000y = k digeser menjauhi titik (0, 0), titik terakhir pada DP yang disentuhnya adalah (20, 30).'],
 kunci:[0,1,0],
 bahas:'Titik pojok yang tidak terletak pada sumbu, yaitu (20, 30), sering terlewat. Di titik itu laba 340.000, lebih besar daripada jawaban Andi. Garis selidik sejajar dengan fungsi tujuan, dan titik terakhir yang disentuhnya adalah titik maksimum.'},

/* ---------------- Grup B · Kapal feri Bajoe ---------------- */
{id:'B1',grup:'B',level:'Aplikasi',bentuk:'pg',tugas:['T4','T7','T9'],
 tanya:'Pendapatan maksimum dari satu kali penyeberangan adalah ….',
 opsi:['Rp15.000.000,00','Rp22.500.000,00','Rp27.000.000,00','Rp30.000.000,00','Rp37.500.000,00'],
 kunci:3,
 bahas:'Luas dek 10x + 30y ≤ 600 disederhanakan menjadi x + 3y ≤ 60, lalu x + y ≤ 30, x ≥ 0, y ≥ 0. Titik pojok (0, 0), (30, 0), (15, 15), dan (0, 20). Pendapatan f = 500.000x + 1.500.000y memberi 15 juta di (30, 0), 30 juta di (15, 15), dan 30 juta di (0, 20).'},
{id:'B2',grup:'B',level:'Penalaran',bentuk:'mcma',tugas:['T9','T11'],
 tanya:'Pilih <b>semua</b> rencana muatan yang memberi pendapatan maksimum.',
 opsi:['0 mobil dan 20 truk','15 mobil dan 15 truk','6 mobil dan 18 truk','30 mobil dan 0 truk','10 mobil dan 10 truk'],
 kunci:[0,1,2],
 bahas:'Fungsi tujuan 500.000x + 1.500.000y = 500.000(x + 3y) sejajar dengan garis batas x + 3y = 60. Akibatnya semua titik pada ruas garis dari (0, 20) sampai (15, 15) memberi pendapatan yang sama, yaitu 30 juta. Rencana (6, 18) terletak pada ruas itu karena 6 + 54 = 60 dan 6 + 18 ≤ 30.'},
{id:'B3',grup:'B',level:'Penalaran',bentuk:'kat',tugas:['T8','T9'],
 tanya:'Tentukan <b>Benar</b> atau <b>Salah</b> untuk setiap pernyataan berikut.',
 kolom:['Benar','Salah'],
 pernyataan:['Jika tarif truk naik menjadi Rp1.800.000,00 (tarif mobil tetap), rencana terbaik adalah memuat 20 truk saja.','Jika tarif mobil naik menjadi Rp800.000,00 (tarif truk tetap), pendapatan maksimum menjadi Rp34.500.000,00.','Dengan tarif semula, kapal selalu memuat 30 kendaraan pada rencana terbaik.'],
 kunci:[0,0,1],
 bahas:'Tarif truk 1,8 juta memberi 36 juta di (0, 20) dan 34,5 juta di (15, 15), jadi 20 truk saja yang terbaik. Tarif mobil 0,8 juta memberi 34,5 juta di (15, 15), 30 juta di (0, 20), dan 24 juta di (30, 0). Dengan tarif semula, rencana (0, 20) juga terbaik padahal hanya memuat 20 kendaraan.'},

/* ---------------- Grup C · gambar DP ---------------- */
{id:'C1',grup:'C',level:'Pemahaman',bentuk:'pg',tugas:['T5','T6'],
 tanya:'Daerah yang diarsir pada gambar merupakan daerah penyelesaian sistem pertidaksamaan ….',
 opsi:['x + y ≤ 6; x + 2y ≤ 4; x ≥ 0; y ≥ 0','x + y ≥ 6; x + 2y ≤ 4; x ≥ 0; y ≥ 0','x + y ≤ 6; x + 2y ≥ 4; x ≥ 0; y ≥ 0','x + y ≤ 6; 2x + y ≥ 4; x ≥ 0; y ≥ 0','x + y ≥ 6; x + 2y ≥ 4; x ≥ 0; y ≥ 0'],
 kunci:2,
 bahas:'Garis (1) melalui (0, 6) dan (6, 0) sehingga persamaannya x + y = 6. Garis (2) melalui (0, 2) dan (4, 0) sehingga persamaannya x + 2y = 4. Uji titik (2, 2) yang berada di daerah arsiran memberi 4 ≤ 6 dan 6 ≥ 4. Jadi tandanya x + y ≤ 6 dan x + 2y ≥ 4.'},
{id:'C2',grup:'C',level:'Aplikasi',bentuk:'kat',tugas:['T7','T8','T9'],
 tanya:'Diketahui fungsi tujuan f(x, y) = 3x + 2y pada daerah yang diarsir. Tentukan <b>Benar</b> atau <b>Salah</b> untuk setiap pernyataan berikut.',
 kolom:['Benar','Salah'],
 pernyataan:['Nilai maksimum f adalah 18.','Nilai minimum f dicapai di titik (4, 0).','Nilai f di titik (0, 6) sama dengan nilai f di titik (4, 0).'],
 kunci:[0,1,0],
 bahas:'Titik pojok (4, 0), (6, 0), (0, 6), dan (0, 2). Nilai f berturut-turut 12, 18, 12, dan 4. Maksimum 18 di (6, 0) dan minimum 4 di (0, 2), bukan di (4, 0).'},

/* ---------------- Soal tunggal ---------------- */
{id:'S1',grup:null,level:'Penalaran',bentuk:'mcma',tugas:['T6'],
 tanya:'Diketahui sistem x + y ≤ 6; x ≥ 1; y ≥ k. Pilih <b>semua</b> nilai k yang membuat sistem tersebut memiliki daerah penyelesaian.',
 opsi:['k = −1','k = 2','k = 5','k = 6'],
 kunci:[0,1,2],
 bahas:'Titik dengan x dan y terkecil yang mungkin adalah (1, k). Titik itu harus memenuhi x + y ≤ 6, jadi 1 + k ≤ 6 atau k ≤ 5. Untuk k = 5, daerah penyelesaiannya hanya satu titik, yaitu (1, 5), dan itu tetap dihitung sebagai daerah penyelesaian.'},
{id:'S2',grup:null,level:'Aplikasi',bentuk:'pg',tugas:['T1','T2','T4'],
 tanya:'Di kantin sekolah, harga 2 barongko, 1 onde-onde, dan 1 es teh Rp13.000,00. Harga 1 barongko, 2 onde-onde, dan 1 es teh Rp11.000,00. Harga 1 barongko, 1 onde-onde, dan 2 es teh Rp10.000,00. Harga 1 barongko, 1 onde-onde, dan 1 es teh adalah ….',
 opsi:['Rp7.500,00','Rp8.000,00','Rp8.500,00','Rp9.000,00','Rp11.000,00'],
 kunci:2,
 bahas:'Misalkan harga barongko a, onde-onde b, dan es teh c (dalam ribuan). Jumlahkan ketiga persamaan sehingga 4a + 4b + 4c = 34, jadi a + b + c = 8,5. Harganya Rp8.500,00. Sistem persamaan linear tiga variabel termasuk cakupan TKA.'},
{id:'S3',grup:null,level:'Pemahaman',bentuk:'kat',tugas:['T3'],
 tanya:'Tentukan <b>Benar</b> atau <b>Salah</b> untuk setiap penulisan berikut.',
 kolom:['Benar','Salah'],
 pernyataan:['"Paling sedikit 20 kotak" ditulis x ≥ 20.','"Tidak lebih dari 50 orang" ditulis x &lt; 50.','"Kurang dari 8 jam" ditulis x ≤ 8.'],
 kunci:[0,1,1],
 bahas:'"Paling sedikit" berarti boleh sama dengan atau lebih, jadi ≥. "Tidak lebih dari" berarti boleh sama dengan atau kurang, jadi ≤, bukan &lt;. "Kurang dari" tidak termasuk nilainya sendiri, jadi &lt;, bukan ≤.'}
];

var PAKET={
  singkat:{nama:'Paket singkat',ids:['A1','A2','A3','A4','A5','A6','A7','S1']},
  lengkap:{nama:'Paket lengkap',ids:SOAL.map(function(s){return s.id;})}
};
var DETIK_PER_SOAL=180;   /* rencana TKA 2026: 25 soal dalam 75 menit */

return {TUGAS:TUGAS,GRUP:GRUP,SOAL:SOAL,PAKET:PAKET,DETIK_PER_SOAL:DETIK_PER_SOAL};
})();
