import express from "express";
import mysql2 from "mysql2";
import cors from "cors";

const app = express();

const db = mysql2.createConnection(
{
    host: "localhost",
    user: "root",
    password: "manas",
    database: "attendance_try"
})

app.use(express.json());  
app.use(cors())

// done
app.get("/",(req, res) => {
  const username = req.query.username;
  console.log(req)
  const q = `SELECT * FROM attendance WHERE username = ? AND total >0`;

    db.query(q , [username], (err, result) => {
        if (err) throw err;
        console.log(result);
        res.send(result);
    })
})

// done
app.get("/TodaysSchedule", (req, res) => {
  const requestedDay = req.query.day;
  const username = req.query.username; 
  if (!requestedDay || isNaN(requestedDay) || requestedDay < 1 || requestedDay > 7) {
      return res.status(400).json({ 
          error: "Invalid day parameter. Please provide a number between 1 and 7" 
      });
  }

  if (!username) {
      return res.status(400).json({ 
          error: "Username is required" 
      });
  }

  db.query(
      "SELECT * FROM timetable WHERE day = ? AND username = ? ORDER BY start_time", 
      [requestedDay, username], 
      (err, result) => {
          if (err) {
              console.error("Database error:", err);
              return res.status(500).json({ 
                  error: "An error occurred while fetching the schedule" 
              });
          }
          res.json(result);
      }
  );
});

// done
app.get("/ScheduleNew",(req, res) =>{
  const username = req.query.username;
 
  console.log(username)
  if (!username) {
        return res.status(400).json({ error: "Username is required" });
    }
    const q = "SELECT DISTINCT subject FROM attendance WHERE username = ?";
    db.query(q, [username], (err, result) => {
      if (err) {
          console.error("Database error:", err);
          return res.status(500).json({ error: "Database error" });
      }
      console.log(result)
      res.json(result);
  });
});

// done
app.post("/ScheduleNew", async (req, res) => {
  let { subject, customSubject, day, startTime, endTime, username } = req.body;

  // Use custom subject if provided
  if (subject === "custom") {
      subject = customSubject;
  }

  // Validate required fields
  if (!subject || !day || !startTime || !endTime || !username) {
      return res.status(400).json({
          success: false,
          message: "All fields are required"
      });
  }

  try {
      // First, ensure the attendance entry exists
      const attendanceQuery = `
          INSERT IGNORE INTO attendance 
          (subject, present, total, username) 
          VALUES (?, 0, 0, ?)
      `;

      db.query(attendanceQuery, [subject, username], (err) => {
          if (err) {
              console.error("Error creating attendance record:", err);
              return res.status(500).json({
                  success: false,
                  message: "Failed to create attendance record"
              });
          }

          // Now insert the timetable entry
          const insertQuery = `
              INSERT INTO timetable 
              (subject, day, start_time, end_time, username) 
              VALUES (?, ?, ?, ?, ?)
          `;

          db.query(insertQuery, 
              [subject, day, startTime, endTime, username],
              (err, result) => {
                  if (err) {
                      console.error("Database error:", err);
                      // Handle duplicate entries with a meaningful message
                      if (err.code === 'ER_DUP_ENTRY') {
                          return res.status(409).json({
                              success: false,
                              message: "This schedule entry already exists for the selected day and time"
                          });
                      }
                      return res.status(500).json({
                          success: false,
                          message: "Failed to create schedule"
                      });
                  }

                  res.json({
                      success: true,
                      message: "Subject scheduled successfully",
                      data: result
                  });
              }
          );
      });
  } catch (err) {
      console.error("Server error:", err);
      res.status(500).json({
          success: false,
          message: "Internal server error"
      });
  }
});



// not being used
    app.post("/TodaysSchedule",(req, res) =>{
    const q = "INSERT INTO attendance (`subject`, `present`, `total`) VALUES (?,?,?)"
    const values=[
        req.body.subject,
        req.body.present,
        req.body.total
    ];
    db.query(q, values, (err, data) => {
        if (err) throw err;
       return res.json("subject added successfully");
    })
})

// done
app.put("/update", (req, res) => {
  const q = "UPDATE attendance SET present = ?, total = ? WHERE subject = ? AND username = ?;";
  const values = [
      req.body.present,
      req.body.total,
      req.body.subject,
      req.body.username  
  ];
  
  db.query(q, [...values], (err, data) => {
      if (err) {
          console.error("Update error:", err);
          return res.status(500).json({
              message: "Failed to update attendance"
          });
      }
      
      if (data.affectedRows === 0) {
          return res.status(404).json({
              message: "No matching record found for this subject and username"
          });
      }
      
      res.json({
          message: "Attendance updated successfully",
          data: data
      });
  });
});
  
