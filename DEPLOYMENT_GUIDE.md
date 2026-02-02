# Panduan Deployment BUMDes Kalosi ke VPS

Panduan ini akan membantu Anda menyiapkan VPS (Virtual Private Server) dari nol, menginstall environment yang dibutuhkan, dan mendepoy aplikasi BUMDes Kalosi (Next.js + Prisma + PostgreSQL).

## 1. Persiapan VPS

Jika Anda belum membeli VPS, disarankan menggunakan OS **Ubuntu 22.04 LTS** atau **24.04 LTS** karena paling umum dan banyak dukungannya.

### Akses VPS via SSH
Setelah membeli VPS, Anda akan mendapatkan IP Address dan password root. Buka terminal (CMD/PowerShell di Windows) dan jalankan:

```bash
ssh root@<IP_VPS_ANDA>
```
Masukan password saat diminta.

### (Opsional namun Disarankan) Update & Secure Server
Update repository dan package sistem:
```bash
sudo apt update && sudo apt upgrade -y
```

***

## 2. Installasi Dependencies

Kita perlu menginstall Node.js, Git, Nginx, dan PostgreSQL.

### Install Node.js & pnpm
Gunakan NVM atau install langsung via NodeSource (contoh Node v20 LTS):

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
```

Install `pnpm` secara global:
```bash
corepack enable
corepack prepare pnpm@latest --activate
```
Cek versi:
```bash
node -v
pnpm -v
```

### Install PostgreSQL
```bash
sudo apt install postgresql postgresql-contrib -y
```
Pastikan service berjalan:
```bash
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### Install Nginx (Web Server/Reverse Proxy)
```bash
sudo apt install nginx -y
sudo systemctl start nginx
sudo systemctl enable nginx
```
Cek apakah Nginx berjalan dengan membuka IP VPS di browser. Anda harusnya melihat "Welcome to nginx!".

***

## 3. Konfigurasi Database

Masuk ke console Postgres:
```bash
sudo -u postgres psql
```

Buat database dan user baru:
```sql
CREATE DATABASE bumdes_db;
CREATE USER bumdes_user WITH ENCRYPTED PASSWORD 'password_rahasia_anda';
GRANT ALL PRIVILEGES ON DATABASE bumdes_db TO bumdes_user;
-- Masuk ke database yang baru dibuat
\c bumdes_db

-- Berikan hak akses penuh ke schema public (Penting untuk Postgres 15+)
GRANT USAGE ON SCHEMA public TO bumdes_user;
GRANT CREATE ON SCHEMA public TO bumdes_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO bumdes_user;
ALTER SCHEMA public OWNER TO bumdes_user;
```
Keluar dari psql dengan mengetik `\q`.

***

## 4. Setup Aplikasi

### Clone Repository
Misalkan nama repository Anda adalah `bumdes`. Kita clone ke `/var/www`:

```bash
mkdir -p /var/www
cd /var/www
git clone <URL_REPO_GITHUB_ANDA> bumdes
```

Struktur folder Anda nantinya akan seperti ini:
```
/var/www/
├── bumdes/         (Repository Anda)
│   ├── bumdes-kalosi/  (Aplikasi Next.js)
│   └── ...
└── bumdes-storage/ (Folder Uploads Terpisah)
```

Masuk ke folder aplikasi:
```bash
cd /var/www/bumdes/bumdes-kalosi
```

### Setup Environment Variables
Copy `.env.example` (jika ada) atau buat `.env` baru:
```bash
nano .env
```
Isi dengan konfigurasi production Anda:
```env
DATABASE_URL="postgresql://bumdes_user:password_rahasia_anda@localhost:5432/bumdes_db?schema=public"
# Wajib untuk NextAuth v5 di belakang proxy/VPS
AUTH_TRUST_HOST=true
AUTH_SECRET="buat_string_acak_disini"
NEXTAUTH_URL="http://bumdessumberkalosi.com"
# Storage setup: Folder storage terpisah di /var/www
STORAGE_DIR="/var/www/bumdes-storage"
```
Simpan dengan `Ctrl+O` lalu keluar `Ctrl+X`.

### Install & Build
Install dependencies dan build project:
```bash
pnpm install
npx prisma generate
npx prisma migrate deploy
pnpm build
```

Jika berhasil, folder `.next` akan terbuat.

### Seeding Data (Isi Data Awal)
Untuk mengisi database dengan data awal (user admin, produk contoh, dll):
```bash
npx prisma db seed
```
Atau jika command di atas gagal:
```bash
pnpm db:seed
```

***

## 5. Setup Persistent Storage

Kita akan membuat folder storage terpisah dari repository agar file tidak tercampur dan lebih aman.

1.  Buat folder storage di root `/var/www`:
    ```bash
    sudo mkdir -p /var/www/bumdes-storage
    ```
2.  Berikan izin write (PENTING):
    ```bash
    sudo chown -R $USER:$USER /var/www/bumdes-storage
    sudo chmod -R 755 /var/www/bumdes-storage
    ```
3.  Pastikan `.env` tadi sudah benar:
    ```env
    STORAGE_DIR="/var/www/bumdes-storage"
    ```

***

## 6. Menjalankan Aplikasi dengan PM2

PM2 digunakan agar aplikasi tetap berjalan di background walau SSH ditutup.

Install PM2:
```bash
npm install -g pm2
```

Jalankan aplikasi:
```bash
pm2 start pnpm --name "bumdes-app" -- start
```
Atau jika command start di package.json adalah `next start`, bisa juga:
```bash
pm2 start npm --name "bumdes-app" -- run start
```

Simpan state PM2 agar auto-start saat reboot:
```bash
pm2 save
pm2 startup
# Jalankan command yang muncul di layar
```

Aplikasi Anda sekarang berjalan di `localhost:3000`. Coba curl untuk tes: `curl localhost:3000`.

***

## 7. Setup Nginx Reverse Proxy

Agar aplikasi bisa diakses via port 80 (HTTP) dan **gambar load super cepat**, kita config Nginx untuk serve file upload langsung.

Edit konfigurasi default Nginx atau buat baru:
```bash
sudo nano /etc/nginx/sites-available/default
```

Ganti isinya menjadi:
```nginx
server {
    listen 80;
    server_name <DOMAIN_ANDA_ATAU_IP>;

    # Serve uploaded files directly from disk (Performa Tinggi)
    location /uploads/ {
        # Arahkan ke folder storage khusus
        alias /var/www/bumdes-storage/;
        expires 30d;
        access_log off;
        add_header Cache-Control "public";
    }

    # Next.js Application
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Cek konfigurasi dan restart Nginx:
```bash
sudo nginx -t
sudo systemctl restart nginx
```

Sekarang coba akses IP VPS Anda di browser. Aplikasi harusnya sudah muncul!

***

## 7. Setup Domain & HTTPS (Opsional tapi Penting)

Jika Anda sudah punya domain (misal `bumdessumberkalosi.com`), arahkan A Record DNS-nya ke IP VPS Anda.

Lalu install SSL gratis dengan Certbot:
```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d bumdessumberkalosi.com
```
Ikuti instruksinya. Nginx akan otomatis dikonfigurasi untuk HTTPS.

---
## Troubleshooting
- **Aplikasi Error**: Cek log dengan `pm2 logs bumdes-app`
- **Database Error**: Pastikan koneksi string di `.env` benar.
- **Port Tertutup**: Pastikan firewall (kalo ada ufw) mengizinkan port 80/443/22.
  ```bash
  sudo ufw allow 'Nginx Full'
  sudo ufw allow OpenSSH
  sudo ufw enable
  ```
