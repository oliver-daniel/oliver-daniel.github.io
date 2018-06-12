const USER_AGENT = window.navigator.userAgent.toLowerCase();

let div = document.getElementById('content');
const phrases = ['developer', 'designer', 'learner'];
const type_delay = 60;
const blink_delay = 800;
const timeout = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function type(word, posn = 0) {
    if (posn === word.length + 1)
        return;
    div.textContent = word.slice(0, posn);
    await timeout(type_delay);
    await type(word, posn + 1);
}

async function erase(word, posn = 0) {
    if (posn === word.length)
        return;
    div.textContent = div
        .textContent
        .slice(0, -1);
    await timeout(type_delay);
    await erase(word, posn + 1);
}

async function typeAll() {
    for (let phrase of phrases) {
        await type(phrase);
        await timeout(blink_delay);
        await erase(phrase);
    }
    await type(phrases.join(' | '));
}

function updateBackground() {
    let bg = document.querySelector('.background');
    const height = window.pageYOffset;
    const limit = bg.offsetTop + bg.offsetHeight;
    /*if (height > bg.offsetTop && height <= limit) {
        bg.style.backgroundPositionY = ((height - bg.offsetTop) / 2.5 % 40.) + 'px';
    } else {
        bg.style.backgroundPositionY = '0px';
    }*/
    bg.style.backgroundPositionY = -(height * .15) % 40. + 'px'
}

function addListeners() {
    //parallax
    if (!USER_AGENT.includes('safari') || USER_AGENT.includes('chrome')) {
        window.addEventListener('scroll', updateBackground);

    } else {
        const bg = document.querySelector('body');
        bg.classList.remove('background');
        bg.style.background = '#0F0F0F';
    }
    //scrollspy
    const menu = document.getElementById('sidebar');
    const SCROLL_SPEED = 3000;
    const chevrons = document.getElementsByClassName('chevron');
    scrollSpy(menu, SCROLL_SPEED, 'easeInOutSine');

    for (let chevron of chevrons) {
        scrollSpy(chevron, SCROLL_SPEED, 'easeInOutSine');
    }

    //skill buttons
    const icons = document.getElementsByClassName('skill-icon');
    let selection = 'frontend-icon';
    for (let icon of icons) {
        icon.addEventListener('click', function () {
            const {
                id
            } = this;
            //clear existing and add new
            const oldIcon = document.getElementById(selection);

            oldIcon.classList.remove('active');
            icon.classList.add('active');

            const oldSkill = document.getElementById(`${selection}-skill`);
            oldSkill.classList.add('hidden');


            const newSkill = document.getElementById(`${id}-skill`);
            newSkill.classList.remove('hidden');

            selection = id;
        })
    }
}

//document ready
feather.replace();
addListeners();
typeAll();