(function () {
  var PASSWORD = 'baraekko.dk!!!';
  var STORAGE_KEY = 'baraekko_access';

  function init() {
    var form = document.getElementById('gate-form');
    var input = document.getElementById('gate-password');
    var error = document.getElementById('gate-error');
    if (!form || !input) return;

    input.focus();

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (input.value === PASSWORD) {
        try { localStorage.setItem(STORAGE_KEY, 'granted'); } catch (_) {}
        document.documentElement.classList.add('access-granted');
        error.textContent = '';
      } else {
        error.textContent = 'Forkert kode. Prøv igen.';
        input.value = '';
        input.focus();
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
