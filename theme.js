// 테마 변경 관련 코드는 전부 이 파일에 모아둔다. (채팅 기능은 client.js)
(() => {

const chatInput = document.querySelector('#chat-input');

/** 테마별 스타일시트와 문구. 새 테마는 여기에 추가하면 된다. */
const THEMES = {
    princess: {
        label: '👑 공주',
        css: 'theme-princess.css',
        title: '💖 프린세스 웹챗 💖',
        heading: '✨ 프린세스 시크릿 채팅방 ✨',
        placeholder: '두근두근, 마음을 전해보세요 💌',
        sparkles: true,
    },
    modern: {
        label: '🌿 모던',
        css: 'theme-modern.css',
        title: '웹챗',
        heading: '채팅',
        placeholder: '메시지를 입력하세요',
        sparkles: false,
    },
    sexy: {
        label: '🔥 섹시',
        css: 'theme-sexy.css',
        title: '🔥 Midnight Chat 🔥',
        heading: '💋 Midnight Lounge 💋',
        placeholder: '속삭여 보세요… 🍷',
        sparkles: false,
    },
    alpha: {
        label: '◆ 알파',
        css: 'theme-alpha.css',
        title: 'Alpha',
        heading: 'ALPHA',
        placeholder: '메시지를 입력하세요',
        sparkles: false,
    },
    terminal: { label: '💻 터미널', css: 'theme-terminal.css', title: 'terminal', heading: 'secret_chat', placeholder: '명령을 입력하세요', sparkles: false },
    neon: { label: '🌃 네온', css: 'theme-neon.css', title: 'NEON', heading: 'NEON CITY', placeholder: '신호를 보내세요', sparkles: false },
    retro: { label: '🖥️ 레트로 98', css: 'theme-retro.css', title: '메신저', heading: '채팅 - 메신저', placeholder: '메시지를 입력하세요', sparkles: false },
    minimal: { label: '⬜ 미니멀', css: 'theme-minimal.css', title: 'chat', heading: 'chat', placeholder: '메시지', sparkles: false },
    pastel: { label: '☁️ 파스텔', css: 'theme-pastel.css', title: '구름 채팅', heading: '구름 수다방', placeholder: '말랑말랑하게 한마디', sparkles: false },
    forest: { label: '🌲 숲', css: 'theme-forest.css', title: '숲속 대화', heading: '숲속 이야기', placeholder: '이야기를 들려주세요', sparkles: false },
    ocean: { label: '🌊 바다', css: 'theme-ocean.css', title: '오션 채팅', heading: '깊은 바다', placeholder: '파도에 말을 실어요', sparkles: false },
    kakao: { label: '💛 카톡풍', css: 'theme-kakao.css', title: '채팅', heading: '채팅방', placeholder: '메시지 입력', sparkles: false },
    paper: { label: '✉️ 편지', css: 'theme-paper.css', title: '쪽지', heading: '쪽지 한 장', placeholder: '마음을 적어보세요', sparkles: false },
    space: { label: '🚀 우주', css: 'theme-space.css', title: 'Space Chat', heading: 'DEEP SPACE', placeholder: '우주로 메시지 발사', sparkles: false },
};

//---------------반짝이 장식(공주 테마)-----------------
const SPARKLE_COUNT = 24;
const SPARKLE_ICONS = ['💗', '💖', '⭐', '✨', '🎀', '💕', '👑'];

function rand(min, max) {
    return Math.random() * (max - min) + min;
}

function createSparkle() {
    const deco = document.createElement('span');
    deco.className = 'sparkle-deco';
    deco.textContent = SPARKLE_ICONS[Math.floor(rand(0, SPARKLE_ICONS.length))];

    const size = rand(0.9, 1.9);
    const left = rand(0, 100);
    const duration = rand(9, 18);
    const swayDuration = rand(3, 6);
    const delay = rand(-duration, 0);

    deco.style.left = `${left}%`;
    deco.style.top = '110%';
    deco.style.fontSize = `${size}rem`;
    deco.style.opacity = rand(0.5, 0.95).toFixed(2);
    deco.style.animationDuration = `${duration}s, ${swayDuration}s`;
    deco.style.animationDelay = `${delay}s, ${delay}s`;

    return deco;
}

let sparkleLayer = null;

function setSparkles(enabled) {
    if (!enabled) {
        sparkleLayer?.remove();
        sparkleLayer = null;
        return;
    }
    if (sparkleLayer) return;

    sparkleLayer = document.createElement('div');
    sparkleLayer.className = 'sparkle-layer';
    document.body.prepend(sparkleLayer);

    for (let i = 0; i < SPARKLE_COUNT; i++) {
        sparkleLayer.append(createSparkle());
    }
}

//---------------테마 선택 UI-----------------
const themeLink = document.querySelector('#theme-css');
const themePicker = document.querySelector('#theme-picker');
const themeCurrent = document.querySelector('#theme-current');
const themeList = document.querySelector('#theme-list');
const heading = document.querySelector('h1');

const themeButtons = {};

function applyTheme(name) {
    const theme = THEMES[name];
    themeLink.href = theme.css;
    document.title = theme.title;
    heading.textContent = theme.heading;
    chatInput.placeholder = theme.placeholder;
    themeCurrent.textContent = theme.label;
    for (const [key, button] of Object.entries(themeButtons)) {
        button.toggleAttribute('aria-current', key === name);
    }
    setSparkles(theme.sparkles);
}

for (const [name, theme] of Object.entries(THEMES)) {
    const item = document.createElement('li');
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = theme.label;
    button.addEventListener('click', () => {
        applyTheme(name);
        themePicker.open = false;
        try { localStorage.setItem('theme', name); } catch { }
    });
    item.append(button);
    themeList.append(item);
    themeButtons[name] = button;
}

// 아코디언 바깥을 누르면 닫는다.
document.addEventListener('click', (event) => {
    if (!themePicker.contains(event.target)) themePicker.open = false;
});

let savedTheme = null;
try { savedTheme = localStorage.getItem('theme'); } catch { }
applyTheme(savedTheme in THEMES ? savedTheme : 'princess');
})();
