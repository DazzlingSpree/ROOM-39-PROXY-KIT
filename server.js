const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

// --- FIX: DYNAMIC CORS POLICY ---
// Instead of '*', we dynamically reflect the requesting origin.
// This allows 'credentials: true' to work without breaking browser security.
app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps, curl, or same-server)
        if (!origin) return callback(null, true);
        // Allow all other origins (Reflect them)
        callback(null, true);
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
    credentials: true // Required for Firebase Auth headers to pass through
}));

// 1. ROOT ROUTE (For browser check)
app.get('/', (req, res) => {
    res.send('<h1>ROOM-39 RELAY IS ACTIVE</h1><p>Status: Online & Ready</p>');
});

// 2. HEALTH CHECK (For App Profile check)
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

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`ROOM-39 RELAY ACTIVE on port ${PORT}`);
});
