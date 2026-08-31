const SITE_TIMEZONE = 'America/New_York';

function localParts(date) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: SITE_TIMEZONE,
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
    weekday: 'short'
  }).formatToParts(date);
  return Object.fromEntries(parts.filter(p => p.type !== 'literal').map(p => [p.type, p.value]));
}

function hash(text) {
  let n = 2166136261;
  for (let i = 0; i < text.length; i++) {
    n ^= text.charCodeAt(i);
    n = Math.imul(n, 16777619);
  }
  return n >>> 0;
}

export default function handler(request, response) {
  const now = new Date();
  const p = localParts(now);
  const hour = Number(p.hour);
  const dateKey = `${p.year}-${p.month}-${p.day}`;

  let phase = 'night';
  if (hour >= 5 && hour < 8) phase = 'dawn';
  else if (hour >= 8 && hour < 17) phase = 'day';
  else if (hour >= 17 && hour < 20) phase = 'dusk';
  else if (hour >= 0 && hour < 4) phase = 'deep-night';

  const tideNames = ['low', 'rising', 'high', 'falling'];
  const houseTide = tideNames[Math.floor((hour % 24) / 6)];
  const seed = hash(`${dateKey}:${hour}`);
  const rareWindow = seed % 19 === 0;
  const dailyNumber = hash(dateKey) % 10000;

  response.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');
  response.status(200).json({
    timezone: SITE_TIMEZONE,
    serverTime: now.toISOString(),
    local: {
      date: dateKey,
      weekday: p.weekday,
      hour,
      minute: Number(p.minute)
    },
    phase,
    houseTide,
    rareWindow,
    dailyNumber,
    note: 'houseTide is an aesthetic site state, not real-world tide data'
  });
}
