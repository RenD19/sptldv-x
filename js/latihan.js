/* ==========================================================================
   latihan.js · TAB LATIHAN MANDIRI
   Wadah: <section id="tab-latihan">. Soal dibangkitkan acak oleh CORE,
   dinilai langsung di halaman, tidak dikirim ke server.
   Opsi khusus tab ini: petunjuk bertahap, "Di mana salahku?", percobaan tanpa batas,
   tombol "Lihat jawaban" setelah dua kali salah.
   ========================================================================== */
(function(PL){
'use strict';
var U=PL.U,$=U.$,esc=U.esc;
var sec,L,pick={t:'C',l:'C'},tahap='intro';

/* ---------- Petunjuk ----------
   Semua urusan teks petunjuk khusus Latihan ada di js/petunjuk.js (PL.Petunjuk):
   - namaRumus : menulis nama rumus/metode secara eksplisit pada petunjuk CORE
   - lanjut    : petunjuk lanjutan setelah petunjuk CORE
   Petunjuk ke-3 dan seterusnya baru terbuka setelah siswa mencoba menjawab minimal
   sekali pada langkah itu (GERBANG_PETUNJUK). */
var GERBANG_PETUNJUK=2;
function petunjukLanjut(Q,s,St){return PL.Petunjuk?PL.Petunjuk.lanjut(Q,s,St):[];}
function namaRumus(h){return PL.Petunjuk?PL.Petunjuk.namaRumus(h):h;}

/* Tipe dan level yang dipakai di Latihan.
   Tipe 1 (Menggambar DP) dan Tipe 2 LOTS tidak dipakai. */
var TIPE_LATIHAN=[2,3,4];
var LEVEL_TIPE={2:'MH',3:'LMH',4:'LMH'};
function acakDari(a){return a[Math.floor(Math.random()*a.length)];}
/* Latihan tanpa bantuan (seperti TKA): menyembunyikan 💡 Petunjuk dan 📍 Di mana salahku? */
function tanpaBantuan(){try{return localStorage.getItem('latihanTanpaBantuan')==='1';}catch(_){return false;}}
function setTanpaBantuan(v){try{localStorage.setItem('latihanTanpaBantuan',v?'1':'0');}catch(_){}document.body.classList.toggle('tanpa-bantuan',!!v);}
document.body.classList.toggle('tanpa-bantuan',tanpaBantuan());
function soalBaru(){
  var calon=(pick.t==='C'?TIPE_LATIHAN:[pick.t]).filter(function(t){return pick.l==='C'||LEVEL_TIPE[t].indexOf(pick.l)>=0;});
  if(!calon.length){pick.l='C';calon=pick.t==='C'?TIPE_LATIHAN:[pick.t];}
  var t=acakDari(calon),l=pick.l==='C'?acakDari(LEVEL_TIPE[t].split('')):pick.l;
  L.muat(CORE.gen(t,l,Math.random,true),0);L.S.selesai=false;tahap='intro';render();
}
function render(){
  L.S.tahap=tahap==='kerja'?'kerja':'lain';
  sec.dataset.tahap=tahap;
  L.renderKartu();
  if(tahap==='intro'){L.renderProgres(true);panelIntro();L.renderBidang('awal');}
  else if(tahap==='selesai'){L.S.selesai=true;L.renderProgres();panelSelesai();L.renderBidang('akhir');}
  else{L.renderProgres();L.panelLangkah();L.renderBidang();}
  if(PL.kuis)PL.kuis.pendNotice(L.el.panel);
}
function panelIntro(){
  var Q=L.S.Q,h='<h2>Pilih soal</h2><p class="muted">Pilih tipe dan level. Tekan 🎲 Soal baru untuk mengganti soal.</p>';
  h+='<div class="lvl"><b>Tipe soal</b><div class="chips">'+[['2','2 · Sistem dari DP'],['3','3 · Kasus kontekstual'],['4','4 · Nilai maks/min'],['C','Campuran']].map(function(o){return '<button class="chip'+(String(pick.t)===o[0]?' on':'')+'" data-aksi="tipe" data-v="'+o[0]+'">'+o[1]+'</button>';}).join('')+'</div></div>';
  h+='<div class="lvl"><b>Level</b><div class="chips">'+[['L','Dasar'],['M','Terapan'],['H','Menantang'],['C','Campuran']].map(function(o){var mati=o[0]!=='C'&&pick.t!=='C'&&LEVEL_TIPE[pick.t].indexOf(o[0])<0;return '<button class="chip'+(pick.l===o[0]?' on':'')+'" data-aksi="level" data-v="'+o[0]+'"'+(mati?' disabled title="Level ini tidak tersedia untuk tipe yang dipilih"':'')+'>'+o[1]+'</button>';}).join('')+'</div></div>';
  h+='<div class="lvl"><b>Bantuan</b><div class="chips">'+[['1','Dengan bantuan'],['0','Tanpa bantuan (seperti TKA)']].map(function(o){var on=(o[0]==='0')===tanpaBantuan();return '<button class="chip'+(on?' on':'')+'" data-aksi="bantuan" data-v="'+o[0]+'" aria-pressed="'+on+'">'+o[1]+'</button>';}).join('')+'</div></div>';
  h+='<div class="row"><button class="btn" data-aksi="acak">🎲 Soal baru</button></div>';
  h+='<div class="note"><p>Soal di atas termasuk <b>'+esc(Q.jd)+' · '+esc(PL.lv(Q.lv))+'</b><span class="guru-saja"> ('+esc(Q.lv)+', kata kerja <i>'+esc(Q.kko)+'</i>)</span>.</p>'+(tanpaBantuan()?'<p>Mode <b>tanpa bantuan</b>. 💡 Petunjuk dan 📍 Di mana salahku? disembunyikan, seperti saat TKA. 🔑 Lihat jawaban tetap muncul setelah dua kali salah.</p>':'<p>Di Latihan kamu boleh mencoba berulang kali, membuka 💡 Petunjuk, dan memakai 📍 Di mana salahku?</p>')+'</div>';
  h+='<div class="row"><button class="btn primary" data-aksi="mulai">Mulai soal</button></div>';
  L.el.panel.innerHTML=h;
}
function panelSelesai(){
  L.el.panel.innerHTML='<h2>🎉 Soal selesai</h2><h3>Pembahasan</h3><ol class="sum">'+L.S.Q.bahas.map(function(b){return '<li>'+b+'</li>';}).join('')+'</ol>'
    +'<div class="row"><button class="btn primary" data-aksi="acak">Soal berikutnya</button><button class="btn" data-aksi="ulangi">↺ Ulangi soal</button><button class="btn ghost" data-aksi="ke-kuis">Buka Kuis</button></div>';
}
/* ---------- Penyelesaian bertahap ----------
   Setelah jawaban benar atau 🔑 Lihat jawaban, langkah yang memerlukan teknik aljabar
   (rumus dua titik, substitusi, eliminasi) ditampilkan lengkap. Isinya dari js/penyelesaian.js. */
function tampilPenyelesaian(){
  var pn=L.el.panel,lama=pn.querySelector('.penyelesaian');if(lama)lama.remove();
  if(!PL.Penyelesaian)return;
  var bl;try{bl=PL.Penyelesaian.langkah(L.S.Q,L.S.s);}catch(err){if(window.console)console.warn('penyelesaian',err);return;}
  if(!bl||!bl.length)return;
  var fb=pn.querySelector('.fb');if(!fb)return;
  fb.insertAdjacentHTML('afterend',PL.Penyelesaian.html(bl));
  var box=pn.querySelector('.penyelesaian');if(box&&PL.Math)PL.Math.render(box);
}
function periksa(a,r){
  var S=L.S;
  if(r.ok){
    S.solved=true;L.tandai(r);L.kunciSemua();
    var hh=L.el.panel.querySelector('.hints');if(hh)hh.hidden=true;
    L.fb('ok','Tepat! '+(S.s<S.Q.st.length-1?'Lanjut ke langkah berikutnya.':'Soal ini selesai.'));
    tampilPenyelesaian();
    PL.Plus.say(S.s<S.Q.st.length-1?'benar':'selesai');
    L.tombol('<button class="btn primary" data-aksi="lanjut">'+(S.s<S.Q.st.length-1?'Langkah berikutnya':'Lihat pembahasan')+'</button>');
    L.renderBidang();L.renderProgres();
  }else{
    S.tries++;L.tandai(r);S.lw={a:a,r:r};
    L.fb('bad','Belum tepat. '+(L.curS().k==='form'&&r.items.some(Boolean)?'Bagian yang hijau sudah benar. ':'')+'Baca petunjuk, lalu coba lagi.');
    if(S.hints<2)L.tambahPetunjuk(false);else L.renderHints(); /* membuka gerbang petunjuk rinci */
    L.tombolDiMana();
    if(S.tries>=2&&!L.el.panel.querySelector('[data-aksi="kunci"]'))L.tambahTombol('<button class="btn ghost" data-aksi="kunci">🔑 Lihat jawaban</button>');
    PL.Plus.say('salah');
  }
}
function lihatKunci(){
  var S=L.S;L.isiKunci();S.solved=true;L.panelLangkah();L.kunciSemua();
  L.bukaSemuaPetunjuk(); /* semua petunjuk dibuka agar siswa bisa belajar dari kesalahan */
  L.fb('info','🔑 Jawaban yang benar adalah <b>'+L.teksKunci()+'</b>. Pelajari, lalu lanjutkan.');
  tampilPenyelesaian();
  L.tombol('<button class="btn primary" data-aksi="lanjut">'+(S.s<S.Q.st.length-1?'Langkah berikutnya':'Lihat pembahasan')+'</button>');L.renderBidang();
}
function lanjut(){var S=L.S;if(S.s<S.Q.st.length-1){S.s++;L.reset();render();}else{tahap='selesai';render();PL.Plus.say('selesai');}}
function aksi(a,b){
  if(a==='tipe'){pick.t=b.dataset.v==='C'?'C':+b.dataset.v;if(pick.t!=='C'&&pick.l!=='C'&&LEVEL_TIPE[pick.t].indexOf(pick.l)<0)pick.l='C';soalBaru();}
  else if(a==='level'){pick.l=b.dataset.v;soalBaru();}
    else if(a==='bantuan'){setTanpaBantuan(b.dataset.v==='0');render();}
  else if(a==='acak')soalBaru();
  else if(a==='mulai'){tahap='kerja';L.S.s=0;L.reset();render();PL.Plus.say('sapa');}
  else if(a==='lanjut')lanjut();
  else if(a==='kunci')lihatKunci();
  else if(a==='ulangi'){tahap='kerja';L.S.selesai=false;L.S.s=0;L.reset();render();}
  else if(a==='ke-kuis')PL.pindahTab('kuis');
}
PL.TAB=PL.TAB||{};
PL.TAB.latihan={
  init:function(){
    sec=$('#tab-latihan');
    L=PL.Langkah(sec,{petunjuk:true,diManaSalah:true,pratinjau:true,ubahPetunjuk:namaRumus,petunjukLanjut:petunjukLanjut,gerbangPetunjuk:GERBANG_PETUNJUK,periksa:periksa,aksi:aksi,
      meta:function(){var Q=L.S.Q;return esc(Q.jd+' · '+PL.lv(Q.lv)+(Q.ls?' · khusus Latihan':''));}});
    this.bidang=L.bidang;this.panduan=L.panduan;this.L=L;
    /* tombol di kartu soal (di luar panel) */
    sec.querySelector('.kartu').addEventListener('click',function(e){
      var b=e.target.closest('[data-aksi]');if(!b)return;
      if(b.dataset.aksi==='ulangi'&&tahap!=='intro')aksi('ulangi');
      else if(b.dataset.aksi==='acak')soalBaru();
    });
    soalBaru();
  },
  tampil:function(){render();},
  sembunyi:function(){return true;}
};
})(window.PL);
