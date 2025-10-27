#!/usr/bin/env node

/**
 * Extended test script for subdirectory pages
 */

import { spawn } from 'child_process';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function testSubdirectoryPages() {
    console.log('🧪 Testing subdirectory page access...\n');

    const serverPath = join(__dirname, 'dist', 'server.js');
    const server = spawn('node', [serverPath], {
        stdio: ['pipe', 'pipe', 'pipe']
    });

    const testCases = [
        { id: 1, path: 'magic/fire', name: 'Fire Magic' },
        { id: 2, path: 'characters/valora_iceclaw', name: 'Valora Character' },
        { id: 3, path: 'creatures/wolf', name: 'Wolf Creature' },
        { id: 4, path: 'nonexistent', name: 'Nonexistent Page' }
    ];

    let responseCount = 0;
    let responses = [];

    server.stdout.on('data', (data) => {
        const lines = data.toString().split('\n').filter(line => line.trim());
        for (const line of lines) {
            try {
                const response = JSON.parse(line);
                if (response.id && response.id >= 1 && response.id <= 4) {
                    responses.push(response);
                    responseCount++;

                    const testCase = testCases.find(tc => tc.id === response.id);
                    console.log(`📨 ${testCase.name} (${testCase.path}):`);

                    if (response.result && response.result.content) {
                        console.log(`   ✅ Success - ${response.result.content[0].text.length} chars`);
                    } else if (response.error) {
                        console.log(`   ❌ Error: ${response.error.message}`);
                    } else {
                        console.log(`   ❓ Unexpected response format`);
                    }

                    if (responseCount === 4) {
                        server.kill();
                    }
                }
            } catch (e) {
                // Ignore non-JSON output
            }
        }
    });

    server.stderr.on('data', (data) => {
        console.error('❌ Error:', data.toString());
    });

    server.on('close', (code) => {
        console.log(`\n🏁 Test completed with exit code ${code}`);
    });

    // Send test messages
    testCases.forEach((testCase, index) => {
        setTimeout(() => {
            const message = {
                jsonrpc: '2.0',
                id: testCase.id,
                method: 'tools/call',
                params: {
                    name: 'get_aetheria_page',
                    arguments: { path: testCase.path }
                }
            };
            console.log(`📤 Requesting ${testCase.name}...`);
            server.stdin.write(JSON.stringify(message) + '\n');
        }, (index + 1) * 200);
    });

    // Timeout after 3 seconds
    setTimeout(() => {
        console.log('⏰ Timeout reached, killing server');
        server.kill();
    }, 3000);
}

testSubdirectoryPages();
