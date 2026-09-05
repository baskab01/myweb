const apps=[
 {id:"npc",icon:"🧠",title:"ตรวจสอบว่าเป็น NPC หรือไม่",desc:"สแกนความเป็นมนุษย์แบบวิทยาศาสตร์มั่ว ๆ"},
 {id:"dont",icon:"🚫",title:"ปุ่มที่ไม่ควรกด",desc:"ปุ่มจะหนีไปไหนเมื่อคุณพยายามกดมัน"},
 {id:"lie",icon:"🕵️",title:"เครื่องจับโกหก",desc:"ตอบคำถาม แล้วให้เครื่องตัดสินแบบมั่วอย่างมีหลักการ"},
 {id:"money",icon:"💰",title:"แจกเงินฟรี",desc:"ขั้นตอนรับเงิน 999,999 บาทที่เริ่มดูไม่น่าไว้ใจ"},
 {id:"reward",icon:"🎁",title:"รับรางวัล",desc:"คลิกสะสมเงิน แล้วลองถอนเงินดู"},
 {id:"hack",icon:"💻",title:"Fake Hacker",desc:"Terminal จำลองแฮ็กแบบหนังฮอลลีวูด"},
 {id:"love",icon:"❤️",title:"ค้นหาเนื้อคู่",desc:"ใส่ชื่อแล้วให้ระบบจักรวาลสุ่มคำตอบ"},
 {id:"friend",icon:"🔨",title:"ปั่นเพื่อน",desc:"สร้างการ์ดผลตรวจปลอมไว้ส่งให้เพื่อนขำ ๆ"},
 {id:"ai",icon:"🤖",title:"AI วิเคราะห์บุคลิก",desc:"ตอบคำถามแล้วรับผลวิเคราะห์สุดจริงจัง"},
 {id:"click",icon:"🖱️",title:"จับวงกลมให้ได้",desc:"เกมทดสอบปฏิกิริยา จับเป้าหมายให้ได้มากที่สุด"}
];

const cards=document.querySelector("#cards");
cards.innerHTML=apps.map(a=>`<article class="card">
  <div class="icon">${a.icon}</div><h3>${a.title}</h3><p>${a.desc}</p>
  <button class="play" onclick="openGame('${a.id}')">เข้าไปเล่น →</button>
</article>`).join("");

function showHome(){
  document.querySelector("#home").classList.add("active");
  document.querySelector("#game").classList.remove("active");
}
function openGame(id){
  document.querySelector("#home").classList.remove("active");
  document.querySelector("#game").classList.add("active");
  window.scrollTo(0,0);
  if(games[id]) games[id]();
}
function toast(t){const x=document.querySelector("#toast");x.textContent=t;x.classList.add("show");setTimeout(()=>x.classList.remove("show"),1800)}
const box=t=>`<div class="gamebox">${t}</div>`;

