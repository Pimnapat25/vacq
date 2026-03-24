# Backend API Reference

Base URL: `http://localhost:5000` (or your deployed host) + `/api/v1`

---

## Global conventions

### Authentication

- **Protected routes:** send header  
  `Authorization: Bearer <JWT>`
- **Cookie:** login/register also set an **httpOnly** `token` cookie, but **`protect` only reads the Bearer header** (not the cookie).

### Common success shape

```json
{ "success": true }
```

### Common error shapes (varies by route)

- `{ "success": false, "message": "..." }`
- `{ "success": false, "msg": "..." }` (mainly login)
- `{ "success": false }` (some hospital errors)

### Roles

- `user` | `admin` (see `User` model)

---

## Data models (what you’ll see in `data`)

### User (no password in responses by default)

| Field       | Type   | Notes                          |
| ----------- | ------ | ------------------------------ |
| `_id`       | string | Mongo ObjectId                 |
| `name`      | string | required                       |
| `email`     | string | required, unique             |
| `tel`       | string | 9–10 digits                    |
| `role`      | string | `user` \| `admin`; register always creates `user` |
| `createdAt` | string | ISO date                       |

### Hospital

| Field         | Type   |
| ------------- | ------ |
| `name`        | string, unique, max 100 |
| `address`     | string |
| `district`    | string |
| `province`    | string |
| `postalcode`  | string, max 5 |
| `tel`         | string (optional in schema) |
| `region`      | string |
| `appointments`| array (virtual, when populated) |

### Dentist

| Field               | Type   |
| ------------------- | ------ |
| `name`              | string |
| `yearsOfExperience` | number ≥ 0 |
| `areaOfExpertise`   | string |
| `hospital`          | ObjectId or populated object |

### Appointment

| Field       | Type   |
| ----------- | ------ |
| `apptDate`  | string (ISO date) |
| `user`      | ObjectId or User |
| `hospital`  | ObjectId or Hospital |
| `dentist`   | ObjectId or Dentist |
| `createdAt` | string (ISO date) |

---

# Auth APIs

## `POST /api/v1/auth/register`

**Access:** public  

**Request body (JSON):**

```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "secret12",
  "tel": "0812345678"
}
```

**Success `200`:**

```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

*(Also sets `token` httpOnly cookie.)*

**Error `400`:**

```json
{ "success": false, "message": "Validation error message or duplicate key..." }
```

---

## `POST /api/v1/auth/login`

**Access:** public  

**Request body:**

```json
{
  "email": "jane@example.com",
  "password": "secret12"
}
```

**Success `200`:**

```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error examples:**

- `400`: `{ "success": false, "msg": "Please provide an email and password" }`
- `400`: `{ "success": false, "msg": "Invalid credentials" }`
- `401`: `{ "success": false, "msg": "Invalid credentials" }`

---

## `GET /api/v1/auth/me`

**Access:** private (Bearer)  

**Request:** no body.

**Success `200`:**

```json
{
  "success": true,
  "data": {
    "_id": "65f1a2b3c4d5e6f7a8b9c0d1",
    "name": "Jane Doe",
    "email": "jane@example.com",
    "tel": "0812345678",
    "role": "user",
    "createdAt": "2025-03-01T10:00:00.000Z"
  }
}
```

**Error `401`:**

```json
{ "success": false, "message": "Not authorized to access this route" }
```

---

## `GET /api/v1/auth/logout`

**Access:** public (no `protect` in code)  

**Request:** no body.

**Success `200`:**

```json
{
  "success": true,
  "data": {}
}
```

*(Clears cookie to `"none"`.)*  
**Frontend:** still remove stored JWT client-side if you use Bearer.

---

# Hospital APIs

## `GET /api/v1/hospitals`

**Access:** public  

**Query (optional):**

