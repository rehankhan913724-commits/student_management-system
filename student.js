const express = require("express");
const mysql = require("mysql2");

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:false}));

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "admin",
    database: "student_db"
});

db.connect((err) => {
    if (err){
        console.log("Connection failed!");
    }
    else{
        console.log("Succefully connected")
    }
});

app.post("/addstudent", (req,res) => {
    const { name, rollno, clas } = req.body;
    if(!name || !rollno || !clas){
        return res.send("all field require!");
    }
    const sql = "INSERT INTO students(name, rollno, clas) VALUES(?, ?, ?)";
    db.query(sql, [name, rollno, clas]), (err, results) => {
        if(err){
            return res.send("Database error!");
        }
        else{
            return res.send("Student added successfully!");
        }
    }
});

app.get("/liststudent", (req, res) => {
    const sql = "SELECT * FROM students";
    db.query(sql, (err, results) => {
        if(err){
            return res.send("Database error!");
        }
        return res.json(results);
    })
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});