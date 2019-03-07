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
const postCard = (title, blurb, date, url) => `
<div class="col-sm-12 col-md-4 col-lg-3">
    <a href="${url}" target="_blank">
        <div class="card fluid shadowed">
            ${title ? `
                <div class="section">
                <h4>
                    ${title}
                </h4>
            </div>
            `:""}
            <div class="section">
                ${blurb}
                <br/>
                <small>
                    Posted ${date}
                </small>
            </div>
        </div>
    </a>
</div>
`;

const el = document.getElementById('posts');
if (tumblr_api_read) {
    el.children[0].remove();
    for (const {
            'regular-body': postBody,
            'regular-title': title,
            'date-gmt': postDate,
            url
        } of tumblr_api_read.posts) {
        const blurb = truncate(postBody, 120);
        const date = postDate.split(' ')[0];
        el.insertAdjacentHTML('beforeend', postCard(title, blurb, date, url));
    }
}