const games={
dont(){document.querySelector("#gameContent").innerHTML=box(`<div class="center"><h2>🚫 ปุ่มที่ไม่ควรกด</h2><p class="sub">คุณถูกเตือนแล้วนะ...</p><div style="height:230px;position:relative" id="dontArea"><button id="dontBtn" class="primary" style="position:absolute;left:45%;top:45%" onclick="dontClick()">อย่ากด</button></div><div id="dontOut" class="result"></div></div>`)},
npc(){document.querySelector("#gameContent").innerHTML=box(`<div class="center"><h2>🧠 NPC Scanner</h2><p class="sub">วางมือบนเมาส์ แล้วเตรียมรับผลการวิเคราะห์</p><div class="big">🧑‍💻</div><div class="progress"><div id="bar" class="bar"></div></div><div id="out" class="result">พร้อมสแกน</div><button class="primary" onclick="scanNPC()">เริ่มสแกน</button></div>`)},
lie(){document.querySelector("#gameContent").innerHTML=box(`<h2>🕵️ เครื่องจับโกหก</h2><p class="sub">เลือกคำตอบที่คิดว่าเครื่องจะเชื่อ</p><div id="lieQ"></div>`);lieStep=0;showLie()},
money(){document.querySelector("#gameContent").innerHTML=box(`<div class="center"><h2>💰 รับเงินฟรี</h2><p class="sub">ยินดีด้วย ระบบพบว่าคุณมีสิทธิ์รับเงิน</p><div class="money">฿999,999</div><p class="warn">*ขั้นตอนนี้เป็นเกมจำลอง ไม่มีการโอนเงินจริง</p><button class="primary" onclick="moneyStep(1)">ยืนยันรับเงิน</button></div>`)},
reward(){reward=0;document.querySelector("#gameContent").innerHTML=box(`<div class="center"><h2>🎁 เครื่องผลิตเงิน</h2><p class="sub">กดปุ่มเพื่อเพิ่มยอดเงิน</p><div id="cash" class="money">฿0</div><button class="primary" onclick="earn()">+ รับเงิน</button> <button class="secondary" onclick="withdraw()">ถอนเงิน</button><div id="rewardMsg" class="result"></div></div>`)},
hack(){document.querySelector("#gameContent").innerHTML=box(`<h2>💻 Fake Hacker</h2><p class="sub">การแฮ็กจำลองเพื่อความบันเทิงเท่านั้น</p><div id="terminal" class="terminal"></div><div class="center" style="margin-top:18px"><button class="primary" onclick="runHack()">เริ่มกระบวนการ</button></div>`)},
love(){document.querySelector("#gameContent").innerHTML=box(`<div class="center"><h2>❤️ Love Scanner</h2><p class="sub">ค้นหาเนื้อคู่จากชื่อของคุณ</p><input id="name" placeholder="ใส่ชื่อของคุณ"><br><br><button class="primary" onclick="findLove()">เริ่มค้นหา</button><div id="loveOut"></div></div>`)},
friend(){document.querySelector("#gameContent").innerHTML=box(`<div class="center"><h2>🔨 เครื่องมือปั่นเพื่อน</h2><p class="sub">สร้างผลตรวจขำ ๆ แล้วให้เพื่อนดู</p><input id="friendName" placeholder="ชื่อเพื่อน"><br><br><button class="primary" onclick="prankFriend()">วิเคราะห์</button><div id="friendOut"></div></div>`)},
ai(){document.querySelector("#gameContent").innerHTML=box(`<h2>🤖 AI วิเคราะห์บุคลิก</h2><p class="sub">ตอบ 3 ข้อ แล้วรับผลวิเคราะห์</p><div id="aiQ"></div>`);aiStep=0;aiScore=0;showAI()},
click(){startClickGame()}
};

let dontClicks=0;
function dontClick(){
  dontClicks++;
  const b=document.querySelector("#dontBtn"),a=document.querySelector("#dontArea"),o=document.querySelector("#dontOut");
  if(dontClicks<6){
    b.style.left=Math.random()*80+"%"; b.style.top=Math.random()*80+"%";
    b.textContent=["บอกว่าอย่ากดไง","หยุดก่อน","ยังจะกดอีก?","เอาจริงดิ","ครั้งสุดท้ายแล้วนะ"][dontClicks-1];
  }else{a.innerHTML=`<div class="big">🗿</div>`;o.innerHTML=`<span class="danger">ยินดีด้วย คุณชนะปุ่ม</span><br><small>แต่เสียเวลาไปกับมันแล้วเรียบร้อย</small>`}
}

function scanNPC(){let b=document.querySelector("#bar"),o=document.querySelector("#out"),p=0;const timer=setInterval(()=>{p+=Math.random()*17;b.style.width=Math.min(p,100)+"%";o.textContent=p<100?"กำลังวิเคราะห์...":"กำลังสรุปผล...";if(p>=100){clearInterval(timer);setTimeout(()=>o.innerHTML=`ผลลัพธ์: <span class="danger">${Math.floor(70+Math.random()*30)}% NPC</span><br><small>ระบบตรวจพบพฤติกรรม “เปิดเว็บแล้วลืมว่ามาทำอะไร”</small>`,300)}},180)}

