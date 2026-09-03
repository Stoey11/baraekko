// ===== ÅBEN/LUKKET-STATUS + NEDTÆLLING TIL ÅBNINGSDAGEN =====
(function () {
  const strip = document.getElementById('statusStrip');
  if (!strip) return;

  const stateEl = document.getElementById('statusState');
  const detailEl = document.getElementById('statusDetail');

  // Åbningsdagen: fredag den 21. august 2026, kl. 11
  const OPENING = { year: 2026, month: 7, day: 21, hour: 11 };

  // Almindelige åbningstider pr. ugedag (0 = søndag). [åbner, lukker] i hele timer.
  // Lukketider over 24 betyder efter midnat, fx 26 = 02:00 natten efter.
  // null betyder lukket.
  const HOURS = {
    0: [10, 22],
    1: [10, 22],
    2: [10, 22],
    3: [10, 22],
    4: [10, 22],
    5: [10, 24],
    6: [10, 24]
  };

  // Undtagelser på bestemte datoer, fx åbningsweekenden
  const SAERLIGE = {
    '2026-08-21': [11, 26],
    '2026-08-22': [11, 26],
    '2026-08-23': null,
    // Aarhus Festuge: åbent til kl. 02 til og med lørdag den 5. september
    '2026-09-03': [10, 26],
    '2026-09-04': [10, 26],
    '2026-09-05': [10, 26]
  };

  const DAGE = ['søndag', 'mandag', 'tirsdag', 'onsdag', 'torsdag', 'fredag', 'lørdag'];

  // Dansk tid, uanset hvor gæsten sidder
  function nu() {
    return new Date(new Date().toLocaleString('en-US', { timeZone: 'Europe/Copenhagen' }));
  }

  function datonoegle(d) {
    return d.getFullYear() + '-' +
      String(d.getMonth() + 1).padStart(2, '0') + '-' +
      String(d.getDate()).padStart(2, '0');
  }

  function tiderFor(d) {
    const noegle = datonoegle(d);
    if (Object.prototype.hasOwnProperty.call(SAERLIGE, noegle)) return SAERLIGE[noegle];
    return HOURS[d.getDay()];
  }

  function klokken(timer) {
    return String(timer % 24).padStart(2, '0') + ':00';
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

  // Første dag med åbent efter `d`
  function naesteAabne(d) {
    for (let i = 1; i <= 7; i++) {
      const kandidat = new Date(d.getFullYear(), d.getMonth(), d.getDate() + i);
      const tider = tiderFor(kandidat);
      if (tider) return { dato: kandidat, om: i, tider: tider };
    }
    return null;
  }

  function opdater() {
    const n = nu();
    const aabning = new Date(OPENING.year, OPENING.month, OPENING.day, OPENING.hour, 0, 0);

    // Før vi åbner for allerførste gang
    if (n < aabning) {
      strip.dataset.state = 'countdown';
      stateEl.textContent = 'Vi åbner om ' + nedtaelling(aabning - n);
      detailEl.textContent = 'Fredag den 21. august kl. 11';
      strip.hidden = false;
      return;
    }

    const minutter = n.getHours() * 60 + n.getMinutes();

    // Kører gårsdagens åbningstid stadig, fordi vi lukkede efter midnat?
    const igaar = new Date(n.getFullYear(), n.getMonth(), n.getDate() - 1);
    const tiderIgaar = tiderFor(igaar);
    if (tiderIgaar && tiderIgaar[1] > 24 && minutter < (tiderIgaar[1] - 24) * 60) {
      strip.dataset.state = 'open';
      stateEl.textContent = 'Åbent nu';
      detailEl.textContent = 'Vi lukker kl. ' + klokken(tiderIgaar[1]);
      strip.hidden = false;
      return;
    }

    const idag = tiderFor(n);

    if (idag && minutter >= idag[0] * 60 && minutter < Math.min(idag[1], 24) * 60) {
      strip.dataset.state = 'open';
      stateEl.textContent = 'Åbent nu';
      detailEl.textContent = 'Vi lukker kl. ' + klokken(idag[1]);
    } else if (idag && minutter < idag[0] * 60) {
      strip.dataset.state = 'closed';
      stateEl.textContent = 'Lukket lige nu';
      detailEl.textContent = 'Vi åbner kl. ' + klokken(idag[0]);
    } else {
      const naeste = naesteAabne(n);
      strip.dataset.state = 'closed';
      stateEl.textContent = 'Lukket lige nu';
      detailEl.textContent = naeste
        ? 'Vi åbner ' + (naeste.om === 1 ? 'i morgen' : DAGE[naeste.dato.getDay()]) + ' kl. ' + klokken(naeste.tider[0])
        : 'Se åbningstider';
    }

    strip.hidden = false;
  }

  opdater();
  setInterval(opdater, 30000);
})();
