const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const expressFile = require("express-fileupload");

//database set up
mongoose.connect("mongodb+srv://erica:Melo123@melo-hlhd1.azure.mongodb.net/test?retryWrites=true&w=majority",{
    useNewUrlParser: true, useUnifiedTopology: true
}, function(error){
    if(error){
        console.log(error);
    }else{
        console.log("Connected to DB successfully.");
    }
});

var applicantTable = new mongoose.Schema({
    firstName: String,
    lastName: String, 
    email: String,
    phone: String,
    location: String,
    role: String, 
    previousCompany: String,
    yearsExperience: Number,
    profilePicture: String,
    resume: String,
    starred: Boolean
});

var Applicant = mongoose.model("Applicant", applicantTable);

/*
Applicant.create({
    firstName: "Ted",
    lastName: "Bear", 
    email: "tbear@gmail.com",
    phone: "123-456-1230",
    location: "San Francisco",
    role: "Scrum Master", 
    previousCompany: "Burger King",
    yearsExperience: 3,
    profilePicture: "ted.jpg",
    resume: "ted.pdf"
}, function(error, data){
    if(error){
        console.log(error);
    }else{
        console.log("Added: " + data);
    }
});
*/

/*
//get data from db
Applicant.find({}, function(error, data){
    if(error){
        console.log(error);
    }else{
        console.log(data);
    }
});
*/

// app set up

app.use(express.static("public"));
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended: true}));
app.use(expressFile());

//home
app.get("/", function(req, res){
    res.render("index");
});

//add applicant form
app.get("/new", function(req, res){
    res.render("form");
});

app.post("/addApplicant", function(req, res){
    var data = req.body;
    var pictureFile = req.files.profilePicture;
    var resumeFile = req.files.resume;

    // move uploaded files to public folder
    pictureFile.mv("public/img/" + pictureFile.name, function(error){
        if(error){
            console.log(error);
        }
    });

    resumeFile.mv("public/resumes/" + resumeFile.name, function(error){
        if(error){
            console.log(error);
        }
    });

    Applicant.create({
        firstName: data.firstName,
        lastName: data.lastName, 
        email: data.email,
        phone: data.phone,
        location: data.location,
        role: data.role, 
        previousCompany: data.previousCompany,
        yearsExperience: data.yearsExperience,
        profilePicture: pictureFile,
        resume: resumeFile,
        starred: data.starred
    }, function(error, data){
        if(error){
            console.log(error);
        }else{
            console.log("Added new applicant.");
        }
        res.redirect("/");
    });
    
});

//list of applicants
app.get("/list", function(req,res){
    /*var applicants = [
        {id: 1, firstName: "Bob", lastName: "Jones"},
        {id: 2, firstName: "Lisa", lastName: "Hill"},
        {id: 3, firstName: "Kumar", lastName: "Popcorn"}
    ]*/
    Applicant.find({}, function(error, applicants){
        if(error){
            console.log(error);
        }else{
            res.render("applicantlist", {
                applicantList: applicants
        });
        }
    });   
});

//individual applicant
app.get("/list/:applicantID", function(req,res){
    var applicantid = req.params.applicantID;
    res.render("applicant", {
        id: applicantid
    });
});

//all other routes throw error
app.get("*", function(req, res){
    res.send("Route doesn't exist.")
});

app.listen(3000, () => console.log("App is running.."));