let lieStep=0;const lieQs=["คุณเคยบอกว่า “กำลังจะนอน” แล้วเล่นมือถืออีก 2 ชั่วโมงไหม?","คุณเคยเปิดตู้เย็นทั้งที่รู้ว่าไม่มีอะไรไหม?","คุณเคยพูดว่า “แป๊บเดียว” แล้วหายไปเป็นชั่วโมงไหม?"];
function showLie(){if(lieStep>=lieQs.length){const p=55+Math.floor(Math.random()*45);document.querySelector("#lieQ").innerHTML=`<div class="center"><div class="big">🔍</div><div class="result">ตรวจพบความน่าสงสัย ${p}%</div><p class="sub">เครื่องสรุปว่า: คุณเป็นมนุษย์ปกติ...ที่น่าสงสัยนิดหน่อย</p><button class="primary" onclick="openGame('lie')">เล่นอีกครั้ง</button></div>`;return}document.querySelector("#lieQ").innerHTML=`<h3>${lieQs[lieStep]}</h3><div class="answers"><button class="secondary" onclick="answerLie()">ใช่</button><button class="secondary" onclick="answerLie()">ไม่</button></div>`}
function answerLie(){lieStep++;showLie()}

let reward=0;
function earn(){reward+=Math.floor(Math.random()*900)+100;document.querySelector("#cash").textContent="฿"+reward.toLocaleString()}
function withdraw(){document.querySelector("#rewardMsg").innerHTML=reward<10000?`<span class="danger">ถอนเงินไม่ได้</span><br><small>ยอดขั้นต่ำ 10,000 บาท และคุณกำลังโดนปั่นอยู่</small>`:`<span class="success">กำลังโอน...</span><br><small>โอนไปยังธนาคารแห่งความฝันเรียบร้อย</small>`}

function moneyStep(n){
  const game = document.querySelector("#gameContent");
  if(n===1){
    game.querySelector(".gamebox").innerHTML=`<div class="center"><h2>🔐 ยืนยันตัวตน</h2><p class="sub">ระบบต้องการยืนยันว่าคุณเป็นมนุษย์</p><div class="big">🤖</div><button class="primary" onclick="moneyStep(2)">ฉันไม่ใช่บอท</button></div>`;
  }else if(n===2){
    game.querySelector(".gamebox").innerHTML=`<div class="center"><h2>⏳ กำลังโอนเงิน</h2><div class="progress"><div id="bar" class="bar"></div></div><p id="m">0%</p></div>`;
    let p=0;
    const t=setInterval(()=>{
      p+=10;
      const bar=document.querySelector("#bar"), m=document.querySelector("#m");
      if(bar) bar.style.width=p+"%";
      if(m) m.textContent=p+"%";
      if(p>=100){clearInterval(t);setTimeout(()=>moneyStep(3),300)}
    },150);
  }else{
    game.querySelector(".gamebox").innerHTML=`<div class="center"><h2>💸 เสร็จสิ้น!</h2><div class="big">🗿</div><div class="result">เงินถูกส่งไปยังดาวอังคารแล้ว</div><button class="primary" onclick="openGame('money')">ลองใหม่</button></div>`;
  }
}

function runHack(){const t=document.querySelector("#terminal");t.textContent="";const lines=["Initializing BAS secure shell...","Connecting to target...","Scanning firewall...","Bypassing firewall [OK]","Decrypting password...","ACCESS GRANTED","Downloading secrets...","████████████████████ 100%","Searching sensitive files...","Found: cat.jpg","Found: homework.txt","Found: snacks.txt","","MISSION COMPLETE.","สิ่งที่ได้มา: รูปแมว 1 รูป 🐈"];let i=0;const x=setInterval(()=>{t.textContent+=lines[i]+"\n";t.scrollTop=t.scrollHeight;i++;if(i>=lines.length)clearInterval(x)},260)}

