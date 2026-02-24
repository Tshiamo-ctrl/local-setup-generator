const fs = require('fs');
const { JSDOM } = require('jsdom');
const html = fs.readFileSync('index.html', 'utf8');
const dom = new JSDOM(html, { runScripts: "dangerously" });
const window = dom.window;

setTimeout(() => {
    window.document.getElementById('repoSelect').value = "https://github.com/bookwyrm-social/bookwyrm.git";
    window.handleRepoChange();
    window.generateScripts();
    fs.writeFileSync('bw_setup_test.sh', window.document.getElementById('setupCode').textContent);
    console.log("Wrote bw_setup_test.sh");
}, 1000);
