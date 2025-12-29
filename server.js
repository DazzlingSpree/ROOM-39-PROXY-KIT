const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

// --- UNIVERSAL CORS POLICY ---
// 1. origin: true -> Automatically reflects the requesting domain (allows everyone).
// 2. credentials: true -> Allows cookies/auth headers to pass through.
// 3. allowedHeaders omitted -> Automatically accepts whatever headers the browser sends.
app.use(cors({
    origin: true, 
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH']
}));

// 1. ROOT ROUTE (Browser Check)
app.get('/', (req, res) => {
    res.send('<h1>ROOM-39 RELAY IS ACTIVE</h1><p>Status: Online & Ready</p>');
});

// 2. HEALTH CHECK (App Connection Check)
app.get('/health', (req, res) => {
    // Send a 200 OK immediately
    res.status(200).send('ROOM-39 RELAY: ONLINE');
});

// 3. TUNNELING LOGIC
app.use('/tunnel', (req, res, next) => {
    const targetUrl = req.query.target;

    if (!targetUrl) {
        return res.status(400).send('Error: Missing target URL parameter.');
    }

    const proxy = createProxyMiddleware({
        target: targetUrl,
        changeOrigin: true,
        pathRewrite: (path, req) => '',
        secure: false, // Ignore SSL issues on target if necessary
        onProxyReq: (proxyReq, req, res) => {
            // Forward body for POST/PUT requests
            if (req.body) {
                const bodyData = JSON.stringify(req.body);
                proxyReq.setHeader('Content-Type', 'application/json');
                proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
                proxyReq.write(bodyData);
            }
        },
        onError: (err, req, res) => {
            console.error('Proxy Error:', err);
            // Send a safe error so the client knows it failed
            if (!res.headersSent) {
                res.status(500).send('Proxy Connection Error');
            }
        }
    });

    proxy(req, res, next);
});

// 4. START SERVER
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`ROOM-39 RELAY ACTIVE on port ${PORT}`);
});
