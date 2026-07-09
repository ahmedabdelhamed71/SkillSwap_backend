# SkillSwap API — New Endpoints Reference

Documentation for the **Users**, **Swap Requests**, and **Contact** APIs added in this task.

## Base URL

```
http://localhost:3000/api
```

(Port comes from `PORT` in `.env`, default `3000`.)

## Authentication

Auth uses a **JWT stored in an httpOnly cookie** named `token`, set by `POST /api/auth/login` (or `/register`). No `Authorization` header is needed — just send requests with credentials:

```js
fetch(url, { credentials: 'include' }); // or axios: { withCredentials: true }
```

Endpoints marked **Auth: Yes** return `401 { "msg": "Not authorized" }` without a valid cookie.

## Recommended Frontend Call Order

1. `POST /api/auth/login` — obtain the auth cookie (existing endpoint, prerequisite).
2. `GET /api/users` — browse/search users (paginated).
3. `GET /api/users/:id` — view a user's profile.
4. `POST /api/requests` — send a swap request to that user for a skill.
5. `GET /api/requests/incoming` / `GET /api/requests/outgoing` — list requests on the dashboard.
6. `GET /api/requests/:id` — view one request's details.
7. `PATCH /api/requests/:id/accept` or `PATCH /api/requests/:id/reject` — receiver responds to a pending request.
8. `POST /api/contact` — anytime, no login needed (public contact form).

---

## Users

### GET /users

Paginated list of users.

- **Method:** `GET`
- **URL:** `/api/users`
- **Auth:** Yes
- **Path params:** none
- **Query params:**

| Param | Type | Default | Description |
|---|---|---|---|
| `page` | number | 1 | Page number (min 1) |
| `limit` | number | 10 | Items per page (max 100) |
| `search` | string | — | Case-insensitive match on username, full name, or email |

**Example request**

```
GET /api/users?page=1&limit=10&search=john
```

**Success — 200**

```json
{
  "users": [
    {
      "id": "665f1a...",
      "full_name": "John Doe",
      "email": "john@example.com",
      "title": "Frontend Developer",
      "location": "Cairo, Egypt",
      "bio": "...",
      "verified": true,
      "verified_expert": false,
      "top_contributor": true,
      "joined_at": "2026-01-15T10:00:00.000Z",
      "rating": 4.8,
      "reviews_count": 42,
      "total_swaps": 28,
      "success_rate": 96,
      "response_time": "< 1 hour",
      "session_length": "45 mins",
      "website": "https://johndoe.dev"
    }
  ],
  "page": 1,
  "limit": 10,
  "total": 57,
  "total_pages": 6
}
```

**Errors**

| Status | Body | When |
|---|---|---|
| 401 | `{ "msg": "Not authorized" }` | Missing/invalid auth cookie |
| 500 | `{ "msg": "Server error" }` | Unexpected error |

### GET /users/:id

Single user profile.

- **Method:** `GET`
- **URL:** `/api/users/:id`
- **Auth:** Yes
- **Path params:** `id` — user MongoDB ObjectId
- **Query params:** none

**Example request**

```
GET /api/users/665f1a2b3c4d5e6f7a8b9c0d
```

**Success — 200**

```json
{ "user": { "id": "665f1a...", "full_name": "John Doe", "...": "same fields as list item above" } }
```

**Errors**

| Status | Body | When |
|---|---|---|
| 400 | `{ "msg": "Invalid user id" }` | Malformed id |
| 401 | `{ "msg": "Not authorized" }` | Not logged in |
| 404 | `{ "msg": "User not found" }` | No user with that id |
| 500 | `{ "msg": "Server error" }` | Unexpected error |

---

## Swap Requests

All request objects share this shape:

```json
{
  "id": "6661ab...",
  "status": "pending",
  "created_at": "2026-07-09T14:30:00.000Z",
  "sender":   { "id": "...", "full_name": "John Doe",  "title": "Frontend Developer", "verified": true },
  "receiver": { "id": "...", "full_name": "Jane Smith", "title": "UX Designer",       "verified": false },
  "requested_skill": { "id": "...", "name": "React Development" },
  "message": "Hi! I'd love to swap skills with you."
}
```

`status` is one of `pending`, `accepted`, `rejected`.

### POST /requests

Create a swap request.

- **Method:** `POST`
- **URL:** `/api/requests`
- **Auth:** Yes (sender = logged-in user)
- **Path/Query params:** none

**Request body**

