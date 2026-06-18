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

    Promise.all([
        fetch(`maps/${pid}.svg`).then(r => { if (!r.ok) throw new Error('map'); return r.text(); }),
        fetch('yokai.json').then(r => r.json()),
        fetch('maps/_meta.json').then(r => r.json()),
        fetch('pref_pins.json').then(r => r.ok ? r.json() : {}).catch(() => ({}))
    ]).then(([svgText, yokaiList, meta, pins]) => {
        const m = meta[pid] || {};
        const pin = (pins && pins[pid]) || null;
        const yokai = yokaiList.find(y => y.prefecture_id === pid);

        // 出現地の緯度経度を地図座標へ変換（県の地理的範囲を viewBox に線形対応）
        const PAD = 46;
        function geoToSvg() {
            if (pin && pin.bbox && pin.lat != null && pin.lon != null && m.w && m.h) {
                const [lo0, la0, lo1, la1] = pin.bbox;
                const x = PAD + (pin.lon - lo0) / (lo1 - lo0) * (m.w - 2 * PAD);
                const y = PAD + (la1 - pin.lat) / (la1 - la0) * (m.h - 2 * PAD);
                return [x, y];
            }
            return [m.cx != null ? m.cx : (m.w || 600) / 2, m.cy != null ? m.cy : (m.h || 600) / 2];
        }
        const prefName = m.name || (yokai ? yokai.region : '') || '';

        brandEl.textContent = `${prefName} 妖怪伝承`;
        document.title = `${prefName} 妖怪伝承マップ — 百鬼夜行`;
        introEl.textContent = yokai
            ? `${prefName}に伝わる妖怪。地図の標(しるべ)を選べば、その物語が立ちのぼる。`
            : `${prefName}の妖怪は、まだ記録されていない。`;

        mapContainer.innerHTML = svgText;
        const pinLayer = document.getElementById('pin-layer');

        if (yokai && pinLayer) {
            const [x, y] = geoToSvg();
            const g = document.createElementNS(SVGNS, 'g');
            g.setAttribute('class', 'pin');
            g.setAttribute('transform', `translate(${x}, ${y})`);
            g.setAttribute('tabindex', '0');
            g.setAttribute('role', 'button');
            g.setAttribute('aria-label', yokai.name);
            g.innerHTML = `
                <circle class="pin-pulse" r="11"></circle>
                <path class="pin-body" d="M0,-22 C-9,-22 -14,-15 -14,-9 C-14,-2 0,12 0,12 C0,12 14,-2 14,-9 C14,-15 9,-22 0,-22 Z"/>
                <circle class="pin-dot" cy="-9" r="4.5"></circle>
                <g class="pin-tip"><text class="pin-label" x="0" y="30">${yokai.name}</text></g>
            `;
            const select = () => showYokai(yokai, prefName, g);
            g.addEventListener('click', select);
            g.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); select(); }
            });
            pinLayer.appendChild(g);
        }
    }).catch(err => {
        console.error('県マップの読み込みに失敗しました:', err);
        introEl.textContent = 'データを読み込めませんでした。ローカルサーバ経由で開いてください。';
    });

    function showYokai(yokai, prefName, gEl) {
        document.querySelectorAll('#pin-layer .pin').forEach(p => p.classList.remove('active'));
        if (gEl) gEl.classList.add('active');

        const media = yokai.image
            ? `<div class="kd-media"><img src="${yokai.image}" alt="${yokai.name}" onerror="this.parentNode.classList.add('noimg');this.parentNode.innerHTML='画像準備中';"></div>`
            : `<div class="kd-media noimg">画像準備中</div>`;

        detail.innerHTML = `
            <article class="kd-card">
                ${media}
                <div class="kd-body">
                    <span class="kd-place">${prefName}<span class="kd-place-yomi">${yokai.region || ''}</span></span>
                    <h2 class="kd-name">${yokai.name}</h2>
                    <div class="kd-rule"></div>
                    <p class="kd-story">${yokai.description || ''}</p>
                </div>
            </article>
        `;
        detail.classList.remove('show');
        requestAnimationFrame(() => requestAnimationFrame(() => detail.classList.add('show')));

        if (window.matchMedia('(max-width: 820px)').matches) {
            detail.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }
});
