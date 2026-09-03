// ===== FORNY INSTAGRAM-TOKEN =====
// Et langtidsholdbart Instagram-token udløber efter 60 dage, medmindre det
// fornys. Vercel kalder denne funktion automatisk hver uge (se "crons" i
// vercel.json). Fornyelsen forlænger tokenet med 60 dage fra i dag.
//
// Beskyttet med CRON_SECRET, så kun Vercels cron kan kalde den.

module.exports = async function handler(req, res) {
  const hemmelighed = process.env.CRON_SECRET;
  if (hemmelighed && req.headers.authorization !== 'Bearer ' + hemmelighed) {
    return res.status(401).json({ error: 'Ingen adgang.' });
  }

  const token = process.env.INSTAGRAM_ACCESS_TOKEN;
  if (!token) {
    return res.status(503).json({ error: 'INSTAGRAM_ACCESS_TOKEN mangler i Vercel.' });
  }

  const url = new URL('https://graph.instagram.com/refresh_access_token');
  url.searchParams.set('grant_type', 'ig_refresh_token');
  url.searchParams.set('access_token', token);

  let data;
  try {
    const svar = await fetch(url, { signal: AbortSignal.timeout(8000) });
    data = await svar.json();
    if (!svar.ok || data.error) {
      throw new Error((data.error && data.error.message) || 'HTTP ' + svar.status);
    }
  } catch (fejl) {
    console.error('Fornyelse af Instagram-token fejlede:', fejl.message);
    return res.status(502).json({ error: 'Fornyelse fejlede: ' + fejl.message });
  }

  const dage = Math.round((data.expires_in || 0) / 86400);
  const nytToken = data.access_token && data.access_token !== token;

  // Normalt får man samme token tilbage med ny udløbsdato. Skulle Instagram
  // en dag sende et helt nyt token, skal det sættes ind i Vercel manuelt,
  // og så står det tydeligt i loggen.
  if (nytToken) {
    console.warn('Instagram sendte et NYT token. Opdater INSTAGRAM_ACCESS_TOKEN i Vercel.');
  }
  console.log('Instagram-token fornyet. Gyldigt i ' + dage + ' dage.');

  res.setHeader('Cache-Control', 'no-store');
  return res.status(200).json({ ok: true, gyldigIDage: dage, nytToken });
};
