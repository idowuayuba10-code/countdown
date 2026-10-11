// ====== CUSTOMIZE HERE (or add ?name=Sara to the link) ======
var NAME = "Ayuba";
var MONTH = 9; // October (0 = January)
var DAY = 19;
var NOTES = [
  "Every second brings the party closer. 🎈",
  "Start planning the cake. 🍰",
  "Get ready to celebrate big! 🥳",
  "The best day of the year is almost here. ✨",
];
// ============================================================
try {
  var q = new URLSearchParams(location.search).get("name");
  if (q) NAME = q.slice(0, 40);
} catch (e) {}
var $ = function (i) {
  return document.getElementById(i);
};
$("title").textContent = NAME + "'s Birthday";
$("ptitle").textContent = "Happy Birthday, " + NAME + "!";
document.title = NAME + "'s Birthday Countdown";

function target() {
  var n = new Date(),
    y = n.getFullYear();
  var t = new Date(y, MONTH, DAY, 0, 0, 0),
    end = new Date(y, MONTH, DAY + 1, 0, 0, 0);
  if (n >= end) {
    t = new Date(y + 1, MONTH, DAY, 0, 0, 0);
  }
  return t;
}
var T = target(),
  partyOn = false,
  last = {};
function pad(n) {
  return String(n).padStart(2, "0");
}
function set(id, v) {
  var e = $(id);
  if (last[id] !== v) {
    e.textContent = v;
    e.classList.remove("tick");
    void e.offsetWidth;
    e.classList.add("tick");
    last[id] = v;
  }
}

function tick() {
  var diff = T - new Date();
  if (diff <= 0) {
    startParty();
    return;
  }
  var s = Math.floor(diff / 1000);
  set("d", pad(Math.floor(s / 86400)));
  set("h", pad(Math.floor((s % 86400) / 3600)));
  set("m", pad(Math.floor((s % 3600) / 60)));
  set("s", pad(s % 60));
  $("msg").textContent = NOTES[Math.floor(s / 5) % NOTES.length];
}
function startParty() {
  if (partyOn) return;
  partyOn = true;
  $("count").classList.add("hide");
  $("party").classList.remove("hide");
  burst(220);
  setInterval(function () {
    burst(40);
  }, 2500);
}

// ---- Confetti ----
var cv = $("c"),
  ctx = cv.getContext("2d"),
  P = [];
function size() {
  cv.width = innerWidth;
  cv.height = innerHeight;
}
size();
addEventListener("resize", size);
var cols = ["#ff4f9a", "#7a5cff", "#ffb703", "#2ec4b6", "#ff6b6b", "#4cc9f0"];
function burst(n) {
  for (var i = 0; i < n; i++) {
    var side = i % 2;
    P.push({
      x: side ? cv.width : 0,
      y: cv.height * 0.9,
      vx: (side ? -1 : 1) * (4 + Math.random() * 9),
      vy: -(8 + Math.random() * 13),
      w: 6 + Math.random() * 7,
      h: 4 + Math.random() * 6,
      r: Math.random() * 6,
      vr: (Math.random() - 0.5) * 0.4,
      c: cols[i % cols.length],
      life: 0,
    });
  }
  if (!running) {
    running = true;
    requestAnimationFrame(loop);
  }
}
var running = false;
function loop() {
  ctx.clearRect(0, 0, cv.width, cv.height);
  P = P.filter(function (p) {
    return p.y < cv.height + 30 && p.life < 400;
  });
  P.forEach(function (p) {
    p.vy += 0.28;
    p.vx *= 0.99;
    p.x += p.vx;
    p.y += p.vy;
    p.r += p.vr;
    p.life++;
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.r);
    ctx.fillStyle = p.c;
    ctx.globalAlpha = Math.max(0, 1 - p.life / 400);
    ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
    ctx.restore();
  });
  if (P.length) requestAnimationFrame(loop);
  else running = false;
}
$("again").onclick = function () {
  burst(200);
};

// ---- Balloons ----
var em = ["🎈", "🎈", "🎉", "🎁", "✨"];
for (var i = 0; i < 10; i++) {
  var b = document.createElement("div");
  b.className = "balloon";
  b.textContent = em[i % em.length];
  b.style.left = Math.random() * 95 + "%";
  b.style.animationDuration = 9 + Math.random() * 10 + "s";
  b.style.animationDelay = -Math.random() * 15 + "s";
  document.body.appendChild(b);
}

tick();
setInterval(tick, 1000);
