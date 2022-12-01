/*************************************************************************
* BTI325– Assignment 5
* I declare that this assignment is my own work in accordance with Seneca Academic Policy.
No part of this assignment has been copied manually or electronically from any other source.
* (including 3rd party web sites) or distributed to other students.
*
* Name:Vishesh Sharma Student ID: 117431213 Date: 29/11/2022
*
* 
* Online ( Cyclic) Link: https://bunny-tights.cyclic.app/
*
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
    runtimeOptions:{
allowProtoPropertiesByDefault:true,
allowedProtoMethodsByDefault:true,
    },
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
        res.render("data");
    }).catch((error) => {
        res.json({error});
    })
});
//employees
app.get("/employees", (req, res) => {
if(req.query.status)
{
   
    linkToDataService__.getEmployeesByStatus(req.query.status).then((stats)=>{
       
        res.render("employees",{employees: stats});
     
    }).catch((err)=>{
        res.render({message: "no results"});
       
    })
}
else if(req.query.department)
{
    linkToDataService__.getEmployeesByDepartment(req.query.department).then((depts)=>{
        res.render("employees",{employees: depts});
    
    }).catch((err)=>{
        res.render({message: "no results"});
    })


}
else if(req.query.manager)
{
    linkToDataService__.getEmployeesByManager(req.query.manager).then((mang)=>{
        res.render("employees",{employees: mang});
    
    }).catch((err)=>{
        res.render({message: "no results"});
    })

}
else{

    linkToDataService__.getAllEmployees().then((data) => {
 res.render("employees",{"employees": data});
    }).catch((error) => {
        res.render({message: "no results"});
    })}
});
//departments
app.get("/departments", (req, res) => {
    linkToDataService__.getDepartments().then((data) => {
        res.render("departments",{"departments": data});
            
    }).catch((error) => {
        res.render({message: "no results"});
    })
});

app.get("/departments/add", (req,res) => {
    res.render(path.join(__dirname + "/views/addDepartment.hbs"));
});

app.post("/departments/add", (req,res) => {
   linkToDataService__.addDepartment(req.body).then(() => {
        res.redirect("/departments");
    })
});

app.post("/department/update", (req,res) => {
    linkToDataService__.updateDepartment(req.body).then(() => {
        res.redirect("/departments");
    })
});
app.get("/department/:departmentId", (req, res) =>{
    linkToDataService__.getDepartmentById(req.params.departmentId)
    .then((data) => {res.render("department", { department: data })})
    .catch((err) => res.status(500).send("department not found"))
});



app.get('/employees/add',(req,res) => {
   linkToDataService__.getDepartments()
    .then(data => res.render("addEmployee", {departments: data}))
    .catch(err => res.render("addEmployee", {departments: []}));
});
app.get("/employee/:empNum", (req, res) => {
   
    // initialize an empty object to store the values
    let viewData = {};
   linkToDataService__.getEmployeeByNum(req.params.empNum).then((data) => {
    if (data) {
    viewData.employee = data; //store employee data in the "viewData" object as "employee"
    } else {
    viewData.employee = null; // set employee to null if none were returned
    }
    }).catch(() => {
    viewData.employee = null; // set employee to null if there was an error
    }).then(linkToDataService__.getDepartments)
    .then((data) => {
    viewData.departments = data; // store department data in the "viewData" object as
   "departments"
    // loop through viewData.departments and once we have found the departmentId that matches
    // the employee's "department" value, add a "selected" property to the matching
    // viewData.departments object
   
    for (let i = 0; i < viewData.departments.length; i++) {
    if (viewData.departments[i].departmentId == viewData.employee.department) {
    viewData.departments[i].selected = true;
    }
    }
    }).catch(() => {
    viewData.departments = []; // set departments to empty if there was an error
    }).then(() => {
    if (viewData.employee == null) { // if no employee - return an error
    res.status(404).send("Employee Not Found");
    } else {
    res.render("employee", { viewData: viewData }); // render the "employee" view
    }
    });
   });
   

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
            "images": items
            //layout: false // do not use the default Layout (main.hbs)
          });
    })
});

app.get('/employees/delete/:value', (req,res) => {
    linkToDataService__.deleteEmployeeByNum(req.params.value)
    .then(res.redirect("/employees"))
    .catch((err) => res.status(500).send("Employee not found"))
});
app.get('/departments/delete/:value', (req,res) => {
    linkToDataService__.deleteDepartmentByNum(req.params.value)
    .then(res.redirect("/departments"))
    .catch((err) => res.status(500).send("Department not found"))
});

   app.post("/employee/update", (req, res) => {
     linkToDataService__.updateEmployee(req.body).then(() => {
    res.redirect("/employees");
}).catch((error)=>{7
    console.log('As Not Complete');
})}); 



linkToDataService__.initialize().then(() => {
    app.listen(HTTP_PORT, onHttpStart());
    
}).catch (() => {
    console.log('zsignment Not Complete');
}); 
app.use((req, res) => {
    res.status(404).end('404 PAGE NOT FOUND');
});
