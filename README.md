# 🍽️ CanteenPro — College Canteen Ordering System

A full-stack web app for ordering food from a college canteen. Students browse the menu, place orders, and track them live. Admins manage items and update order status.

---

## 🏗️ Project Structure

```
canteen-management-system/
├── frontend/          # React + Vite (this is ready)
├── backend/           # FastAPI + MongoDB (backend team)
├── docs/              # API notes, screenshots, diagrams
├── .gitignore
├── README.md
└── LICENSE
```

---

## 🛠️ Tech Stack

| Layer    | Technology                          |
|----------|-------------------------------------|
| Frontend | React 19, Vite, Tailwind CSS (CDN)  |
| Backend  | FastAPI (Python)                    |
| Database | MongoDB                             |
| Auth     | JWT (Bearer token)                  |

---

## 🚀 Running the Frontend

```bash
cd frontend
npm install
npm run dev
# Opens at http://localhost:5173
```

> The frontend works fully with **mock data** while the backend is offline.
> Use the "Demo User" or "Demo Admin" buttons on the login page.

---

## ⚙️ Running the Backend (backend team)

```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

Copy `backend/.env.example` → `backend/.env` and fill in your MongoDB URI and secret key.

---

## 🗃️ MongoDB Collections

| Collection | Purpose                    |
|------------|----------------------------|
| `users`    | Registered accounts        |
| `items`    | Menu items                 |
| `orders`   | Placed orders              |

---

## 🔗 API Contract

Base URL: `http://localhost:8000/api`

### Auth
| Method | Endpoint           | Body / Notes                        | Response                        |
|--------|--------------------|-------------------------------------|---------------------------------|
| POST   | `/auth/signup`     | `{ name, email, password }`         | `{ access_token, user }`        |
| POST   | `/auth/login`      | `{ email, password }`               | `{ access_token, user }`        |
| GET    | `/auth/me`         | Bearer token required               | `{ _id, name, email, role }`    |

### Items
| Method | Endpoint             | Notes                              | Response          |
|--------|----------------------|------------------------------------|-------------------|
| GET    | `/items`             | Query: `?search=&category=`        | `[item, ...]`     |
| GET    | `/items/{id}`        |                                    | `item`            |
| POST   | `/items`             | Multipart form, admin only         | `item`            |
| PUT    | `/items/{id}`        | Multipart form, admin only         | `item`            |
| DELETE | `/items/{id}`        | Admin only                         | `{ success: true }` |
| PATCH  | `/items/{id}/toggle` | Toggle is_available, admin only    | `item`            |

### Orders
| Method | Endpoint               | Notes                          | Response        |
|--------|------------------------|--------------------------------|-----------------|
| POST   | `/orders`              | Place new order (user)         | `order`         |
| GET    | `/orders/user`         | Logged-in user's orders        | `[order, ...]`  |
| GET    | `/orders/admin`        | All orders (admin only)        | `[order, ...]`  |
| GET    | `/orders/{id}`         |                                | `order`         |
| PATCH  | `/orders/{id}/status`  | Body: `{ status }`, admin only | `order`         |

---

## 📦 Expected Response Shapes

### User object
```json
{
  "_id": "string",
  "name": "string",
  "email": "string",
  "role": "user" | "admin"
}
```

### Item object
```json
{
  "_id": "string",
  "name": "string",
  "description": "string",
  "price": 50,
  "category": "Breakfast | Lunch | Dinner | Snacks | Beverages | Desserts",
  "is_available": true,
  "is_veg": true,
  "stock": 20,
  "rating": 4.5,
  "image": "/uploads/food_images/filename.jpg"
}
```

### Order object
```json
{
  "_id": "string",
  "user_id": "string",
  "user_name": "string",
  "status": "pending | confirmed | preparing | ready | delivered | cancelled",
  "items": [
    { "item_id": "string", "name": "string", "price": 50, "quantity": 2 }
  ],
  "total_amount": 100,
  "created_at": "ISO datetime string"
}
```

### Auth response
```json
{
  "access_token": "eyJ...",
  "user": { "_id": "...", "name": "...", "email": "...", "role": "user" }
}
```

### Error response (FastAPI default)
```json
{ "detail": "Error message here" }
```

---

## 🌿 Git Branch Strategy

| Branch         | Who works here  | Purpose                     |
|----------------|-----------------|-----------------------------|
| `main`         | Both teams      | Stable, production-ready    |
| `frontend-dev` | Frontend team   | All React/UI work           |
| `backend-dev`  | Backend team    | All FastAPI/MongoDB work    |

**Rule:** Never push directly to `main`. Open a PR from your branch.

---

## 🔌 Connecting Frontend to Backend

When the backend is running, the frontend automatically switches from mock data to real API calls.

1. Make sure `frontend/.env` has:
   ```
   VITE_API_URL=http://localhost:8000/api
   ```
2. Start the backend on port `8000`
3. Start the frontend (`npm run dev`)
4. Done — all service calls go to the real API

---

## 📁 Frontend Environment

```bash
# frontend/.env
VITE_API_URL=http://localhost:8000/api
```

---

## 📁 Backend Environment

```bash
# backend/.env
MONGODB_URL=mongodb://localhost:27017
DB_NAME=canteen_db
SECRET_KEY=your-long-random-secret-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=10080
ALLOWED_ORIGINS=["http://localhost:5173"]
```
