// ===== KLIPPEKORT · ÆKKO REGULARS =====
// Bruges på forsiden og i kaffe-afsnittet på menukortet.

(function () {
  // Linket fra Regulars — præcis det samme som QR-koden på plakaten peger på.
  // Så længe der ikke står en rigtig https-adresse her, bliver klippekortet
  // pillet af begge sider, så der aldrig står en knap der ikke virker.
  var REGULARS_URL = 'https://cards.getregulars.com/c/6a9147be0c998619b04c5492';

  var blokke = document.querySelectorAll('[data-klippekort]');
  if (!blokke.length) return;

  var gyldigt = /^https:\/\/[^\s]+$/.test(REGULARS_URL);

  Array.prototype.forEach.call(blokke, function (blok) {
    if (!gyldigt) {
      blok.parentNode.removeChild(blok);
      return;
    }

    Array.prototype.forEach.call(blok.querySelectorAll('[data-regulars-link]'), function (link) {
      link.href = REGULARS_URL;
      link.target = '_blank';
      link.rel = 'noopener';
    });

    // QR-koden er kun til computerbrugere, og filen mangler måske endnu
    var qr = blok.querySelector('.loyalty__qr');
    var billede = qr && qr.querySelector('img');
    if (billede) {
      billede.addEventListener('error', function () {
        qr.style.display = 'none';
      });
      if (billede.complete && billede.naturalWidth === 0) {
        qr.style.display = 'none';
      }
    }

    blok.hidden = false;
  });
})();
