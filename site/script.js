(function () {
  // Muhurat: 21 Feb 2027, 12:31 PM IST — fixed offset so every viewer counts
  // down to the same instant.
  const targetDate = new Date("2027-02-21T12:31:00+05:30").getTime();

  const daysEl = document.getElementById("count-days");
  const hoursEl = document.getElementById("count-hours");
  const minsEl = document.getElementById("count-mins");
  const secsEl = document.getElementById("count-secs");
  const noteEl = document.getElementById("count-note");
  const pad = (n) => String(n).padStart(2, "0");

  let timer;
  function updateCountdown() {
    const distance = targetDate - Date.now();

    if (distance <= 0) {
      daysEl.textContent = hoursEl.textContent = minsEl.textContent = secsEl.textContent = "00";
      noteEl.textContent = "शुभ मंगल सावधान!";
      clearInterval(timer);
      return;
    }

    daysEl.textContent = pad(Math.floor(distance / 86400000));
    hoursEl.textContent = pad(Math.floor((distance % 86400000) / 3600000));
    minsEl.textContent = pad(Math.floor((distance % 3600000) / 60000));
    secsEl.textContent = pad(Math.floor((distance % 60000) / 1000));
  }

  updateCountdown();
  timer = setInterval(updateCountdown, 1000);
})();
