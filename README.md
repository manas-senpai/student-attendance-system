# Student Attendance Management System

A web application for managing student attendance and timetable using Node.js, React, and MySQL.

## Features

- User authentication (Login/Register)
- Attendance tracking
- Timetable management
- Subject-wise attendance statistics

## Prerequisites

Before running this project, make sure you have the following installed:
- Node.js (v14 or higher)
- MySQL (v8.0 or higher)
- npm (Node Package Manager)

## Project Setup

### 1. Clone the Repository

```bash
git clone https://github.com/manas-senpai/student-attendance-system.git
cd student-attendance-system
```

### 2. Database Setup

1. Create a MySQL database
```sql
CREATE DATABASE attendance_db;
USE attendance_db;
```

2. Create the required tables:

```sql
-- User table
CREATE TABLE user (
    username VARCHAR(255) NOT NULL PRIMARY KEY,
    password VARCHAR(255) NOT NULL
);

-- Attendance table
CREATE TABLE attendance (
    subject VARCHAR(100) NOT NULL PRIMARY KEY,
    present INT,
    total INT,
    username VARCHAR(255),
    FOREIGN KEY (username) REFERENCES user(username)
);

-- Timetable table
CREATE TABLE timetable (
    subject VARCHAR(100) NOT NULL,
    day INT NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME,
    username VARCHAR(255) NOT NULL,
    PRIMARY KEY (subject, day, start_time, username),
    FOREIGN KEY (username) REFERENCES user(username)
);
```

### 3. Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory with the following content:
```env
DB_HOST=localhost
DB_USER=your_mysql_username
DB_PASSWORD=your_mysql_password
DB_NAME=attendance_db
PORT=5000
```

4. Start the backend server:
```bash
npm start
```

### 4. Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the frontend development server:
```bash
npm start
```

The application should now be running at `http://localhost:3000`

## Database Structure

### User Table
```sql
+----------+--------------+------+-----+---------+-------+
| Field    | Type         | Null | Key | Default | Extra |
+----------+--------------+------+-----+---------+-------+
| username | varchar(255) | NO   | PRI | NULL    |       |
| password | varchar(255) | NO   |     | NULL    |       |
+----------+--------------+------+-----+---------+-------+
```

### Attendance Table
```sql
+----------+--------------+------+-----+---------+-------+
| Field    | Type         | Null | Key | Default | Extra |
+----------+--------------+------+-----+---------+-------+
| subject  | varchar(100) | NO   | PRI | NULL    |       |
| present  | int          | YES  |     | NULL    |       |
| total    | int          | YES  |     | NULL    |       |
| username | varchar(255) | YES  | MUL | NULL    |       |
+----------+--------------+------+-----+---------+-------+
```

### Timetable Table
```sql
+------------+--------------+------+-----+---------+-------+
| Field      | Type         | Null | Key | Default | Extra |
+------------+--------------+------+-----+---------+-------+
| subject    | varchar(100) | NO   | PRI | NULL    |       |
| day        | int          | NO   | PRI | NULL    |       |
| start_time | time         | NO   | PRI | NULL    |       |
| end_time   | time         | YES  |     | NULL    |       |
| username   | varchar(255) | NO   | PRI | NULL    |       |
+------------+--------------+------+-----+---------+-------+
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details




