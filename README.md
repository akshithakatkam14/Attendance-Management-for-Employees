# Attendance-Management-for-Employees
 A modern, responsive web application built with HTML5, CSS3, and JavaScript for tracking employee attendance and working hours. Features user authentication with login/signup functionality, real-time check-in/check-out system, advanced filtering and search capabilities, CSV data export, and a beautiful glass-morphism UI design. 


 # 📊 Attendance Management System

A modern, responsive web application for tracking employee attendance and working hours with user authentication.

## ✨ Features

- **User Authentication** - Login/Signup with email and password
- **Check In/Check Out** - Mark employee attendance
- **Real-time Statistics** - Employees today, currently present, total hours
- **Advanced Filtering** - Search by name, filter by date and status
- **Data Export** - Download attendance records as CSV
- **Responsive Design** - Works on desktop, tablet, and mobile
- **Modern UI** - Beautiful gradient backgrounds with glass-morphism effects

## 🚀 Quick Start

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- No additional dependencies required!


## 📱 How to Use

### 1. Authentication
- **Sign Up**: Create a new account with your details
- **Login**: Use your email and password to access the system

### 2. Mark Attendance
1. Enter employee name in the input field
2. Click **"Check In"** to mark arrival
3. Click **"Check Out"** to mark departure
4. View real-time statistics and records

### 3. Manage Records
- **Search**: Use the search box to find specific employees
- **Filter**: Use date and status filters to narrow down records
- **Export**: Download attendance data as CSV
- **Clear**: Remove all records (with confirmation)

## 🛠️ Project Structure

```
attendance-management-system/
├── public/
│   ├── index1.html          # Main HTML file
│   ├── style1.css           # Complete CSS with responsive design
│   └── app1.js              # JavaScript with authentication & attendance logic
└── README.md               # Project documentation
```

## 🔧 Technologies Used

- **HTML5** - Semantic markup and structure
- **CSS3** - Modern styling with CSS Grid, Flexbox, and animations
- **Vanilla JavaScript** - Pure ES6+ JavaScript, no frameworks
- **localStorage** - Client-side data persistence

## 🐛 Debugging

Open browser console (F12) and use these commands:

```javascript
// View all attendance data
attendanceData()

// Add sample test data
addSampleData()

// Clear date filter to show all records
clearDateFilter()

// Show all records (clear all filters)
showAllRecords()
```


## 📊 Data Format

### Attendance Record Structure
```javascript
{
  id: 1704067200000,           // Unique timestamp ID
  name: "John Doe",             // Employee name
  date: "2024-01-15",          // Date in YYYY-MM-DD format
  checkIn: "2024-01-15T09:00:00.000Z",  // ISO timestamp
  checkOut: "2024-01-15T17:00:00.000Z", // ISO timestamp
  hours: 8.0,                  // Working hours (calculated)
  status: "Completed"          // "Present" or "Completed"
}
```

## 📝 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**Your Name**
- GitHub: [akshithakatkam14](https://github.com/akshithakatkam14)
- Email: akshithakatkam14@gmail.com

---

⭐ **Star this repository if you found it helpful!**
