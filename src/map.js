document.addEventListener('DOMContentLoaded', () => {
    const mapContainer = document.getElementById('map-container');
    const cardContainer = document.getElementById('yokai-card-container');
    let yokaiData = {};

    // 妖怪データ取得（prefecture_id をキーに）
    fetch('yokai.json')
        .then(res => res.json())
        .then(data => {
            data.forEach(y => { yokaiData[y.prefecture_id] = y; });
        })
        .catch(err => console.error('妖怪データの取得に失敗しました:', err));

    // SVG地図を読み込み
    fetch('map-full.svg')
        .then(res => res.text())
        .then(svg => {
            mapContainer.innerHTML = svg;
            addPrefectureListeners();
        })
        .catch(err => {
            console.error('地図データの読み込みに失敗しました:', err);
            mapContainer.innerHTML = '<p>地図を読み込めませんでした。</p>';
        });

    function addPrefectureListeners() {
        const prefectures = document.querySelectorAll('#map-container .prefecture');
        prefectures.forEach(pref => {
            pref.addEventListener('click', () => {
                // 選択ハイライト
                prefectures.forEach(p => p.classList.remove('selected'));
                pref.classList.add('selected');

                // どの prefecture_id か判定
                let key = '';
                for (const id in yokaiData) {
                    if (pref.classList.contains(id) || pref.id === id) { key = id; break; }
                }
                showCard(yokaiData[key]);
            });
        });
    }

    function showCard(yokai) {
        if (yokai) {
            const media = yokai.image
                ? `<div class="map-card-media"><img src="${yokai.image}" alt="${yokai.name}"></div>`
                : `<div class="map-card-noimg">画像準備中</div>`;
            cardContainer.innerHTML = `
                ${media}
                <div class="map-card-body">
                    <span class="map-card-region">${yokai.region}</span>
                    <h3 class="map-card-name">${yokai.name}</h3>
                    <div class="map-card-rule"></div>
                    <p class="map-card-desc">${yokai.description}</p>
                </div>
            `;
        } else {
            cardContainer.innerHTML = `<p class="map-card-empty">この地に伝わる妖怪は、まだ記録されていない。</p>`;
        }
        cardContainer.classList.remove('hidden');
        // 再アニメーション
        cardContainer.classList.remove('show');
        requestAnimationFrame(() => requestAnimationFrame(() => cardContainer.classList.add('show')));
    }
});
