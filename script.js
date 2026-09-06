
/* ===== BAS LAB MUSIC PLAYER ===== */
(() => {
  const music = document.createElement('audio');
  music.id = 'basBackgroundMusic';
  music.preload = 'auto';
  music.loop = false;
  music.volume = Number(localStorage.getItem('basMusicVolume') ?? 35) / 100;
  document.body.appendChild(music);

  const tracks = Array.from({length: 10}, (_, i) => `./sound/song${i+1}.mp3`);
  let current = Number(localStorage.getItem('basMusicTrack') ?? 0);
  let started = false;
  let pausedByUser = false;

  const btn = document.getElementById('basMusicSettingsBtn');
  const panel = document.getElementById('basMusicSettings');
  const select = document.getElementById('basMusicTrack');
  const volume = document.getElementById('basMusicVolume');
  const volText = document.getElementById('basMusicVolText');
  const toggle = document.getElementById('basMusicToggle');

  const available = tracks.map((src, i) => ({src, i}));
  select.innerHTML = available.map(x => `<option value="${x.i}">เพลง ${x.i+1}</option>`).join('');
  select.value = String(Math.max(0, Math.min(9, current)));

  function updateUI() {
    const v = Math.round(music.volume * 100);
    volume.value = v;
    volText.textContent = v + '%';
    toggle.textContent = music.paused ? '▶️ เล่นเพลง' : '⏸️ หยุดเพลง';
  }

  function loadTrack(index, autoplay = false) {
    current = (index + tracks.length) % tracks.length;
    localStorage.setItem('basMusicTrack', current);
    music.src = tracks[current];
    select.value = String(current);
    if (autoplay) {
      music.play().then(() => {
        started = true; pausedByUser = false; updateUI();
      }).catch(() => {});
    }
  }

  function playFromUserGesture() {
    if (pausedByUser) return;
    if (!started || music.paused) {
      music.play().then(() => { started = true; updateUI(); }).catch(() => {});
    }
  }

  music.addEventListener('ended', () => {
    loadTrack(current + 1, true);
  });

  btn.addEventListener('click', () => panel.classList.toggle('show'));

  volume.addEventListener('input', () => {
    music.volume = Number(volume.value) / 100;
    localStorage.setItem('basMusicVolume', volume.value);
    updateUI();
  });

  select.addEventListener('change', () => {
    loadTrack(Number(select.value), true);
  });

  toggle.addEventListener('click', () => {
    if (music.paused) {
      pausedByUser = false;
      music.play().then(() => { started = true; updateUI(); }).catch(() => {});
    } else {
      pausedByUser = true;
      music.pause();
      updateUI();
    }
  });

  // Browsers normally block audible autoplay. Start on the first user interaction.
  ['pointerdown', 'keydown', 'touchstart'].forEach(evt => {
    document.addEventListener(evt, playFromUserGesture, {once: false, passive: true});
  });

  loadTrack(current, false);
  updateUI();
})();

