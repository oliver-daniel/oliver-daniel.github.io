const USER_AGENT = window
    .navigator
    .userAgent
    .toLowerCase();

let div = document.getElementById('content');
const phrases = ['developer', 'designer', 'learner'];
const type_delay = 60;
const blink_delay = 800;
const timeout = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let current_index = -1;
const COLORS = ['#EECF6D', '#8A89C0', '#00ADE9', '#37CB4D', '#F758FF'];

const ANCHORS = ['#home', '#about-me', '#skills', '#blog', '#contact'];

function setAnchors() {
    ANCHORS.forEach((id, i) => {
        let selector = `${id} .chevron a`;
        let els = document.querySelectorAll(selector);
        //home
        if (els.length == 1) {
            let [down] = els;
            down.href = ANCHORS[i + 1];
        } else {
            let [up,
                down
            ] = els;
            up.href = ANCHORS[i > 0 ?
                i - 1 :
                ANCHORS.length - 1];
            down.href = ANCHORS[(i + 1) % ANCHORS.length];
        }
    })
}

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
    // const limit = bg.offsetTop + bg.offsetHeight;
    /*if (height > bg.offsetTop && height <= limit) {
        bg.style.backgroundPositionY = ((height - bg.offsetTop) / 2.5 % 40.) + 'px';
    } else {
        bg.style.backgroundPositionY = '0px';
    }*/
    bg.style.backgroundPositionY = -(height * .15) % 40. + 'px'
}

function handleResize() {
    const skills = document.getElementsByClassName('skill');
    let max = 0;
    for (let skill of skills) {
        let clone = skill.cloneNode(true);
        clone
            .classList
            .remove('hidden');
        max = Math.max(max, clone.clientHeight);
    }
}

function setAccent(index){
    const color = COLORS[index];
    try {
        document.documentElement.style.setProperty('--accent', color);
    } catch (err) {
        console.log(err)
    }
}

function addListeners() {
    //resize sensitivity
    // window.addEventListener('resize', handleResize);
    //parallax
    // if (!USER_AGENT.includes('safari') || USER_AGENT.includes('chrome')) {
    //     window.addEventListener('scroll', updateBackground);

    // } else {
        // const bg = document.querySelector('body');
        // bg
        //     .classList
        //     .remove('background');
        // bg.style.background = '#0F0F0F';
    // }
    //scrollspy
    const chevrons = document.getElementsByClassName('chevron');
    scrollSpy('#sidebar', {
        sectionSelector: 'div',
    });

    for (let chevron of chevrons) {
        scrollSpy(chevron);
    }

    //color change
    document.addEventListener('scroll-in', ({detail: {href}}) => {
        const index = ANCHORS.indexOf(href);
        const home = document.querySelector('#sidebar [href="#home"]');
        if (index === current_index){
            return;
        } else if (index === 0) {
            home.classList.add('active');
        } else {
            home.classList.remove('active');
        }
        current_index = index;
        setAccent(index);
    });

    //skill buttons
    const icons = document.getElementsByClassName('skill-icon');
    let selection = 'frontend-icon';
    for (let icon of icons) {
        icon
            .addEventListener('click', function () {
                const {
                    id
                } = this;
                //clear existing and add new
                const oldIcon = document.getElementById(selection);

                icons[1].classList.remove('blink');

                oldIcon
                    .classList
                    .remove('active');
                icon
                    .classList
                    .add('active');

                const oldSkill = document.getElementById(`${selection}-skill`);
                oldSkill
                    .classList
                    .add('hidden');

                const newSkill = document.getElementById(`${id}-skill`);
                newSkill
                    .classList
                    .remove('hidden');

                selection = id;
            })
    }
}

function populateBlog(MAX_TITLE_LENGTH, MAX_BLURB_LENGTH) {
    if (!tumblr_api_read) return;

    function truncate(str, len) {
        if (str.length < len) {
            return str;
        }
        let ret = "";
        const tokens = str.replace(/[\n]/g, ' ').split(' ');
        for (let i = 0; ret.length <= len - 3; i++) {
            ret += tokens[i] + " ";
        }
        return ret.trim() + "...";
    }

    const postPreview = (title, blurb, image, url, date) => `
    <a href="${url}" target="_blank">
    <div class="post-preview">
        <div class="preview-img ${!image && "empty"}">
            ${image ? `<img src="${image}" alt=""/>` 
            :'<i data-feather="file-text"></i>'}
        </div>
        <div class="preview-desc">
            <span class="title">${title}</span><br/>
            <span class="blurb">${blurb}</span>
            <div class="preview-date">
                Posted on ${date}
            </div>
        </div>
    </div>
    </a>`

    let el = document.querySelector('#blog .content .previews');
    el.children[0].remove();

    for (const {
            'regular-body': postBody,
            'regular-title': postTitle,
            'date-gmt': postDate,
            //TODO: proper image reading
            tumblelog: {
                avatar_url_96: image
            },
            url
        } of tumblr_api_read.posts) {
        const date = postDate.split(' ')[0];
        const title = truncate(postTitle || `<i>Post on ${date}</i>`, MAX_TITLE_LENGTH);
        const blurb = truncate(postBody, MAX_BLURB_LENGTH);


        let node = postPreview(title, blurb, image, url, date);

        el.insertAdjacentHTML('beforeend', node);
    }
}

//document ready
// setAnchors();
setAccent(0);
addListeners();
populateBlog(40, 40);
feather.replace();
typeAll();