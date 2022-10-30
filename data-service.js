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

exports.addEmployee=(employeeData)=>{
    if(employeeData.isManager==undefined)
    {
        employeeData.isManager=false;
    }
    else
    {
employeeData.isManager=true;
    }
    employeeData.employeeNum=employees.length +1;
    employees.push(employeeData);
    return new Promise ((resolve,reject) => {
        
       if (employeeData.length == 0) 
            reject('no results returned');
       
            resolve();
    })

};
exports.getEmployeesByStatus=(status)=>
{

    return new Promise ((resolve,reject) => {
        var stats=[]
        for(var i=0;i<employees.length;i++)
       {
        if(employees[i].status==status)
        {
           
            stats.push(employees[i])
        }}
        if (status.length == 0) 
            reject('no results returned');
       
            resolve(stats);
    })
}
exports.getEmployeesByDepartment=(department)=>
{
    return new Promise ((resolve,reject) => {
        var Dept_status=[];
        for(var i=0;i<employees.length;i++)
       {
        if(employees[i].department==department)
        {
            
            Dept_status.push(employees[i]);
        }}
        if (Dept_status.length == 0) 
            reject('no results returned');
       
            resolve(Dept_status);
    })
}
exports.getEmployeesByManager=(manager)=>
{

    return new Promise ((resolve,reject) => {
        var mang_status=[];
        for(var i=0;i<employees.length;i++)
       {
        if(employees[i].employeeManagerNum==manager)
        {
            
            mang_status.push(employees[i]);
        }}
        if (mang_status.length == 0) 
            reject('no results returned');
       
            resolve(mang_status);
    })
}
exports.getEmployeeByNum=(num)=>{
    return new Promise ((resolve,reject) => {
    var nums;
    for(var i=0;i<employees.length;i++)
    {
     if(employees[i].employeeNum==num)
     {
         
         nums=employees[i];
     }}

     if (nums.length == 0) 
     reject('no results returned');

     resolve(nums);


})
}