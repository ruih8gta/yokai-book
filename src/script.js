
document.addEventListener('DOMContentLoaded', () => {
    const yokaiListContainer = document.getElementById('yokai-list-container');

    // JSONファイルから妖怪データを取得して表示
    fetch('./yokai.json')
        .then(response => response.json())
        .then(yokaiData => {
            // 妖怪データを元にHTMLを生成して表示
            yokaiData.forEach(yokai => {
                const yokaiCard = document.createElement('div');
                yokaiCard.className = 'yokai-card';

                let imageHtml;
                if (yokai.image) {
                    imageHtml = `<img src="${yokai.image}" alt="${yokai.name}">`;
                } else {
                    imageHtml = `<div class="no-image">画像準備中</div>`;
                }

                yokaiCard.innerHTML = `
                    ${imageHtml}
                    <h3>${yokai.name}</h3>
                    <p>${yokai.description}</p>
                `;

                yokaiListContainer.appendChild(yokaiCard);
            });
        })
        .catch(error => {
            console.error('妖怪データの取得に失敗しました:', error);
            yokaiListContainer.innerHTML = '<p>妖怪リストを読み込めませんでした。</p>';
        });
});
