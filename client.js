const chatForm = document.querySelector('#chat-form');
const chatInput = document.querySelector('#chat-input');
const messages = document.querySelector('#messages');

const ws = new WebSocket(`ws://${location.host}`);

function addMessage(message) {
    const messageItem = document.createElement('li');
    messageItem.textContent = message;
    messages.append(messageItem);
    messages.scrollTop = messages.scrollHeight;
}

chatForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const message = chatInput.value.trim();
    if (!message) return;

    addMessage(message);
    ws.send(message);

    chatInput.value = '';
    chatInput.focus();
});

const EYE_COUNT = 20;
const VEIN_COLORS = ['#ff2a2a', '#e01313', '#b30000', '#7a0000', '#ff5252'];

function rand(min, max) {
    return Math.random() * (max - min) + min;
}

function buildVeinSVG() {
    const mainVeinCount = Math.round(rand(6, 10));
    let paths = '';

    for (let i = 0; i < mainVeinCount; i++) {
        const angle = rand(0, Math.PI * 2);
        const edgeR = rand(44, 49);
        const targetR = rand(14, 32);
        const segments = Math.round(rand(4, 7));
        let x = 50 + Math.cos(angle) * edgeR;
        let y = 50 + Math.sin(angle) * edgeR;
        let d = `M ${x.toFixed(1)} ${y.toFixed(1)}`;
        let branchPoint = null;

        for (let s = 1; s <= segments; s++) {
            const t = s / segments;
            const r = edgeR + (targetR - edgeR) * t;
            const wobble = rand(-0.2, 0.2);
            const nx = 50 + Math.cos(angle + wobble) * r + rand(-2, 2);
            const ny = 50 + Math.sin(angle + wobble) * r + rand(-2, 2);
            d += ` L ${nx.toFixed(1)} ${ny.toFixed(1)}`;
            if (s === Math.round(segments / 2)) branchPoint = { x: nx, y: ny, angle };
        }

        const width = rand(0.5, 1.6);
        const color = VEIN_COLORS[Math.floor(rand(0, VEIN_COLORS.length))];
        const opacity = rand(0.35, 0.85);
        paths += `<path d="${d}" stroke="${color}" stroke-width="${width.toFixed(2)}" fill="none" opacity="${opacity.toFixed(2)}" stroke-linecap="round"/>`;

        if (branchPoint && Math.random() > 0.35) {
            const branchAngle = branchPoint.angle + rand(-1, 1);
            const branchLen = rand(6, 14);
            const bx = branchPoint.x + Math.cos(branchAngle) * branchLen;
            const by = branchPoint.y + Math.sin(branchAngle) * branchLen;
            const branchWidth = width * rand(0.4, 0.7);
            paths += `<path d="M ${branchPoint.x.toFixed(1)} ${branchPoint.y.toFixed(1)} L ${bx.toFixed(1)} ${by.toFixed(1)}" stroke="${color}" stroke-width="${branchWidth.toFixed(2)}" fill="none" opacity="${(opacity * 0.8).toFixed(2)}" stroke-linecap="round"/>`;
        }
    }

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">${paths}</svg>`;
    return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

function createEye() {
    const size = Math.round(rand(28, 170));

    const eye = document.createElement('div');
    eye.className = 'creepy-eye';
    eye.style.width = `${size}px`;
    eye.style.height = `${size}px`;
    eye.style.top = `${rand(1, 92)}%`;
    eye.style.left = `${rand(1, 92)}%`;
    eye.style.transform = `rotate(${rand(-18, 18).toFixed(1)}deg)`;

    const white = document.createElement('div');
    white.className = 'eye-white';

    const veins = document.createElement('div');
    veins.className = 'veins';
    veins.style.backgroundImage = `url("${buildVeinSVG()}")`;

    const iris = document.createElement('div');
    iris.className = 'iris';
    const irisSize = rand(40, 52);
    iris.style.width = `${irisSize}%`;
    iris.style.height = `${irisSize}%`;

    const pupil = document.createElement('div');
    pupil.className = 'pupil';

    const blinkDelay = `${rand(0, 7).toFixed(2)}s`;
    const blinkDuration = `${rand(5, 9).toFixed(2)}s`;

    const eyelidTop = document.createElement('div');
    eyelidTop.className = 'eyelid-top';
    eyelidTop.style.animationDelay = blinkDelay;
    eyelidTop.style.animationDuration = blinkDuration;

    const eyelidBottom = document.createElement('div');
    eyelidBottom.className = 'eyelid-bottom';
    eyelidBottom.style.animationDelay = blinkDelay;
    eyelidBottom.style.animationDuration = blinkDuration;

    iris.append(pupil);
    white.append(veins, iris, eyelidTop, eyelidBottom);
    eye.append(white);
    return eye;
}

const eyeLayer = document.createElement('div');
eyeLayer.className = 'eye-layer';
document.body.prepend(eyeLayer);

for (let i = 0; i < EYE_COUNT; i++) {
    eyeLayer.append(createEye());
}

const eyeIrises = document.querySelectorAll('.creepy-eye .iris');
const maxPupilOffset = 9;
let latestMouse = { x: 0, y: 0 };
let ticking = false;

function updateEyes(mouseX, mouseY) {
    eyeIrises.forEach((iris) => {
        const rect = iris.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const dx = mouseX - centerX;
        const dy = mouseY - centerY;
        const angle = Math.atan2(dy, dx);
        const distance = Math.min(maxPupilOffset, Math.hypot(dx, dy) / 12);
        iris.style.setProperty('--px', `${Math.cos(angle) * distance}px`);
        iris.style.setProperty('--py', `${Math.sin(angle) * distance}px`);
    });
    ticking = false;
}

window.addEventListener('mousemove', (event) => {
    latestMouse = { x: event.clientX, y: event.clientY };
    if (!ticking) {
        ticking = true;
        requestAnimationFrame(() => updateEyes(latestMouse.x, latestMouse.y));
    }
});
