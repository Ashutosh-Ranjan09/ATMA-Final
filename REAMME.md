# 🎓 ATMA - Advanced Timetable Management Application

Welcome to **ATMA**, a comprehensive web-based timetable management system designed to streamline academic scheduling for educational institutions. Built with modern web technologies, ATMA makes timetable creation, management, and visualization effortless for administrators, faculty, and staff.

## ✨ What Makes ATMA Special?

ATMA isn't just another scheduling tool - it's a complete solution that transforms how educational institutions handle their timetabling challenges. Whether you're managing a small department or a large university, ATMA adapts to your needs with intelligent algorithms and an intuitive interface.

### 🌟 Key Features

- **🤖 Intelligent Scheduling Algorithm**: Automatically generates optimal timetables considering room capacity, faculty availability, and course requirements
- **🏢 Multi-Department Support**: Manage timetables for multiple departments with centralized and department-specific rooms
- **👤 User Authentication**: Secure login system ensuring data privacy and user-specific access
- **📅 Interactive Timetable Editor**: Visual drag-and-drop interface for manual timetable adjustments
- **📊 Multiple View Modes**:
  - Department-wise timetables
  - Faculty-wise schedules
  - Room-wise allocations
- **📱 Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **📋 Export Capabilities**: Generate PDF reports and export timetables for sharing
- **🔄 Real-time Updates**: Changes reflect instantly across all views

## 🛠️ Technology Stack

ATMA is built with cutting-edge technologies to ensure performance, scalability, and maintainability:

### Frontend

- **Next.js 15** - React framework with server-side rendering
- **React 19** - Modern UI library with latest features
- **Bootstrap 5** - Responsive CSS framework
- **React Bootstrap** - Bootstrap components for React
- **Lucide React** - Beautiful icons
- **HTML2Canvas & jsPDF** - Client-side export functionality

### Backend

- **Next.js API Routes** - Serverless backend functions
- **MongoDB** - NoSQL database for flexible data storage
- **Mongoose** - Elegant MongoDB object modeling

### Authentication & Security

- **JSON Web Tokens (JWT)** - Secure authentication
- **bcryptjs** - Password hashing
- **JOSE** - JWT verification
- **HTTP-only cookies** - Secure token storage

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

- **Node.js** (version 18 or higher)
- **npm** or **yarn**
- **MongoDB** (local or cloud instance)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/Ashutosh-Ranjan09/ATMA-Final.git
   cd ATMA-Final
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment Setup**
   
   Create a `.env.local` file in the root directory and add:

   ```env
   # Database Configuration
   MONGODB_URI=your_mongodb_connection_string
   
   # JWT Secret (use a strong, random string)
   JWT_SECRET=your_super_secure_jwt_secret_key
   
   # Application URL (for production)
   NEXT_PUBLIC_SOCKET_URL=http://localhost:3000
   ```

4. **Start the development server**

   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000) and start using ATMA!

## 📖 How to Use ATMA

### 1. **Getting Started**

- Create an account or log in to your existing account
- You'll be redirected to the main dashboard

### 2. **Setting Up Your Institution**

- **Create Departments**: Add your academic departments (Computer Science, Mechanical Engineering, etc.)
- **Add Courses**: Define courses with details like course ID, name, credits, faculty, and student count
- **Setup Classrooms**: Configure rooms with capacity and type (Central or Department-specific)

### 3. **Generating Timetables**

- Navigate to "Create Timetable"
- Select a department
- Ensure you have added courses and classrooms for that department
- Click "Generate Timetable" - ATMA's algorithm will automatically create an optimal schedule

### 4. **Customizing Your Schedule**

- Use the "Edit Timetable" feature for manual adjustments
- Add, remove, or modify individual classes
- Change instructors, rooms, or time slots as needed

### 5. **Viewing and Sharing**

- Use "View Timetable" to see schedules from different perspectives:
  - **Department View**: See all classes for a specific department
  - **Faculty View**: Track individual faculty schedules
  - **Room View**: Monitor room utilization
- Export timetables as PDFs for printing or sharing

## 🧮 The Smart Algorithm

ATMA's scheduling algorithm is designed with real-world constraints in mind:

### **Optimization Factors**

