// ===== SENESTE OPSLAG FRA @baraekko =====
// Serverless-funktion på Vercel. Henter de nyeste opslag via
// "Instagram API with Instagram Login" og sender dem til forsiden i et
// lille, rent format. Selve access token ligger som miljøvariablen
// INSTAGRAM_ACCESS_TOKEN i Vercel og når aldrig ud til browseren.

const ANTAL = 3;
const FELTER = 'id,caption,media_type,media_url,thumbnail_url,permalink,timestamp';

module.exports = async function handler(req, res) {
  const token = process.env.INSTAGRAM_ACCESS_TOKEN;

  if (!token) {
    res.setHeader('Cache-Control', 'no-store');
    return res.status(503).json({ error: 'INSTAGRAM_ACCESS_TOKEN mangler i Vercel.' });
  }

  const url = new URL('https://graph.instagram.com/v23.0/me/media');
  url.searchParams.set('fields', FELTER);
  url.searchParams.set('limit', '12');
  url.searchParams.set('access_token', token);

  let data;
  try {
    const svar = await fetch(url, { signal: AbortSignal.timeout(8000) });
    data = await svar.json();
    if (!svar.ok || data.error) {
      throw new Error((data.error && data.error.message) || 'HTTP ' + svar.status);
    }
  } catch (fejl) {
    console.error('Instagram-kald fejlede:', fejl.message);
    res.setHeader('Cache-Control', 'public, s-maxage=300');
    return res.status(503).json({ error: 'Kunne ikke hente opslag fra Instagram.' });
  }

  const posts = (data.data || [])
    .map(tilOpslag)
    .filter(Boolean)
    .slice(0, ANTAL);

  // Vercels CDN gemmer svaret i en halv time og serverer det gamle svar,
  // mens et nyt hentes i baggrunden. Instagram bliver altså kun spurgt
  // få gange i timen, uanset hvor mange der besøger siden.
  res.setHeader('Cache-Control', 'public, s-maxage=1800, stale-while-revalidate=86400');
  return res.status(200).json({ posts });
};

// Oversætter Instagrams format til det, forsiden skal bruge.
function tilOpslag(m) {
  const billede = m.media_type === 'VIDEO' ? m.thumbnail_url : m.media_url;
  if (!billede) return null;

  return {
    id: m.id,
    permalink: m.permalink,
    image: billede,
    type: m.media_type,
    caption: rensTekst(m.caption),
    timestamp: m.timestamp
  };
}

// Fjerner hashtags og tomme linjer, så der kun står den egentlige tekst tilbage.
function rensTekst(tekst) {
  if (!tekst) return '';
  return tekst
    .split('\n')
    .map(l => l.replace(/#[\p{L}\p{N}_]+/gu, '').replace(/\s+/g, ' ').trim())
    .filter(l => l.length > 0)
    .join(' ')
    .trim();
}
