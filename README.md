# Multi-Tenant SaaS Notes Application

This is a full-stack SaaS application that allows multiple companies (tenants) to manage their users and notes securely. It features role-based access control and subscription plan limits.

## Tech Stack
* **Frontend:** React, Vite, Tailwind CSS, Framer Motion
* **Backend:** Node.js, Express, MongoDB (with Mongoose)
* **Authentication:** JWT (Bearer Token)

## Multi-Tenancy Approach

This project implements a **Shared Database, Shared Collection with a `tenantId`** model.

* **Database:** A single MongoDB database is used for all tenants.
* **Collections:** All data (e.g., users, notes) for all tenants resides in shared collections.
* **Data Isolation:** Strict data isolation is enforced at the application layer. Every document in a tenant-specific collection (like `notes` and `users`) contains a `tenantId` field. Every database query on the backend is filtered by the `tenantId` extracted from the authenticated user's JWT. This ensures that a user from one tenant can never access, modify, or even know about the existence of data belonging to another tenant.

## Getting Started

### Prerequisites
- Node.js
- MongoDB connection string (from Atlas or a local instance)

### Backend Setup
1. Navigate to the `saas-notes-backend` directory.
2. Run `npm install`.
3. Create a `.env` file and add your `MONGO_URI` and `JWT_SECRET`.
4. Run `npm run seed` to populate the database with tenants and test users.
5. Run `npm start` to start the backend server.

### Frontend Setup
1. Navigate to the `saas-notes-frontend` directory.
2. Run `npm install`.
3. Create a `.env.local` file and add `VITE_BACKEND_URL=http://localhost:5001`.
4. Run `npm run dev` to start the frontend development server.

## Test Accounts
All accounts have the password: `password`

- `admin@acme.test` (Admin, Tenant: Acme)
- `user@acme.test` (Member, Tenant: Acme)
- `admin@globex.test` (Admin, Tenant: Globex)
- `user@globex.test` (Member, Tenant: Globex)