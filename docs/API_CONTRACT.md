# API Contract — CanteenPro

This document is the single source of truth for the API that the frontend expects.
**Backend team must match this exactly.** Do not change field names, URL structure, or response shapes without updating the frontend services too.

---

## Base URL

```
http://localhost:8000/api
```

Production base URL will be set via `VITE_API_URL` environment variable in the frontend.

---

## Authentication

All protected routes require the header:

```
Authorization: Bearer <access_token>
```

The token is stored in `localStorage` as `token` by the frontend.

---

## ── AUTH ROUTES ──────────────────────────────────────────

### POST `/auth/signup`

Register a new user.

**Request body:**
```json
{ "name": "Rahul Kumar", "email": "rahul@college.edu", "password": "secret123" }
```

**Response `200`:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "64a1f...",
    "name": "Rahul Kumar",
    "email": "rahul@college.edu",
    "role": "user"
  }
}
```

**Error `400`:** email already registered
```json
{ "detail": "Email already registered" }
```

---

### POST `/auth/login`

Log in with email and password.

**Request body:**
```json
{ "email": "rahul@college.edu", "password": "secret123" }
```

**Response `200`:** same shape as signup response

**Error `401`:**
```json
{ "detail": "Invalid credentials" }
```

---

### GET `/auth/me`

Get currently logged-in user. Requires Bearer token.

**Response `200`:**
```json
{
  "_id": "64a1f...",
  "name": "Rahul Kumar",
  "email": "rahul@college.edu",
  "role": "user"
}
```

---

## ── ITEM ROUTES ──────────────────────────────────────────

### GET `/items`

Get all menu items. Supports optional query params.

**Query params:**
- `search` — string, partial match on name or category
- `category` — exact category name (Breakfast, Lunch, Dinner, Snacks, Beverages, Desserts)

**Response `200`:**
```json
[
  {
    "_id": "64b2a...",
    "name": "Masala Dosa",
    "description": "Crispy dosa with spiced potato filling",
    "price": 45,
    "category": "Breakfast",
    "is_available": true,
    "is_veg": true,
    "stock": 30,
    "rating": 4.8,
    "image": "/uploads/food_images/masala-dosa.jpg",
    "emoji": "🥞"
  }
]
```

---

### GET `/items/{id}`

Get a single item by ID.

**Response `200`:** single item object (same shape as above)

**Error `404`:**
```json
{ "detail": "Item not found" }
```

---

### POST `/items` _(admin only)_

Create a new menu item. Sent as **multipart/form-data**.

**Form fields:**
- `name` (string, required)
- `description` (string)
- `price` (number, required)
- `category` (string, required)
- `stock` (number)
- `is_veg` (boolean)
- `is_available` (boolean)
- `image` (file, optional)

**Response `201`:** created item object

---

### PUT `/items/{id}` _(admin only)_

Update a menu item. Sent as **multipart/form-data** (same fields as POST).

**Response `200`:** updated item object

---

### DELETE `/items/{id}` _(admin only)_

Delete a menu item.

**Response `200`:**
```json
{ "success": true }
```

---

### PATCH `/items/{id}/toggle` _(admin only)_

Toggle `is_available` between true and false.

**Response `200`:** updated item object

---

## ── ORDER ROUTES ─────────────────────────────────────────

### POST `/orders`

Place a new order. Requires Bearer token (user).

**Request body:**
```json
{
  "items": [
    { "item_id": "64b2a...", "name": "Masala Dosa", "price": 45, "quantity": 2 }
  ],
  "total_amount": 90
}
```

**Response `201`:**
```json
{
  "_id": "64c3b...",
  "user_id": "64a1f...",
  "user_name": "Rahul Kumar",
  "status": "pending",
  "items": [
    { "item_id": "64b2a...", "name": "Masala Dosa", "price": 45, "quantity": 2 }
  ],
  "total_amount": 90,
  "created_at": "2025-05-17T10:30:00.000Z"
}
```

---

### GET `/orders/user`

Get the currently logged-in user's orders. Requires Bearer token.

**Response `200`:** array of order objects (newest first)

---

### GET `/orders/admin` _(admin only)_

Get all orders across all users. Requires Bearer token + admin role.

**Response `200`:** array of order objects (newest first)

---

### GET `/orders/{id}`

Get a single order by ID.

**Response `200`:** single order object

**Error `404`:**
```json
{ "detail": "Order not found" }
```

---

### PATCH `/orders/{id}/status` _(admin only)_

Update the status of an order.

**Request body:**
```json
{ "status": "confirmed" }
```

Valid status values: `pending`, `confirmed`, `preparing`, `ready`, `delivered`, `cancelled`

**Response `200`:** updated order object

---

## ── ERROR FORMAT ─────────────────────────────────────────

All errors use FastAPI's default format:

```json
{ "detail": "Human-readable error message" }
```

The frontend reads `err.response?.data?.detail` to display error messages.

---

## ── IMPORTANT NOTES FOR BACKEND TEAM ────────────────────

1. **Field names are case-sensitive.** Use `_id` not `id`. Use `is_available` not `isAvailable`.
2. **`created_at`** must be an ISO 8601 datetime string (e.g., `"2025-05-17T10:30:00.000Z"`).
3. **Image paths** — return as `/uploads/food_images/filename.jpg`. The frontend prepends `VITE_API_URL`'s host to display them.
4. **User role** — must be either `"user"` or `"admin"` (lowercase string).
5. **Auth token** — frontend stores it under the key `token` in localStorage and sends it as `Authorization: Bearer <token>`.
6. **CORS** — allow `http://localhost:5173` (Vite dev server) and your production URL.
7. **Order `user_name`** — populate this from the user's profile when creating the order; the frontend displays it in the admin panel.
