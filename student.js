const express = require("express");
const mysql = require("mysql2");
const cors = require("cors")
require("dotenv").config();

const app = express();

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({extended:false}));

const db = mysql.createConnection({
   host: process.env.MYSQLHOST,
   user: process.env.MYSQLUSER,
   password: process.env.MYSQLPASSWORD,
   database: process.env.MYSQLDATABASE,
   port: process.env.MYSQLPORT,
   ssl: {
   rejectUnauthorized: false
}
});

db.connect((err) => {
    if (err){
        console.log("Connection failed!");
        console.log(err);
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
    db.query(sql, [name, rollno, clas], (err, results) => {
        if(err){
            return res.send("Database error!");
        }
        else{
            return res.send("Student added successfully!");
        }
    })
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

app.put("/updatestudent/:rollno", (req, res) => {
    const rollno = req.params.rollno;

    const {name, clas} = req.body;

    const sql = " UPDATE students SET name=?, clas=?, WHERE rollno=?";
    db.query(sql, [name, rollno, clas], (err, results) => {
        if (err){
            console.log(err)
            res.send("Database Error!");
        }
        res.send(`rollno ${rollno} updated sucessfully`)
    })
});

app.delete("/deletestudent/:rollno", (req, res) => {
    const rollno = req.params.rollno;
    const sql = "DELETE FROM students WHERE rollno=?";
    db.query(sql, [rollno], (err, result) => {
        if (err){
            console.log(err);
            res.send("Database Error!");
        }
        res.send(`rollno ${rollno} deleted sucessfully`)
    })
});
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log("Server running on port ",port);
});