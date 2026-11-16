const USER = 'FieFiFoFum';
const UPSTREAM = 'https://ws.audioscrobbler.com/2.0/';
const TTL = 60; // seconds
const ORIGINS = new Set([
    'https://fiefifofum.dev',
    'https://www.fiefifofum.dev',
    'http://localhost:5173',
    'http://localhost:5174',
]);
const PERIODS = new Set(['overall', '7day', '1month', '3month', '6month', '12month']);
const METHODS = new Set(['user.getTopArtists', 'user.getTopTracks', 'user.getRecentTracks']);

const memo = new Map();

export default {
    async fetch(request, env) {
        const origin = request.headers.get('Origin');
        const cors = {
            'Access-Control-Allow-Origin': ORIGINS.has(origin) ? origin : 'https://fiefifofum.dev',
            Vary: 'Origin',
        };
        const reply = (body, status = 200, extra = {}) =>
            new Response(body, { status, headers: { ...cors, ...extra } });
        const json = (body, status) =>
            reply(body, status, {
                'Content-Type': 'application/json',
                'Cache-Control': status === 200 ? `public, max-age=${TTL}` : 'no-store',
            });

        if (request.method === 'OPTIONS') return reply(null, 204);
        if (request.method !== 'GET') return reply('method not allowed', 405);
        if (origin && !ORIGINS.has(origin)) return reply('forbidden', 403);
        if (!env.LASTFM_KEY) return reply('LASTFM_KEY not configured', 500);

        const params = new URL(request.url).searchParams;
        const method = params.get('method');
        if (!METHODS.has(method)) return reply('bad method', 400);

        const q = new URLSearchParams({
            method,
            user: USER,
            api_key: env.LASTFM_KEY,
            format: 'json',
            limit: String(Math.min(Math.max(Number(params.get('limit')) || 1, 1), 50)),
        });
        const period = params.get('period');
        if (period && PERIODS.has(period)) q.set('period', period);
        const url = `${UPSTREAM}?${q}`;

        const hit = memo.get(url);
        if (hit && hit.expires > Date.now()) return json(hit.body, hit.status);

        try {
            const upstream = await fetch(url, {
                cf: { cacheEverything: true, cacheTtlByStatus: { '200-299': TTL, '400-599': 0 } },
            });
            const body = await upstream.text();
            if (upstream.ok) {
                memo.set(url, { expires: Date.now() + TTL * 1000, status: 200, body });
            }
            return json(body, upstream.ok ? 200 : upstream.status);
        } catch {
            return json('{"error":"upstream unreachable"}', 502);
        }
    },
};
