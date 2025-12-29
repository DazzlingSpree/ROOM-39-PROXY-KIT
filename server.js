const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

// 1. GLOBAL CORS POLICY
app.use(cors({
    origin: '*', 
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
    credentials: true
}));

// --- NEW: ROOT ROUTE (Fixes "Cannot GET /") ---
app.get('/', (req, res) => {
    res.send('<h1>ROOM-39 RELAY IS ACTIVE</h1><p>Status: Online</p>');
});

// 2. HEALTH CHECK
app.get('/health', (req, res) => {
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
        secure: false,
        onProxyReq: (proxyReq, req, res) => {
            if (req.body) {
                const bodyData = JSON.stringify(req.body);
                proxyReq.setHeader('Content-Type', 'application/json');
                proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
                proxyReq.write(bodyData);
            }
        },
        onError: (err, req, res) => {
            console.error('Proxy Error:', err);
            res.status(500).send('Proxy Error');
        }
    });

    proxy(req, res, next);
});

// 4. START SERVER
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`ROOM-39 RELAY ACTIVE on port ${PORT}`);
});
