/*********************************************************************************
* BTI325 – Assignment 3
* I declare that this assignment is my own work in accordance with Seneca Academic Policy.
* No part of this assignment has been copied manually or electronically from any other source
* (including web sites) or distributed to other students.
*
* Name: Vishesh Sharma Student ID: 117431213 Date: 30/10/22
*
* Online (Cyclic) URL:
* https://mysterious-reef-29940.herokuapp.com/
********************************************************************************/ 
var HTTP_PORT = process.env.PORT || 8080;
var express = require("express");
var app = express();
var path = require('path');
var linkToDataService__ = require(__dirname + "/data-service.js");
app.use(express.static('public'));
const fs = require('fs');  
const multer = require("multer");
const exphbs = require("express-handlebars");

app.engine(".hbs", exphbs.engine({
    extname: ".hbs",
    
    defaultLayout: "main",
   helpers: {navLink : function(url, options)
    {
        return '<li' +
        ((url == app.locals.activeRoute) ? ' class="active" ' : '') +'><a href=" ' + url + ' ">' + options.fn(this) + '</a></li>';
       } ,
    equal: function (lvalue, rvalue, options) {
        if (arguments.length < 3)
        throw new Error("Handlebars Helper equal needs 2 parameters");
        if (lvalue != rvalue) {
        return options.inverse(this);
        } else {
        return options.fn(this);
        }
       } }})
    );
app.set("view engine", ".hbs");

const storage = multer.diskStorage({
    destination: "./public/images/uploaded",
    filename :function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
        } 
    }
  );
  
  // tell multer to use the diskStorage function for naming files instead of the default.
  const upload = multer({ storage: storage });
 
app.use(express.json());
app.use(express.urlencoded({extended: true}));

onHttpStart = () => {
    console.log('Express http server listening on port ' + HTTP_PORT);
    
}
app.use(function(req,res,next){
    let route = req.baseUrl + req.path;
    app.locals.activeRoute = (route == "/") ? "/" : route.replace(/\/$/, "");
    next();
   });
   
//home
app.get('/', (req, res) => {
    res.render("home");
});



//about
app.get('/about', (req, res) => {
    res.render("about")
});
//managers
app.get("/managers", (req, res) => {
    linkToDataService__.getManagers().then((data) => {
        res.send(JSON.stringify(data));
    }).catch((error) => {
        res.json({error});
    })
});
//employees
app.get("/employees", (req, res) => {
if(req.query.status)
{console.log(req.query.status);
   
    linkToDataService__.getEmployeesByStatus(req.query.status).then((stats)=>{
        res.send(JSON.stringify(stats));;
     
    }).catch((err)=>{
        res.json({err})
       
    })
}
else if(req.query.department)
{
    linkToDataService__.getEmployeesByDepartment(req.query.department).then((depts)=>{
        res.send(JSON.stringify(depts));;
    
    }).catch((err)=>{
        res.json({err})
    })


}
else if(req.query.manager)
{
    linkToDataService__.getEmployeesByManager(req.query.manager).then((mang)=>{
        res.send(JSON.stringify(mang));;
    
    }).catch((err)=>{
        res.json({err})
    })

}
else{

    linkToDataService__.getAllEmployees().then((data) => {
 res.render("employees",{"employees": data, title: "Employees"});
    }).catch((error) => {
        res.render({message: "no results"});
    })}
});
//departments
app.get("/departments", (req, res) => {
    linkToDataService__.getDepartments().then((data) => {
        res.render("departments", {departments:
            data});
            
    }).catch((error) => {
        res.render({message: "no results"});
    })
});

app.get("/employee/:value",(req,res)=>{
    linkToDataService__.getEmployeeByNum(req.params.value).then((data) => {
        res.render("employee", { employee: data })
    }).catch((error) => {
       res.render("employee",{message:"no results"})
    })

});

app.get("/employees/add",(req,res)=>
{
    res.render("addEmployee")
})

app.post('/employees/add', (req,res) => {
    linkToDataService__.addEmployee(req.body).then(() => {
        res.redirect("/employees");
    }).catch((error)=>{
        res.json({error});
    })
});
app.get("/images/add",(req,res)=>
{
    res.render("addImage");
})
app.post("/images/add", upload.single("imageFile"), (req, res) => {
    res.redirect("/images")
  });
  app.get("/images", (req,res) => {
    fs.readdir("./public/images/uploaded", function(err,items) {
        if(err)
        {
         
            console.log(err);
        }
      
        res.render("images", {
            "images": items,
            layout: false // do not use the default Layout (main.hbs)
          });
    })
});


   app.post("/employee/update", (req, res) => {
     linkToDataService__.updateEmployee(req.body).then(() => {
    res.redirect("/employees");
}).catch((error)=>{
    console.log('Assignment Not Complete');
})});  
linkToDataService__.initialize().then(() => {
    app.listen(HTTP_PORT, onHttpStart());
    
}).catch (() => {
    console.log('Assignment Not Complete');
});
app.use((req, res) => {
    res.status(404).end('404 PAGE NOT FOUND');
});
