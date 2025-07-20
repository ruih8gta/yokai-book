document.addEventListener('DOMContentLoaded', () => {
    const mapContainer = document.getElementById('map-container');
    const yokaiCardContainer = document.getElementById('yokai-card-container');

    // 妖怪のデータ
    const yokaiData = {
        'saga': {
            name: '河童',
            image: 'img/kappa.png',
            description: '川や沼に住むと言われる妖怪。頭の皿が乾くと力を失う。'
        },
        'aichi': {
            name: 'ろくろ首',
            image: 'img/rokurokubi.png',
            description: '首が長く伸びる妖怪。昼間は普通の人間と変わらない姿をしていることが多い。'
        },
        'kyoto': {
            name: '一つ目小僧',
            image: 'img/hitotsume-kozo.png',
            description: '額に一つだけ目がある子供の姿の妖怪。人を驚かすのが好きだが、悪さはしない。'
        }
    };

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
