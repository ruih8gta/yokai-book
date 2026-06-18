document.addEventListener('DOMContentLoaded', () => {
    const mapContainer = document.getElementById('kyoto-map-container');
    const detail = document.getElementById('kyoto-detail');
    const introEl = document.getElementById('kyoto-intro');
    const SVGNS = 'http://www.w3.org/2000/svg';
    let legends = [];

    // 地図SVGと伝承データを読み込み（現行の地図と同じくSVGをfetchして挿入）
    Promise.all([
        fetch('kyoto-map.svg').then(r => r.text()),
        fetch('kyoto.json').then(r => r.json())
    ]).then(([svgText, data]) => {
        mapContainer.innerHTML = svgText;
        introEl.textContent = data.intro || '';
        legends = data.legends || [];
        renderPins();
    }).catch(err => {
        console.error('京都マップの読み込みに失敗しました:', err);
        introEl.textContent = 'データを読み込めませんでした。';
    });

    function renderPins() {
        const pinLayer = document.getElementById('pin-layer');
        if (!pinLayer) return;
        legends.forEach((lg, i) => {
            const g = document.createElementNS(SVGNS, 'g');
            g.setAttribute('class', 'pin');
            g.setAttribute('transform', `translate(${lg.x}, ${lg.y})`);
            g.setAttribute('tabindex', '0');
            g.setAttribute('role', 'button');
            g.setAttribute('aria-label', `${lg.place}・${lg.name}`);
            g.style.setProperty('--d', `${i * 0.25}s`);

            g.innerHTML = `
                <circle class="pin-pulse" r="11"></circle>
                <path class="pin-body" d="M0,-22 C-9,-22 -14,-15 -14,-9 C-14,-2 0,12 0,12 C0,12 14,-2 14,-9 C14,-15 9,-22 0,-22 Z"/>
                <circle class="pin-dot" cy="-9" r="4.5"></circle>
                <g class="pin-tip"><text class="pin-label" x="0" y="30">${lg.label || lg.place}</text></g>
            `;

            const select = () => showLegend(lg, g);
            g.addEventListener('click', select);
            g.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); select(); }
            });
            pinLayer.appendChild(g);
        });
    }

    function showLegend(lg, gEl) {
        document.querySelectorAll('#pin-layer .pin').forEach(p => p.classList.remove('active'));
        if (gEl) gEl.classList.add('active');

        const media = lg.image
            ? `<div class="kd-media"><img src="${lg.image}" alt="${lg.name}" onerror="this.parentNode.classList.add('noimg');this.parentNode.innerHTML='画像準備中';"></div>`
            : `<div class="kd-media noimg">画像準備中</div>`;

        detail.innerHTML = `
            <article class="kd-card">
                ${media}
                <div class="kd-body">
                    <span class="kd-place">${lg.place}<span class="kd-place-yomi">${lg.place_yomi || ''}</span></span>
                    <h2 class="kd-name">${lg.name}<span class="kd-yomi">${lg.yomi || ''}</span></h2>
                    <div class="kd-rule"></div>
                    <p class="kd-summary">${lg.summary || ''}</p>
                    <p class="kd-story">${lg.story || ''}</p>
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
