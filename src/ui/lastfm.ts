// Cloudflare Worker in worker/ that holds the Last.fm key and fixes the user.
const PROXY = import.meta.env.VITE_LASTFM_PROXY;

type Period = 'overall' | '7day' | '1month' | '3month' | '6month' | '12month';
const PERIOD: Period = '1month';
const PERIOD_LABEL: Record<Period, string> = {
    overall: 'all time',
    '7day': 'this week',
    '1month': 'this month',
    '3month': 'in the last 3 months',
    '6month': 'in the last 6 months',
    '12month': 'this year',
};

type SlotKind = 'artist' | 'track' | 'now';

interface LfmArtist {
    name: string;
    url: string;
}
interface LfmTopTrack {
    name: string;
    url: string;
    artist: { name: string };
    playcount: string;
}
interface LfmRecentTrack {
    name: string;
    url: string;
    artist: { '#text': string };
    '@attr'?: { nowplaying?: 'true' };
}

interface Api {
    'user.getTopArtists': {
        params: { period: Period; limit: number };
        response: { topartists: { artist: LfmArtist[] } };
    };
    'user.getTopTracks': {
        params: { period: Period; limit: number };
        response: { toptracks: { track: LfmTopTrack[] } };
    };
    'user.getRecentTracks': {
        params: { limit: number };
        response: { recenttracks: { track: LfmRecentTrack[] } };
    };
}
type Method = keyof Api;

async function call<M extends Method>(
    proxy: string,
    method: M,
    params: Api[M]['params'],
): Promise<Api[M]['response']> {
    const q = new URLSearchParams({ method });
    for (const [k, v] of Object.entries(params)) q.set(k, String(v));
    const res = await fetch(`${proxy}?${q}`);
    if (!res.ok) throw new Error(`last.fm ${res.status}`);
    return res.json() as Promise<Api[M]['response']>;
}

function link(text: string, href: string): HTMLAnchorElement {
    const a = document.createElement('a');
    a.textContent = text;
    a.href = href;
    a.target = '_blank';
    a.rel = 'noopener';
    return a;
}

export async function hydrateLastFm(root: HTMLElement | null): Promise<void> {
    if (!root) return;
    const slots = (kind: SlotKind) => [
        ...root.querySelectorAll<HTMLElement>(`[data-lfm="${kind}"]`),
    ];
    const artistEls = slots('artist');
    const trackEls = slots('track');
    const nowEl = slots('now').at(0);
    const filled = new Set<HTMLElement>();
    const prune = () =>
        root
            .querySelectorAll<HTMLElement>('[data-lfm]')
            .forEach((el) => filled.has(el) || el.remove());
    if (!PROXY) return prune();

    try {
        const [artists, tracks, recent] = await Promise.all([
            artistEls.length
                ? call(PROXY, 'user.getTopArtists', { period: PERIOD, limit: artistEls.length })
                : null,
            trackEls.length
                ? call(PROXY, 'user.getTopTracks', { period: PERIOD, limit: trackEls.length })
                : null,
            nowEl ? call(PROXY, 'user.getRecentTracks', { limit: 1 }) : null,
        ]);

        artists?.topartists.artist.slice(0, artistEls.length).forEach((a, i) => {
            artistEls[i].replaceChildren(link(a.name, a.url));
            filled.add(artistEls[i]);
        });
        tracks?.toptracks.track.slice(0, trackEls.length).forEach((t, i) => {
            const el = trackEls[i];
            el.replaceChildren(link(`♪ ${t.name}`, t.url));
            el.title = `${t.artist.name} · ${t.playcount} plays ${PERIOD_LABEL[PERIOD]}`;
            filled.add(el);
        });
        const last = recent?.recenttracks.track.at(0);
        if (last && nowEl) {
            const live = last['@attr']?.nowplaying === 'true';
            const strong = document.createElement('strong');
            strong.append(link(last.name, last.url));
            const span = document.createElement('span');
            span.textContent = `${live ? 'now playing · ' : 'last played · '}${last.artist['#text']}`;
            nowEl.replaceChildren(strong, span);
            filled.add(nowEl);
        }
    } catch (err) {
        console.warn(err);
    }
    prune();
}
