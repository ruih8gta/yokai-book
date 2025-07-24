document.addEventListener('DOMContentLoaded', () => {
    const mapContainer = document.getElementById('map-container');
    const yokaiCardContainer = document.getElementById('yokai-card-container');
    let yokaiData = {}; // 妖怪データを格納するオブジェクト

    // JSONファイルから妖怪データを取得
    fetch('yokai.json')
        .then(response => response.json())
        .then(data => {
            // 扱いやすいように、prefecture_idをキーにしたオブジェクトに変換
            data.forEach(yokai => {
                yokaiData[yokai.prefecture_id] = yokai;
            });
            console.log('妖怪データをAPIから取得しました。', yokaiData);
        })
        .catch(error => console.error('妖怪データの取得に失敗しました:', error));


    // SVG地図データを読み込んで表示
    fetch('map-full.svg')
        .then(response => response.text())
        .then(svgData => {
            mapContainer.innerHTML = svgData;
            console.log('SVGデータが挿入されました。');
            addEventListenersToPrefectures();
        })
        .catch(error => {
            console.error('地図データの読み込みに失敗しました:', error);
            mapContainer.innerHTML = '<p>地図を読み込めませんでした。</p>';
        });

    // 各都道府県にイベントリスナーを追加する関数
    function addEventListenersToPrefectures() {
        const prefectures = document.querySelectorAll('#map-container .prefecture');
        console.log('取得した都道府県の数:', prefectures.length);
        prefectures.forEach(prefecture => {
            const prefectureId = prefecture.id;
            console.log('都道府県ID:', prefectureId);

            prefecture.addEventListener('click', () => {
                let prefectureId = '';
                for (const key in yokaiData) {
                    if (prefecture.classList.contains(key)) {
                        prefectureId = key;
                        break;
                    }
                }

                console.log(prefectureId + 'がクリックされました。');
                if (yokaiData[prefectureId]) {
                    showYokaiName(yokaiData[prefectureId]);
                } else {
                    yokaiCardContainer.innerHTML = '<p>この都道府県には妖怪データがありません。</p>';
                    yokaiCardContainer.classList.remove('hidden');
                }
            });
        });
    }

    // 妖怪の名前を表示する関数
    function showYokaiName(yokai) {
        yokaiCardContainer.innerHTML = `
            <h3>${yokai.name}</h3>
        `;
        yokaiCardContainer.classList.remove('hidden');
    }
});