- **Room Capacity**: Ensures student count doesn't exceed room capacity
- **Credit Distribution**: Properly distributes course credits across time slots
- **Faculty Availability**: Prevents scheduling conflicts for instructors
- **Room Utilization**: Optimizes room usage across departments
- **Time Slot Management**: Balances workload across different times

### **Constraint Handling**

- No double-booking of rooms or faculty
- Preference for optimal room sizes (closest fit to student count)
- Support for both central and department-specific resources
- Automatic conflict resolution

## 📁 Project Structure

```txt
ATMA-Final/
├── app/                          # Next.js App Router
│   ├── api/                      # API endpoints
│   │   ├── courses/             # Course management
│   │   ├── departments/         # Department management
│   │   ├── rooms/               # Room management
│   │   ├── timetables/          # Timetable operations
│   │   └── user/                # Authentication
│   ├── CreateTimetable/         # Timetable creation page
│   ├── Dashboard/               # Main dashboard
│   ├── EditTimetable/           # Timetable editing
│   ├── ViewTimeTable/           # Viewing interface
│   └── login/                   # Authentication page
├── components/                   # Reusable React components
├── models/                      # MongoDB data models
├── utils/                       # Utility functions & algorithm
└── public/                      # Static assets
```

## 🔧 API Endpoints

ATMA provides a comprehensive REST API:

### Authentication

- `POST /api/user/login` - User login
- `POST /api/user/register` - User registration
- `GET /api/user/me` - Get current user info
- `POST /api/user/logout` - User logout

### Data Management

- `GET/POST/DELETE /api/courses` - Course operations
- `GET/POST/DELETE /api/rooms` - Room management
- `GET/POST /api/departments` - Department handling
- `GET/POST/PATCH/DELETE /api/timetables` - Timetable operations

## 🎨 User Interface Highlights

- **Clean, Modern Design**: Intuitive interface that's easy to navigate
- **Color-Coded Timetables**: Visual distinction between different courses and time slots
- **Responsive Layout**: Adapts beautifully to any screen size
- **Interactive Elements**: Drag-and-drop functionality for easy editing
- **Real-time Feedback**: Instant visual feedback for all user actions

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: Bcrypt encryption for user passwords
- **HTTP-Only Cookies**: Prevents XSS attacks
- **Route Protection**: Middleware ensures only authenticated users access protected routes
- **Input Validation**: Server-side validation for all API endpoints

## 🌐 Deployment

### Development

```bash
npm run dev
```

### Production Build

```bash
npm run build
npm start
```

### Environment Variables for Production

```env
NODE_ENV=production
MONGODB_URI=your_production_mongodb_uri
JWT_SECRET=your_production_jwt_secret
NEXT_PUBLIC_SOCKET_URL=your_production_domain
```

## 🤝 Contributing

We welcome contributions to make ATMA even better! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes**: Implement your feature or fix
4. **Test thoroughly**: Ensure your changes work correctly
5. **Commit your changes**: `git commit -m 'Add amazing feature'`
6. **Push to branch**: `git push origin feature/amazing-feature`
7. **Open a Pull Request**: Describe your changes and their benefits

### Development Guidelines

- Follow existing code style and conventions
- Add comments for complex logic
- Test your changes thoroughly
- Update documentation if needed

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🆘 Support & Issues

Encountering issues or have questions? We're here to help!

- **Create an Issue**: [GitHub Issues](https://github.com/Ashutosh-Ranjan09/ATMA-Final/issues)
- **Documentation**: Check this README and code comments
- **Community**: Connect with other users and contributors

## 🙏 Acknowledgments

- **Bootstrap Team** - For the excellent UI framework
- **Next.js Team** - For the amazing React framework
- **MongoDB Team** - For the flexible database solution
- **Open Source Community** - For inspiration and contributions

## 🔮 Future Enhancements

We're constantly working to improve ATMA. Upcoming features include:

- **📧 Email Notifications**: Automated schedule updates
- **📊 Analytics Dashboard**: Insights into room utilization and scheduling patterns
- **🔄 Bulk Import/Export**: CSV/Excel integration for large datasets
- **🌍 Multi-language Support**: Localization for global use
- **📱 Mobile App**: Native mobile applications
- **🤖 AI-Powered Suggestions**: Smart recommendations for optimal scheduling

---

Made with ❤️ for Educational Institutions Worldwide

ATMA - Simplifying Academic Scheduling, One Timetable at a Time
