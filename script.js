(() => {
  'use strict';

  let lieStep = 0;
  let reward = 0;
  let aiStep = 0;
  let aiScore = 0;
  let dontClicks = 0;
  let targetScore = 0;
  let targetTime = 15;
  let targetTimer = null;
  let hackTimer = null;

  const lieQs = [
    'คุณเคยบอกว่า “กำลังจะนอน” แล้วเล่นมือถืออีก 2 ชั่วโมงไหม?',
    'คุณเคยเปิดตู้เย็นทั้งที่รู้ว่าไม่มีอะไรไหม?',
    'คุณเคยพูดว่า “แป๊บเดียว” แล้วหายไปเป็นชั่วโมงไหม?'
  ];
  const aiQs = [
    ['ถ้ามีงานส่งพรุ่งนี้ คุณจะ...', 'ทำทันที', 'ไว้ก่อน เดี๋ยวค่อยทำ', 'ลืมไปเลย'],
    ['เจอปุ่มเขียนว่า “ห้ามกด” คุณจะ...', 'ไม่กด', 'กดนิดเดียว', 'กดรัว ๆ'],
    ['เพื่อนส่งมีมมา คุณจะ...', 'กดดู', 'ส่งต่อ', 'ทำมีมใหม่แข่ง']
  ];

  const $ = (s) => document.querySelector(s);
  const gameContent = () => $('#gameContent');
  const box = (html) => `<div class="gamebox">${html}</div>`;

  function showHome() {
    $('#home').classList.add('active');
    $('#game').classList.remove('active');
    clearInterval(targetTimer);
    clearInterval(hackTimer);
  }

  function openGame(id) {
    if (!games[id]) return;
    $('#home').classList.remove('active');
    $('#game').classList.add('active');
    window.scrollTo({top: 0, behavior: 'smooth'});
    games[id]();
  }

  window.showHome = showHome;
  window.openGame = openGame;

  const games = {
    dont() {
      dontClicks = 0;
      gameContent().innerHTML = box(`
        <div class="center">
          <h2>🚫 ปุ่มที่ไม่ควรกด</h2>
          <p class="sub">คุณถูกเตือนแล้วนะ...</p>
          <div style="height:230px;position:relative" id="dontArea">
            <button id="dontBtn" class="primary" style="position:absolute;left:45%;top:45%">อย่ากด</button>
          </div>
          <div id="dontOut" class="result"></div>
        </div>`);
      $('#dontBtn').addEventListener('click', dontClick);
    },

    npc() {
      gameContent().innerHTML = box(`
        <div class="center">
          <h2>🧠 NPC Scanner</h2>
          <p class="sub">วางมือบนเมาส์ แล้วเตรียมรับผลการวิเคราะห์</p>
          <div class="big">🧑‍💻</div>
          <div class="progress"><div id="npcBar" class="bar"></div></div>
          <div id="npcOut" class="result">พร้อมสแกน</div>
          <button id="npcStart" class="primary">เริ่มสแกน</button>
        </div>`);
      $('#npcStart').addEventListener('click', scanNPC);
    },

    lie() {
      lieStep = 0;
      gameContent().innerHTML = box(`<h2>🕵️ เครื่องจับโกหก</h2><p class="sub">เลือกคำตอบที่คิดว่าเครื่องจะเชื่อ</p><div id="lieQ"></div>`);
      showLie();
    },

    money() {
      gameContent().innerHTML = box(`
        <div class="center">
          <h2>💰 รับเงินฟรี</h2>
          <p class="sub">ยินดีด้วย ระบบพบว่าคุณมีสิทธิ์รับเงิน</p>
          <div class="money">฿999,999</div>
          <p class="warn">*ขั้นตอนนี้เป็นเกมจำลอง ไม่มีการโอนเงินจริง</p>
          <button id="moneyStart" class="primary">ยืนยันรับเงิน</button>
        </div>`);
      $('#moneyStart').addEventListener('click', () => moneyStep(1));
    },

    reward() {
      reward = 0;
      gameContent().innerHTML = box(`
        <div class="center">
          <h2>🎁 เครื่องผลิตเงิน</h2>
          <p class="sub">กดปุ่มเพื่อเพิ่มยอดเงิน</p>
          <div id="cash" class="money">฿0</div>
          <button id="earnBtn" class="primary">+ รับเงิน</button>
          <button id="withdrawBtn" class="secondary">ถอนเงิน</button>
          <div id="rewardMsg" class="result"></div>
        </div>`);
      $('#earnBtn').addEventListener('click', earn);
      $('#withdrawBtn').addEventListener('click', withdraw);
    },

    hack() {
      gameContent().innerHTML = box(`
        <h2>💻 Fake Hacker</h2>
        <p class="sub">Terminal จำลองแฮ็กแบบหนังฮอลลีวูด</p>
        <div id="terminal" class="terminal"></div>
        <div class="center" style="margin-top:18px"><button id="hackStart" class="primary">เริ่มกระบวนการ</button></div>`);
      $('#hackStart').addEventListener('click', runHack);
    },

    love() {
      gameContent().innerHTML = box(`
        <div class="center">
          <h2>❤️ Love Scanner</h2>
          <p class="sub">ค้นหาเนื้อคู่จากชื่อของคุณ</p>
          <input id="name" placeholder="ใส่ชื่อของคุณ">
          <br><br><button id="loveStart" class="primary">เริ่มค้นหา</button>
          <div id="loveOut"></div>
        </div>`);
      $('#loveStart').addEventListener('click', findLove);
    },

    friend() {
      gameContent().innerHTML = box(`
        <div class="center">
          <h2>🔨 เครื่องมือปั่นเพื่อน</h2>
          <p class="sub">สร้างผลตรวจขำ ๆ แล้วให้เพื่อนดู</p>
          <input id="friendName" placeholder="ชื่อเพื่อน">
          <br><br><button id="friendStart" class="primary">วิเคราะห์</button>
          <div id="friendOut"></div>
        </div>`);
      $('#friendStart').addEventListener('click', prankFriend);
    },

    ai() {
      aiStep = 0;
      aiScore = 0;
      gameContent().innerHTML = box(`<h2>🤖 AI วิเคราะห์บุคลิก</h2><p class="sub">ตอบ 3 ข้อ แล้วรับผลวิเคราะห์</p><div id="aiQ"></div>`);
      showAI();
    },

    click() {
      startClickGame();
    }
  };

  function dontClick() {
    dontClicks++;
    const b = $('#dontBtn'), a = $('#dontArea'), o = $('#dontOut');
    if (dontClicks < 6) {
      b.style.left = Math.random() * 80 + '%';
      b.style.top = Math.random() * 80 + '%';
      b.textContent = ['บอกว่าอย่ากดไง', 'หยุดก่อน', 'ยังจะกดอีก?', 'เอาจริงดิ', 'ครั้งสุดท้ายแล้วนะ'][dontClicks - 1];
    } else {
      a.innerHTML = '<div class="big">🗿</div>';
      o.innerHTML = '<span class="danger">ยินดีด้วย คุณชนะปุ่ม</span><br><small>แต่เสียเวลาไปกับมันแล้วเรียบร้อย</small>';
    }
  }

  function scanNPC() {
    const b = $('#npcBar'), o = $('#npcOut');
    let p = 0;
    $('#npcStart').disabled = true;
    const timer = setInterval(() => {
      p += Math.random() * 17;
      b.style.width = Math.min(p, 100) + '%';
      o.textContent = p < 100 ? 'กำลังวิเคราะห์...' : 'กำลังสรุปผล...';
      if (p >= 100) {
        clearInterval(timer);
        setTimeout(() => {
          o.innerHTML = `ผลลัพธ์: <span class="danger">${Math.floor(70 + Math.random() * 30)}% NPC</span><br><small>ระบบตรวจพบพฤติกรรม “เปิดเว็บแล้วลืมว่ามาทำอะไร”</small>`;
          $('#npcStart').disabled = false;
        }, 300);
      }
    }, 180);
  }

  function showLie() {
    const q = $('#lieQ');
    if (lieStep >= lieQs.length) {
      const p = 55 + Math.floor(Math.random() * 45);
      q.innerHTML = `<div class="center"><div class="big">🔍</div><div class="result">ตรวจพบความน่าสงสัย ${p}%</div><p class="sub">เครื่องสรุปว่า: คุณเป็นมนุษย์ปกติ...ที่น่าสงสัยนิดหน่อย</p><button id="lieAgain" class="primary">เล่นอีกครั้ง</button></div>`;
      $('#lieAgain').addEventListener('click', () => openGame('lie'));
      return;
    }
    q.innerHTML = `<h3>${lieQs[lieStep]}</h3><div class="answers"><button class="secondary lieAns">ใช่</button><button class="secondary lieAns">ไม่</button></div>`;
    q.querySelectorAll('.lieAns').forEach(btn => btn.addEventListener('click', () => { lieStep++; showLie(); }));
  }

  function moneyStep(n) {
    const game = gameContent();
    if (n === 1) {
      game.innerHTML = box(`<div class="center"><h2>🔐 ยืนยันตัวตน</h2><p class="sub">ระบบต้องการยืนยันว่าคุณเป็นมนุษย์</p><div class="big">🤖</div><button id="moneyHuman" class="primary">ฉันไม่ใช่บอท</button></div>`);
      $('#moneyHuman').addEventListener('click', () => moneyStep(2));
    } else if (n === 2) {
      game.innerHTML = box(`<div class="center"><h2>⏳ กำลังโอนเงิน</h2><div class="progress"><div id="moneyBar" class="bar"></div></div><p id="moneyPct">0%</p></div>`);
      let p = 0;
      const t = setInterval(() => {
        p += 10;
        const bar = $('#moneyBar'), pct = $('#moneyPct');
        if (bar) bar.style.width = p + '%';
        if (pct) pct.textContent = p + '%';
        if (p >= 100) { clearInterval(t); setTimeout(() => moneyStep(3), 300); }
      }, 150);
    } else {
      game.innerHTML = box(`<div class="center"><h2>💸 เสร็จสิ้น!</h2><div class="big">🗿</div><div class="result">เงินถูกส่งไปยังดาวอังคารแล้ว</div><button id="moneyAgain" class="primary">ลองใหม่</button></div>`);
      $('#moneyAgain').addEventListener('click', () => openGame('money'));
    }
  }

  function earn() {
    reward += Math.floor(Math.random() * 900) + 100;
    $('#cash').textContent = '฿' + reward.toLocaleString('th-TH');
  }

  function withdraw() {
    $('#rewardMsg').innerHTML = reward < 10000
      ? '<span class="danger">ถอนเงินไม่ได้</span><br><small>ยอดขั้นต่ำ 10,000 บาท และคุณกำลังโดนปั่นอยู่</small>'
      : '<span class="success">กำลังโอน...</span><br><small>โอนไปยังธนาคารแห่งความฝันเรียบร้อย</small>';
  }

  function runHack() {
    clearInterval(hackTimer);
    const t = $('#terminal');
    t.textContent = '';
    const lines = [
      'Initializing BAS secure shell...', 'Connecting to target...', 'Scanning firewall...',
      'Bypassing firewall [OK]', 'Decrypting password...', 'ACCESS GRANTED',
      'Downloading secrets...', '████████████████████ 100%', 'Searching sensitive files...',
      'Found: cat.jpg', 'Found: homework.txt', 'Found: snacks.txt', '',
      'MISSION COMPLETE.', 'สิ่งที่ได้มา: รูปแมว 1 รูป 🐈'
    ];
    let i = 0;
    hackTimer = setInterval(() => {
      t.textContent += lines[i] + '\n';
      t.scrollTop = t.scrollHeight;
      i++;
      if (i >= lines.length) clearInterval(hackTimer);
    }, 260);
  }

  function findLove() {
    const n = ($('#name').value || 'คนแปลกหน้า').trim();
    const r = ['แมวข้างบ้าน', 'คนที่อ่านข้อความแล้วไม่ตอบ', 'คนที่อยู่ใกล้กว่าที่คิด', 'ตัวคุณเอง', 'คนที่กำลังหาเนื้อคู่เหมือนกัน'];
    $('#loveOut').innerHTML = `<div class="fakecard"><b>ผลการค้นหา: ${escapeHtml(n)}</b><p>คู่ที่เข้ากันได้มากที่สุดคือ...</p><div class="result">${r[Math.floor(Math.random() * r.length)]}</div><p class="sub">ความเข้ากันได้: ${60 + Math.floor(Math.random() * 41)}%</p></div>`;
  }

  function prankFriend() {
    const n = ($('#friendName').value || 'ผู้ถูกปั่น').trim();
    const score = Math.floor(70 + Math.random() * 30);
    $('#friendOut').innerHTML = `<div class="fakecard"><h3>รายงานการวิเคราะห์</h3><p>ผู้ถูกวิเคราะห์: <b>${escapeHtml(n)}</b></p><p>ระดับความปั่น: ${score}%</p><div class="meter"><div style="width:${score}%"></div></div><p class="warn">ข้อสรุป: บุคคลนี้มีแนวโน้มเชื่อเว็บแปลก ๆ ถ้าหน้าตาดูจริงจังพอ</p></div>`;
  }

  function showAI() {
    const qbox = $('#aiQ');
    if (aiStep >= aiQs.length) {
      const labels = ['สายวางแผน', 'สายชิล', 'สายปั่นระดับตำนาน'];
      qbox.innerHTML = `<div class="center"><div class="big">🤖</div><div class="result">${labels[Math.min(aiScore, 2)]}</div><p class="sub">ความสามารถในการปั่น: ${65 + aiScore * 15}%</p><button id="aiAgain" class="primary">วิเคราะห์ใหม่</button></div>`;
      $('#aiAgain').addEventListener('click', () => openGame('ai'));
      return;
    }
    const q = aiQs[aiStep];
    qbox.innerHTML = `<h3>${q[0]}</h3><div class="answers">${q.slice(1).map((x, i) => `<button class="secondary aiAns" data-score="${i}">${x}</button>`).join('')}</div>`;
    qbox.querySelectorAll('.aiAns').forEach(btn => btn.addEventListener('click', () => { aiScore += Number(btn.dataset.score); aiStep++; showAI(); }));
  }

  function startClickGame() {
    clearInterval(targetTimer);
    targetScore = 0;
    targetTime = 15;
    gameContent().innerHTML = box(`<h2>🖱️ จับวงกลมให้ได้</h2><div class="score"><span>คะแนน: <b id="sc">0</b></span><span>เวลา: <b id="tm">15</b>s</span></div><div id="arena" class="target-area"></div><div class="center" style="margin-top:18px"><button id="clickRestart" class="secondary">เริ่มใหม่</button></div>`);
    $('#clickRestart').addEventListener('click', startClickGame);
    moveTarget();
    targetTimer = setInterval(() => {
      targetTime--;
      const tm = $('#tm');
      if (tm) tm.textContent = targetTime;
      if (targetTime <= 0) {
        clearInterval(targetTimer);
        const arena = $('#arena');
        if (arena) arena.innerHTML = `<div class="center" style="padding-top:110px"><div class="result">หมดเวลา! ${targetScore} คะแนน</div></div>`;
      }
    }, 1000);
  }

  function moveTarget() {
    if (targetTime <= 0) return;
    const a = $('#arena');
    if (!a) return;
    const x = Math.random() * Math.max(0, a.clientWidth - 55);
    const y = Math.random() * Math.max(0, a.clientHeight - 55);
    a.innerHTML = '<button id="target" class="target" style="left:' + x + 'px;top:' + y + 'px"></button>';
    $('#target').addEventListener('click', targetHit);
  }

  function targetHit(e) {
    e.stopPropagation();
    targetScore++;
    const sc = $('#sc');
    if (sc) sc.textContent = targetScore;
    moveTarget();
  }

  function escapeHtml(s) {
    return s.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
  }

  document.addEventListener('DOMContentLoaded', () => {
    // Static cards are in index.html; this only verifies the script loaded.
    document.body.dataset.prankLabReady = 'true';
  });
})();
