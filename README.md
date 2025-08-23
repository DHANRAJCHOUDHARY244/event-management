# event-management
https://docs.google.com/document/d/1-MMwuL4r6RGLQZuTrNjl17Iz5Vkm1P2OBKLQ79wNdXM/edit?usp=sharing


## EventHub-README.md

# EventHub – Event Management System

A full-stack web application to create, manage, and register for events. Built with **React (Vite, Tailwind CSS)** on the frontend and **PHP + MySQL** on the backend, featuring secure **JWT authentication**, role-based access (user, organizer, admin), and event dashboards.

---

##  Features

- User registration & login with strong password policies
- JWT-based authentication with refresh-token mechanism
- Role-based access control: **User**, **Organizer**, **Admin**
- Event creation, retrieval, deletion (organizer/admin)
- Event registration (user)
- Dashboard for user’s created and registered events
- Frontend: responsive UI, dark mode toggle, client-side validation
- Backend: input validation, rate-limiting, CORS handling, secure token storage

---

##  File Structure

```

EventHub/
├── client/                      # Frontend
│   ├── api/
│   │   └── apiClient.ts         # Axios setup with token interceptors
│   ├── auth/
│   │   └── ProtectedRoute.tsx
│   ├── components/              # Reusable UI modules
│   ├── context/                 # Theme & sidebar contexts
│   ├── hooks/                   # Custom React hooks
│   ├── layout/                  # Sidebar, header, layout
│   ├── pages/                   # App screens (signin, dashboard, events…)
│   ├── store/                   # Zustand (auth) store
│   ├── main.tsx & App.tsx       # Entry & routing with dark mode toggle
│   └── index.css, tailwind.config.js
└── server/                      # Backend
├── bootstrap.php            # CORS, DB connection, table creation, default admin
├── config.php               # Database and JWT config
├── jwt.php                  # Token creation and verification
├── auth.php                 # Reusable auth/role functions
├── register.php             # User registration API
├── login.php                # User login API, rate limit
├── logout.php               # Logout & revoke refresh token
├── refresh.php              # Refresh JWT token
├── events.php               # Event CRUD & details
├── register\_event.php       # Event signup API
├── dashboard.php            # User dashboard data API
└── rate\_limit.php           # Login attempt protection

````

---

##  Installation & Setup

### Prerequisites

- **Node.js & npm**
- **PHP 8+, Composer**
- **MySQL**

### Backend Setup

1. Clone the repo and navigate to the server folder:
   ```bash
   cd server


2. Install dependencies:

   ```bash
   composer require firebase/php-jwt
   ```

3. Configure `config.php`:

   * Set database credentials
   * Define `JWT_SECRET`, `ACCESS_TTL`, `REFRESH_TTL`

4. Start backend server:

   ```bash
   php -S localhost:8000
   ```

5. **Note:**
### A default admin user ([admin@admin.com](mailto:admin@admin.com) / Admin@123) is auto-created on first run. Change this after logging in!
### Frontend Setup

1. From the root directory, go to `client/`:

   ```bash
   cd client
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create `.env` file:

   ```
   VITE_BACKEND_URL=http://localhost:8000
   ```

4. Run the development server:

   ```bash
   npm run dev
   ```

---

## Usage

1. Visit `http://localhost:5173`
2. Register or sign in (or use default admin account)
3. Explore features based on your user role:

   * **Users:** browse and register for events
   * **Organizers/Admins:** create or delete events
   * **Dashboard:** view created/registered events
4. Dark mode toggle, responsive layout, form validations across the UI

---

## Testing

### Backend via Postman or cURL:

* **POST** `/register.php` → Test validations & create new users
* **POST** `/login.php` → Retrieve JWT and refresh token
* **GET/POST/DELETE** `/events.php` → Test CRUD operations with proper roles
* **POST** `/register_event.php` → Test event registrations and duplicates handling
* **POST** `/refresh.php` → Simulate token refresh workflow

### Frontend Manual Testing:

* Ensure form validations (email format, strong password)
* Verify protected routes redirect correctly
* Check JWT storage and automatic logout on 401 responses
* Confirm dark mode persists across sessions
* Test admin functionality: event creation/deletion

---

## Tech Stack

| Layer          | Technology                                |
| -------------- | ----------------------------------------- |
| Frontend       | React, Vite, Tailwind CSS, Zustand, Axios |
| Backend        | PHP, PDO, MySQL, Firebase JWT             |
| Authentication | JWT access & refresh tokens               |
| Styling        | Tailwind CSS                              |
| State          | Zustand (auth management)                 |

---

## Team Members

* **Aman** – CIHE231402 – Backend/API & JWT auth
* **Husnain Ali** – CIHE240280 – Frontend & Dashboard UI
* **Attiq** – CIHE240404 – Form validation & API integration
* **Kartik Sharma** – CIHE231437 – Testing & UX
* **Charanpal Kaur** – CIHE23865 – Documentation & components

---

## References

* Tailwind CSS – [https://tailwindcss.com](https://tailwindcss.com)
* React – [https://reactjs.org](https://reactjs.org)
* Firebase JWT – [https://github.com/firebase/php-jwt](https://github.com/firebase/php-jwt)
* PHP manual – [https://www.php.net/docs.php](https://www.php.net/docs.php)
* MySQL documentation – [https://dev.mysql.com/doc/](https://dev.mysql.com/doc/)

---

