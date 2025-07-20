
document.addEventListener('DOMContentLoaded', () => {
    const yokaiListContainer = document.getElementById('yokai-list-container');

    // 表示する妖怪のデータ
    const yokaiData = [
        {
            name: '河童',
            image: 'img/kappa.png',
            description: '川や沼に住むと言われる妖怪。頭の皿が乾くと力を失う。'
        },
        {
            name: 'ろくろ首',
            image: 'img/rokurokubi.png',
            description: '首が長く伸びる妖怪。昼間は普通の人間と変わらない姿をしていることが多い。'
        },
        {
            name: '一つ目小僧',
            image: 'img/hitotsume-kozo.png',
            description: '額に一つだけ目がある子供の姿の妖怪。人を驚かすのが好きだが、悪さはしない。'
        }
    ];

    // 妖怪データを元にHTMLを生成して表示
    yokaiData.forEach(yokai => {
        const yokaiCard = document.createElement('div');
        yokaiCard.className = 'yokai-card';

        yokaiCard.innerHTML = `
            <img src="${yokai.image}" alt="${yokai.name}">
            <h3>${yokai.name}</h3>
            <p>${yokai.description}</p>
        `;

        yokaiListContainer.appendChild(yokaiCard);
    });
});