function findLove(){const n=(document.querySelector("#name").value||"คนแปลกหน้า").trim();const r=["แมวข้างบ้าน","คนที่อ่านข้อความแล้วไม่ตอบ","คนที่อยู่ใกล้กว่าที่คิด","ตัวคุณเอง","คนที่กำลังหาเนื้อคู่เหมือนกัน"];document.querySelector("#loveOut").innerHTML=`<div class="fakecard"><b>ผลการค้นหา: ${escapeHtml(n)}</b><p>คู่ที่เข้ากันได้มากที่สุดคือ...</p><div class="result">${r[Math.floor(Math.random()*r.length)]}</div><p class="sub">ความเข้ากันได้: ${60+Math.floor(Math.random()*41)}%</p></div>`}
function prankFriend(){const n=(document.querySelector("#friendName").value||"ผู้ถูกปั่น").trim();const score=Math.floor(70+Math.random()*30);document.querySelector("#friendOut").innerHTML=`<div class="fakecard"><h3>รายงานการวิเคราะห์</h3><p>ผู้ถูกวิเคราะห์: <b>${escapeHtml(n)}</b></p><p>ระดับความปั่น: ${score}%</p><div class="meter"><div style="width:${score}%"></div></div><p class="warn">ข้อสรุป: บุคคลนี้มีแนวโน้มเชื่อเว็บแปลก ๆ ถ้าหน้าตาดูจริงจังพอ</p></div>`}

let aiStep=0,aiScore=0;const aiQs=[["ถ้ามีงานส่งพรุ่งนี้ คุณจะ...","ทำทันที","ไว้ก่อน เดี๋ยวค่อยทำ","ลืมไปเลย"],["เจอปุ่มเขียนว่า “ห้ามกด” คุณจะ...","ไม่กด","กดนิดเดียว","กดรัว ๆ"],["เพื่อนส่งมีมมา คุณจะ...","กดดู","ส่งต่อ","ทำมีมใหม่แข่ง"]];
function showAI(){if(aiStep>=aiQs.length){const labels=["สายวางแผน","สายชิล","สายปั่นระดับตำนาน"];document.querySelector("#aiQ").innerHTML=`<div class="center"><div class="big">🤖</div><div class="result">${labels[Math.min(aiScore,2)]}</div><p class="sub">ความสามารถในการปั่น: ${65+aiScore*15}%</p><button class="primary" onclick="openGame('ai')">วิเคราะห์ใหม่</button></div>`;return}const q=aiQs[aiStep];document.querySelector("#aiQ").innerHTML=`<h3>${q[0]}</h3><div class="answers">${q.slice(1).map((x,i)=>`<button class="secondary" onclick="aiAnswer(${i})">${x}</button>`).join("")}</div>`}
function aiAnswer(i){aiScore+=i;aiStep++;showAI()}

let targetScore=0,targetTime=15,targetTimer=null;
function startClickGame(){targetScore=0;targetTime=15;document.querySelector("#gameContent").innerHTML=box(`<h2>🖱️ จับวงกลมให้ได้</h2><div class="score"><span>คะแนน: <b id="sc">0</b></span><span>เวลา: <b id="tm">15</b>s</span></div><div id="arena" class="target-area"></div><div class="center" style="margin-top:18px"><button class="secondary" onclick="openGame('click')">เริ่มใหม่</button></div>`);moveTarget();clearInterval(targetTimer);targetTimer=setInterval(()=>{targetTime--;document.querySelector("#tm").textContent=targetTime;if(targetTime<=0){clearInterval(targetTimer);document.querySelector("#arena").innerHTML=`<div class="center" style="padding-top:110px"><div class="result">หมดเวลา! ${targetScore} คะแนน</div></div>`}},1000)}
function moveTarget(){if(targetTime<=0)return;const a=document.querySelector("#arena");if(!a)return;let x=Math.random()*(a.clientWidth-55),y=Math.random()*(a.clientHeight-55);a.innerHTML=`<button class="target" style="left:${x}px;top:${y}px" onclick="targetHit(event)"></button>`}
function targetHit(e){e.stopPropagation();targetScore++;document.querySelector("#sc").textContent=targetScore;moveTarget()}
function escapeHtml(s){return s.replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]))}
