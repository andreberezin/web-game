#!/usr/bin/env node

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const testFile = join(__dirname, 'timer-winner-integration.test.js');

const testProcess = spawn('node', ['--test', testFile], {
    stdio: 'inherit',
    cwd: process.cwd()
});

testProcess.on('close', (code) => {
    process.exit(code);
});

testProcess.on('error', (error) => {
    console.error('Failed to start test process:', error);
    process.exit(1);
});
