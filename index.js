const express = require("express");
const cors = require('cors');
const fs = require('fs');
const bodyParser = require('body-parser');
const app = express();
const path = require("path");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());

app.get("/students", (req, res) => {
  res.sendFile(path.join(__dirname, "data.json"));
});
app.put("/students/:mssv", (req, res) => {
  const mssv = req.params.mssv;
  const students = require("./data.json");
  const student = students.data.find((student) => student.mssv === mssv);

  if (!student) {
    res.status(404).json({ error: "Student not found" });
    return;
  }

  const studentIndex = students.data.indexOf(student);
  const updatedStudent = req.body;
  students.data[studentIndex] = updatedStudent;
  fs.writeFileSync("./data.json", JSON.stringify(students));

  res.json(updatedStudent); // Return the student information
});

app.delete("/students/:mssv", (req, res) => {
  const mssv = req.params.mssv;
  const students = require("./data.json");
  const studentIndex = students.data.findIndex((student) => student.mssv === mssv);

  if (studentIndex === -1) {
    res.status(404).json({ error: "Student not found" });
    return;
  }

  students.data.splice(studentIndex, 1);
  fs.writeFileSync("./data.json", JSON.stringify(students));

  res.json({ message: "Student deleted successfully" });
});

app.post("/students", (req, res) => {
  const newStudent = req.body;
  const students = require("./data.json");
  const updatedStudents = [...students.data, newStudent];

  fs.writeFile("./data.json", JSON.stringify({ data: updatedStudents }), (err) => {
    if (err) {
      console.error("Lỗi khi ghi file JSON:", err);
      res.status(500).json({ error: "Lỗi khi lưu sinh viên mới" });
    } else {
      res.status(201).json({ message: "Sinh viên mới đã được thêm thành công" });
    }
  });
});


app.listen(3001, () => {
  console.log("Server is running on port 3001");
});
