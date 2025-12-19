## ATMA: Advanced Timetable Management Application

**ATMA** is a web-based solution designed to simplify academic scheduling for educational institutions. It combines automated scheduling with intuitive user interfaces to help administrators, faculty, and staff manage timetables efficiently.

---

### Overview

ATMA addresses common timetabling challenges by providing:

* Automated schedule generation based on institutional constraints
* Visual editors for manual adjustments
* Multiple perspective views (department, faculty, room)
* Export options for reports and sharing

---

### Key Features

* **Automated Scheduling**

  * Generates conflict-free timetables considering room capacity, instructor availability, and course requirements
  * Applies straightforward constraints: no double-booking, capacity checks, and balanced time‑slot distribution

* **Flexible Editing Tools**

  * Drag-and-drop interface for manual adjustments
  * Real‑time conflict detection and alerts

* **Multi-View Support**

  * Department-wise, faculty-wise, and room-wise schedule views
  * Custom filters for date ranges and course types

* **Responsive Design**

  * Full support for desktop, tablet, and mobile browsers
  * Accessible layout with clear visual indicators

* **Export and Reporting**

  * PDF export of timetables
  * Downloadable data formats for integration with other systems

* **User Management and Security**

  * Role-based access controls (administrator, faculty, staff)
  * Secure authentication using JSON Web Tokens (JWT) and HTTP-only cookies
  * Password hashing with bcrypt

---

### Technology Stack

* **Frontend**

  * Next.js (React) for server-side rendering and routing
  * Bootstrap 5 for layout and components
  * Lucide React for icons
  * html2canvas and jsPDF for client-side exports

* **Backend**

  * Next.js API routes (serverless functions)
  * MongoDB with Mongoose for data persistence
  * JSON Web Tokens (JWT) for authentication

* **Development Tools**

  * Node.js (v18+) and npm/yarn
  * ESLint and Prettier for code quality

---

### Getting Started

1. **Clone the repository**

   ```bash
   git clone https://github.com/Ashutosh-Ranjan09/ATMA-Final.git
   cd ATMA-Final
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment**
   Create a `.env.local` file with:

   ```env
   MONGODB_URI=<your_connection_string>
   JWT_SECRET=<your_jwt_secret>
   NEXT_PUBLIC_SOCKET_URL=http://localhost:3000
   ```

4. **Run in development**

   ```bash
   npm run dev
   ```

5. **Access the application**
   Open `http://localhost:3000` in your browser.

---

### Project Structure

```
ATMA-Final/
├── app/                # Next.js application router
│   ├── api/            # API endpoints
│   ├── components/     # Reusable UI components
│   ├── pages/          # Route-based pages
│   └── public/         # Static assets
├── models/             # Mongoose schemas
├── utils/              # Helper functions and scheduling logic
└── README.md           # Project documentation
```

---

### API Endpoints

* `POST /api/user/register` — Register new user

* `POST /api/user/login` — Authenticate user

* `GET /api/user/me` — Get current user

* `POST /api/user/logout` — Log out user

* `GET/POST/DELETE /api/departments` — Manage departments

* `GET/POST/DELETE /api/courses` — Manage courses

* `GET/POST/DELETE /api/rooms` — Manage rooms

* `GET/POST/PATCH/DELETE /api/timetables` — Manage timetables

---

### Contribution Guidelines

Contributions are welcome to improve ATMA. Please follow these steps:

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature-description`).
3. Implement and test your changes.
4. Commit with clear messages.
5. Submit a pull request describing your updates.

---
