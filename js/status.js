// ===== ÅBEN/LUKKET-STATUS + NEDTÆLLING TIL ÅBNINGSDAGEN =====
(function () {
  const strip = document.getElementById('statusStrip');
  if (!strip) return;

  const stateEl = document.getElementById('statusState');
  const detailEl = document.getElementById('statusDetail');

  // Åbningsdagen: fredag den 21. august 2026, kl. 10
  const OPENING = { year: 2026, month: 7, day: 21, hour: 10 };

  // Åbningstider pr. ugedag (0 = søndag). [åbner, lukker] i hele timer.
  const HOURS = {
    0: [10, 22],
    1: [10, 22],
    2: [10, 22],
    3: [10, 22],
    4: [10, 22],
    5: [10, 24],
    6: [10, 24]
  };

  const DAGE = ['søndag', 'mandag', 'tirsdag', 'onsdag', 'torsdag', 'fredag', 'lørdag'];

  // Dansk tid, uanset hvor gæsten sidder
  function nu() {
    return new Date(new Date().toLocaleString('en-US', { timeZone: 'Europe/Copenhagen' }));
  }

  function klokken(timer) {
    return timer >= 24 ? '00:00' : String(timer).padStart(2, '0') + ':00';
  }

  function nedtaelling(ms) {
    const minutter = Math.floor(ms / 60000);
    const dage = Math.floor(minutter / 1440);
    const timer = Math.floor((minutter % 1440) / 60);
    const rest = minutter % 60;

    if (dage > 0) return dage + (dage === 1 ? ' dag og ' : ' dage og ') + timer + ' timer';
    if (timer > 0) return timer + (timer === 1 ? ' time og ' : ' timer og ') + rest + ' min';
    return rest + (rest === 1 ? ' minut' : ' minutter');
  }

  function opdater() {
    const n = nu();
    const aabning = new Date(OPENING.year, OPENING.month, OPENING.day, OPENING.hour, 0, 0);

    // Før vi åbner for allerførste gang
    if (n < aabning) {
      strip.dataset.state = 'countdown';
      stateEl.textContent = 'Vi åbner om ' + nedtaelling(aabning - n);
      detailEl.textContent = 'Fredag den 21. august kl. 10';
      strip.hidden = false;
      return;
    }

    const dag = n.getDay();
    const minutter = n.getHours() * 60 + n.getMinutes();
    const [aabner, lukker] = HOURS[dag];

    if (minutter >= aabner * 60 && minutter < lukker * 60) {
      strip.dataset.state = 'open';
      stateEl.textContent = 'Åbent nu';
      detailEl.textContent = 'Vi lukker kl. ' + klokken(lukker);
    } else if (minutter < aabner * 60) {
      strip.dataset.state = 'closed';
      stateEl.textContent = 'Lukket lige nu';
      detailEl.textContent = 'Vi åbner kl. ' + klokken(aabner);
    } else {
      const imorgen = (dag + 1) % 7;
      strip.dataset.state = 'closed';
      stateEl.textContent = 'Lukket lige nu';
      detailEl.textContent = 'Vi åbner igen ' + DAGE[imorgen] + ' kl. ' + klokken(HOURS[imorgen][0]);
    }

    strip.hidden = false;
  }

  opdater();
  setInterval(opdater, 30000);
})();
