const fs = require('fs');
const path = require('path');
const vm = require('vm');
const reposContent = fs.readFileSync(path.join(__dirname, 'repos.js'), 'utf8');
const reposSandbox = {};
vm.createContext(reposSandbox);
vm.runInContext(reposContent + "; this.REPO_LIST = REPO_LIST;", reposSandbox);
const REPO_LIST = reposSandbox.REPO_LIST;
const indexContent = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
function extractFunction(source, funcName) {
    const start = source.indexOf(`function ${funcName}`);
    if (start === -1) return null;
    let braceCount = 0; let end = -1; let foundBrace = false;
    for (let i = start; i < source.length; i++) {
        if (source[i] === '{') { braceCount++; foundBrace = true; }
        else if (source[i] === '}') { braceCount--; }
        if (foundBrace && braceCount === 0) { end = i + 1; break; }
    }
    return source.substring(start, end);
}
const generatorFnCode = extractFunction(indexContent, 'generateSetupScript');
const sandbox = { console: console, document: { getElementById: () => ({value: "", checked: true}) } };
vm.createContext(sandbox);
vm.runInContext(generatorFnCode, sandbox);
const bwRepo = REPO_LIST.flatMap(c => c.repos).find(r => r.name === 'BookWyrm');
let repoCmdAdmin = bwRepo.setupCommands.adminCreate.replace(/__USER__/g, "admin").replace(/__PASS__/g, "pass").replace(/__EMAIL__/g, "admin@test.com");
const script = sandbox.generateSetupScript(
    bwRepo.url, "bookwyrm", "~/dev/test-bw", "venv", "postgresql", bwRepo.framework, true, true,
    "admin", "admin@test.com", "pass", 8000, repoCmdAdmin, "", bwRepo.setupCommands.preInstall, "", true, bwRepo.setupCommands.loadDemoCmd || "", true, bwRepo.dependencies, "", "local"
);
fs.writeFileSync('test-bw/setup.sh', script);
console.log("Wrote test-bw/setup.sh");
