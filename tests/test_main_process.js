const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

// MOCK ELECTRON MODULES
const mockIpcMain = {
    handlers: {},
    handle: (channel, callback) => {
        mockIpcMain.handlers[channel] = callback;
    }
};

const mockDialog = {
    showSaveDialog: async () => ({ canceled: false, filePath: '/tmp/test_archive.tar.gz' }),
    showOpenDialog: async () => ({ canceled: false, filePaths: ['/tmp/test_dir'] })
};

const mockApp = {
    whenReady: () => Promise.resolve(),
    on: () => { },
    quit: () => { }
};

const mockBrowserWindow = class {
    constructor() { }
    loadFile() { }
};
mockBrowserWindow.getAllWindows = () => [];

// Mock the require mechanism to intercept 'electron'
const Module = require('module');
const originalRequire = Module.prototype.require;

Module.prototype.require = function (request) {
    if (request === 'electron') {
        return {
            app: mockApp,
            BrowserWindow: mockBrowserWindow,
            ipcMain: mockIpcMain,
            dialog: mockDialog
        };
    }
    return originalRequire.apply(this, arguments);
};

// LOAD MAIN.JS
// We need to suppress the window creation or it will fail
// But main.js code runs immediately.
// Luckily, most logic is inside app.whenReady or ipcMain handlers.
// We just need to load it to register handlers.

console.log("--- Loading main.js with mocks ---");
try {
    require('../main.js');
} catch (e) {
    console.error("Error loading main.js:", e);
}

// TEST HELPER
async function testHandler(channel, args, expectedSuccess = true) {
    console.log(`\nTesting IPC handler: ${channel}`);
    const handler = mockIpcMain.handlers[channel];
    if (!handler) {
        console.error(`Handler ${channel} not found!`);
        return false;
    }

    try {
        const result = await handler({}, args);
        console.log("Result:", result);

        if (result.success !== expectedSuccess) {
            console.error(`FAILED: Expected success=${expectedSuccess}, got ${result.success}`);
            if (result.error) console.error("Error:", result.error);
            return false;
        }
        console.log("PASSED");
        return true;
    } catch (e) {
        console.error("Handler exception:", e);
        return false;
    }
}

// SETUP TEST ENVIRONMENT
const TEST_DIR = path.join(__dirname, 'temp_test_env');
const VENV_NAME = 'test_env_venv';

function setupFs() {
    if (fs.existsSync(TEST_DIR)) fs.rmSync(TEST_DIR, { recursive: true, force: true });
    fs.mkdirSync(TEST_DIR);

    // Create structure for 'workspace' mode test
    // workspace/
    //   venv/
    //   src/
    //   db.sqlite3

    fs.mkdirSync(path.join(TEST_DIR, VENV_NAME));
    fs.writeFileSync(path.join(TEST_DIR, VENV_NAME, 'activate'), 'mock');

    fs.mkdirSync(path.join(TEST_DIR, 'node_modules'));
    fs.writeFileSync(path.join(TEST_DIR, 'db.sqlite3'), 'mock db');
    fs.writeFileSync(path.join(TEST_DIR, 'main.py'), 'print("hello")');
    fs.writeFileSync(path.join(TEST_DIR, 'other.txt'), 'data');
}

// TESTS
async function runTests() {
    let passed = 0;
    let total = 0;

    // TEST 1: Delete Items - Repo Mode
    // Should delete source code (main.py, other.txt) but KEEP venv
    setupFs();
    total++;
    console.log("\n[TEST 1] Delete Repo Mode");
    await testHandler('delete-items', { directory: TEST_DIR, mode: 'repo', venvName: VENV_NAME });

    if (fs.existsSync(path.join(TEST_DIR, VENV_NAME)) &&
        !fs.existsSync(path.join(TEST_DIR, 'main.py'))) {
        console.log("Assertion PASSED: Venv exists, Source deleted");
        passed++;
    } else {
        console.log("Assertion FAILED");
    }

    // TEST 2: Delete Items - Env Mode
    // Should delete venv, db, node_modules, but KEEP source code
    setupFs();
    total++;
    console.log("\n[TEST 2] Delete Env Mode");
    await testHandler('delete-items', { directory: TEST_DIR, mode: 'env', venvName: VENV_NAME });

    if (!fs.existsSync(path.join(TEST_DIR, VENV_NAME)) &&
        !fs.existsSync(path.join(TEST_DIR, 'db.sqlite3')) &&
        !fs.existsSync(path.join(TEST_DIR, 'node_modules')) &&
        fs.existsSync(path.join(TEST_DIR, 'main.py'))) {
        console.log("Assertion PASSED: Venv deleted, Source exists");
        passed++;
    } else {
        console.log("Assertion FAILED");
        console.log("Venv exists:", fs.existsSync(path.join(TEST_DIR, VENV_NAME)));
        console.log("Main.py exists:", fs.existsSync(path.join(TEST_DIR, 'main.py')));
    }

    // TEST 3: Delete Items - Workspace Mode
    // Should delete everything
    setupFs();
    total++;
    console.log("\n[TEST 3] Delete Workspace Mode");
    await testHandler('delete-items', { directory: TEST_DIR, mode: 'workspace', venvName: VENV_NAME });

    // Check if directory is empty
    const items = fs.readdirSync(TEST_DIR);
    if (items.length === 0) {
        console.log("Assertion PASSED: Directory empty");
        passed++;
    } else {
        console.log(`Assertion FAILED: Items remain: ${items.join(', ')}`);
    }

    // TEST 4: Archive Workspace
    // Should run tar command
    total++;
    console.log("\n[TEST 4] Archive Workspace");
    const archivePath = path.join(__dirname, 'test_output.tar.gz');
    // Using main.py as a file to archive
    setupFs();

    await testHandler('archive-workspace', { sourceDir: TEST_DIR, destPath: archivePath });

    if (fs.existsSync(archivePath)) {
        console.log("Assertion PASSED: Archive created");
        // Clean up archive
        fs.unlinkSync(archivePath);
        passed++;
    } else {
        console.log("Assertion FAILED: Archive not found");
        // Verify we are on Linux (this test relies on system tar)
        if (process.platform !== 'linux') {
            console.log("NOTE: This test might fail on non-Linux if tar is missing.");
        }
    }

    // CLEANUP
    if (fs.existsSync(TEST_DIR)) fs.rmSync(TEST_DIR, { recursive: true, force: true });

    console.log(`\n--- RESULTS: ${passed}/${total} Tests Passed ---`);
    if (passed !== total) process.exit(1);
}

runTests();
