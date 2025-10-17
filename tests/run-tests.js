#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Test runner script
class TestRunner {
    constructor() {
        this.results = {
            passed: 0,
            failed: 0,
            total: 0
        };
    }

    async runTests() {
        console.log('🧪 Tour Application Test Suite');
        console.log('================================\n');

        // Find all test files
        const testFiles = this.findTestFiles();

        if (testFiles.length === 0) {
            console.log('❌ No test files found');
            return;
        }

        console.log(`📁 Found ${testFiles.length} test file(s):`);
        testFiles.forEach(file => console.log(`   - ${file}`));
        console.log('');

        // Run each test file
        for (const testFile of testFiles) {
            await this.runTestFile(testFile);
        }

        // Print summary
        this.printSummary();
    }

    findTestFiles() {
        const testFiles = [];
        const testDir = path.join(__dirname);

        const findFiles = (dir) => {
            const files = fs.readdirSync(dir);

            for (const file of files) {
                const filePath = path.join(dir, file);
                const stat = fs.statSync(filePath);

                if (stat.isDirectory()) {
                    findFiles(filePath);
                } else if (file.endsWith('.js') && file.startsWith('test-')) {
                    testFiles.push(filePath);
                }
            }
        };

        findFiles(testDir);
        return testFiles;
    }

    async runTestFile(testFile) {
        const relativePath = path.relative(__dirname, testFile);
        console.log(`\n🔬 Running: ${relativePath}`);
        console.log('─'.repeat(50));

        try {
            // Run the test file
            const { spawn } = require('child_process');
            const child = spawn('node', [testFile], {
                stdio: 'inherit',
                cwd: path.dirname(testFile)
            });

            await new Promise((resolve, reject) => {
                child.on('close', (code) => {
                    if (code === 0) {
                        this.results.passed++;
                        console.log(`✅ ${relativePath} - PASSED`);
                    } else {
                        this.results.failed++;
                        console.log(`❌ ${relativePath} - FAILED (exit code: ${code})`);
                    }
                    this.results.total++;
                    resolve();
                });

                child.on('error', (err) => {
                    this.results.failed++;
                    this.results.total++;
                    console.log(`❌ ${relativePath} - ERROR: ${err.message}`);
                    resolve();
                });
            });

        } catch (error) {
            this.results.failed++;
            this.results.total++;
            console.log(`❌ ${relativePath} - ERROR: ${error.message}`);
        }
    }

    printSummary() {
        console.log('\n' + '='.repeat(50));
        console.log('📊 Test Summary');
        console.log('='.repeat(50));
        console.log(`✅ Passed: ${this.results.passed}`);
        console.log(`❌ Failed: ${this.results.failed}`);
        console.log(`📈 Total:  ${this.results.total}`);

        if (this.results.failed === 0) {
            console.log('\n🎉 All tests passed!');
        } else {
            console.log(`\n⚠️  ${this.results.failed} test(s) failed`);
        }
    }
}

// Run tests if this file is executed directly
if (require.main === module) {
    const runner = new TestRunner();
    runner.runTests().catch(console.error);
}

module.exports = TestRunner;
