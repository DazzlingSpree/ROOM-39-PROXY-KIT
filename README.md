# Ghost Proxy Node

A lightweight, secure relay server designed for the Ghost Protocol application. This server acts as a proxy to circumvent censorship or CORS restrictions by tunneling traffic through a neutral server.

## Features
- **Obfuscation**: Masks the origin of requests.
- **CORS Handling**: Automatically adds Access-Control headers to allow the Ghost App to communicate with external APIs.
- **JSON Body Support**: Correctly re-streams JSON payloads to target servers.

## Deployment

### Option 1: Render (Recommended)
1. Fork this repository.
2. Create a new account on [Render.com](https://render.com).
3. Click **New +** -> **Web Service**.
4. Connect your GitHub/GitLab account and select this repository.
5. Render will automatically detect the `render.yaml` or `package.json` configuration.
6. Click **Deploy**.

### Option 2: Manual Node.js
1. `npm install`
2. `npm start`

## Usage in Ghost App

Once deployed, copy your service URL (e.g., `https://ghost-proxy-node.onrender.com`).

1. Log in to the Ghost App.
2. Go to **Profile** -> **Network Uplinks**.
3. Unlock the **Ghost Protocol** (Subscribers only).
4. Enter your Proxy URL in the **Custom Relay** field:
