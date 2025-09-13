# Multi-Tenant SaaS Notes Application

This is a full-stack SaaS application that allows multiple companies (tenants) to manage their users and notes securely. It features role-based access control, subscription plan limits, and a modern, responsive user interface.

## Tech Stack
* **Frontend:** React, Vite, Tailwind CSS, Framer Motion
* **Backend:** Node.js, Express, MongoDB (with Mongoose)
* **Authentication:** JWT (Bearer Token)

## Multi-Tenancy Approach

This project implements a **Shared Database, Shared Collection with a `tenantId`** model.

* **Database:** A single MongoDB database is used for all tenants.
* **Collections:** All data (e.g., users, notes) for all tenants resides in shared collections.
* **Data Isolation:** Strict data isolation is enforced at the application layer. Every document in a tenant-specific collection (like `notes` and `users`) contains a `tenantId` field. Every database query on the backend is filtered by the `tenantId` extracted from the authenticated user's JWT. This ensures that a user from one tenant can never access data belonging to another tenant.

---

## Getting Started

Follow these instructions to set up and run the full application on your local machine.

### Prerequisites
- Node.js (v18 or later recommended)
- A MongoDB database (local or a free cloud instance from MongoDB Atlas)

### Backend Setup

1.  **Navigate to the backend directory**
    ```bash
    cd saas-notes-backend
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Create your environment file**
    Copy the example file to create your own local configuration file. In the project root, you should find a `.env.example` file.
    ```bash
    cp .env.example .env
    ```

4.  **Configure your backend environment variables**
    Open the newly created `.env` file and fill in your values.

    * `PORT`: The port the local server will run on. Defaults to `5000`.
    * `MONGO_URI`: Your secret MongoDB connection string.
    * `JWT_SECRET`: Your secret key for creating tokens.
    * `LOCAL_FRONTEND_URL`: **Crucial for CORS.** This must match the URL your local frontend runs on (e.g., `http://localhost:5173`).
    * `DEPLOYED_FRONTEND_URL`: The URL of your deployed frontend, also for CORS.

5.  **Seed the database**
    This command will populate the database with the initial tenants and test users.
    ```bash
    npm run seed
    ```

6.  **Start the server**
    ```bash
    npm start
    ```
    The server will now be running on the port you specified (e.g., `http://localhost:5000`).

### Frontend Setup

1.  **Navigate to the frontend directory** in a new terminal window.
    ```bash
    cd saas-notes-frontend
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Create your environment file**
    In the root of the frontend project, create a file named `.env.local`.

4.  **Configure your frontend environment variable**
    Open the `.env.local` file and add the following line. This tells the frontend where to find the backend API. The URL must match the `PORT` you set in the backend's `.env` file.
    ```
    VITE_BACKEND_URL=http://localhost:5000
    ```

5.  **Start the development server**
    ```bash
    npm run dev
    ```
    The frontend will now be running and accessible, typically at `http://localhost:5173`.

---

## Test Accounts
All accounts have the password: `password`

- `admin@acme.test` (Admin, Tenant: Acme)
- `user@acme.test` (Member, Tenant: Acme)
- `admin@globex.test` (Admin, Tenant: Globex)
- `user@globex.test` (Member, Tenant: Globex)