(() => {
'use strict';
let lieStep=0,reward=0,aiStep=0,aiScore=0,dontClicks=0,targetScore=0,targetTime=15,targetTimer=null,hackTimer=null,targetMoveTimer=null,clickRounds=0,ghostKeyHandler=null,ghostRAF=null,ghostState=null;
const $=s=>document.querySelector(s), gameContent=()=>$('#gameContent'), box=h=>`<div class="gamebox">${h}</div>`;
const MUSIC_FILES = Array.from({length:10},(_,i)=>`./music/song${i+1}.mp3`);
let bgMusic=null,bgIndex=0,bgStarted=false;
function initBackgroundMusic(){
  bgMusic=new Audio(); bgMusic.volume=0.35; bgMusic.preload='auto';
  const next=()=>{
    if(!bgMusic)return;
    let tries=0;
    const loadNext=()=>{
      if(tries++>=MUSIC_FILES.length){bgMusic.removeAttribute('src');return;}
      bgMusic.src=MUSIC_FILES[bgIndex%MUSIC_FILES.length]; bgIndex++;
      bgMusic.load();
      bgMusic.play().then(()=>{bgStarted=true}).catch(()=>{});
    };
    loadNext();
  };
  bgMusic.addEventListener('ended',next);
  bgMusic.addEventListener('error',next);
  next();
  const unlock=()=>{
    if(!bgMusic||bgStarted)return;
    bgMusic.play().then(()=>{bgStarted=true}).catch(()=>{});
  };
  ['pointerdown','keydown','touchstart'].forEach(ev=>document.addEventListener(ev,unlock,{once:true,passive:true}));
}

const npcBehaviors=[
'เปิดเว็บแล้วลืมว่ามาทำอะไร','กดปุ่มซ้ำเพราะคิดว่าเว็บค้าง','เห็นคำว่า “ห้ามกด” แล้วอยากกด','เลื่อนหน้าจอทั้งที่ไม่มีอะไรให้ดู','เปิดตู้เย็นแล้วปิดโดยไม่ได้หยิบอะไร','ตอบว่า “เดี๋ยวทำ” แล้วหายไป','ค้นหาของที่ถืออยู่ในมือ','ตั้งปลุกแล้วกดเลื่อน 7 รอบ','เข้า YouTube เพื่อดูคลิปเดียว','อ่านแชตแล้วตอบในใจแทนการพิมพ์','กดรีเฟรชเพื่อหวังให้ชีวิตดีขึ้น','เปิดหลายแท็บจนจำไม่ได้ว่าแท็บไหนสำคัญ','พิมพ์รหัสผ่านผิดแล้วโทษคีย์บอร์ด','เห็นโหลด 99% แล้วจ้องมัน','กดปุ่มย้อนกลับทั้งที่ยังอยู่หน้าเดิม','ชาร์จมือถือทั้งที่แบต 94%','ตั้งใจนอนเร็วแต่เปิดมือถือก่อน','พูดว่า “5 นาที” แล้วผ่านไปหนึ่งชั่วโมง','กดข้ามโฆษณาเร็วเกินไปจนกดไม่ได้','ค้นหาวิธีทำสิ่งที่กำลังทำอยู่','เปิดเพลงแล้วลืมว่ากำลังหาเพลงอะไร','อ่านแจ้งเตือนแล้วลืมเนื้อหา','กดไลก์โพสต์เก่าโดยไม่ตั้งใจ','ถ่ายรูปอาหารก่อนกิน','ดูนาฬิกาซ้ำหลังจากดูไปเมื่อกี้','เปิดแอปแล้วปิดทันที','พิมพ์ “555” ทั้งที่ไม่ได้ขำ','กดปุ่มเสียงเพื่อเช็กว่าเปิดเสียงอยู่ไหม','เลื่อนฟีดจนเจอโพสต์เดิม','เดินเข้าห้องแล้วลืมว่ามาทำอะไร','เปิดแอร์แล้วห่มผ้า','บอกว่าไม่หิวแล้วแอบหาของกิน','เช็กมือถือทั้งที่ไม่มีแจ้งเตือน','กด “ยอมรับ” โดยไม่อ่าน','กดสุ่มเพราะไม่รู้จะเลือกอะไร','เห็นคำว่า UPDATE แล้วกดทันที','จำรหัสได้แต่จำไม่ได้ว่าบัญชีไหน','เปิดกล้องหน้าเพื่อเช็กหน้าตัวเอง','ส่งข้อความแล้วอ่านซ้ำ 3 รอบ','พิมพ์ผิดแล้วส่งก่อนแก้','กดปิดแจ้งเตือนแล้วเปิดใหม่','บอกว่า “ครั้งสุดท้าย” หลายครั้ง','ดูแบตทุก 2 นาที','เข้าเกมเพื่อเล่น 10 นาทีแล้วหายไปทั้งคืน','ค้นหาคำตอบทั้งที่รู้คำตอบอยู่แล้ว','กดปุ่มสุ่มเพราะอยากรู้ผล','อ่านหน้านี้มาถึงตรงนี้','ใช้เมาส์ลากไปรอบ ๆ โดยไม่มีเหตุผล','ทำทุกอย่างก่อนถึงจะยอมทำงานจริง','คลิกปุ่มเพราะมันอยู่ตรงหน้า'
];
const lieConclusions=['เครื่องสรุปว่า: คุณเคยโกหก แต่โกหกได้เนียนพอตัว','เครื่องสรุปว่า: ความจริงอยู่ตรงหน้า แต่คุณกด “ไม่”','เครื่องสรุปว่า: มีพิรุธระดับ “แป๊บเดียวจริง ๆ”','เครื่องสรุปว่า: คุณน่าจะพูดความจริง...มั้ง','เครื่องสรุปว่า: ระบบไม่เชื่อแม้แต่เครื่องเอง','เครื่องสรุปว่า: คุณมีความลับเกี่ยวกับตู้เย็น','เครื่องสรุปว่า: พบอาการ “เดี๋ยวค่อยทำ” รุนแรง','เครื่องสรุปว่า: คำตอบฟังดูดี แต่เครื่องไม่ซื้อ','เครื่องสรุปว่า: ความน่าเชื่อถือกำลังโหลด 99%','เครื่องสรุปว่า: ตรวจพบการโกหกแบบสุภาพ','เครื่องสรุปว่า: คุณตอบเร็วเกินไป น่าสงสัย','เครื่องสรุปว่า: คุณรู้ว่าคำถามนี้หมายถึงอะไร','เครื่องสรุปว่า: หลักฐานยังไม่พอ แต่ความรู้สึกบอกใช่','เครื่องสรุปว่า: พิรุธระดับแมวเห็นปลาทู','เครื่องสรุปว่า: ระบบขอเวลาตั้งสติก่อนเชื่อ','เครื่องสรุปว่า: คำตอบนี้มีความเป็นมนุษย์สูง','เครื่องสรุปว่า: มีแนวโน้มพูดว่า “ไม่ได้โกหก” บ่อย','เครื่องสรุปว่า: คุณเกือบผ่าน แต่เครื่องจำได้','เครื่องสรุปว่า: ตรวจพบรอยยิ้มที่มองไม่เห็น','เครื่องสรุปว่า: มีพิรุธแบบไม่ตั้งใจ','เครื่องสรุปว่า: ความจริงน่าจะอยู่ในแชตเก่า','เครื่องสรุปว่า: เครื่องจับโกหกก็โดนปั่น','เครื่องสรุปว่า: คุณตอบเหมือนคนมีประสบการณ์','เครื่องสรุปว่า: คำตอบนี้ดูสะอาดเกินไป','เครื่องสรุปว่า: มีความจริงปนอยู่ประมาณหนึ่ง','เครื่องสรุปว่า: คุณควรตอบใหม่ แต่ก็สายไปแล้ว','เครื่องสรุปว่า: พบความมั่นใจเกินเหตุ','เครื่องสรุปว่า: ความน่าสงสัยพุ่งเพราะคำว่า “แป๊บ”','เครื่องสรุปว่า: คุณไม่ได้โกหกทุกเรื่อง แค่บางเรื่อง','เครื่องสรุปว่า: ระบบกำลังแกล้งคุณกลับ','เครื่องสรุปว่า: มีพิรุธแบบมือสมัครเล่น','เครื่องสรุปว่า: คำตอบผ่าน แต่สายตาในจินตนาการไม่ผ่าน','เครื่องสรุปว่า: ความจริงซ่อนอยู่หลังปุ่มนี้','เครื่องสรุปว่า: คุณตอบแบบคนที่รู้ว่ากำลังถูกตรวจ','เครื่องสรุปว่า: พบความน่าสงสัยระดับขนมหมดถุง','เครื่องสรุปว่า: คุณอาจพูดจริง แต่จังหวะไม่ดี','เครื่องสรุปว่า: ระบบสุ่มแล้วก็เลยต้องเชื่อ','เครื่องสรุปว่า: พบข้อมูลลับจากดาวอังคาร','เครื่องสรุปว่า: คำตอบนี้มีความ “เออ ๆ” สูง','เครื่องสรุปว่า: คุณผ่านการตรวจแบบเฉียดฉิว','เครื่องสรุปว่า: มีพิรุธแต่ไม่รู้พิรุธอะไร','เครื่องสรุปว่า: คุณน่าจะเคยโกหกเรื่องเวลา','เครื่องสรุปว่า: เครื่องต้องการพักร้อน','เครื่องสรุปว่า: ความจริงถูกซ่อนไว้ใต้เตียง','เครื่องสรุปว่า: ตรวจพบความน่าสงสัยแบบขำ ๆ','เครื่องสรุปว่า: คุณยังมีโอกาสแก้ตัวในเกมหน้า','เครื่องสรุปว่า: หลักฐานชี้ไปที่คำว่า “ไม่เป็นไร”','เครื่องสรุปว่า: คุณดูน่าสงสัยเพราะเว็บนี้เอง','เครื่องสรุปว่า: ระบบตัดสินใจแล้ว และไม่รับอุทธรณ์','เครื่องสรุปว่า: คุณคือผู้ต้องสงสัยหมายเลข 1 ในคดีขนมหมด'
];
const prankConclusions=['คนนี้เชื่อเว็บง่ายกว่าที่คิด','ระดับความปั่นเกินกว่าที่ระบบรับไหว','มีแววโดนเพื่อนหลอกซ้ำได้สูง','ดูจริงจังมาก แต่จริง ๆ ไม่มีอะไรเลย','ถ้าเห็นคำว่า “ระบบตรวจพบ” มีโอกาสตกใจ','ควรเก็บสติเมื่อเจอเว็บหน้าตาจริงจัง','ความปั่นระดับพร้อมแชร์ให้เพื่อน','ระบบขอประกาศว่าคนนี้น่ารักเกินไปที่จะโดนหลอก','มีความเสี่ยงต่อการกดปุ่มโดยไม่อ่าน','มีพฤติกรรมสายลุย ไม่อ่านรายละเอียด','โอกาสโดนปั่นในกลุ่มแชตสูง','ดูเหมือนจะรู้ทัน แต่ระบบยังไม่ยืนยัน','เป็นเป้าหมายชั้นดีของมุก “ห้ามกด”','ความปั่นกำลังไต่ระดับภูเขา','ถ้าเพื่อนบอกว่าเป็น AI มีโอกาสเชื่อ','มีพลังงาน NPC แทรกเล็กน้อย','เป็นมนุษย์ แต่ปั่นเก่ง','อ่านผลแล้วอาจเถียงกับเว็บ','มีความสามารถในการหลงกลแบบมีสไตล์','ระบบให้ผ่าน แต่เพื่อนอาจไม่ให้ผ่าน','ความน่าเชื่อถือของเว็บสูงเกินเหตุ','มีโอกาสส่งผลตรวจนี้กลับมาปั่นเจ้าของเว็บ','ดูแล้วน่าจะกด “ลองอีกครั้ง”','ความปั่นอยู่ในระดับต้องจับตา','ระบบแนะนำให้พักจากปุ่มนี้ 5 นาที','พบความกวนที่ยังไม่ได้ปลดล็อกเต็มที่','เป็นผู้ทดลองที่กล้าหาญมาก','ความปั่น 100% แต่หลักฐาน 0%','เหมาะกับการเป็นตัวละครลับในเกม','มีแนวโน้มถามว่า “เว็บนี้จริงไหม”','ระบบพบความจริงหนึ่งอย่าง: เว็บนี้ปั่น','มีแววเป็นหัวหน้าทีมปั่น','ระดับความเชื่อเว็บ: สูงอย่างน่ากลัว','ระบบตรวจไม่เจอความปกติ','ควรได้รับเหรียญผู้เสียสละให้เว็บ','เป็นคนที่เห็นปุ่มแล้วต้องลอง','การวิเคราะห์นี้ไม่มีหลักวิทยาศาสตร์เลย','มีความเสี่ยงเปิดเว็บนี้ซ้ำ','ผลตรวจเหมาะสำหรับส่งในกลุ่มเพื่อน','ระดับความปั่นกำลังขึ้น','มีพลัง “เอาอีกดิ” สูง','อาจรู้ว่าโดนปั่น แต่ยังเล่นต่อ','ระบบแนะนำให้ลองเครื่องมืออื่น','ความจริงไม่สำคัญ ความปั่นสำคัญกว่า','คะแนนนี้สุ่ม แต่ความกวนจริง','มีแนวโน้มตกเป็นเหยื่อของปุ่มปลอม','ผลตรวจนี้ไม่สามารถใช้ในศาลได้','เพื่อนเห็นแล้วมีโอกาสขำ','ผ่านการตรวจโดยทีมงานในจินตนาการ','ระบบสรุปว่า: ปั่นได้อีก'
];
const aiQs=[['ถ้ามีงานส่งพรุ่งนี้ คุณจะ...','ทำทันที','ไว้ก่อน เดี๋ยวค่อยทำ','ลืมไปเลย'],['เจอปุ่มเขียนว่า “ห้ามกด” คุณจะ...','ไม่กด','กดนิดเดียว','กดรัว ๆ'],['เพื่อนส่งมีมมา คุณจะ...','กดดู','ส่งต่อ','ทำมีมใหม่แข่ง']];
function showHome(){stopGhostGame();clearInterval(targetTimer);clearInterval(hackTimer);clearInterval(targetMoveTimer);$('#home').classList.add('active');$('#game').classList.remove('active')}
function openGame(id){if(!games[id])return;stopGhostGame();clearInterval(targetTimer);clearInterval(hackTimer);clearInterval(targetMoveTimer);$('#home').classList.remove('active');$('#game').classList.add('active');window.scrollTo({top:0,behavior:'smooth'});games[id]()}
window.showHome=showHome;window.openGame=openGame;
const games={
 dont(){dontClicks=0;gameContent().innerHTML=box(`<div class="center"><h2>🚫 ปุ่มที่ไม่ควรกด</h2><p class="sub">คุณถูกเตือนแล้วนะ...</p><div style="height:230px;position:relative" id="dontArea"><button id="dontBtn" class="primary" style="position:absolute;left:45%;top:45%">อย่ากด</button></div><div id="dontOut" class="result"></div></div>`);$('#dontBtn').addEventListener('click',()=>{dontClicks++;let b=$('#dontBtn');if(dontClicks<6){b.style.left=Math.random()*80+'%';b.style.top=Math.random()*80+'%';b.textContent=['บอกว่าอย่ากดไง','หยุดก่อน','ยังจะกดอีก?','เอาจริงดิ','ครั้งสุดท้ายแล้วนะ'][dontClicks-1]}else{$('#dontArea').innerHTML='<div class="big">🗿</div>';$(`#dontOut`).innerHTML='<span class="danger">ยินดีด้วย คุณชนะปุ่ม</span><br><small>แต่เสียเวลาไปกับมันแล้วเรียบร้อย</small>'}})},
 npc(){gameContent().innerHTML=box(`<div class="center"><h2>🧠 NPC Scanner</h2><p class="sub">วางมือบนเมาส์ แล้วเตรียมรับผลการวิเคราะห์</p><div class="big">🧑‍💻</div><div class="progress"><div id="npcBar" class="bar"></div></div><div id="npcOut" class="result">พร้อมสแกน</div><button id="npcStart" class="primary">เริ่มสแกน</button></div>`);$('#npcStart').addEventListener('click',()=>{let p=0;$('#npcStart').disabled=true;const t=setInterval(()=>{p+=Math.random()*17;$('#npcBar').style.width=Math.min(p,100)+'%';$('#npcOut').textContent=p<100?'กำลังวิเคราะห์...':'กำลังสรุปผล...';if(p>=100){clearInterval(t);setTimeout(()=>{const n=Math.floor(Math.random()*100)+1;const human=n<=10;const behavior=npcBehaviors[Math.floor(Math.random()*npcBehaviors.length)];$('#npcOut').innerHTML=human?`ผลลัพธ์: <span class="success">${n}% มนุษย์</span><br><small>ระบบตรวจพบพฤติกรรม “${behavior}”</small>`:`ผลลัพธ์: <span class="danger">${n}% หุ่นยนต์</span><br><small>ระบบตรวจพบพฤติกรรม “${behavior}”</small>`;$('#npcStart').disabled=false},300)}},180)})},
 lie(){lieStep=0;gameContent().innerHTML=box(`<h2>🕵️ เครื่องจับโกหก</h2><p class="sub">เลือกคำตอบที่คิดว่าเครื่องจะเชื่อ</p><div id="lieQ"></div>`);showLie()},
 money(){gameContent().innerHTML=box(`<div class="center"><h2>💰 รับเงินฟรี</h2><p class="sub">ยินดีด้วย ระบบพบว่าคุณมีสิทธิ์รับเงิน</p><div class="money">฿999,999</div><p class="warn">*ขั้นตอนนี้เป็นเกมจำลอง ไม่มีการโอนเงินจริง</p><button id="moneyStart" class="primary">ยืนยันรับเงิน</button></div>`);$('#moneyStart').addEventListener('click',()=>moneyStep(1))},
 reward(){reward=0;gameContent().innerHTML=box(`<div class="center"><h2>🎁 เครื่องผลิตเงิน</h2><p class="sub">กดปุ่มเพื่อเพิ่มยอดเงิน</p><div id="cash" class="money">฿0</div><button id="earnBtn" class="primary">+ รับเงิน</button> <button id="withdrawBtn" class="secondary">ถอนเงิน</button><div id="rewardMsg" class="result"></div></div>`);$('#earnBtn').addEventListener('click',()=>{reward+=Math.floor(Math.random()*900)+100;$('#cash').textContent='฿'+reward.toLocaleString('th-TH')});$('#withdrawBtn').addEventListener('click',()=>{$('#rewardMsg').innerHTML=reward<10000?'<span class="danger">ถอนเงินไม่ได้</span><br><small>ยอดขั้นต่ำ 10,000 บาท และคุณกำลังโดนปั่นอยู่</small>':'<span class="success">กำลังโอน...</span><br><small>โอนไปยังธนาคารแห่งความฝันเรียบร้อย</small>'})},
 hack(){gameContent().innerHTML=box(`<h2>💻 Fake Hacker</h2><p class="sub">Terminal จำลองแฮ็กแบบหนังฮอลลีวูด</p><div id="terminal" class="terminal"></div><div class="center" style="margin-top:18px"><button id="hackStart" class="primary">เริ่มกระบวนการ</button></div>`);$('#hackStart').addEventListener('click',runHack)},
 love(){gameContent().innerHTML=box(`<div class="center"><h2>❤️ Love Scanner</h2><p class="sub">ค้นหาเนื้อคู่จากชื่อของคุณ</p><input id="name" required placeholder="ใส่ชื่อของคุณ"><br><br><button id="loveStart" class="primary">เริ่มค้นหา</button><div id="loveOut"></div></div>`);$('#loveStart').addEventListener('click',findLove)},
 friend(){gameContent().innerHTML=box(`<div class="center"><h2>🔨 เครื่องมือปั่นเพื่อน</h2><p class="sub">สร้างผลตรวจขำ ๆ แล้วให้เพื่อนดู</p><input id="friendName" required placeholder="ชื่อเพื่อน"><br><br><button id="friendStart" class="primary">วิเคราะห์</button><div id="friendOut"></div></div>`);$('#friendStart').addEventListener('click',prankFriend)},
 ai(){aiStep=0;aiScore=0;gameContent().innerHTML=box(`<h2>🤖 AI วิเคราะห์บุคลิก</h2><p class="sub">ตอบ 3 ข้อ แล้วรับผลวิเคราะห์</p><div id="aiQ"></div>`);showAI()},
 click(){startClickGame()},
 ghost(){startGhostGame()}
};
function showLie(){const q=$('#lieQ');if(lieStep>=3){const n=Math.floor(Math.random()*100)+1;const text=lieConclusions[Math.floor(Math.random()*lieConclusions.length)];q.innerHTML=`<div class="center"><div class="big">🔍</div><div class="result">ตรวจพบความน่าสงสัย ${n}%</div><p class="sub">${n<=10?'ไม่มีอะไรให้สงสัย': 'คุณเคยโกหก'}</p><p class="sub">${text}</p><button id="lieAgain" class="primary">เล่นอีกครั้ง</button></div>`;$('#lieAgain').addEventListener('click',()=>openGame('lie'));return}q.innerHTML=`<h3>${['คุณเคยบอกว่า “กำลังจะนอน” แล้วเล่นมือถืออีก 2 ชั่วโมงไหม?','คุณเคยเปิดตู้เย็นทั้งที่รู้ว่าไม่มีอะไรไหม?','คุณเคยพูดว่า “แป๊บเดียว” แล้วหายไปเป็นชั่วโมงไหม?'][lieStep]}</h3><div class="answers"><button class="secondary lieAns">ใช่</button><button class="secondary lieAns">ไม่</button></div>`;q.querySelectorAll('.lieAns').forEach(b=>b.addEventListener('click',()=>{lieStep++;showLie()}))}
function moneyStep(n){const g=gameContent();if(n===1){g.innerHTML=box(`<div class="center"><h2>🔐 ยืนยันตัวตน</h2><p class="sub">ระบบต้องการยืนยันว่าคุณเป็นมนุษย์</p><div class="big">🤖</div><button id="moneyHuman" class="primary">ฉันไม่ใช่บอท</button></div>`);$('#moneyHuman').addEventListener('click',()=>moneyStep(2))}else if(n===2){g.innerHTML=box(`<div class="center"><h2>⏳ กำลังโอนเงิน</h2><div class="progress"><div id="moneyBar" class="bar"></div></div><p id="moneyPct">0%</p></div>`);let p=0;const t=setInterval(()=>{p+=10;if($('#moneyBar'))$('#moneyBar').style.width=p+'%';if($('#moneyPct'))$('#moneyPct').textContent=p+'%';if(p>=100){clearInterval(t);setTimeout(()=>moneyStep(3),300)}},150)}else{g.innerHTML=box(`<div class="center"><h2>💸 เสร็จสิ้น!</h2><div class="big">🗿</div><div class="result">เงินถูกส่งไปยังดาวอังคารแล้ว</div><button id="moneyAgain" class="primary">ลองใหม่</button></div>`);$('#moneyAgain').addEventListener('click',()=>openGame('money'))}}
function runHack(){clearInterval(hackTimer);const t=$('#terminal');t.textContent='';const lines=['Initializing BAS secure shell...','Connecting to target...','Scanning firewall...','Bypassing firewall [OK]','Decrypting password...','ACCESS GRANTED','Downloading secrets...','████████████████████ 100%','Searching sensitive files...','Found: cat.jpg','Found: homework.txt','Found: snacks.txt','','MISSION COMPLETE.','สิ่งที่ได้มา: รูปแมว 1 รูป'];let i=0;hackTimer=setInterval(()=>{t.textContent+=lines[i]+'\n';t.scrollTop=t.scrollHeight;i++;if(i>=lines.length){clearInterval(hackTimer);setTimeout(showCatModal,250)}},260)}
function showCatModal(){if($('#catModal'))$('#catModal').remove();document.body.insertAdjacentHTML('beforeend',`<div id="catModal" class="cat-modal"><div class="cat-card"><button id="catClose" class="cat-close" aria-label="ปิด">×</button><h2>🐱 MISSION COMPLETE</h2><p>สิ่งที่ได้มา: รูปแมว 1 รูป</p><img src="./png/cat.jpg" alt="รูปแมว" alt="รูปแมว"><button id="catDone" class="primary">ปิด</button></div></div>`);$('#catClose').addEventListener('click',closeCat);$('#catDone').addEventListener('click',closeCat)}
function closeCat(){const m=$('#catModal');if(m)m.remove()}
function findLove(){const input=$('#name'),n=(input.value||'').trim();if(!n){input.focus();toast('กรุณาใส่ชื่อก่อน');return}const r=['แมวข้างบ้าน','คนที่อ่านข้อความแล้วไม่ตอบ','คนที่อยู่ใกล้กว่าที่คิด','ตัวคุณเอง','คนที่กำลังหาเนื้อคู่เหมือนกัน'];$('#loveOut').innerHTML=`<div class="fakecard"><b>ผลการค้นหา: ${escapeHtml(n)}</b><p>คู่ที่เข้ากันได้มากที่สุดคือ...</p><div class="result">${r[Math.floor(Math.random()*r.length)]}</div><p class="sub">ความเข้ากันได้: ${60+Math.floor(Math.random()*41)}%</p></div>`}
function prankFriend(){const input=$('#friendName'),n=(input.value||'').trim();if(!n){input.focus();toast('กรุณาใส่ชื่อเพื่อนก่อน');return}const score=Math.floor(Math.random()*101),text=prankConclusions[Math.floor(Math.random()*prankConclusions.length)];$('#friendOut').innerHTML=`<div class="fakecard"><h3>รายงานการวิเคราะห์</h3><p>ผู้ถูกวิเคราะห์: <b>${escapeHtml(n)}</b></p><p>ระดับความปั่น: ${score}%</p><div class="meter"><div style="width:${score}%"></div></div><p class="warn">ข้อสรุป: ${text}</p></div>`}
function showAI(){const qbox=$('#aiQ');if(aiStep>=3){const labels=['สายวางแผน','สายชิล','สายปั่นระดับตำนาน'];qbox.innerHTML=`<div class="center"><div class="big">🤖</div><div class="result">${labels[Math.min(aiScore,2)]}</div><p class="sub">ความสามารถในการปั่น: ${65+aiScore*15}%</p><button id="aiAgain" class="primary">วิเคราะห์ใหม่</button></div>`;$('#aiAgain').addEventListener('click',()=>openGame('ai'));return}const q=aiQs[aiStep];qbox.innerHTML=`<h3>${q[0]}</h3><div class="answers">${q.slice(1).map((x,i)=>`<button class="secondary aiAns" data-score="${i}">${x}</button>`).join('')}</div>`;qbox.querySelectorAll('.aiAns').forEach(b=>b.addEventListener('click',()=>{aiScore+=Number(b.dataset.score);aiStep++;showAI()}))}
function startClickGame(){clearInterval(targetTimer);clearInterval(targetMoveTimer);targetScore=0;targetTime=15;clickRounds++;gameContent().innerHTML=box(`<h2>🖱️ จับวงกลมให้ได้</h2><div class="score"><span>คะแนน: <b id="sc">0</b></span><span>เวลา: <b id="tm">15</b>s</span></div><div id="arena" class="target-area"></div><div class="center" style="margin-top:18px"><button id="clickRestart" class="secondary">เริ่มใหม่</button></div>`);$('#clickRestart').addEventListener('click',startClickGame);moveTarget();targetTimer=setInterval(()=>{targetTime--;if($('#tm'))$('#tm').textContent=targetTime;if(targetTime<=0){clearInterval(targetTimer);clearInterval(targetMoveTimer);const a=$('#arena');if(a)a.innerHTML=`<div class="center" style="padding-top:110px"><div class="result">หมดเวลา! ${targetScore} คะแนน</div></div>`}},1000);const a=$('#arena');a.addEventListener('mousemove',ev=>{const t=$('#target');if(!t||t.dataset.flying==='1')return;const r=t.getBoundingClientRect(),dx=ev.clientX-(r.left+r.width/2),dy=ev.clientY-(r.top+r.height/2),d=Math.hypot(dx,dy);if(d<115)moveAway(dx,dy)});a.addEventListener('touchstart',ev=>{const t=$('#target');if(!t)return;const p=ev.touches[0],r=t.getBoundingClientRect(),d=Math.hypot(p.clientX-(r.left+r.width/2),p.clientY-(r.top+r.height/2));if(d<140)moveTarget()}, {passive:true})}
function safePosition(a){const pad=4,w=55,h=55;return {x:Math.max(pad,Math.random()*(a.clientWidth-w-pad)),y:Math.max(pad,Math.random()*(a.clientHeight-h-pad))}}
function moveTarget(){if(targetTime<=0)return;const a=$('#arena');if(!a)return;const pos=safePosition(a);a.innerHTML='<button id="target" class="target" aria-label="เป้าหมาย"></button>';const t=$('#target');t.style.left=pos.x+'px';t.style.top=pos.y+'px';t.addEventListener('click',targetHit);if(Math.random()<0.22)startDrift()} 
function moveAway(dx,dy){const a=$('#arena'),t=$('#target');if(!a||!t)return;const r=t.getBoundingClientRect(),ar=a.getBoundingClientRect(),cx=r.left+r.width/2,cy=r.top+r.height/2;let vx=-dx,vy=-dy,len=Math.hypot(vx,vy)||1;vx/=len;vy/=len;let x=(cx-ar.left)+vx*(90+Math.random()*70)-27.5,y=(cy-ar.top)+vy*(90+Math.random()*70)-27.5;x=Math.max(4,Math.min(a.clientWidth-59,x));y=Math.max(4,Math.min(a.clientHeight-59,y));t.style.transition='left .18s ease, top .18s ease';t.style.left=x+'px';t.style.top=y+'px';setTimeout(()=>{if(t)t.style.transition=''},190)}
function startDrift(){clearInterval(targetMoveTimer);targetMoveTimer=setInterval(()=>{const t=$('#target');if(!t||t.dataset.flying==='1'||targetTime<=0){clearInterval(targetMoveTimer);return}moveAway(Math.random()-.5,Math.random()-.5)},700+Math.random()*700)}
function targetHit(e){e.stopPropagation();const t=e.currentTarget;if(t.dataset.flying==='1')return;targetScore++;if($('#sc'))$('#sc').textContent=targetScore;if(targetScore%3===2){flyOut()}else{moveTarget()}}function flyOut(){const t=$('#target');if(!t)return;t.dataset.flying='1';clearInterval(targetMoveTimer);const r=t.getBoundingClientRect();t.style.position='fixed';t.style.left=r.left+'px';t.style.top=r.top+'px';t.style.zIndex='99999';t.style.transition='left .7s ease-out,top .7s ease-out,opacity .7s';requestAnimationFrame(()=>{t.style.left='120vw';t.style.top='-30vh';t.style.opacity='0'});setTimeout(()=>{if(targetTime<=0)return;const a=$('#arena');if(!a)return;const pos=safePosition(a);t.style.transition='none';t.style.opacity='0';t.style.position='absolute';t.style.left=pos.x+'px';t.style.top=pos.y+'px';t.style.zIndex='';a.appendChild(t);requestAnimationFrame(()=>{t.style.transition='opacity .35s';t.style.opacity='1';t.dataset.flying='0';startDrift()})},3000)}
function stopGhostGame(){if(ghostRAF){cancelAnimationFrame(ghostRAF);ghostRAF=null}if(ghostKeyHandler){document.removeEventListener('keydown',ghostKeyHandler);ghostKeyHandler=null}ghostState=null}
function startGhostGame(){stopGhostGame();const mobile='ontouchstart' in window||navigator.maxTouchPoints>0||window.matchMedia('(pointer:coarse)').matches;gameContent().innerHTML=box(`<div class="ghost-game"><h2>👻 มินิเกม</h2><p class="sub">กระโดดจากพื้นหนึ่งไปอีกพื้นหนึ่ง อย่าตกลงไปข้างล่าง...</p><div class="ghost-hud"><span>กระโดด: <b id="ghostJumps">0</b></span><span>ระยะทาง: <b id="ghostDistance">0</b> m</span></div><div id="ghostArena" class="ghost-arena"><div id="ghostWorld" class="ghost-world"><div id="ghostPlayer" class="ghost-player"></div></div><div id="ghostStartOverlay" style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.72);z-index:999;pointer-events:auto"><div class="center"><div style="font-size:42px">👻</div><h3 style="margin:8px 0">กดเพื่อเริ่มเกม</h3><p class="sub" style="font-size:18px">${mobile?'กดปุ่ม JUMP':'กด SPACEBAR'}</p></div></div></div><button id="ghostJump" class="primary ghost-jump" type="button">JUMP</button><div class="ghost-hint">${mobile?'กดปุ่ม JUMP เพื่อเริ่มและกระโดด':'กด Spacebar เพื่อเริ่มและกระโดด'}</div><div id="ghostStatus" class="center result" style="font-size:18px">รอเริ่มเกม...</div></div>`);const arena=$('#ghostArena'),world=$('#ghostWorld'),player=$('#ghostPlayer'),jumpBtn=$('#ghostJump');ghostState={arena,world,player,x:65,y:238,vy:0,vx:2.7,grounded:true,jumps:0,distance:0,platforms:[],active:false,started:false,lastY:238,audio:new Audio('./scream/scream.mp3')};ghostState.audio.preload='auto';ghostState.audio.load();let x=15;ghostState.platforms.push({x,y:280,w:180,missing:false});for(let i=1;i<30;i++){x+=125+Math.random()*75;const prev=ghostState.platforms[i-1].y;let y=prev+(Math.random()*100-50);y=Math.max(165,Math.min(285,y));ghostState.platforms.push({x,y,w:105+Math.random()*65,missing:false})}ghostState.platforms.forEach((pl,i)=>{const el=document.createElement('div');el.className='ghost-platform';el.style.left=pl.x+'px';el.style.top=pl.y+'px';el.style.width=pl.w+'px';el.dataset.index=i;world.insertBefore(el,player);pl.el=el});const jump=()=>{const g=ghostState;if(!g||!g.active||!g.grounded)return;g.vy=-11;g.grounded=false;g.jumps++;$('#ghostJumps').textContent=g.jumps;if(g.jumps>=5&&Math.random()<0.30){const next=g.platforms.find(pl=>!pl.missing&&pl.x>g.x+35);if(next){next.missing=true;next.el.style.opacity='0';next.el.style.pointerEvents='none'}}};const start=()=>{const g=ghostState;if(!g||g.started)return;g.started=true;g.active=true;g.audio.volume=1;g.audio.currentTime=0;g.audio.play().then(()=>{g.audio.pause();g.audio.currentTime=0}).catch(()=>{});const overlay=$('#ghostStartOverlay');if(overlay)overlay.remove();if($('#ghostStatus'))$('#ghostStatus').textContent='เริ่มแล้ว!';jump();ghostRAF=requestAnimationFrame(loop)};ghostKeyHandler=e=>{if(e.code!=='Space')return;e.preventDefault();if(!ghostState?.started)start();else jump()};document.addEventListener('keydown',ghostKeyHandler);jumpBtn.addEventListener('click',()=>{if(!ghostState?.started)start();else jump()});let touchStart=0;arena.addEventListener('touchstart',()=>{touchStart=Date.now()},{passive:true});arena.addEventListener('touchend',()=>{if(Date.now()-touchStart<500){if(!ghostState?.started)start();else jump()}},{passive:true});function loop(){const g=ghostState;if(!g||!g.active)return;g.lastY=g.y;g.x+=g.vx;g.vy+=0.52;g.y+=g.vy;if(g.vy>=0){for(const pl of g.platforms){if(pl.missing)continue;const wasAbove=g.lastY+42<=pl.y,nowCross=g.y+42>=pl.y,overlap=g.x+30>pl.x&&g.x<pl.x+pl.w;if(wasAbove&&nowCross&&overlap){g.y=pl.y-42;g.vy=0;g.grounded=true;break}}}player.style.left=g.x+'px';player.style.top=g.y+'px';const camera=Math.max(0,g.x-170);world.style.transform=`translateX(${-camera}px)`;g.distance=Math.floor(g.x/10);$('#ghostDistance').textContent=g.distance;if(g.y>390){g.active=false;if($('#ghostStatus'))$('#ghostStatus').textContent='ตกแมพ...';setTimeout(showGhostJumpscare,180);return}ghostRAF=requestAnimationFrame(loop)}}
function showGhostJumpscare(){const old=ghostState;const audio=old?.audio;stopGhostGame();if($('#ghostScare'))$('#ghostScare').remove();document.body.insertAdjacentHTML('beforeend',`<div id="ghostScare" class="jumpscare"><video id="ghostVideo" src="./video/ghost_jumpscare.mp4" autoplay muted playsinline></video><button id="ghostRetry" class="primary ghost-retry">เล่นอีกครั้ง</button></div>`);const v=$('#ghostVideo');const playScare=()=>{v.currentTime=0;v.play().catch(()=>{});if(audio){audio.currentTime=0;audio.volume=1;audio.play().catch(()=>{})}};if(v.readyState>=2)playScare();else v.addEventListener('loadeddata',playScare,{once:true});$('#ghostRetry').addEventListener('click',()=>{$('#ghostScare')?.remove();openGame('ghost')})}

function toast(t){const x=$('#toast');x.textContent=t;x.classList.add('show');setTimeout(()=>x.classList.remove('show'),1800)}
function escapeHtml(s){return s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]))}
document.addEventListener('DOMContentLoaded',()=>{document.body.dataset.prankLabReady='true';initBackgroundMusic()});
})();
