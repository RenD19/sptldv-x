/* ==========================================================================
   tka.js · HALAMAN LATIHAN SOAL TKA (tka.html)
   Dua mode:
     latihan  = setiap soal langsung diperiksa, ada pembahasan dan tugas kecil
     simulasi = berwaktu 3 menit per soal, boleh pindah soal dan menandai ragu,
                hasil dan pembahasan muncul di akhir (seperti TKA)
   Bentuk soal: pg (pilih satu), mcma (pilih semua yang benar), kat (Benar/Salah).
   Setiap jawaban disertai tingkat keyakinan (Yakin / Ragu / Menebak) untuk
   melihat "yakin tetapi salah" di layar hasil.
   Tidak ada server: progres disimpan di peramban (localStorage) bila tersedia.
   ========================================================================== */
(function(){
'use strict';
var B=window.TKA_SOAL,KEY='tka-pl-sesi-v1';
var $=function(s,r){return (r||document).querySelector(s);};
var esc=function(s){return String(s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});};
var byId={};B.SOAL.forEach(function(q){byId[q.id]=q;});
var root=$('#tka'),S=null,tik=null;
var YAKIN={y:'Yakin',r:'Ragu',m:'Menebak'};
var PETUNJUK={pg:'Pilih satu jawaban.',mcma:'Pilih semua jawaban yang benar. Jawaban benar lebih dari satu.',kat:'Tentukan Benar atau Salah untuk setiap pernyataan.'};

/* ---------- simpan / muat ---------- */
function simpan(){try{localStorage.setItem(KEY,JSON.stringify(S));}catch(_){}}
function muat(){try{var x=JSON.parse(localStorage.getItem(KEY)||'null');return x&&x.ids&&x.ids.every(function(id){return byId[id];})?x:null;}catch(_){return null;}}
function hapus(){try{localStorage.removeItem(KEY);}catch(_){}}

/* ---------- penilaian ---------- */
function kosong(q){return q.bentuk==='pg'?null:q.bentuk==='mcma'?[]:q.pernyataan.map(function(){return null;});}
function jaw(q){var v=S.jaw[q.id];return v===undefined?kosong(q):v;}
function lengkap(q,v){
  if(q.bentuk==='pg')return v!==null&&v!==undefined;
  if(q.bentuk==='mcma')return v.length>0;
  return v.every(function(x){return x!==null;});
}
function nilai(q,v){
  var salah;
  if(q.bentuk==='pg'){var b=v===q.kunci;return {penuh:b,poin:b?2:0};}
  if(q.bentuk==='mcma'){
    salah=q.opsi.filter(function(_,i){return (v.indexOf(i)>=0)!==(q.kunci.indexOf(i)>=0);}).length;
  }else{
    salah=q.kunci.filter(function(k,i){return v[i]!==k;}).length;
  }
  return {penuh:salah===0,poin:salah===0?2:salah===1?1:0};
}
function teksKunci(q){
  if(q.bentuk==='pg')return String.fromCharCode(65+q.kunci)+'. '+q.opsi[q.kunci];
  if(q.bentuk==='mcma')return q.kunci.map(function(i){return q.opsi[i];}).join('; ');
  return q.kunci.map(function(k,i){return '('+(i+1)+') '+q.kolom[k];}).join(', ');
}
function teksJawab(q,v){
  if(!lengkap(q,v))return 'belum dijawab lengkap';
  if(q.bentuk==='pg')return String.fromCharCode(65+v)+'. '+q.opsi[v];
  if(q.bentuk==='mcma')return v.slice().sort().map(function(i){return q.opsi[i];}).join('; ');
  return v.map(function(k,i){return '('+(i+1)+') '+q.kolom[k];}).join(', ');
}

/* ---------- gambar daerah penyelesaian (grup C) ---------- */
function gambarDP(g){
  var W=300,pad=28,M=g.maks,u=(W-2*pad)/M,X=function(x){return pad+x*u;},Y=function(y){return W-pad-y*u;};
  var s='<svg class="tka-dp" viewBox="0 0 '+W+' '+W+'" role="img" aria-label="Bidang koordinat dengan daerah penyelesaian diarsir">';
  s+='<defs><pattern id="arsir" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="8" height="8" fill="#d6efe0"/><line x1="0" y1="0" x2="0" y2="8" stroke="#3f9e68" stroke-width="1.4"/></pattern></defs>';
  for(var i=0;i<=M;i++){s+='<line class="kisi" x1="'+X(i)+'" y1="'+Y(0)+'" x2="'+X(i)+'" y2="'+Y(M)+'"/><line class="kisi" x1="'+X(0)+'" y1="'+Y(i)+'" x2="'+X(M)+'" y2="'+Y(i)+'"/>';}
  s+='<polygon points="'+g.dp.map(function(p){return X(p[0])+','+Y(p[1]);}).join(' ')+'" fill="url(#arsir)" stroke="none"/>';
  s+='<line class="sumbu" x1="'+X(0)+'" y1="'+Y(0)+'" x2="'+(X(M)+12)+'" y2="'+Y(0)+'"/><line class="sumbu" x1="'+X(0)+'" y1="'+Y(0)+'" x2="'+X(0)+'" y2="'+(Y(M)-12)+'"/>';
  s+='<text class="lbs" x="'+(X(M)+14)+'" y="'+(Y(0)+4)+'">x</text><text class="lbs" x="'+(X(0)-4)+'" y="'+(Y(M)-15)+'">y</text>';
  for(i=1;i<=M;i++){s+='<text class="angka" x="'+X(i)+'" y="'+(Y(0)+15)+'" text-anchor="middle">'+i+'</text><text class="angka" x="'+(X(0)-7)+'" y="'+(Y(i)+4)+'" text-anchor="end">'+i+'</text>';}
  s+='<text class="angka" x="'+(X(0)-7)+'" y="'+(Y(0)+15)+'" text-anchor="end">0</text>';
  g.garis.forEach(function(L){
    var a=L[0],b=L[1],dx=b[0]-a[0],dy=b[1]-a[1],t0=-0.12,t1=1.12;
    s+='<line class="batas" x1="'+X(a[0]+dx*t0)+'" y1="'+Y(a[1]+dy*t0)+'" x2="'+X(a[0]+dx*t1)+'" y2="'+Y(a[1]+dy*t1)+'"/>';
    s+='<text class="lbg" x="'+(X(a[0]+dx*0.18)+8)+'" y="'+(Y(a[1]+dy*0.18)-4)+'">'+L[2]+'</text>';
  });
  return s+'</svg>';
}

/* ---------- layar awal ---------- */
var pilih={mode:'latihan',paket:'singkat'};
function layarMulai(){
  berhentiWaktu();
  var lama=muat(),h='<section class="card tka-awal"><h2>Latihan soal bergaya TKA</h2>';
  h+='<p class="muted">Soal program linear dalam tiga bentuk soal TKA.</p>';
  h+='<ul class="tka-bentuk"><li><b>Pilihan ganda</b>, pilih satu jawaban.</li><li><b>Pilih semua yang benar</b>, jawaban benar bisa lebih dari satu.</li><li><b>Benar atau Salah</b>, tentukan untuk setiap pernyataan.</li></ul>';
  if(lama&&!lama.selesai){
    var n=lama.ids.filter(function(id){return lama.jaw[id]!==undefined;}).length;
    h+='<div class="rule">Ada sesi yang belum selesai, yaitu '+(lama.mode==='simulasi'?'simulasi':'latihan')+' '+B.PAKET[lama.paket].nama.toLowerCase()+' dengan '+n+' dari '+lama.ids.length+' soal terjawab.'
      +'<div class="row"><button class="btn primary" data-aksi="lanjut" type="button">Lanjutkan sesi</button><button class="btn ghost" data-aksi="buang" type="button">Hapus sesi itu</button></div></div>';
  }
  h+='<div class="lvl"><b>Mode</b><div class="chips">'
    +[['latihan','Latihan per soal'],['simulasi','Simulasi TKA (berwaktu)']].map(function(o){return '<button class="chip'+(pilih.mode===o[0]?' on':'')+'" type="button" data-aksi="mode" data-v="'+o[0]+'" aria-pressed="'+(pilih.mode===o[0])+'">'+o[1]+'</button>';}).join('')+'</div></div>';
  h+='<div class="lvl"><b>Paket</b><div class="chips">'
    +['singkat','lengkap'].map(function(k){var n=B.PAKET[k].ids.length;return '<button class="chip'+(pilih.paket===k?' on':'')+'" type="button" data-aksi="paket" data-v="'+k+'" aria-pressed="'+(pilih.paket===k)+'">'+B.PAKET[k].nama+', '+n+' soal</button>';}).join('')+'</div></div>';
  var nS=B.PAKET[pilih.paket].ids.length;
  h+='<div class="note">'+(pilih.mode==='latihan'
    ?'<p>Setiap soal langsung diperiksa setelah kamu memilih tingkat keyakinan. Pembahasan dan tugas kecil yang perlu dilatih muncul setelah setiap soal.</p>'
    :'<p>Waktumu '+(nS*B.DETIK_PER_SOAL/60)+' menit untuk '+nS+' soal, yaitu 3 menit per soal seperti TKA. Kamu boleh pindah soal dan menandai soal yang masih ragu. Hasil dan pembahasan muncul di akhir.</p>')
    +'<p>Sebelum memeriksa jawaban, pilih seberapa yakin kamu. Di akhir kamu akan melihat soal yang kamu jawab "Yakin" tetapi ternyata salah. Soal itulah yang paling perlu dibahas.</p></div>';
  h+='<div class="row"><button class="btn primary" data-aksi="mulai" type="button">Mulai '+(pilih.mode==='latihan'?'latihan':'simulasi')+'</button></div></section>';
  root.innerHTML=h;
  document.body.dataset.tahap='awal';
}
function mulaiBaru(){
  var ids=B.PAKET[pilih.paket].ids.slice(),now=Date.now();
  S={mode:pilih.mode,paket:pilih.paket,ids:ids,i:0,jaw:{},yakin:{},ragu:{},cek:{},mulai:now,
     batas:pilih.mode==='simulasi'?now+ids.length*B.DETIK_PER_SOAL*1000:0,selesai:false};
  simpan();layarKerja();
}

/* ---------- layar mengerjakan ---------- */
function q(){return byId[S.ids[S.i]];}
function layarKerja(){
  var Q=q(),v=jaw(Q),G=Q.grup?B.GRUP[Q.grup]:null,dicek=S.mode==='latihan'&&S.cek[Q.id],h='';
  document.body.dataset.tahap='kerja';
  /* bar atas: nomor, level, waktu, navigasi nomor */
  h+='<section class="card tka-bar"><div class="tka-info"><b>Soal '+(S.i+1)+' dari '+S.ids.length+'</b><span class="tag">'+esc(Q.level)+'</span>'
    +(S.mode==='simulasi'?'<span class="tka-waktu" role="timer" aria-live="off"></span>':'<span class="muted">Mode latihan</span>')+'</div>';
  h+='<nav class="tka-nomor" aria-label="Nomor soal">'+S.ids.map(function(id,i){
    var c=['nomor'];if(i===S.i)c.push('kini');
    if(S.jaw[id]!==undefined&&lengkap(byId[id],S.jaw[id]))c.push('isi');
    if(S.ragu[id])c.push('ragu');
    if(S.mode==='latihan'&&S.cek[id])c.push(nilai(byId[id],S.jaw[id]).penuh?'benar':'salah');
    return '<button type="button" class="'+c.join(' ')+'" data-aksi="ke" data-v="'+i+'" aria-label="Soal '+(i+1)+(S.ragu[id]?', ditandai ragu':'')+'"'+(i===S.i?' aria-current="step"':'')+'>'+(i+1)+'</button>';
  }).join('')+'</nav></section>';
  h+='<div class="tka-isi'+(G?' bergrup':'')+'">';
  if(G){
    var nomorGrup=S.ids.map(function(id,i){return byId[id].grup===Q.grup?i+1:0;}).filter(Boolean);
    /* layar sempit: cerita dilipat mulai soal kedua dalam grup agar soal langsung terlihat */
    var buka=(window.matchMedia&&window.matchMedia('(min-width:960px)').matches)||S.i+1===nomorGrup[0];
    h+='<details class="card tka-stimulus"'+(buka?' open':'')+'><summary><h3>'+esc(G.judul)+'</h3><span class="muted">Untuk soal '+nomorGrup[0]+(nomorGrup.length>1?' sampai '+nomorGrup[nomorGrup.length-1]:'')+'</span></summary>'+G.isi+(G.gambar?gambarDP(G.gambar):'')+'</details>';
  }
  h+='<section class="card tka-soal"><p class="tka-tanya">'+Q.tanya+'</p>'+(Q.bentuk==='kat'?'':'<p class="tka-petunjuk">'+PETUNJUK[Q.bentuk]+'</p>');
  h+=opsiHtml(Q,v,dicek);
  /* keyakinan */
  h+='<fieldset class="tka-yakin"'+(dicek?' disabled':'')+'><legend>Seberapa yakin jawabanmu?</legend><div class="chips">'
    +['y','r','m'].map(function(k){var on=S.yakin[Q.id]===k;return '<button type="button" class="chip'+(on?' on':'')+'" data-aksi="yakin" data-v="'+k+'" aria-pressed="'+on+'">'+YAKIN[k]+'</button>';}).join('')+'</div></fieldset>';
  h+='<div class="tka-umpan" role="status"></div>';
  h+='<div class="row tka-aksi"></div></section></div>';
  root.innerHTML=h;
  aksiSoal();
  if(dicek)tampilUmpan(Q);
  if(S.mode==='simulasi')mulaiWaktu();
}
function opsiHtml(Q,v,kunci){
  var h='',nama='q-'+Q.id;
  if(Q.bentuk==='kat'){
    h+='<table class="tka-kat"><thead><tr><th scope="col">Pernyataan</th>'+Q.kolom.map(function(k){return '<th scope="col">'+k+'</th>';}).join('')+'</tr></thead><tbody>';
    Q.pernyataan.forEach(function(p,i){
      var cls=kunci?(v[i]===Q.kunci[i]?' class="ok"':' class="bad"'):'';
      h+='<tr'+cls+'><td>'+p+'</td>'+Q.kolom.map(function(k,j){
        return '<td class="pilih"><label><input type="radio" name="'+nama+'-'+i+'" value="'+j+'" data-baris="'+i+'"'+(v[i]===j?' checked':'')+(kunci?' disabled':'')+'><span class="sr">'+k+' untuk pernyataan '+(i+1)+'</span></label></td>';
      }).join('')+'</tr>';
    });
    return h+'</tbody></table>';
  }
  var multi=Q.bentuk==='mcma';
  h+='<div class="tka-opsi" role="group">';
  Q.opsi.forEach(function(o,i){
    var dipilih=multi?v.indexOf(i)>=0:v===i,cls='sol';
    if(dipilih)cls+=' on';
    if(kunci){var k=multi?Q.kunci.indexOf(i)>=0:Q.kunci===i;if(k)cls+=' kunci';if(dipilih&&!k)cls+=' keliru';}
    h+='<label class="'+cls+'"><input type="'+(multi?'checkbox':'radio')+'" name="'+nama+'" value="'+i+'"'+(dipilih?' checked':'')+(kunci?' disabled':'')+'>'
      +(multi?'':'<b class="huruf">'+String.fromCharCode(65+i)+'</b>')+'<span>'+o+'</span></label>';
  });
  return h+'</div>';
}
function aksiSoal(){
  var Q=q(),v=jaw(Q),box=$('.tka-aksi'),akhir=S.i===S.ids.length-1,h='';
  if(S.mode==='latihan'){
    if(!S.cek[Q.id]){
      var siap=lengkap(Q,v),yk=!!S.yakin[Q.id];
      h+='<button class="btn primary" type="button" data-aksi="periksa"'+(siap&&yk?'':' disabled')+'>Periksa jawaban</button>';
      if(!siap)h+='<span class="muted tka-tunggu">'+(Q.bentuk==='kat'?'Jawab semua pernyataan dulu.':'Pilih jawabanmu dulu.')+'</span>';
      else if(!yk)h+='<span class="muted tka-tunggu">Pilih tingkat keyakinan dulu.</span>';
    }else h+='<button class="btn primary" type="button" data-aksi="'+(akhir?'selesai':'berikut')+'">'+(akhir?'Lihat hasil':'Soal berikutnya')+'</button>';
  }else{
    h+='<button class="btn" type="button" data-aksi="sebelum"'+(S.i===0?' disabled':'')+'>◀ Sebelumnya</button>';
    h+='<button class="btn ghost'+(S.ragu[Q.id]?' on':'')+'" type="button" data-aksi="ragu" aria-pressed="'+!!S.ragu[Q.id]+'">'+(S.ragu[Q.id]?'Hapus tanda ragu':'Tandai ragu')+'</button>';
    h+=akhir?'<button class="btn primary" type="button" data-aksi="selesai">Selesai, lihat hasil</button>':'<button class="btn primary" type="button" data-aksi="berikut">Berikutnya ▶</button>';
  }
  box.innerHTML=h;
}
function tampilUmpan(Q){
  var v=jaw(Q),n=nilai(Q,v),el=$('.tka-umpan');
  el.innerHTML='<div class="fb '+(n.penuh?'ok':'bad')+'">'+(n.penuh?'✔ Benar.':n.poin?'Hampir benar, satu bagian masih keliru.':'✘ Belum benar.')
    +(n.penuh?'':' Jawaban yang benar adalah '+esc(teksKunci(Q))+'.')+'</div>'
    +'<div class="penyelesaian"><b>Pembahasan</b><p>'+Q.bahas+'</p>'+tugasHtml(Q,!n.penuh)+'</div>';
}
function tugasHtml(Q,latih){
  return '<p class="tka-tugas">'+(latih?'Latih lagi tugas kecil ':'Tugas kecil ')+Q.tugas.map(function(t){var T=B.TUGAS[t];return '<span class="tag" title="'+esc(T.tempat)+'">'+t+' '+esc(T.nama)+'</span>';}).join(' ')+'</p>';
}

/* ---------- waktu (simulasi) ---------- */
function sisaDetik(){return Math.max(0,Math.round((S.batas-Date.now())/1000));}
function teksWaktu(d){var m=Math.floor(d/60),s=d%60;return 'Sisa waktu '+m+' menit '+(s<10?'0':'')+s+' detik';}
function mulaiWaktu(){
  berhentiWaktu();
  var upd=function(){
    var d=sisaDetik(),el=$('.tka-waktu');
    if(el){el.textContent=teksWaktu(d);el.classList.toggle('mepet',d<=120);}
    if(d<=0){berhentiWaktu();selesai(true);}
  };
  upd();tik=setInterval(upd,1000);
}
function berhentiWaktu(){if(tik){clearInterval(tik);tik=null;}}

/* ---------- selesai dan hasil ---------- */
function selesai(waktuHabis){
  S.selesai=true;S.waktuHabis=!!waktuHabis;S.akhir=Date.now();simpan();berhentiWaktu();layarHasil();
}
function layarHasil(){
  document.body.dataset.tahap='hasil';
  var N=S.ids.length,penuh=0,poin=0,lv={},yakinSalah=[],tugas={};
  S.ids.forEach(function(id,i){
    var Q=byId[id],v=jaw(Q),n=lengkap(Q,v)?nilai(Q,v):{penuh:false,poin:0};
    if(n.penuh)penuh++;poin+=n.poin;
    lv[Q.level]=lv[Q.level]||[0,0];lv[Q.level][1]++;if(n.penuh)lv[Q.level][0]++;
    if(!n.penuh){if(S.yakin[id]==='y')yakinSalah.push(i+1);Q.tugas.forEach(function(t){tugas[t]=(tugas[t]||0)+1;});}
  });
  var h='<section class="card tka-hasil"><h2>Hasil '+(S.mode==='simulasi'?'simulasi':'latihan')+' · '+esc(B.PAKET[S.paket].nama.toLowerCase())+'</h2>';
  if(S.waktuHabis)h+='<div class="fb info">Waktu habis. Jawaban yang sudah kamu isi tetap dinilai.</div>';
  h+='<div class="tka-skor"><div><span class="score">'+penuh+'<small> dari '+N+'</small></span><p>soal benar penuh<br><span class="muted">cara TKA, satu soal dihitung benar hanya bila seluruh jawabannya tepat</span></p></div>'
    +'<div><span class="score">'+poin+'<small> dari '+(2*N)+'</small></span><p>poin latihan<br><span class="muted">2 poin bila tepat, 1 poin bila hanya satu bagian keliru</span></p></div></div>';
  h+='<h3>Per level kognitif</h3><table class="tbl rinci"><tr><th>Level</th><th>Benar penuh</th></tr>'
    +['Pemahaman','Aplikasi','Penalaran'].filter(function(k){return lv[k];}).map(function(k){return '<tr><td>'+k+'</td><td>'+lv[k][0]+' dari '+lv[k][1]+'</td></tr>';}).join('')+'</table>';
  h+='<h3>Yakin tetapi salah</h3>'+(yakinSalah.length
    ?'<p>Soal nomor <b>'+yakinSalah.join(', ')+'</b>. Kamu yakin, tetapi jawabannya belum tepat. Baca pembahasannya lebih dulu, karena di sinilah salah konsep biasanya tersembunyi.</p>'
    :'<p class="muted">Tidak ada. Keyakinanmu sesuai dengan hasilnya.</p>');
  var tk=Object.keys(tugas).sort(function(a,b){return tugas[b]-tugas[a];});
  h+='<h3>Tugas kecil yang perlu dilatih</h3>'+(tk.length
    ?'<ul class="tka-latih">'+tk.map(function(t){var T=B.TUGAS[t];return '<li><b>'+t+' '+esc(T.nama)+'</b> <span class="muted">(muncul di '+tugas[t]+' soal yang belum tepat)</span><br><a href="'+T.latih+'">Latih di '+esc(T.tempat)+'</a></li>';}).join('')+'</ul>'
    :'<p class="muted">Semua soal benar penuh. Coba paket lain atau mode simulasi.</p>');
  h+='<h3>Pembahasan semua soal</h3>'+S.ids.map(function(id,i){
    var Q=byId[id],v=jaw(Q),n=lengkap(Q,v)?nilai(Q,v):{penuh:false,poin:0};
    return '<details class="tka-bahas"><summary><span class="'+(n.penuh?'okc':'badc')+'">'+(n.penuh?'✔':'✘')+'</span> Soal '+(i+1)+' · '+esc(Q.level)+(S.yakin[id]?' · '+YAKIN[S.yakin[id]]:'')+'</summary>'
      +(Q.grup?'<p class="muted">Cerita '+esc(B.GRUP[Q.grup].judul)+'</p>':'')+'<p>'+Q.tanya+'</p>'
      +'<p><b>Jawabanmu</b> '+esc(teksJawab(Q,v))+'<br><b>Kunci</b> '+esc(teksKunci(Q))+'</p><p>'+Q.bahas+'</p>'+tugasHtml(Q,!n.penuh)+'</details>';
  }).join('');
  h+='<div class="row"><button class="btn primary" type="button" data-aksi="ulang">Ulangi paket ini</button><button class="btn ghost" type="button" data-aksi="awal">Kembali ke awal</button></div></section>';
  root.innerHTML=h;
  window.scrollTo(0,0);
}

/* ---------- peristiwa ---------- */
root.addEventListener('click',function(e){
  var b=e.target.closest('[data-aksi]');if(!b||b.disabled)return;
  var a=b.dataset.aksi,Q=S?q():null;
  if(a==='mode'){pilih.mode=b.dataset.v;layarMulai();}
  else if(a==='paket'){pilih.paket=b.dataset.v;layarMulai();}
  else if(a==='mulai'){hapus();mulaiBaru();}
  else if(a==='lanjut'){S=muat();if(S.mode==='simulasi'&&sisaDetik()<=0)selesai(true);else layarKerja();}
  else if(a==='buang'){hapus();layarMulai();}
  else if(a==='yakin'){S.yakin[Q.id]=b.dataset.v;simpan();
    document.querySelectorAll('.tka-yakin .chip').forEach(function(c){var on=c===b;c.classList.toggle('on',on);c.setAttribute('aria-pressed',on);});aksiSoal();}
  else if(a==='periksa'){S.cek[Q.id]=true;simpan();layarKerja();var u=$('.tka-umpan');if(u&&u.scrollIntoView)u.scrollIntoView({block:'nearest'});}
  else if(a==='berikut'){S.i=Math.min(S.ids.length-1,S.i+1);simpan();layarKerja();window.scrollTo(0,0);}
  else if(a==='sebelum'){S.i=Math.max(0,S.i-1);simpan();layarKerja();window.scrollTo(0,0);}
  else if(a==='ke'){S.i=+b.dataset.v;simpan();layarKerja();}
  else if(a==='ragu'){S.ragu[Q.id]=!S.ragu[Q.id];simpan();layarKerja();}
  else if(a==='selesai'){
    if(S.mode==='simulasi'){
      var belum=S.ids.filter(function(id){return !lengkap(byId[id],jaw(byId[id]));}).length,ragu=S.ids.filter(function(id){return S.ragu[id];}).length;
      var pesan=(belum?belum+' soal belum dijawab lengkap. ':'')+(ragu?ragu+' soal masih ditandai ragu. ':'');
      if(pesan&&!window.confirm(pesan+'Selesaikan simulasi sekarang?'))return;
    }
    selesai(false);
  }
  else if(a==='ulang'){pilih.mode=S.mode;pilih.paket=S.paket;hapus();mulaiBaru();}
  else if(a==='awal'){hapus();S=null;layarMulai();}
});
root.addEventListener('change',function(e){
  var t=e.target;if(!S||!t.name||t.name.indexOf('q-')!==0)return;
  var Q=q(),v=jaw(Q);
  if(Q.bentuk==='pg')v=+t.value;
  else if(Q.bentuk==='mcma'){v=v.slice();var i=+t.value,p=v.indexOf(i);if(t.checked&&p<0)v.push(i);if(!t.checked&&p>=0)v.splice(p,1);}
  else{v=v.slice();v[+t.dataset.baris]=+t.value;}
  S.jaw[Q.id]=v;simpan();
  if(Q.bentuk!=='kat')document.querySelectorAll('.tka-opsi .sol').forEach(function(l){l.classList.toggle('on',l.querySelector('input').checked);});
  aksiSoal();
  /* nomor soal diperbarui (terisi) */
  var nb=document.querySelector('.tka-nomor [data-v="'+S.i+'"]');if(nb)nb.classList.toggle('isi',lengkap(Q,v));
});
window.addEventListener('beforeunload',function(e){
  if(S&&!S.selesai&&S.mode==='simulasi'){e.preventDefault();e.returnValue='';}
});

/* mulai */
var lama=muat();
if(lama&&lama.selesai){S=lama;layarHasil();}else layarMulai();
})();