- **Filter:** any hospital field; use Mongo-style operators in query string, e.g. `province[in]=Bangkok&sort=-createdAt`
- **Operators in JSON after replace:** `gt`, `gte`, `lt`, `lte`, `in`
- **`select`:** comma-separated fields, e.g. `select=name,province`
- **`sort`:** e.g. `sort=-createdAt,name`
- **`page`:** number (default `1`)
- **`limit`:** number (default `25`)

**Success `200`:**

```json
{
  "success": true,
  "count": 2,
  "pagination": {
    "next": { "page": 2, "limit": 25 },
    "prev": { "page": 1, "limit": 25 }
  },
  "data": [
    {
      "_id": "65f1...",
      "name": "Smile Dental Center",
      "address": "123 Road",
      "district": "Pathum Wan",
      "province": "Bangkok",
      "postalcode": "10330",
      "tel": "021234567",
      "region": "Central",
      "appointments": [
        {
          "_id": "65f2...",
          "apptDate": "2025-04-10T09:00:00.000Z",
          "user": "65f0...",
          "hospital": "65f1..."
        }
      ]
    }
  ]
}
```

**Error `400`:** `{ "success": false }`

---

## `GET /api/v1/hospitals/:id`

**Access:** public  

**Success `200`:**

```json
{
  "success": true,
  "data": {
    "_id": "65f1...",
    "name": "Smile Dental Center",
    "address": "123 Road",
    "district": "Pathum Wan",
    "province": "Bangkok",
    "postalcode": "10330",
    "tel": "021234567",
    "region": "Central",
    "appointments": []
  }
}
```

**Error `400`:** `{ "success": false }` (not found or bad id)

---

## `POST /api/v1/hospitals`

**Access:** private + role **`admin`**  

**Request body (all model fields you want to set):**

```json
{
  "name": "Smile Dental Center",
  "address": "123 Road",
  "district": "Pathum Wan",
  "province": "Bangkok",
  "postalcode": "10330",
  "tel": "021234567",
  "region": "Central"
}
```

**Success `201`:**

```json
{
  "success": true,
  "data": { "_id": "65f1...", "name": "Smile Dental Center" }
}
```

**Error `400`:** `{ "success": false }`  
**Error `403`:** role not admin  
**Error `401`:** missing/invalid token

---

## `PUT /api/v1/hospitals/:id`

**Access:** private + **`admin`**  

**Request body:** partial update, same field names as Hospital.

**Success `200`:**

```json
{ "success": true, "data": { "_id": "65f1...", "tel": "029999999" } }
```

**Error `400`:** `{ "success": false }`

---

## `DELETE /api/v1/hospitals/:id`

**Access:** private + **`admin`**  

**Success `200`:**

```json
{ "success": true, "data": {} }
```

*(Deletes related appointments via hospital `pre('deleteOne')` hook.)*

---

# Dentist APIs

## `GET /api/v1/dentists`

**Access:** public  

**Success `200`:**

```json
{
  "success": true,
  "count": 1,
  "data": [
    {
      "_id": "65f3...",
      "name": "Dr. Somchai",
      "yearsOfExperience": 10,
      "areaOfExpertise": "Orthodontics",
      "hospital": {
        "_id": "65f1...",
        "name": "Smile Dental Center",
        "province": "Bangkok",
        "tel": "021234567"
      }
    }
  ]
}
```

**Error `500`:** `{ "success": false, "message": "Cannot find dentists" }`

---

## `GET /api/v1/hospitals/:hospitalId/dentists`

**Access:** public  

Same response shape as `GET /dentists`, but filtered to that hospital.

---

## `GET /api/v1/dentists/:id`

**Access:** public  

**Success `200`:**

```json
{
  "success": true,
  "data": {
    "_id": "65f3...",
    "name": "Dr. Somchai",
    "yearsOfExperience": 10,
    "areaOfExpertise": "Orthodontics",
    "hospital": {
      "_id": "65f1...",
      "name": "Smile Dental Center",
      "province": "Bangkok",
      "tel": "021234567"
    }
  }
}
```

**Error `404`:**

```json
{
  "success": false,
  "message": "No dentist with the id of 65f3..."
}
```

---

