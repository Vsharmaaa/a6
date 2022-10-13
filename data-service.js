const fs = require('fs');     
var employees = [];
var departments = [];

exports.initialize = () => {
    return new Promise ((resolve, reject) => {
        fs.readFile('./data/employees.json', (err,data) => {
            if (err) 
                reject ('Sorry! Cannot Read The employee file');
            
           
                employees = JSON.parse(data);
            
        });

        fs.readFile('./data/departments.json', (err,data)=> {
            if (err) 
            reject ('Sorry! Cannot Read The department file');
            
                departments = JSON.parse(data);
            
        })
        resolve();
    })
};

exports.getAllEmployees = () => {
    return new Promise ((resolve,reject) => {
        
        if (employees.length == 0) 
            reject('no results returned');
       
            resolve(employees);
    })
};

exports.getManagers = () => {
    return new Promise ((resolve, reject) => {
        var getManagers = [];
        for(var i=0;i<employees.length;i++)
        { if(employees[i].isManager==true)
            getManagers.push(employees[i]);
        }
        if (getManagers.length == 0) {
            reject('no results returned');
        }
        resolve(getManagers);
    })
};

exports.getDepartments = () => {
    return new Promise((resolve,reject) => {
        if (departments.length == 0) 
            reject ('no results returned');
    

            resolve (departments);
        
    })
};


