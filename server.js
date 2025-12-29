const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

// 1. GLOBAL CORS POLICY (Allow access from ANY Room-39 client)
// This is critical for anti-censorship; it allows the proxy to work 
// regardless of where the user is hosting their client.
app.use(cors({
    origin: '*', 
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
    credentials: true
}));

// 2. HEALTH CHECK
// Used by the app to verify the relay is active before connecting.
app.get('/health', (req, res) => {
    res.status(200).send('ROOM-39 RELAY: ONLINE');
});

// 3. TUNNELING LOGIC
// The app sends requests here: /tunnel?target=https://firestore.googleapis.com/...
app.use('/tunnel', (req, res, next) => {
    const targetUrl = req.query.target;

    if (!targetUrl) {
        return res.status(400).send('Error: Missing target URL parameter.');
    }

    // Configure the proxy middleware dynamically
    const proxy = createProxyMiddleware({
        target: targetUrl,
        changeOrigin: true, // Needed for virtual hosted sites
        pathRewrite: (path, req) => '', // Strip '/tunnel' from the request path
        secure: false, // Allow self-signed certs if necessary
        onProxyReq: (proxyReq, req, res) => {
            // Forward the original request body if present (for POST/PUT)
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