## `POST /api/v1/hospitals/:hospitalId/dentists`

**Access:** private + **`admin`**  

**Request body:**

```json
{
  "name": "Dr. Somchai",
  "yearsOfExperience": 10,
  "areaOfExpertise": "Orthodontics"
}
```

*(Server sets `hospital` from URL.)*

**Success `201`:**

```json
{
  "success": true,
  "data": {
    "_id": "65f3...",
    "name": "Dr. Somchai",
    "yearsOfExperience": 10,
    "areaOfExpertise": "Orthodontics",
    "hospital": "65f1..."
  }
}
```

**Error `404`:** hospital missing  
**Error `400`:** `{ "success": false, "message": "Cannot create dentist" }`

---

## `PUT /api/v1/dentists/:id`

**Access:** private + **`admin`**  

**Request body (partial):**

```json
{
  "yearsOfExperience": 11,
  "areaOfExpertise": "General Dentistry"
}
```

**Success `200`:** `{ "success": true, "data": { ... } }`

---

## `DELETE /api/v1/dentists/:id`

**Access:** private + **`admin`**  

**Success `200`:**

```json
{ "success": true, "data": {} }
```

---

### Route note (dentists)

The file `routes/dentists.js` also registers **`POST /api/v1/dentists`** (no `hospitalId`). The controller expects **`req.params.hospitalId`** to create a dentist, so **use only**  
`POST /api/v1/hospitals/:hospitalId/dentists` for creation.

---

# Appointment APIs

## `GET /api/v1/appointments`

**Access:** private — roles **`user`** or **`admin`**  

**Behavior:**

- **`user`:** only that user’s appointments.
- **`admin`:** all appointments (or filtered by hospital when using nested route below).

**Success `200`:**

```json
{
  "success": true,
  "count": 1,
  "data": [
    {
      "_id": "65f4...",
      "apptDate": "2025-04-10T09:00:00.000Z",
      "user": "65f0...",
      "hospital": {
        "_id": "65f1...",
        "name": "Smile Dental Center",
        "province": "Bangkok",
        "tel": "021234567"
      },
      "dentist": {
        "_id": "65f3...",
        "name": "Dr. Somchai",
        "yearsOfExperience": 10,
        "areaOfExpertise": "Orthodontics"
      },
      "createdAt": "2025-03-20T08:00:00.000Z"
    }
  ]
}
```

**Error `500`:** `{ "success": false, "message": "Cannot find Appointment" }`

---

## `GET /api/v1/hospitals/:hospitalId/appointments`

**Access:** private — **`user`** or **`admin`**  

**Behavior:**

- **`admin`:** appointments for that hospital.
- **`user`:** still **only own** appointments (hospital filter is not applied for non-admin in code).

Same response shape as `GET /appointments`.

---

## `GET /api/v1/appointments/:id`

**Access:** private  

**Success `200`:**

```json
{
  "success": true,
  "data": {
    "_id": "65f4...",
    "apptDate": "2025-04-10T09:00:00.000Z",
    "user": "65f0...",
    "hospital": {
      "_id": "65f1...",
      "name": "Smile Dental Center",
      "tel": "021234567"
    },
    "dentist": {
      "_id": "65f3...",
      "name": "Dr. Somchai",
      "yearsOfExperience": 10,
      "areaOfExpertise": "Orthodontics"
    },
    "createdAt": "2025-03-20T08:00:00.000Z"
  }
}
```

*(Controller selects `hospital`: `name description tel` — there is no `description` on the Hospital schema, so you’ll get `name` and `tel`.)*

**Error `404`:**

```json
{
  "success": false,
  "message": "No appointment with the id of 65f4..."
}
```

---

## `POST /api/v1/hospitals/:hospitalId/appointments`

**Access:** private — **`user`** or **`admin`**  

**Request body:**

```json
{
  "apptDate": "2025-04-10T09:00:00.000Z",
  "dentist": "65f3..."
}
```

*(Server sets `hospital` from URL and `user` from JWT.)*

