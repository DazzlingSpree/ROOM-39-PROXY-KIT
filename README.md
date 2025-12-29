# 🛡️ Room-39 Secure Relay (Proxy Kit)

This repository contains the code for a **Private Relay Node** compatible with the Room-39 secure terminal.

## 🚨 Why do I need this?
If **Room-39.com** is blocked in your region, or if you simply want to obscure your network traffic, deploying your own Relay Node allows you to bypass firewalls.

When you use a Relay, your connection looks like this:
`You -> [Private Relay] -> Room-39 Network`

The firewall only sees you connecting to your private relay (which is not blocked), allowing your encrypted data to pass through freely.

---

## 🚀 How to Deploy (Free & Fast)

You can deploy this code for free on **Render**, **Glitch**, or **Railway**.

### Option A: Deploy on Render (Recommended)
1. Fork this repository to your GitHub.
2. Sign up at [dashboard.render.com](https://dashboard.render.com).
3. Click **"New +"** -> **"Web Service"**.
4. Connect your GitHub account and select this repository.
5. Scroll down and click **"Create Web Service"** (Use the Free Tier).
6. Wait for the deploy to finish. Render will give you a URL like:
   `https://my-relay-name.onrender.com`

### Option B: Deploy on Glitch
1. Go to [glitch.com](https://glitch.com).
2. Click **"New Project"** -> **"Import from GitHub"**.
3. Paste the URL of this repository.
4. Glitch will give you a URL like:
   `https://my-project-name.glitch.me`

---

## 🔗 How to Connect

1. Copy your new **Server URL** (e.g., `https://my-relay-name.onrender.com`).
2. Open **Room-39**.
3. Go to **Profile** -> **Network Uplinks**.
4. Paste your URL into the **Custom Relay (Proxy)** field.
5. Click **LINK**.

If the connection is successful, your status will change to **● TUNNELED**, and all encrypted traffic will now route through your private server.
