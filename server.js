
var HTTP_PORT = process.env.PORT || 8080;
var express = require("express");
var app = express();
var path = require('path');
var linkToDataService = require(__dirname + "/data-service.js");
app.use(express.static('public'));

app.use((req, res) => {
    res.status(404).end('404 PAGE NOT FOUND');
});
onHttpStart = () => {
    console.log('Express http server listening on port ' + HTTP_PORT);
}
//home
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + "/views/home.html"));
});



//about
app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname + "/views/about.html"));
});
//managers
app.get("/managers", (req, res) => {
    linkToDataService.getManagers().then((data) => {
        res.json({data});
    }).catch((err) => {
        res.json({err});
    })
});
//employees
app.get("/employees", (req, res) => {
    linkToDataService.getAllEmployees().then((data) => {
        res.json({data});
    }).catch((err) => {
        res.json({err});
    })
});
//departments
app.get("/departments", (req, res) => {
    linkToDataService.getDepartments().then((data) => {
        res.json({data});
    }).catch((err) => {
        res.json({ err});
    })
});
//no route provided


linkToDataService.initialize().then(() => {
    app.listen(HTTP_PORT, onHttpStart());
}).catch (() => {
    console.log('Assignment Not Complete');
});