// done
const today = new Date();
const dayOfWeek = today.getDay();
app.get("/AttendanceCard", (req, res) => {
  const username = req.query.username;
  if (!username) {
    return res.status(400).json({ error: 'Username is required' });
  }

  const query = `
    SELECT * FROM timetable 
    WHERE day = ? 
    AND username = ? 
    AND (last_checked IS NULL OR last_checked < DATE_SUB(NOW(), INTERVAL 1 WEEK))
  `;

  db.query(query, [dayOfWeek + 1, username], (err, result) => {
    if (err) {
      console.error('Error fetching attendance data:', err);
      return res.status(500).json({ error: 'Failed to fetch attendance data' });
    }

    const response = {
      counter: result.length,
      data: result
    };

    res.json(response);
  });
});


// done
app.post("/AttendanceCardT", (req, res) => {
  const { subject, username } = req.body;

  // Step 1: Update present and total in attendance
  const attendanceQuery = "UPDATE attendance SET present = present + 1, total = total + 1 WHERE subject = ? AND username = ?";
  db.query(attendanceQuery, [subject, username], (err, data) => {
    if (err) {
      console.error('Error updating attendance:', err);
      return res.status(500).json({ error: 'Failed to update attendance' });
    }

    if (data.affectedRows === 0) {
      return res.status(404).json({ error: 'No matching record found for the given subject and username' });
    }

    // Step 2: Update last_checked in timetable
    const timetableQuery = "UPDATE timetable SET last_checked = NOW() WHERE day = ? AND username = ?";
    db.query(timetableQuery, [new Date().getDay() + 1, username], (err, timetableData) => {
      if (err) {
        console.error('Error updating timetable last_checked:', err);
        return res.status(500).json({ error: 'Failed to update timetable last_checked' });
      }

      res.json({ message: "Attendance and last_checked updated successfully" });
    });
  });
});

app.post("/AttendanceCardF", (req, res) => {
  const { subject, username } = req.body;

  if (!username) {
    return res.status(400).json({ error: 'Username is required' });
  }

  // Step 1: Update only total in attendance
  const attendanceQuery = "UPDATE attendance SET total = total + 1 WHERE subject = ? AND username = ?";
  db.query(attendanceQuery, [subject, username], (err, data) => {
    if (err) {
      console.error('Error updating attendance:', err);
      return res.status(500).json({ error: 'Failed to update attendance' });
    }

    if (data.affectedRows === 0) {
      return res.status(404).json({ error: 'No matching record found for the given subject and username' });
    }

    // Step 2: Update last_checked in timetable
    const timetableQuery = "UPDATE timetable SET last_checked = NOW() WHERE day = ? AND username = ?";
    db.query(timetableQuery, [new Date().getDay() + 1, username], (err, timetableData) => {
      if (err) {
        console.error('Error updating timetable last_checked:', err);
        return res.status(500).json({ error: 'Failed to update timetable last_checked' });
      }

      res.json({ message: "Total updated in attendance and last_checked updated in timetable successfully" });
    });
  });
});


  // no need
  app.delete("/TodaysSchedule", (req, res) => {
    const q = "DELETE FROM timetable WHERE subject = ? AND day = ? AND start_time = ?";
    const values = [
      req.body.subject,
      req.body.day,
      req.body.start_time,
    ];
  
    db.query(q, values, (err, data) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json("Attendance schedule deleted successfully");
    });
  });
  


  app.post('/register', (req, res) => {
    const { username, password } = req.body;
  
    db.query('SELECT * FROM user WHERE username = ?', [username], (err, result) => {
      if (err) throw err;
  
      if (result.length > 0) {
        return res.status(409).send('Username already exists');
      }
  
      db.query('INSERT INTO user (username, password) VALUES (?, ?)', [username, password], (err, result) => {
        if (err) throw err;
        res.status(201).send('User registered successfully');
      });
    });
  });
  
  app.post('/login', (req, res) => {
    const { username, password } = req.body;
  
    db.query('SELECT * FROM user WHERE username = ?', [username], (err, result) => {
      if (err) throw err;
  
      if (result.length === 0) {
        return res.status(401).send('Invalid username or password');
      }
  
      if (result[0].password !== password) {
        return res.status(401).send('Invalid username or password');
      }
  
      res.status(200).json({
        message: 'Login successful',
        username: req.body.username  
      });

    });
  });


  app.delete("/delete/:subject/:username", (req, res) => {
    const { subject, username } = req.params;
  
    const q = "DELETE FROM attendance WHERE subject = ? AND username = ?";
    const values = [subject, username];
  
    db.query(q, values, (err, data) => {
      if (err) {
        return res.status(500).json({ message: err.message });
      }
  
      if (data.affectedRows === 0) {
        return res.status(404).json({ message: "Subject not found" });
      }
  
      res.json("Subject deleted successfully");
    });
  });
  


app.listen(8800,()=>{
    console.log("connected to back end !")
});