# Hostinger Deployment Guide for JH Soft CV Builder

This guide provides step-by-step instructions to deploy **JH Soft CV Builder** (`cv.jhsoft.online`) with **Node.js + MySQL** on **Hostinger** (Cloud Hosting, VPS, or cPanel/hPanel Node.js Application).

---

## 1. Prerequisites on Hostinger

1. A Hostinger account with **Node.js support** (Hostinger Cloud Hosting, Business Web Hosting with Node.js application feature, or Hostinger VPS/Ubuntu).
2. A domain or subdomain pointed to Hostinger (e.g. `cv.jhsoft.online`).
3. MySQL Database created in Hostinger **hPanel** / **cPanel**.

---

## 2. Setting Up MySQL Database on Hostinger

1. Log in to **Hostinger hPanel**.
2. Navigate to **Databases** > **Management** (or **MySQL Databases**).
3. Create a new database:
   - **Database Name**: e.g., `u123456789_jhsoft_cv`
   - **Database Username**: e.g., `u123456789_admin`
   - **Password**: *Create a strong password and save it*
4. Click **Enter phpMyAdmin** next to your newly created database.
5. In phpMyAdmin, click the **Import** tab.
6. Choose the `schema.sql` file from this project root and click **Go** (or paste the contents of `schema.sql` into the SQL tab and run it).
7. This creates the two primary tables:
   - `users` (Shop owners, authentication, custom Gemini API keys)
   - `resumes` (Cloud synced customer resumes with full JSON payloads)

---

## 3. Uploading Application Files to Hostinger

### Option A: Via Git / SSH (Recommended)
```bash
cd /home/your-user/domains/cv.jhsoft.online/public_html
git clone <your-repo-url> .
npm install
npm run build
```

### Option B: Via File Manager / FTP
1. Build locally or run `npm run build`.
2. Zip the project files (excluding `node_modules` and `.git`).
3. Upload and extract into your domain folder in Hostinger File Manager.
4. Open the Hostinger SSH Terminal or Web Terminal and run:
   ```bash
   npm install --production=false
   npm run build
   ```

---

## 4. Configuring Environment Variables (`.env`)

In the application root directory on Hostinger, create or edit the `.env` file:

```env
PORT=3000
NODE_ENV=production

# Hostinger MySQL Database credentials
DB_HOST=localhost
DB_USER=u123456789_admin
DB_PASSWORD=your_strong_mysql_password
DB_NAME=u123456789_jhsoft_cv
DB_PORT=3306
```

*(Note: On Hostinger shared/cloud hosting, `DB_HOST` is usually `localhost` or `127.0.0.1`)*.

---

## 5. Setting Up Node.js in Hostinger hPanel

If using Hostinger's **Node.js Selector**:
1. Go to **Advanced** > **Node.js** in hPanel.
2. Click **Create Application**:
   - **Node.js version**: `18.x`, `20.x`, or `22.x`
   - **Application mode**: `Production`
   - **Application root**: `public_html` (or your subdomain folder)
   - **Application startup file**: `dist/server.cjs`
3. Click **Save** and then click **Run NPM Install** if prompted.
4. Click **Restart Application**.

---

## 6. Running on Hostinger VPS / Ubuntu (Alternative)

If you have a VPS:
```bash
# 1. Install Node 20 & MySQL
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs mysql-server

# 2. Clone repository & install dependencies
git clone <repo-url> /var/www/cv.jhsoft.online
cd /var/www/cv.jhsoft.online
npm install
npm run build

# 3. Use PM2 for continuous 24/7 uptime
sudo npm install -g pm2
pm2 start dist/server.cjs --name "jhsoft-cv"
pm2 save
pm2 startup
```

---

## 7. Verifying the Deployment

1. Open `https://cv.jhsoft.online/api/health` in your browser.
   - You should see:
     ```json
     {
       "status": "ok",
       "environment": "production",
       "mysqlConfigured": true
     }
     ```
2. Open `https://cv.jhsoft.online` to view the live CV Builder app.
3. Click **Shop Account** to register your computer training center / cyber cafe account.
4. All customer resumes will now be permanently preserved in your Hostinger MySQL database.
