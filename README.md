# 🐬 DolphinCSS Cloud UI Bank Server

This repository contains the backend API server, database models, and web portal client for the DolphinCSS Cloud UI Bank and Developer Dashboard.

## 🚀 Stack & Technologies
- **Backend API**: Node.js, Mongoose, MongoDB
- **Routing Engine**: `dolphin-server-modules` (Koa-like lightweight server module)
- **Database**: MongoDB (holds components, version logs, and developer profiles)
- **Web Frontend**: Vanilla HTML5, Vanilla CSS (DolphinCSS UI theme + styling), Tailwind CDN (utility helpers), AlpineJS (client state), PrismJS (code highlighting).

---

## 📂 Project Structure
```
dolphincss-template/
├── backend/                  # Backend Node.js server
│   ├── models/               # Mongoose Schemas (Component, Developer)
│   ├── controllers/          # Business logic controllers
│   ├── routes/               # API Router endpoints
│   ├── app.js                # Core app boot entrypoint
│   └── package.json
├── templates/                # Cache / pre-seeded component files
├── index.html                # Public UI Bank Portal
├── dashboard.html            # Developer Admin Dashboard
├── view.html                 # Component Detail & Engagement Viewer
└── push.html                 # Direct Web Push Panel
```

---

## ⚡ API Routes Reference

### 1. Developer Authorization
- `GET /api/templates/developer/token?username=...`
  - Headers: `x-admin-secret: <token>`
  - Returns the unique developer token.

### 2. Component CRUD
- `POST /api/templates/push`
  - Creates or upserts a component.
  - Requires `x-admin-secret` (global admin secret or developer specific token).
- `PATCH /api/templates/:id/settings`
  - Updates component settings, metadata, or code.
- `DELETE /api/templates/:id`
  - Deletes the component.

### 3. Retrieval & Lists
- `GET /api/templates/list`
  - Query: `author`, `category`, `search`, `visibility`
  - Returns component metadata lists.
- `GET /api/templates/:name`
  - Returns the raw template code.
  - Query `preview=true` returns wrapped HTML page for iframe previewing.
- `GET /api/templates/:name/details`
  - Returns detailed database document fields.

---

## ⚙️ Running Locally

1. **Prerequisites**: Ensure you have Node.js and MongoDB installed and running locally.
2. **Configuration**: Create `backend/.env` file:
   ```env
   PORT=3000
   MONGODB_URI=mongodb://127.0.0.1:27017/dolphincss-templates
   ADMIN_SECRET=dolphin-admin-2025
   ```
3. **Install Dependencies**:
   ```bash
   cd backend
   npm install
   ```
4. **Seed components**: Run the migration script to seed the initial 42 templates:
   ```bash
   node migrate.js
   ```
5. **Start Server**:
   ```bash
   node app.js
   ```
   Open `http://localhost:3000` to view the UI Bank portal, or `http://localhost:3000/dashboard` to manage templates.

---

**Built with ❤️ in Nepal.**
