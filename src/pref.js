document.addEventListener('DOMContentLoaded', () => {
    const SVGNS = 'http://www.w3.org/2000/svg';
    const mapContainer = document.getElementById('pref-map-container');
    const detail = document.getElementById('pref-detail');
    const introEl = document.getElementById('pref-intro');
    const brandEl = document.getElementById('pref-brand');

    const params = new URLSearchParams(location.search);
    const pid = (params.get('p') || '').toLowerCase();

    if (!pid) {
        introEl.textContent = '都道府県が指定されていません。妖怪マップから選んでください。';
        return;
    }

    const PAD = 46;
    const optional = (url) => fetch(url).then(r => r.ok ? r.json() : null).catch(() => null);

    Promise.all([
        fetch(`maps/${pid}.svg`).then(r => { if (!r.ok) throw new Error('map'); return r.text(); }),
        fetch('yokai.json').then(r => r.json()),
        optional('maps/_meta.json'),
        optional('pref_pins.json'),
        optional(`${pid}.json`)   // 県別の複数伝承データ（あれば）
    ]).then(([svgText, yokaiList, meta, pins, rich]) => {
        const m = (meta && meta[pid]) || {};
        const yokai = yokaiList.find(y => y.prefecture_id === pid);
        const prefName = (rich && rich.prefecture) || (m.name) || (yokai ? yokai.region : '') || '';

        brandEl.textContent = `${prefName} 妖怪伝承`;
        document.title = `${prefName} 妖怪伝承マップ — 百鬼夜行`;

        mapContainer.innerHTML = svgText;
        const pinLayer = document.getElementById('pin-layer');

        if (rich && Array.isArray(rich.legends) && rich.legends.length) {
            // 複数伝承モード
            introEl.textContent = rich.intro || `${prefName}に伝わる妖怪たち。地図の標(しるべ)を選べば、その物語が立ちのぼる。`;
            rich.legends.forEach((lg, i) => addPin(pinLayer, lg.x, lg.y, lg.label || lg.place, i, () => showLegend(lg)));
        } else if (yokai) {
            // 1体モード（出現地の緯度経度から配置）
            introEl.textContent = `${prefName}に伝わる妖怪。地図の標(しるべ)を選べば、その物語が立ちのぼる。`;
            const [x, y] = geoToSvg(pins && pins[pid], m);
            addPin(pinLayer, x, y, yokai.name, 0, () => showYokai(yokai, prefName));
        } else {
            introEl.textContent = `${prefName}の妖怪は、まだ記録されていない。`;
        }
    }).catch(err => {
        console.error('県マップの読み込みに失敗しました:', err);
        introEl.textContent = 'データを読み込めませんでした。ローカルサーバ経由で開いてください。';
    });

    function geoToSvg(pin, m) {
        if (pin && pin.bbox && pin.lat != null && pin.lon != null && m.w && m.h) {
            const [lo0, la0, lo1, la1] = pin.bbox;
            const x = PAD + (pin.lon - lo0) / (lo1 - lo0) * (m.w - 2 * PAD);
            const y = PAD + (la1 - pin.lat) / (la1 - la0) * (m.h - 2 * PAD);
            return [x, y];
        }
        return [m.cx != null ? m.cx : (m.w || 600) / 2, m.cy != null ? m.cy : (m.h || 600) / 2];
    }

    function addPin(pinLayer, x, y, label, i, onSelect) {
        if (!pinLayer) return;
        const g = document.createElementNS(SVGNS, 'g');
        g.setAttribute('class', 'pin');
        g.setAttribute('transform', `translate(${x}, ${y})`);
        g.setAttribute('tabindex', '0');
        g.setAttribute('role', 'button');
        g.setAttribute('aria-label', label);
        g.style.setProperty('--d', `${i * 0.25}s`);
        g.innerHTML = `
            <circle class="pin-pulse" r="11"></circle>
            <path class="pin-body" d="M0,-22 C-9,-22 -14,-15 -14,-9 C-14,-2 0,12 0,12 C0,12 14,-2 14,-9 C14,-15 9,-22 0,-22 Z"/>
            <circle class="pin-dot" cy="-9" r="4.5"></circle>
            <g class="pin-tip"><text class="pin-label" x="0" y="30">${label}</text></g>
        `;
        const select = () => {
            document.querySelectorAll('#pin-layer .pin').forEach(p => p.classList.remove('active'));
            g.classList.add('active');
            onSelect();
        };
        g.addEventListener('click', select);
        g.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); select(); }
        });
        pinLayer.appendChild(g);
    }

    function media(image, alt) {
        return image
            ? `<div class="kd-media"><img src="${image}" alt="${alt}" onerror="this.parentNode.classList.add('noimg');this.parentNode.innerHTML='画像準備中';"></div>`
            : `<div class="kd-media noimg">画像準備中</div>`;
    }

    function reveal(html) {
        detail.innerHTML = html;
        detail.classList.remove('show');
        requestAnimationFrame(() => requestAnimationFrame(() => detail.classList.add('show')));
        if (window.matchMedia('(max-width: 820px)').matches) {
            detail.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    function showLegend(lg) {
        reveal(`
            <article class="kd-card">
                ${media(lg.image, lg.name)}
                <div class="kd-body">
                    <span class="kd-place">${lg.place || ''}<span class="kd-place-yomi">${lg.place_yomi || ''}</span></span>
                    <h2 class="kd-name">${lg.name}<span class="kd-yomi">${lg.yomi || ''}</span></h2>
                    <div class="kd-rule"></div>
                    <p class="kd-summary">${lg.summary || ''}</p>
                    <p class="kd-story">${lg.story || ''}</p>
                </div>
            </article>
        `);
    }

    function showYokai(yokai, prefName) {
        reveal(`
            <article class="kd-card">
                ${media(yokai.image, yokai.name)}
                <div class="kd-body">
                    <span class="kd-place">${prefName}<span class="kd-place-yomi">${yokai.region || ''}</span></span>
                    <h2 class="kd-name">${yokai.name}</h2>
                    <div class="kd-rule"></div>
                    <p class="kd-story">${yokai.description || ''}</p>
                </div>
            </article>
        `);
    }
});