```json
{
  "receiver": "665f1a2b3c4d5e6f7a8b9c0d",
  "skill": "664e0f1a2b3c4d5e6f7a8b9c",
  "message": "Optional message, max 500 chars"
}
```

**Success — 201**

```json
{ "request": { "id": "...", "status": "pending", "...": "full request object above" } }
```

**Errors**

| Status | Body | When |
|---|---|---|
| 400 | `{ "msg": "Receiver and skill are required" }` | Missing fields |
| 400 | `{ "msg": "You cannot send a request to yourself" }` | receiver = self |
| 400 | `{ "msg": "Invalid request data" }` | Malformed ids / validation failure |
| 401 | `{ "msg": "Not authorized" }` | Not logged in |
| 404 | `{ "msg": "Receiver not found" }` / `{ "msg": "Skill not found" }` | Bad references |
| 409 | `{ "msg": "A pending request already exists" }` | Duplicate pending request (same receiver + skill) |
| 500 | `{ "msg": "Server error" }` | Unexpected error |

### GET /requests/incoming

Requests **received** by the logged-in user, newest first.

- **Method:** `GET`
- **URL:** `/api/requests/incoming`
- **Auth:** Yes
- **Params/Body:** none

**Success — 200**

```json
{ "requests": [ { "...": "request objects" } ] }
```

**Errors:** 401, 500 (as above).

### GET /requests/outgoing

Requests **sent** by the logged-in user, newest first. Identical shape to `/incoming`.

- **Method:** `GET`
- **URL:** `/api/requests/outgoing`
- **Auth:** Yes

### GET /requests/:id

Details of a single request. Only the sender or receiver may view it.

- **Method:** `GET`
- **URL:** `/api/requests/:id`
- **Auth:** Yes
- **Path params:** `id` — request ObjectId

**Success — 200**

```json
{ "request": { "...": "request object" } }
```

**Errors**

| Status | Body | When |
|---|---|---|
| 401 | `{ "msg": "Not authorized" }` | Not logged in |
| 403 | `{ "msg": "Not authorized" }` | Logged in, but not sender/receiver |
| 404 | `{ "msg": "Request not found" }` | Missing or malformed id |
| 500 | `{ "msg": "Server error" }` | Unexpected error |

### PATCH /requests/:id/accept

Accept a **pending** request. Receiver only. No body.

- **Method:** `PATCH`
- **URL:** `/api/requests/:id/accept`
- **Auth:** Yes
- **Path params:** `id` — request ObjectId

**Success — 200**

```json
{ "request": { "id": "...", "status": "accepted", "...": "rest of request object" } }
```

**Errors**

| Status | Body | When |
|---|---|---|
| 400 | `{ "msg": "Cannot accept a request that is already accepted" }` (or `rejected`) | Not pending |
| 401 | `{ "msg": "Not authorized" }` | Not logged in |
| 403 | `{ "msg": "Only the receiver can accept this request" }` | Caller is not the receiver |
| 404 | `{ "msg": "Request not found" }` | Missing or malformed id |
| 500 | `{ "msg": "Server error" }` | Unexpected error |

### PATCH /requests/:id/reject

Same contract as `/accept`, but sets `status` to `rejected`. Error messages say "reject" instead of "accept".

---

## Contact

### POST /contact

Submit a contact form message. **Public — no login required.**

- **Method:** `POST`
- **URL:** `/api/contact`
- **Auth:** No
- **Path/Query params:** none

**Request body** (all fields required)

```json
{
  "full_name": "John Doe",
  "email": "john@example.com",
  "subject": "How can we help?",
  "message": "Tell us more about your inquiry..."
}
```

Limits: `full_name` ≤ 100 chars, `subject` ≤ 200, `message` ≤ 2000, `email` must be valid.

**Success — 201**

```json
{
  "msg": "Message sent successfully",
  "contact_message": {
    "id": "6662cd...",
    "full_name": "John Doe",
    "email": "john@example.com",
    "subject": "How can we help?",
    "message": "Tell us more about your inquiry...",
    "created_at": "2026-07-09T15:00:00.000Z"
  }
}
```

**Errors**

| Status | Body | When |
|---|---|---|
| 400 | `{ "msg": "All fields are required" }` | Missing field |
| 400 | `{ "msg": "Invalid email address" }` | Bad email format |
| 400 | `{ "msg": "Invalid contact data" }` | Length/validation failure |
| 500 | `{ "msg": "Server error" }` | Unexpected error |
