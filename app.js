//app.js
const express = require("express")
const app = express()
const ejs = require("ejs")
const mongoose = require("mongoose")
const bodyparser = require("body-parser")
const Student = require("./models/students")
const methodOverride = require('method-override')

app.use(express.static("public"))
app.use(bodyparser.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.set("view engine", "ejs")
mongoose.set('useFindAndModify', false);

// connect to Mongoose
mongoose
  .connect("mongodb://localhost:27017/studentDB", {
    useNewUrlParser: true, //使用新版的url解析器, 避免舊版出現錯誤或警告
    useUnifiedTopology: true, //使用新版的拓樸引擎 (Unified Topology)
  })
  .then(() => {
    console.log("Successfully connected to MongoDB");
  })
  .catch(e => {
    console.log("Connection failed");
    console.log(e);
  })

// routes
app.get("/", (req, res) => {
  res.send(`This is Homepage. :D
    <a href="/students">Student page</a> `)
})

app.get("/students", async (req, res) => {
  try {
    let data = await Student.find()
    res.render("students.ejs", { data })
  } catch {
    res.send("Error with Finding data.")
  }
})

app.get("/student/insert", (req, res) => {
  res.render("studentInsert.ejs")
})

app.get("/student/:id", async (req, res) => {
  let { id } = req.params
  try {
    let data = await Student.findOne({ id })
    if (data !== null) { //避免id=null(沒有這個id)而出現錯誤頁面
      res.render("studentPage.ejs", { data })
    } else {
      res.send("Cannot find this student.  Please enter a valid id.")
    }
  }
  catch (e) { // Student Model有問題 才會catch到 id=null不會catch
    res.send("Error")
    console.log("Error in finding student id. ");
    console.log(e);
  }
})

app.post("/student/insert", (req, res) => {
  // console.log(req.body); //看傳回來的內容
  let { id, name, age, merit, other } = req.body
  let newStudent = new Student({ id, name, age, scholarship: { merit, other } })
  newStudent.save().then(() => {
    console.log("Student accepted.");
    res.render("accept.ejs")
  }).catch(e => {
    console.log("Student not accepted.");
    console.log(e);
    res.render("reject.ejs")
  })
})

app.get("/students/edit/:id", async (req, res) => {
  let { id } = req.params
  try {
    let data = await Student.findOne({ id })
    if (data !== null) {
      res.render("edit.ejs", { data })
    } else {
      res.send("Cannot find this student.  Please enter a valid id(edit).")
    }
  } catch (e) {
    res.send("Error!")
    console.log("Student Id finding error (edit).");
    console.log(e);
  }
})

app.put("/students/edit/:id", async (req, res) => {
  console.log(req.body);
  let { id, name, age, merit, other } = req.body
  try {
    let d = await Student.findOneAndUpdate({ id }, { id, name, age, scholarship: { merit, other } }, {
      new: true,
      runValidators: true,
    })
    res.redirect(`/student/${id}`)
  } catch {
    res.render("reject.ejs")
  }
})

app.delete("/students/delete/:id", (req, res) => {
  let { id } = req.params
  Student.deleteOne({ id })
    .then((message) => {
      console.log(message);
      res.send("Student id deleted.")
    })
    .catch((e) => {
      console.log(e);
      res.send("Delete failed.")
    })
})

app.get("/*", (req, res) => { //設定404頁面
  res.status(404)
  res.send("Not Allowed")
})

//Listen
app.listen(3000, () => {
  console.log("~~~服務生3000跑步中~~~");
})