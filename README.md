# 🛡️ Room-39 Secure Relay (Proxy Kit)

This repository contains the code for a **Private Relay Node** compatible with the Room-39 secure terminal.

## 🚨 Why do I need this?
If **Room-39.com** is blocked in your region, or if you simply want to obscure your network traffic, deploying your own Relay Node allows you to bypass firewalls.

---

## 🚀 How to Deploy

### Option A: One-Click Deploy (Recommended)
You can deploy this proxy directly to Render's free tier by clicking the button below.

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy)

1. Click the button above.
2. Sign in to Render (GitHub/GitLab/Email).
3. Give your service a name (e.g., `my-proxy-node`).
4. Click **Apply**.
5. Wait for the deploy to finish. Copy your new URL (e.g., `https://my-proxy-node.onrender.com`).

### Option B: Manual Deploy
1. Fork this repo.
2. Go to [dashboard.render.com](https://dashboard.render.com).
3. Click **New +** -> **Web Service**.
4. Connect your forked repository.
5. Render will auto-detect the settings. Click **Create Web Service**.

---

## 🔗 How to Connect

1. Copy your new **Server URL** (e.g., `https://my-proxy-node.onrender.com`).
2. Open **Room-39**.
3. Go to **Profile** -> **Network Uplinks**.
4. Paste your URL into the **Custom Relay (Proxy)** field.
5. Click **LINK**.

If the connection is successful, your status will change to **● TUNNELED**.
