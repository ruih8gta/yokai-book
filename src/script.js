
document.addEventListener('DOMContentLoaded', () => {
    const yokaiListContainer = document.getElementById('yokai-list-container');

    // 表示する妖怪のデータ
    const yokaiData = [
        // 北海道・東北
        { name: 'コロポックル', image: 'img/koropokkuru.png', description: 'アイヌの伝承に登場する小人。' },
        { name: '赤舌', image: 'img/akashita.png', description: '津軽地方に伝わる妖怪。' },
        { name: '座敷童子', image: 'img/zashiki-warashi.png', description: '岩手県に伝わる、家に富をもたらすという子供の妖怪。' },
        { name: '提灯小僧', image: 'img/chochin-kozo.png', description: '提灯を持った子供の姿の妖怪。' },
        { name: 'なまはげ', image: 'img/namahage.png', description: '秋田県の民俗行事に登場する神の使い。' },
        { name: '雪女', image: 'img/yuki-onna.png', description: '雪の日に現れるとされる美しい女性の妖怪。' },
        { name: '朱の盆', image: 'img/shunobon.png', description: '福島県に伝わる顔の赤い妖怪。' },
        // 関東
        { name: 'イクチ', image: 'img/ikuchi.png', description: '茨城県の海に現れるという、うなぎのような長い妖怪。' },
        { name: '九尾の狐', image: 'img/kyubi-no-kitsune.png', description: '栃木県の那須野に現れたという、9本の尾を持つ狐の妖怪。' },
        { name: '天狗', image: 'img/tengu.png', description: '群馬県の山に住むという、神通力を持つ妖怪。' },
        { name: '夜道怪', image: 'img/yadokai.png', description: '埼玉県に伝わる、一つ目の巨人。' },
        { name: '二口女', image: 'img/futakuchi-onna.png', description: '千葉県に伝わる、後頭部に口を持つ女性の妖怪。' },
        { name: '一つ目小僧', image: 'img/hitotsume-kozo.png', description: '額に一つだけ目がある子供の姿の妖怪。' },
        { name: '舞首', image: 'img/maikubi.png', description: '神奈川県の海に現れるという、3つの首だけの妖怪。' },
        // 中部
        { name: '団三郎狸', image: '', description: '新潟県佐渡島の狸の総大将。' },
        { name: '人形神', image: '', description: '富山県に伝わる呪いの人形。' },
        { name: 'アマメハギ', image: '', description: '石川県の民俗行事に登場する鬼。' },
        { name: '八百比丘尼', image: '', description: '人魚の肉を食べて不老不死になったという尼。' },
        { name: '蟹坊主', image: '', description: '山梨県の寺に現れたという巨大な蟹の妖怪。' },
        { name: '山彦', image: '', description: '長野県の山に住む音の妖怪。' },
        { name: '両面宿儺', image: '', description: '岐阜県に伝わる2つの顔を持つ鬼神。' },
        { name: 'だいだらぼっち', image: '', description: '日本の各地に伝わる巨人。' },
        { name: 'おとら狐', image: '', description: '愛知県に伝わる化け狐。' },
        // 近畿
        { name: '鈴鹿御前', image: '', description: '三重県の鈴鹿山に住んでいたという天女。' },
        { name: '大百足', image: '', description: '滋賀県の三上山を7巻き半したという大百足。' },
        { name: '酒呑童子', image: '', description: '京都府の大江山に住んでいたという鬼の頭領。' },
        { name: 'ぬらりひょん', image: '', description: '妖怪の総大将といわれる。' },
        { name: '長壁姫', image: '', description: '兵庫県の姫路城に住むという妖怪。' },
        { name: '元興寺', image: '', description: '奈良県の元興寺に現れたという鬼。' },
        { name: '八咫烏', image: '', description: '日本神話に登場する3本足の烏。' },
        { name: 'ろくろ首', image: 'img/rokurokubi.png', description: '首が長く伸びる妖怪。' },
        { name: '河童', image: 'img/kappa.png', description: '川や沼に住むと言われる妖怪。' },
        // 中国
        { name: '七尋女', image: '', description: '鳥取県の海に現れるという巨大な女の妖怪。' },
        { name: '八岐大蛇', image: '', description: '島根県に伝わる8つの頭を持つ大蛇。' },
        { name: '温羅の鬼', image: '', description: '岡山県に伝わる鬼。桃太郎の鬼のモデルといわれる。' },
        { name: 'おさん姫', image: '', description: '広島県に伝わる狐の妖怪。' },
        { name: '耳なし芳一', image: '', description: '山口県に伝わる琵琶法師の怪談。' },
        // 四国
        { name: '夜行さん', image: '', description: '徳島県に伝わる鬼。' },
        { name: '手洗い鬼', image: '', description: '香川県に伝わる巨大な鬼。' },
        { name: '牛鬼', image: '', description: '愛媛県に伝わる牛と鬼の妖怪。' },
        { name: '七人ミサキ', image: '', description: '高知県に伝わる7人組の怨霊。' },
        // 九州・沖縄
        { name: '塗壁', image: '', description: '福岡県に伝わる壁の妖怪。' },
        { name: '化け猫', image: '', description: '佐賀県に伝わる化け猫騒動。' },
        { name: '磯撫で', image: '', description: '長崎県の海に現れるという鮫のような妖怪。' },
        { name: '磯女', image: '', description: '熊本県の海岸に現れるという女の妖怪。' },
        { name: '夜刀神', image: '', description: '大分県に伝わる蛇の神。' },
        { name: 'ひょうすべ', image: '', description: '宮崎県に伝わる河童に似た妖怪。' },
        { name: '一反木綿', image: '', description: '鹿児島県に伝わる白い布の妖怪。' },
        { name: 'キジムナー', image: '', description: '沖縄県に伝わる木の精霊。' }
    ];

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
});
