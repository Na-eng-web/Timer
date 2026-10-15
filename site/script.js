// Target: 21 Feb 2027, 12:31 PM IST — fixed offset so every viewer, in any
// time zone, counts down to the same instant.
const targetDate = new Date("2027-02-21T12:31:00+05:30");

const targetLabel = document.getElementById("targetLabel");
targetLabel.textContent = "Until " + targetDate.toLocaleString(undefined, {
  weekday: "long", year: "numeric", month: "long", day: "numeric",
  hour: "numeric", minute: "2-digit",
  timeZone: "Asia/Kolkata", timeZoneName: "short"
});

const countdownEl = document.getElementById("countdown");
const summaryEl = document.getElementById("summary");
const monthsEl = document.getElementById("months");
const daysEl = document.getElementById("days");
const hoursEl = document.getElementById("hours");
const minutesEl = document.getElementById("minutes");
const secondsEl = document.getElementById("seconds");

function pad(n) {
  return String(n).padStart(2, "0");
}

// Re-triggers the 3D "flip" animation only on the tiles whose value actually changed.
function setValue(el, text) {
  if (el.textContent === text) return;
  el.textContent = text;
  if (!("ready" in el.dataset)) return;
  el.classList.remove("flip");
  void el.offsetWidth; // force reflow so the animation restarts
  el.classList.add("flip");
}

// Calendar-accurate breakdown: whole months first, then days/hours/min/sec
// from whatever remains, so "1 month" always means one real calendar month.
function breakdown(from, to) {
  let months = (to.getFullYear() - from.getFullYear()) * 12 + (to.getMonth() - from.getMonth());
  let marker = new Date(from);
  marker.setMonth(marker.getMonth() + months);
  if (marker > to) {
    months--;
    marker.setMonth(marker.getMonth() - 1);
  }

  let remainingMs = to - marker;
  const days = Math.floor(remainingMs / 86400000);
  remainingMs -= days * 86400000;
  const hours = Math.floor(remainingMs / 3600000);
  remainingMs -= hours * 3600000;
  const minutes = Math.floor(remainingMs / 60000);
  remainingMs -= minutes * 60000;
  const seconds = Math.floor(remainingMs / 1000);

  return { months, days, hours, minutes, seconds };
}

function tick() {
  const now = new Date();
  const diff = targetDate - now;

  if (diff <= 0) {
    countdownEl.innerHTML = '<div class="finished">The moment has arrived.</div>';
    summaryEl.textContent = "";
    return false;
  }

  const { months, days, hours, minutes, seconds } = breakdown(now, targetDate);
  const totalSeconds = Math.floor(diff / 1000);
  const totalDays = Math.floor(diff / 86400000);

  setValue(monthsEl, pad(months));
  setValue(daysEl, pad(days));
  setValue(hoursEl, pad(hours));
  setValue(minutesEl, pad(minutes));
  setValue(secondsEl, pad(seconds));

  summaryEl.innerHTML =
    `<strong>${totalDays.toLocaleString()}</strong> days left &middot; ` +
    `<strong>${totalSeconds.toLocaleString()}</strong> seconds left`;
  return true;
}

// Schedule each update right on the next whole second of the real clock,
// so the seconds tick evenly instead of drifting like setInterval does.
function scheduleNext() {
  setTimeout(() => { if (tick()) scheduleNext(); }, 1000 - (Date.now() % 1000) + 5);
}

// Fill the tiles once without the flip animation, then start ticking.
const running = tick();
document.querySelectorAll(".unit .value").forEach((el) => (el.dataset.ready = ""));
if (running) scheduleNext();

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Tilt the 3D countdown toward the pointer (desktop / mouse only).
if (!reduceMotion && window.matchMedia("(hover: hover)").matches) {
  let frame = 0;
  window.addEventListener("pointermove", (e) => {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => {
      const x = e.clientX / window.innerWidth - 0.5;
      const y = e.clientY / window.innerHeight - 0.5;
      countdownEl.style.setProperty("--tilt-y", (x * 18).toFixed(2) + "deg");
      countdownEl.style.setProperty("--tilt-x", (10 - y * 14).toFixed(2) + "deg");
    });
  });
}

// Falling rose petals in the background.
if (!reduceMotion) {
  const petalsEl = document.getElementById("petals");
  const count = window.innerWidth < 600 ? 12 : 22;
  for (let i = 0; i < count; i++) {
    const petal = document.createElement("span");
    petal.className = "petal";
    petal.style.left = Math.random() * 100 + "%";
    petal.style.setProperty("--size", 10 + Math.random() * 12 + "px");
    petal.style.setProperty("--dur", 10 + Math.random() * 12 + "s");
    petal.style.setProperty("--delay", -Math.random() * 20 + "s");
    petal.style.setProperty("--sway", (Math.random() * 120 - 60).toFixed(0) + "px");
    petalsEl.appendChild(petal);
  }
}
