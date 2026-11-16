import { isEffectKey } from '../effects';
import type { Stage } from '../core/App';
import { MAX_NODES } from '../core/ShaderEffect';
import { autoLayout } from './layout';

export function hydratePage(nav: HTMLElement, content: HTMLElement): Stage[] {
    const stages: Stage[] = [];
    const panels = [...content.querySelectorAll<HTMLElement>('.panel')];
    const menu = nav.querySelector('nav')!;

    for (const el of panels) {
        if (el.id) {
            const a = document.createElement('a');
            a.href = `#${el.id}`;
            a.textContent =
                el.dataset.nav ?? el.querySelector('.kicker')?.textContent?.trim() ?? el.id;
            menu.append(a);
        }

        el.querySelectorAll<HTMLElement>('.nodes').forEach(autoLayout);
        const count = el.querySelectorAll('.node').length;
        if (count > MAX_NODES)
            console.warn(`#${el.id}: ${count} nodes, shader only reads the first ${MAX_NODES}`);

        const key = el.dataset.fx;
        if (key === undefined) continue;
        if (!isEffectKey(key)) {
            console.warn(`#${el.id}: unknown effect "${key}"`);
            continue;
        }
        stages.push({ el, effect: key });
    }

    nav.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((a) =>
        a.addEventListener('click', (e) => {
            e.preventDefault();
            const el = content.querySelector<HTMLElement>(a.hash);
            if (el) scrollTo({ top: el.offsetTop, behavior: 'smooth' });
        }),
    );

    const io = new IntersectionObserver(
        (entries) => {
            for (const en of entries)
                if (en.isIntersecting)
                    menu.querySelectorAll<HTMLElement>('a').forEach((a) => {
                        const on = a.getAttribute('href') === `#${en.target.id}`;
                        a.classList.toggle('on', on);

                        if (on && menu.scrollWidth > menu.clientWidth)
                            menu.scrollTo({
                                left: a.offsetLeft - (menu.clientWidth - a.offsetWidth) / 2,
                                behavior: 'smooth',
                            });
                    });
        },
        { rootMargin: '-50% 0px -50% 0px' },
    );
    panels.forEach((p) => io.observe(p));

    return stages;
}
