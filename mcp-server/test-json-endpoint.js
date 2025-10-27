#!/usr/bin/env node

/**
 * Test script for both MCP endpoints
 */

import http from 'http';

async function testJSONEndpoint() {
    console.log('🧪 Testing JSON Endpoint (http://localhost:3000/)...\n');

    const requests = [
        {
            name: 'Initialize',
            data: {
                jsonrpc: '2.0',
                id: 1,
                method: 'initialize',
                params: {
                    protocolVersion: '2024-11-05',
                    capabilities: { tools: {} },
                    clientInfo: { name: 'test-client', version: '1.0.0' }
                }
            }
        },
        {
            name: 'List Tools',
            data: {
                jsonrpc: '2.0',
                id: 2,
                method: 'tools/list'
            }
        },
        {
            name: 'Get Index Page',
            data: {
                jsonrpc: '2.0',
                id: 3,
                method: 'tools/call',
                params: {
                    name: 'get_aetheria_page',
                    arguments: { path: 'index' }
                }
            }
        },
        {
            name: 'Get Magic/Fire Page',
            data: {
                jsonrpc: '2.0',
                id: 4,
                method: 'tools/call',
                params: {
                    name: 'get_aetheria_page',
                    arguments: { path: 'magic/fire' }
                }
            }
        }
    ];

    for (const request of requests) {
        console.log(`📤 ${request.name}...`);

        const response = await makeJSONRequest(request.data);

        if (response.result) {
            if (response.result.content) {
                const content = response.result.content[0]?.text;
                console.log(`✅ Success - ${content ? content.length : 0} characters`);
            } else if (response.result.tools) {
                console.log(`✅ Success - ${response.result.tools.length} tools found`);
            } else {
                console.log(`✅ Success - ${JSON.stringify(response.result).substring(0, 100)}...`);
            }
        } else if (response.error) {
            console.log(`❌ Error: ${response.error.message}`);
        }

        console.log();
    }
}

function makeJSONRequest(data) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 3000,
            path: '/',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }
        };

        const jsonData = JSON.stringify(data);
        options.headers['Content-Length'] = Buffer.byteLength(jsonData);

        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => {
                body += chunk;
            });

            res.on('end', () => {
                try {
                    const parsed = JSON.parse(body);
                    resolve(parsed);
                } catch (e) {
                    resolve({ error: { message: 'Invalid JSON response' } });
                }
            });
        });

        req.on('error', (error) => {
            reject(error);
        });

        req.write(jsonData);
        req.end();
    });
}

testJSONEndpoint().catch(console.error);
