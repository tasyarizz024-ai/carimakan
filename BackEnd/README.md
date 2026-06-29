````markdown
# 🍽️ CariMakan - Backend API

Backend API untuk aplikasi **CariMakan** menggunakan **Node.js**, **Express.js**, dan **MySQL**.

---

## 🚀 Cara Menjalankan

### 1. Install Dependencies

```bash
npm install
```

### 2. Konfigurasi Environment

Salin file `.env.example` menjadi `.env`.

```bash
cp .env.example .env
```

### 3. Import Database

```bash
mysql -u root -p < carimakan.sql
```

### 4. Jalankan Server

```bash
npm run dev
```

Server akan berjalan di:

```
http://localhost:5000
```

---

# 🔌 Endpoint API

## Authentication

| Method | Endpoint | Keterangan |
| :----: | -------- | ---------- |
| POST | `/api/auth/login` | Login admin |
| POST | `/api/auth/logout` | Logout |
| GET | `/api/auth/me` | Cek session login |

## Register

| Method | Endpoint | Keterangan |
| :----: | -------- | ---------- |
| POST | `/api/register` | Register admin (memerlukan token) |

## Menu

| Method | Endpoint | Keterangan |
| :----: | -------- | ---------- |
| GET | `/api/menus` | Ambil semua menu |
| GET | `/api/menus/:id` | Detail menu |
| POST | `/api/menus` | Tambah menu (Admin) |
| PUT | `/api/menus/:id` | Edit menu (Admin) |
| DELETE | `/api/menus/:id` | Hapus menu (Admin) |
| PATCH | `/api/menus/:id/stock` | Update stok menu |

## Orders

| Method | Endpoint | Keterangan |
| :----: | -------- | ---------- |
| GET | `/api/orders` | Ambil semua pesanan |
| POST | `/api/orders` | Buat pesanan baru |
| PATCH | `/api/orders/:id` | Update status pesanan (Admin) |
| DELETE | `/api/orders/:id` | Hapus pesanan (Admin) |

## Categories

| Method | Endpoint | Keterangan |
| :----: | -------- | ---------- |
| GET | `/api/categories` | Ambil semua kategori |

## Dashboard

| Method | Endpoint | Keterangan |
| :----: | -------- | ---------- |
| GET | `/api/dashboard` | Statistik dashboard admin |

---

# 🔐 Autentikasi

Backend menggunakan **Session Authentication**.

Semua request yang membutuhkan autentikasi harus mengirim **cookie session**.

Jika menggunakan **Axios**, aktifkan:

```javascript
axios.defaults.withCredentials = true;
```

### Contoh Login

**Request**

```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "password"
}
```

**Response**

```json
{
  "success": true,
  "user": {
    "id": 1,
    "username": "admin",
    "role": "admin"
  }
}
```

---

# 🔑 Register Admin

Untuk membuat akun admin baru diperlukan **Registration Token**.

```
ADMIN2026
```

### Request

```http
POST /api/register

{
  "username": "tasya",
  "password": "tasya123",
  "registration_token": "ADMIN2026"
}
```

---

# ⚙️ Environment Variables

```env
PORT=5000

DB_HOST=localhost
DB_USER=root
DB_PASS=
DB_NAME=carimakan

SESSION_SECRET=rahasia
```

---


---

<div align="center">

**Happy Coding! 🚀**

</div>
````