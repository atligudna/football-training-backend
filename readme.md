# ⚽ Football Training Backend  
### Node.js · Express · PostgreSQL · TypeScript · JWT · Zod

This backend powers a complete football training management system: drills, categories, fields, equipment, drag-and-drop drill items, training sessions, analytics and more.

It is built using **clean architecture**, **middleware-driven validation**, **PostgreSQL relations**, and a fully centralized **error handling layer**.

---

## 🚀 Features

### **Authentication**
- JWT login & register
- Role-based access (coach, admin-ready)
- Middleware protected routes

### **Drills System**
- Create and manage drills
- Assign categories & fields
- Add drill items for drawing: players, cones, arrows, runs, zones…
- Add equipment per drill
- Soft-delete logic (`is_deleted`)

### **Training Sessions**
- Create training sessions
- Assign drills in order (`order_number`)
- Optional duration override
- Full session view with drills included

### **Coach Dashboard Analytics**
- Sessions past 30 days
- Most used drills
- Top 10 drills by popularity
- Filter drills by category, difficulty, equipment

### **Quality of Life**
- Zod validation schemas
- Global error handler
- Reusable successResponse helper
- Seed script to generate demo data
- Fully typed models & controllers

---

## 🧱 Tech Stack

| Layer | Technology |
|-------|------------|
| Runtime | Node.js |
| Server | Express |
| Language | TypeScript |
| Database | PostgreSQL |
| DB Client | pg-promise |
| Auth | JWT |
| Validation | Zod |
| Error Handling | Centralized middleware |
| Deployment-ready | Railway / Render |

---

## 📂 Folder Structure
--src/
  -- config/ # database connection
  -- controllers/ # logic for each resource
  -- models/ # DB queries
  -- routes/ # express routes
  -- middleware/ # auth, validate, success/error handlers
  -- schemas/ # zod validation schemas
  -- scripts/
  -- seed.ts # Seed script


---

## 🔧 Installation

###  Clone repository

```bash
git clone https://github.com/your-user/football-training-backend.git
cd football-training-backend

2. Install dependencies
npm install

3. Create .env file

PORT=3000
PGHOST=localhost
PGPORT=5432
PGDATABASE=football_training
PGUSER=postgres (or your user)
PGPASSWORD=yourpassword
JWT_SECRET=your-secret

4. Run database migrations

Import schema.sql into your PostgreSQL:

psql -U postgres -d football_training -f schema.sql

5. Seed demo data
npm run seed

6. Start server (development)
npm run dev

🗄 Database Schema Diagram
users (1) ────< drills >──── (1) categories
   │                │
   │                └──── (N) drill_items
   │
   └────< sessions >──── session_drills >──── drills

equipment ────< drill_equipment >──── drills
fields ───────< drills

Authentication
Register

POST /auth/register

Body:

{
  "name": "Atli",
  "email": "atli@example.com",
  "password": "secret123"
}

Login

POST /auth/login

Response:

{
  "success": true,
  "token": "JWT_TOKEN",
  "user": { "id": 1, "email": "atli@example.com" }
}


Use the token:

Authorization: Bearer <token>

API Overview

Drills
   Method   Endpoint	Description
 - GET	    /drills	    Get all drills
 - POST	    /drills	    Create drill
 - PATCH	/drills/:id	Update drill
 - DELETE	/drills/:id	Soft delete drill
 
 Drill Items
   Method   Endpoint
 - GET	    /drills/:id/items
 - POST	    /drills/:id/items
 - PATCH	/drill-items/:id
 - DELETE	/drill-items/:id


Equipment

 - | POST | /equipment |
 - | POST | /drills/:id/equipment |

Sessions

 - | POST | /sessions |
 - | GET | /sessions |
 - | GET | /sessions/:id |
 - | PATCH | /sessions/:id |
 - | DELETE | /sessions/:id |

Dashboard

 - GET /dashboard

Validation Layer (Zod)

Each endpoint validates input using Zod schemas:

 - authSchemas.ts

 - drillSchemas.ts

 - drillItemSchema.ts

 - sessionSchema.ts

 
 Validation errors always return:

{
  "success": false,
  "error": "Validation error",
  "details": { ... }
}

Central Error Handling

All controllers throw errors, which are caught by:

middleware/errorHandler.ts


Output format is unified:

{
  "success": false,
  "error": "Something went wrong"
}

Seeding

Run:

 - npm run seed


This generates:

 - demo users

 - categories

 - fields

 - drills

 - sessions

 - drill items


Environment Variables required:
 - DATABASE_URL=postgres://...
 - JWT_SECRET=your-secret
 - NODE_ENV=production

Start command:
 - npm run start


Works seamlessly on:

 - Railway.app

 - Render.com

 - Supabase (DB only)

Roadmap / Future Features

 - Role permissions (admin)

 - Player attendance tracking

 - Session templates

 - Stripe subscription

 - AI drill suggestions

 - Motion detection for video uploads

Author

-- Developed by Atli as a structured, scalable backend for football training management.
