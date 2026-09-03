// ===== SENESTE OPSLAG FRA INSTAGRAM =====
// Henter de tre nyeste opslag fra /api/instagram og lægger dem ind i de tre
// kort på forsiden. Kortene i HTML'en er faste eksempler, som bliver stående,
// hvis kaldet fejler, så siden aldrig står tom.
(function () {
  const kort = document.querySelectorAll('.social__grid .social-card');
  if (!kort.length) return;

  const MAANEDER = ['jan.', 'feb.', 'mar.', 'apr.', 'maj', 'jun.', 'jul.', 'aug.', 'sep.', 'okt.', 'nov.', 'dec.'];

  fetch('/api/instagram')
    .then(svar => (svar.ok ? svar.json() : Promise.reject(new Error('HTTP ' + svar.status))))
    .then(data => {
      const posts = (data && data.posts) || [];
      posts.slice(0, kort.length).forEach((post, i) => udfyld(kort[i], post, i === 0));
    })
    .catch(fejl => {
      console.warn('Kunne ikke hente Instagram-opslag:', fejl.message);
    });

  function udfyld(el, post, erSeneste) {
    const img = el.querySelector('img');
    const tekst = el.querySelector('.social-card__text');
    const meta = el.querySelector('.social-card__meta');

    el.href = post.permalink;

    if (img) {
      // Bytter først billedet, når det nye er hentet, så kortet ikke blinker.
      const nyt = new Image();
      nyt.onload = () => {
        img.src = post.image;
        img.alt = post.caption ? forkort(post.caption, 120) : 'Opslag fra @baraekko på Instagram';
      };
      nyt.src = post.image;
    }

    if (tekst) {
      tekst.textContent = post.caption ? forkort(post.caption, 110) : 'Se opslaget på Instagram.';
    }

    if (meta) {
      meta.textContent = erSeneste ? 'Seneste opslag' : dato(post.timestamp);
    }
  }

  function forkort(s, max) {
    if (s.length <= max) return s;
    const klip = s.slice(0, max);
    const sidsteMellemrum = klip.lastIndexOf(' ');
    return (sidsteMellemrum > max * 0.6 ? klip.slice(0, sidsteMellemrum) : klip).replace(/[,.:;!?-]+$/, '') + '…';
  }

  function dato(iso) {
    if (!iso) return 'Opslag';
    const d = new Date(iso);
    if (isNaN(d)) return 'Opslag';
    const dansk = new Date(d.toLocaleString('en-US', { timeZone: 'Europe/Copenhagen' }));
    return dansk.getDate() + '. ' + MAANEDER[dansk.getMonth()];
  }
})();
