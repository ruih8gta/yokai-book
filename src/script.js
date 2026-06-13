document.addEventListener('DOMContentLoaded', () => {
    const listContainer = document.getElementById('yokai-list-container');
    const regionFilters = document.getElementById('region-filters');
    const searchInput = document.getElementById('search-input');
    const resultCount = document.getElementById('result-count');
    const emptyState = document.getElementById('empty-state');
    const modalOverlay = document.getElementById('modal-overlay');
    const modalBody = document.getElementById('modal-body');
    const modalClose = document.getElementById('modal-close');

    let allYokai = [];
    let currentRegion = 'all';
    let currentKeyword = '';

    // スクロール時の時差フェードイン
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                entry.target.style.transitionDelay = `${(entry.target.dataset.delay || 0)}ms`;
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    fetch('./yokai.json')
        .then(res => res.json())
        .then(data => {
            allYokai = data;
            buildRegionFilters(data);
            render();
        })
        .catch(err => {
            console.error('妖怪データの取得に失敗しました:', err);
            listContainer.innerHTML = '<p>妖怪リストを読み込めませんでした。ローカルサーバー経由で開いてください。</p>';
        });

    // 地方フィルターボタンを生成
    function buildRegionFilters(data) {
        const regions = [...new Set(data.map(y => y.region))];
        const buttons = ['all', ...regions];
        regionFilters.innerHTML = buttons.map(r => {
            const label = r === 'all' ? 'すべて' : r;
            const active = r === 'all' ? ' active' : '';
            return `<button class="region-btn${active}" data-region="${r}">${label}</button>`;
        }).join('');

        regionFilters.querySelectorAll('.region-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                regionFilters.querySelectorAll('.region-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                currentRegion = btn.dataset.region;
                render();
            });
        });
    }

    // 検索
    searchInput.addEventListener('input', () => {
        currentKeyword = searchInput.value.trim().toLowerCase();
        render();
    });

    // フィルタ＆描画
    function render() {
        const filtered = allYokai.filter(y => {
            const matchRegion = currentRegion === 'all' || y.region === currentRegion;
            const matchKeyword = !currentKeyword ||
                y.name.toLowerCase().includes(currentKeyword) ||
                y.description.toLowerCase().includes(currentKeyword);
            return matchRegion && matchKeyword;
        });

        listContainer.innerHTML = '';
        emptyState.classList.toggle('hidden', filtered.length !== 0);
        resultCount.textContent = `全 ${allYokai.length} 体中 ${filtered.length} 体を表示`;

        filtered.forEach((yokai, i) => {
            const card = document.createElement('div');
            card.className = 'yokai-card';
            card.dataset.delay = Math.min(i, 8) * 60;

            const media = yokai.image
                ? `<div class="card-media"><img src="${yokai.image}" alt="${yokai.name}" loading="lazy"></div>`
                : `<div class="no-image">画像準備中</div>`;

            card.innerHTML = `
                ${media}
                <div class="card-body">
                    <span class="card-region">${yokai.region}</span>
                    <h3 class="card-name">${yokai.name}</h3>
                    <div class="card-rule"></div>
                    <p class="card-desc">${yokai.description}</p>
                </div>
            `;
            card.addEventListener('click', () => openModal(yokai));
            listContainer.appendChild(card);
            observer.observe(card);
        });
    }

    // モーダル
    function openModal(yokai) {
        const media = yokai.image
            ? `<div class="modal-media"><img src="${yokai.image}" alt="${yokai.name}"></div>`
            : `<div class="modal-media no-image">画像準備中</div>`;
        modalBody.innerHTML = `
            ${media}
            <div class="modal-text">
                <span class="modal-region">${yokai.region}</span>
                <h2 class="modal-name">${yokai.name}</h2>
                <div class="modal-rule"></div>
                <p class="modal-desc">${yokai.description}</p>
            </div>
        `;
        modalOverlay.classList.remove('hidden');
        requestAnimationFrame(() => modalOverlay.classList.add('show'));
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        modalOverlay.classList.remove('show');
        document.body.style.overflow = '';
        setTimeout(() => modalOverlay.classList.add('hidden'), 300);
    }

    modalClose.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) closeModal();
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !modalOverlay.classList.contains('hidden')) closeModal();
    });

    // 人魂を漂わせる
    spawnHitodama();
    function spawnHitodama() {
        const layer = document.getElementById('hitodama-layer');
        if (!layer) return;
        const COUNT = 7;
        for (let i = 0; i < COUNT; i++) {
            const h = document.createElement('div');
            h.className = 'hitodama';
            h.style.left = `${Math.random() * 100}%`;
            h.style.bottom = `-20px`;
            const dur = 14 + Math.random() * 14;
            const delay = Math.random() * 16;
            h.style.animationDuration = `${dur}s`;
            h.style.animationDelay = `${delay}s`;
            const scale = 0.6 + Math.random() * 0.9;
            h.style.transform = `scale(${scale})`;
            layer.appendChild(h);
        }
    }
});
