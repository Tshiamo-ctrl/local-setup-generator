const fs = require('fs');
const path = require('path');
const vm = require('vm');

// 1. Load repos.js
const reposContent = fs.readFileSync(path.join(__dirname, '../repos.js'), 'utf8');
const reposSandbox = {};
vm.createContext(reposSandbox);
// Append an assignment to make it visible on the sandbox object
vm.runInContext(reposContent + "; this.REPO_LIST = REPO_LIST;", reposSandbox);
const REPO_LIST = reposSandbox.REPO_LIST;

// 2. Load index.html and extract scripts
const indexContent = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8');

const startIndex = indexContent.indexOf('function generateSetupScript');
const openScript = indexContent.lastIndexOf('<script>', startIndex);
const closeScript = indexContent.indexOf('</script>', startIndex);

if (startIndex === -1 || openScript === -1 || closeScript === -1) {
    console.error("Could not extract script section from index.html");
    process.exit(1);
}

const scriptContent = indexContent.substring(openScript + 8, closeScript);

// Create a sandbox to run the generator
const sandbox = {
    generateSetupScript: null,
    generateEnvFile: null,
    console: console,
    REPO_LIST: REPO_LIST,
    document: {
        getElementById: (id) => {
            return { value: "mock_value", checked: true, style: {} };
        },
        querySelectorAll: () => [],
        querySelector: () => null,
        documentElement: { classList: { add: () => { }, remove: () => { }, contains: () => false } }
    },
    window: {
        addEventListener: () => { }
    },
    localStorage: {
        getItem: () => null,
        setItem: () => { }
    }
};
vm.createContext(sandbox);

try {
    vm.runInContext(scriptContent, sandbox);
} catch (e) {
    console.error("Error evaluating script block:", e);
    process.exit(1);
}

const generateSetupScript = sandbox.generateSetupScript;

// 3. Run Tests
let errors = [];

REPO_LIST.forEach(cat => {
    cat.repos.forEach(repo => {
        console.log(`Testing ${repo.name}...`);

        // Mock Parameters
        const params = {
            repoUrl: repo.url,
            repoName: repo.name.replace(/\s+/g, '-').toLowerCase(),
            projectPath: "~/dev/test-project",
            venvName: "venv",
            dbType: "postgresql",
            framework: repo.framework || "generic",
            loadDemo: true,
            createSuper: true,
            adminUser: "admin",
            adminEmail: "admin@example.com",
            adminPass: "pass123",
            serverPort: 8000,
            cmdAdmin: "python3 manage.py createsuperuser", // Default
            cmdPostInstall: "",
            preInstall: "",
            customReqPath: "",
            runServer: true,
            demoDataCmd: "",
            initDb: true,
            dependencies: repo.dependencies
        };

        // Override with repo specifics if they exist (mimicking index.html logic)
        let repoCmdAdmin = params.cmdAdmin;
        let repoPreInstall = "";
        let repoDemoData = "";

        if (repo.setupCommands) {
            if (repo.setupCommands.preInstall) repoPreInstall = repo.setupCommands.preInstall;
            if (repo.setupCommands.demoData) repoDemoData = repo.setupCommands.demoData;
            if (repo.setupCommands.adminCreate) {
                // Apply replacements as index.html does
                repoCmdAdmin = repo.setupCommands.adminCreate
                    .replace(/__USER__/g, params.adminUser)
                    .replace(/__PASS__/g, params.adminPass)
                    .replace(/__EMAIL__/g, params.adminEmail);
            }
        }

        // Generate Script
        const script = generateSetupScript(
            params.repoUrl,
            params.repoName,
            params.projectPath,
            params.venvName,
            params.dbType,
            params.framework,
            params.loadDemo,
            params.createSuper,
            params.adminUser,
            params.adminEmail,
            params.adminPass,
            params.serverPort,
            repoCmdAdmin,
            params.cmdPostInstall,
            repoPreInstall,
            params.customReqPath,
            params.runServer,
            repoDemoData,
            params.initDb,
            repo.dependencies,
            "", // customInstallCmd (empty for defaults)
            "local"
        );

        // --- ASSERTIONS ---

        // 1. Check Dependencies
        if (repo.dependencies) {
            if (repo.dependencies.command) {
                if (!script.includes(repo.dependencies.command)) {
                    errors.push(`[${repo.name}] Missing dependency command: ${repo.dependencies.command}`);
                }
            } else if (repo.dependencies.files) {
                // Only check individual files if NO custom command is provided
                repo.dependencies.files.forEach(f => {
                    if (!script.includes(`pip install -r "${f}"`)) {
                        errors.push(`[${repo.name}] Missing dependency install for: ${f}`);
                    }
                });
            }
        } else {
            // Fallback check (less strict, but ensuring SOMETHING is installed)
            if (!script.includes("pip install")) {
                errors.push(`[${repo.name}] Script has no pip install commands.`);
            }
        }

        // 2. Check Admin Creation
        // Validation: If setupCommands.adminCreate was provided, the script MUST contain the substituted version
        if (repo.setupCommands && repo.setupCommands.adminCreate) {
            const expectedAdmin = repo.setupCommands.adminCreate
                .replace(/__USER__/g, params.adminUser)
                .replace(/__PASS__/g, params.adminPass)
                .replace(/__EMAIL__/g, params.adminEmail);

            if (!script.includes(expectedAdmin)) {
                errors.push(`[${repo.name}] Missing/Incorrect admin creation command. Expected: ${expectedAdmin}`);
            }
        }

        // 3. Check PreInstall
        if (repo.setupCommands && repo.setupCommands.preInstall) {
            if (!script.includes(repo.setupCommands.preInstall)) {
                errors.push(`[${repo.name}] Missing pre-install command.`);
            }
        }

        // 4. Sanity Check for undefined
        if (script.includes("undefined")) {
            errors.push(`[${repo.name}] Generated script contains 'undefined'. Check variable passing.`);
        }
    });
});

if (errors.length > 0) {
    console.error("\n❌ TESTS FAILED:");
    errors.forEach(e => console.error(e));
    process.exit(1);
} else {
    console.log("\n✅ ALL TESTS PASSED");
}