**Business rules:**

- Hospital must exist.
- Dentist must exist and **`dentist.hospital` must match `:hospitalId`**.
- Non-admin users: **max 1 appointment per user** (if they already have one, error).

**Success `200`:**

```json
{
  "success": true,
  "data": {
    "_id": "65f4...",
    "apptDate": "2025-04-10T09:00:00.000Z",
    "user": "65f0...",
    "hospital": "65f1...",
    "dentist": "65f3...",
    "createdAt": "2025-03-20T08:00:00.000Z"
  }
}
```

**Error examples:**

- `404` hospital / dentist not found  
- `400` dentist not in hospital  
- `400` user already has a booking (non-admin)

---

## `PUT /api/v1/appointments/:id`

**Access:** private — **`user`** or **`admin`**  
**Rule:** only **owner** or **admin**.

**Request body (partial):**

```json
{
  "apptDate": "2025-04-11T14:00:00.000Z",
  "dentist": "65f3..."
}
```

**Success `200`:** `{ "success": true, "data": { ... } }`

**Error `401`:** not owner and not admin  
**Error `404`:** appointment not found  
**Error `500`:** `{ "success": false, "message": "Cannot update Appointment" }`

---

## `DELETE /api/v1/appointments/:id`

**Access:** private — **`user`** or **`admin`**  
**Rule:** owner or admin.

**Success `200`:**

```json
{ "success": true, "data": {} }
```

**Error `401`:** not authorized  
**Error `404`:** not found  

---

### Route note (appointments)

`routes/appointments.js` registers **`POST /api/v1/appointments`** without `hospitalId`. The handler **`addAppointment`** needs **`req.params.hospitalId`**, so **use only**  
`POST /api/v1/hospitals/:hospitalId/appointments` to create bookings.

---

## Quick reference table

| Method | Path | Auth |
| ------ | ---- | ---- |
| POST | `/api/v1/auth/register` | — |
| POST | `/api/v1/auth/login` | — |
| GET | `/api/v1/auth/me` | Bearer |
| GET | `/api/v1/auth/logout` | — |
| GET | `/api/v1/hospitals` | — |
| GET | `/api/v1/hospitals/:id` | — |
| POST | `/api/v1/hospitals` | admin |
| PUT | `/api/v1/hospitals/:id` | admin |
| DELETE | `/api/v1/hospitals/:id` | admin |
| GET | `/api/v1/dentists` | — |
| GET | `/api/v1/hospitals/:hospitalId/dentists` | — |
| GET | `/api/v1/dentists/:id` | — |
| POST | `/api/v1/hospitals/:hospitalId/dentists` | admin |
| PUT | `/api/v1/dentists/:id` | admin |
| DELETE | `/api/v1/dentists/:id` | admin |
| GET | `/api/v1/appointments` | user/admin |
| GET | `/api/v1/hospitals/:hospitalId/appointments` | user/admin |
| GET | `/api/v1/appointments/:id` | user/admin |
| POST | `/api/v1/hospitals/:hospitalId/appointments` | user/admin |
| PUT | `/api/v1/appointments/:id` | user/admin |
| DELETE | `/api/v1/appointments/:id` | user/admin |

---

## Frontend integration (this repo)

- **Base URL:** set `VITE_API_URL` (see `.env.example`). Default is `/api/v1`; Vite dev server proxies `/api` → `http://localhost:5000`.
- **Auth:** JWT stored in `localStorage` and sent as `Authorization: Bearer <token>`.
- **Modules:** `src/api/` — `auth`, `hospitals`, `dentists`, `appointments` + `client.js` / `token.js`.
- **UI:** `AuthProvider` + `ProtectedRoute`; patient routes for any logged-in user; `/admin/*` requires `role === "admin"`.
- **Global dentists list** (`GET /dentists`) is available via `listDentists()` if you add a screen; hospital-scoped CRUD is under **Admin → Hospitals → Dentists**.

---

*Generated from this repository’s Express routes and controllers.*
