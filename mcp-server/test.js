#!/usr/bin/env node

/**
 * Simple test script for the Aetheria MCP Server
 * Tests basic functionality without requiring an actual MCP client
 */

import { spawn } from 'child_process';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function testMCPServer() {
    console.log('🧪 Testing Aetheria MCP Server...\n');

    const serverPath = join(__dirname, 'dist', 'server.js');
    const server = spawn('node', [serverPath], {
        stdio: ['pipe', 'pipe', 'pipe']
    });

    // Test initialization
    const initMessage = {
        jsonrpc: '2.0',
        id: 1,
        method: 'initialize',
        params: {
            protocolVersion: '2024-11-05',
            capabilities: {
                tools: {}
            },
            clientInfo: {
                name: 'test-client',
                version: '1.0.0'
            }
        }
    };

    // Test tool list
    const listToolsMessage = {
        jsonrpc: '2.0',
        id: 2,
        method: 'tools/list'
    };

    // Test getting index page
    const getIndexMessage = {
        jsonrpc: '2.0',
        id: 3,
        method: 'tools/call',
        params: {
            name: 'get_aetheria_page',
            arguments: {}
        }
    };

    // Test getting magic page
    const getMagicMessage = {
        jsonrpc: '2.0',
        id: 4,
        method: 'tools/call',
        params: {
            name: 'get_aetheria_page',
            arguments: { path: 'magic' }
        }
    };

    let responseCount = 0;
    let responses = [];

    server.stdout.on('data', (data) => {
        const lines = data.toString().split('\n').filter(line => line.trim());
        for (const line of lines) {
            try {
                const response = JSON.parse(line);
                responses.push(response);
                responseCount++;

                console.log(`📨 Response ${responseCount}:`, JSON.stringify(response, null, 2));

                if (responseCount === 4) {
                    // All responses received, validate them
                    validateResponses(responses);
                    server.kill();
                }
            } catch (e) {
                console.log('📝 Non-JSON output:', line);
            }
        }
    });

    server.stderr.on('data', (data) => {
        console.error('❌ Error:', data.toString());
    });

    server.on('close', (code) => {
        console.log(`\n🏁 Server process exited with code ${code}`);
    });

    // Send test messages
    setTimeout(() => {
        console.log('📤 Sending initialize...');
        server.stdin.write(JSON.stringify(initMessage) + '\n');
    }, 100);

    setTimeout(() => {
        console.log('📤 Sending tools/list...');
        server.stdin.write(JSON.stringify(listToolsMessage) + '\n');
    }, 200);

    setTimeout(() => {
        console.log('📤 Sending get index page...');
        server.stdin.write(JSON.stringify(getIndexMessage) + '\n');
    }, 300);

    setTimeout(() => {
        console.log('📤 Sending get magic page...');
        server.stdin.write(JSON.stringify(getMagicMessage) + '\n');
    }, 400);

    // Timeout after 5 seconds
    setTimeout(() => {
        console.log('⏰ Timeout reached, killing server');
        server.kill();
    }, 5000);
}

function validateResponses(responses) {
    console.log('\n🔍 Validating responses...\n');

    // Check initialization
    const initResponse = responses.find(r => r.id === 1);
    if (initResponse && initResponse.result) {
        console.log('✅ Initialization successful');
    } else {
        console.log('❌ Initialization failed');
    }

    // Check tools list
    const toolsResponse = responses.find(r => r.id === 2);
    if (toolsResponse && toolsResponse.result && toolsResponse.result.tools) {
        const hasAetheriaPageTool = toolsResponse.result.tools.some(tool => tool.name === 'get_aetheria_page');
        if (hasAetheriaPageTool) {
            console.log('✅ get_aetheria_page tool found');
        } else {
            console.log('❌ get_aetheria_page tool not found');
        }
    } else {
        console.log('❌ Tools list failed');
    }

    // Check index page
    const indexResponse = responses.find(r => r.id === 3);
    if (indexResponse && indexResponse.result && indexResponse.result.content) {
        const content = indexResponse.result.content[0];
        if (content && content.type === 'text' && content.text.includes('Aetheria')) {
            console.log('✅ Index page retrieved successfully');
            console.log(`   Content length: ${content.text.length} characters`);
        } else {
            console.log('❌ Index page content invalid');
        }
    } else {
        console.log('❌ Index page retrieval failed');
    }

    // Check magic page
    const magicResponse = responses.find(r => r.id === 4);
    if (magicResponse && magicResponse.result && magicResponse.result.content) {
        const content = magicResponse.result.content[0];
        if (content && content.type === 'text' && content.text.includes('Magic')) {
            console.log('✅ Magic page retrieved successfully');
            console.log(`   Content length: ${content.text.length} characters`);
        } else {
            console.log('❌ Magic page content invalid');
        }
    } else {
        console.log('❌ Magic page retrieval failed');
    }

    console.log('\n🎉 Test completed!');
}

testMCPServer();
