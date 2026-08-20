// ===== INDHOLD MED UDLØBSDATO =====
// data-until="2026-08-24T06:00"  skjules, når tidspunktet er passeret
// data-from="2026-08-24T06:00"   vises først, når tidspunktet er nået
// Tidspunkterne læses som dansk tid.
(function () {
  const udloeber = document.querySelectorAll('[data-until]');
  const starter = document.querySelectorAll('[data-from]');
  if (!udloeber.length && !starter.length) return;

  function nu() {
    return new Date(new Date().toLocaleString('en-US', { timeZone: 'Europe/Copenhagen' }));
  }

  function laes(tekst) {
    const m = String(tekst).match(/^(\d{4})-(\d{2})-(\d{2})(?:T(\d{2}):(\d{2}))?$/);
    if (!m) return null;
    return new Date(+m[1], +m[2] - 1, +m[3], m[4] ? +m[4] : 0, m[5] ? +m[5] : 0);
  }

  function opdater() {
    const n = nu();

    udloeber.forEach(function (el) {
      const tid = laes(el.dataset.until);
      if (tid) el.hidden = n >= tid;
    });

    starter.forEach(function (el) {
      const tid = laes(el.dataset.from);
      if (tid) el.hidden = n < tid;
    });
  }

  opdater();
  setInterval(opdater, 60000);
})();
