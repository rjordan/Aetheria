#!/usr/bin/env node

/**
 * Comprehensive HTTP test for the Aetheria MCP Server
 * Tests the complete MCP protocol over HTTP streaming
 */

import http from 'http';

class MCPHTTPClient {
    constructor(host = 'localhost', port = 3000) {
        this.host = host;
        this.port = port;
        this.sessionId = null;
    }

    makeRequest(data) {
        return new Promise((resolve, reject) => {
            const options = {
                hostname: this.host,
                port: this.port,
                path: '/',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json, text/event-stream',
                }
            };

            if (this.sessionId) {
                options.headers['x-mcp-session-id'] = this.sessionId;
            }

            const jsonData = JSON.stringify(data);
            options.headers['Content-Length'] = Buffer.byteLength(jsonData);

            const req = http.request(options, (res) => {
                console.log(`Response status: ${res.statusCode}`);
                console.log(`Response headers:`, res.headers);

                // Extract session ID if provided
                if (res.headers['x-mcp-session-id']) {
                    this.sessionId = res.headers['x-mcp-session-id'];
                    console.log(`Session ID: ${this.sessionId}`);
                }

                let body = '';
                res.on('data', (chunk) => {
                    body += chunk;
                });

                res.on('end', () => {
                    console.log(`Response body: ${body}`);

                    // Parse SSE format if needed
                    if (body.startsWith('event: message\ndata: ')) {
                        const jsonPart = body.replace('event: message\ndata: ', '').trim();
                        try {
                            const parsed = JSON.parse(jsonPart);
                            resolve(parsed);
                        } catch (e) {
                            resolve(body);
                        }
                    } else {
                        try {
                            const parsed = JSON.parse(body);
                            resolve(parsed);
                        } catch (e) {
                            resolve(body);
                        }
                    }
                });
            });

            req.on('error', (error) => {
                console.error('Request error:', error);
                reject(error);
            });

            req.write(jsonData);
            req.end();
        });
    }

    async initialize() {
        console.log('🔧 Initializing MCP session...');
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

        const response = await this.makeRequest(initData);
        console.log('✅ Initialization response:', JSON.stringify(response, null, 2));
        return response;
    }

    async listTools() {
        console.log('📋 Listing available tools...');
        const toolsData = {
            jsonrpc: '2.0',
            id: 2,
            method: 'tools/list'
        };

        const response = await this.makeRequest(toolsData);
        console.log('✅ Tools list:', JSON.stringify(response, null, 2));
        return response;
    }

    async getPage(path = 'index') {
        console.log(`📄 Getting page: ${path}...`);
        const pageData = {
            jsonrpc: '2.0',
            id: 3,
            method: 'tools/call',
            params: {
                name: 'get_aetheria_page',
                arguments: { path }
            }
        };

        const response = await this.makeRequest(pageData);
        console.log(`✅ Page content length: ${response?.result?.content?.[0]?.text?.length || 0} characters`);
        return response;
    }
}

async function testMCPServer() {
    console.log('🧪 Testing Aetheria MCP HTTP Server...\n');

    const client = new MCPHTTPClient();

    try {
        // Test initialization
        await client.initialize();
        console.log();

        // Test tools list
        await client.listTools();
        console.log();

        // Test getting index page
        await client.getPage('index');
        console.log();

        // Test getting magic page
        await client.getPage('magic');
        console.log();

        // Test getting magic/fire page
        await client.getPage('magic/fire');
        console.log();

        console.log('🎉 All tests completed successfully!');

    } catch (error) {
        console.error('❌ Test failed:', error.message);
    }
}

testMCPServer();
