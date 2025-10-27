#!/usr/bin/env node

/**
 * Simple HTTP test client for the Aetheria MCP Server
 */

import http from 'http';

function makeRequest(method, path, data = null) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 3000,
            path: path,
            method: method,
            headers: {
                'Content-Type': 'application/json',
            }
        };

        if (data) {
            const jsonData = JSON.stringify(data);
            options.headers['Content-Length'] = Buffer.byteLength(jsonData);
        }

        const req = http.request(options, (res) => {
            console.log(`Response status: ${res.statusCode}`);
            console.log(`Response headers:`, res.headers);

            let body = '';
            res.on('data', (chunk) => {
                body += chunk;
            });

            res.on('end', () => {
                console.log(`Response body: ${body}`);
                resolve(body);
            });
        });

        req.on('error', (error) => {
            console.error('Request error:', error);
            reject(error);
        });

        if (data) {
            req.write(JSON.stringify(data));
        }

        req.end();
    });
}

async function testServer() {
    console.log('Testing Aetheria MCP HTTP Server...\n');

    try {
        // Test GET request (SSE stream)
        console.log('1. Testing GET request for SSE stream...');
        await makeRequest('GET', '/');

        // Test POST request with initialization
        console.log('\n2. Testing POST request with initialization...');
        const initData = {
            jsonrpc: '2.0',
            id: 1,
            method: 'initialize',
            params: {
                protocolVersion: '2024-11-05',
                capabilities: { tools: {} },
                clientInfo: { name: 'test-client', version: '1.0.0' }
            }
        };
        await makeRequest('POST', '/', initData);

    } catch (error) {
        console.error('Test failed:', error.message);
    }
}

testServer();
