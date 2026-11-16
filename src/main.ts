import './style.css';
import { App } from './core/App';
import { hydratePage } from './ui/page';
import { hydrateLastFm } from './ui/lastfm';

function byId<T extends HTMLElement = HTMLElement>(id: string): T {
    const el = document.getElementById(id);
    if (!el) throw new Error(`#${id} missing from index.html`);
    return el as T;
}

const content = byId('content');
const stages = hydratePage(byId('nav'), content);
new App(byId<HTMLCanvasElement>('gl'), content, byId('spacer'), stages);
void hydrateLastFm(document.getElementById('lastfm'));
