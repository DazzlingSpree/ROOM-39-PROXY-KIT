const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const PORT = process.env.PORT || 3000;

// --- SECURITY & CORS ---
// Allow requests from any origin (or restrict to your App's domain in production)
app.use(cors({
    origin: true, 
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH']
}));

// Parse JSON bodies (needed if you want to log or inspect bodies before proxying)
app.use(express.json());

// --- ROUTES ---

// 1. Root Route (Status Check)
app.get('/', (req, res) => {
    res.send(`
        <div style="font-family: monospace; background: #111; color: #0f0; padding: 20px; height: 100vh;">
            <h1>GHOST PROXY NODE: ACTIVE</h1>
            <p>Status: Online</p>
            <p>Region: ${process.env.RENDER_REGION || 'Unknown'}</p>
        </div>
    `);
});

// 2. Health Check (for Uptime Monitors)
app.get('/health', (req, res) => {
    res.status(200).send('OK');
});

// 3. The Proxy Tunnel
// Usage: /tunnel?target=https://blocked-site.com/api/v1/resource
app.use('/tunnel', (req, res, next) => {
    const targetUrl = req.query.target;

    if (!targetUrl) {
        return res.status(400).json({ error: 'Missing "target" query parameter.' });
    }

    // Dynamic Proxy Configuration
    const proxy = createProxyMiddleware({
        target: targetUrl,
        changeOrigin: true,
        pathRewrite: (path, req) => '', // Strips '/tunnel' from the forwarded path
        secure: false, // Set to true in strictly secure environments; false helps with self-signed certs
        onProxyReq: (proxyReq, req, res) => {
            // If the client sent a body, we need to restream it because body-parser consumed it
            if (req.body && Object.keys(req.body).length > 0) {
                const bodyData = JSON.stringify(req.body);
                proxyReq.setHeader('Content-Type', 'application/json');
                proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
                proxyReq.write(bodyData);
            }
        },
        onError: (err, req, res) => {
            console.error('Proxy Error:', err);
            res.status(500).send('Proxy Connection Failed');
        }
    });

    proxy(req, res, next);
});

// --- START SERVER ---
app.listen(PORT, () => {
    console.log(`Ghost Proxy listening on port ${PORT}`);
});
