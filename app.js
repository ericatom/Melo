const express = require("express");
const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");

app.get("/", function(req, res){
    res.render("index")
});

app.get("/new", function(req, res){
    res.send("New form")
});

app.get("/list", function(req,res){
    res.send("list of applicants")
});

app.get("/list/:applicantID", function(req,res){
    var applicantid = req.params.applicantID;
    res.render("applicant", {
        id: applicantid
    });
});

app.get("*", function(req, res){
    res.send("Route doesn't exist.")
});

app.listen(3000, () => console.log("App is running.."));