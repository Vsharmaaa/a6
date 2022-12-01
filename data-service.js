const Sequelize = require('sequelize');
var sequelize = new Sequelize('jasftmvb', 'jasftmvb', 'IRrpGRDE2wwfPNCWExI0rXFWuE2b6jNf', {
 host: 'peanut.db.elephantsql.com',
 dialect: 'postgres',
 port: 5432,
 dialectOptions: {
 ssl: true
},
// update here. You need it.
});

const Employee = sequelize.define('Employee',{
    employeeNum:{
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    firstName: Sequelize.STRING,
    last_name: Sequelize.STRING,
    email: Sequelize.STRING,
    SSN: Sequelize.STRING,
    addressStreet: Sequelize.STRING,
    addresCity: Sequelize.STRING,
    addressState: Sequelize.STRING,
    addressPostal: Sequelize.STRING,
    matritalStatus: Sequelize.STRING,
    isManager: Sequelize.BOOLEAN,
    employeeManagerNum: Sequelize.INTEGER,
    status: Sequelize.STRING,
    department: Sequelize.INTEGER,
    hireDate: Sequelize.STRING
    }, {
        createdAt: false, // disable createdAt
        updatedAt: false // disable updatedAt
});

const Department = sequelize.define('Department',{
    departmentId:{
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    departmentName: Sequelize.STRING
    }, {
        createdAt: false, // disable createdAt
        updatedAt: false // disable updatedAt
});
    
sequelize.authenticate().then(() =>{ console.log('Connection success.')})
.catch((err) =>{console.log('l', err)});
module.exports.initialize = () => {
    return new Promise(function (resolve, reject) {
        sequelize.sync().then(function() {
            
            resolve();
        }).catch((err) =>{
            reject("unable to sync the database");
        });
    });
}

exports.getAllEmployees = () => {
    return new Promise(function (resolve, reject) {
        Employee.findAll({
           
        }).then(function(data){
            resolve(data);
        }).catch(() =>{
                reject("no results returned");
        });
       });
       
};

exports.getManagers = () => {
    return new Promise(function (resolve, reject) {
        Employee.findAll({
            where: {
                isManager:true
            }
        })
        .then(resolve(Employee.findAll({ where: { isManager: true }})))
        .catch(() =>{
            reject('no results returned')})
       });
       
};

exports.getDepartments = () => {
    return new Promise(function (resolve, reject) {
        Department.findAll({
        }).then(function(data){
            resolve(data);
        }).catch(() =>{
                reject("no results returned");
        });
       });
       
};

exports.addEmployee=(employeeData)=>{
    employeeData.isManager = (employeeData.isManager) ? true : false;
    
    for (var i in employeeData) {
        if (employeeData[i] == ""){
            employeeData[i] = null;
        }}
    return new Promise(function (resolve, reject) {
        
        Employee.create(employeeData)
        .then(resolve(Employee.findAll()))
        .catch(() =>{
            reject("unable to create employee");
    });;
       

})};
exports.updateEmployee=(employeeData)=>
{           employeeData.isManager= employeeData.isManager?true:false;
     for (var i in employeeData)
    {
        if (employeeData[i]=="")
            employeeData[i]=null;
    }
  
        return new Promise(function (resolve, reject) {

            sequelize.sync().then(()=>{console.log("LO")
              Employee.update(employeeData,
                  {where: {employeeNum: employeeData.employeeNum}}
              )}).then(()=>{
                  resolve();
              }).catch((err)=>{
                  reject("unable to update employee");
              });
          });
      
    
}
exports.getEmployeesByStatus=(status)=>
{

    return new Promise(function (resolve, reject) {
        Employee.findAll({where: {
            status:status
            }
        }).then(function(data){
            resolve(data);
        }).catch(() =>{
                reject("no results returned");
        });
       });
       
}

exports.getEmployeesByDepartment=(department)=>
{
    return new Promise(function (resolve, reject) {
        Employee.findAll({where: {
            department:department
            }
        }).then(function(data){
            resolve(data);
        }).catch(() =>{
                reject("no results returned");
        });
       });
       
}
exports.getEmployeesByManager=(manager)=>
{
    return new Promise(function (resolve, reject) {
        Employee.findAll({where: {
            employeeManagerNum:manager
            }
        }).then(function(data){
            resolve(data);
        }).catch(() =>{
                reject("no results returned");
        });
       });
       
}
exports.getEmployeeByNum=(num)=>{
    return new Promise(function (resolve, reject) {
        Employee.findAll({where: {
            employeeNum:num
              }
        }).then((data)=>{
            resolve(data[0]);
        }).catch(() =>{
                reject("no results returned");
        });
    }
    )}

    exports.addDepartment = (departmentData) => {
        for (var i in departmentData) {
            if (departmentData[i] == ""){
                departmentData[i] = null;
            }}
        return new Promise(function (resolve, reject) {
            
            Department.create(departmentData)
            .then(resolve(Department.findAll()))
            .catch(() =>{
                reject("unable to create employee");
        });;
    }) 
    };


    exports.updateDepartment = (departmentData) => {
        for (var i in departmentData) {
            if (departmentData[i] == ""){
                departmentData[i] = null;
            }}
        return new Promise((resolve,reject) => {
           
    
            sequelize.sync()
            .then(Department.update(departmentData, {where: { 
                departmentId: departmentData.departmentId
            }}))
            .then(resolve(Department.update(departmentData, {where: { departmentId:departmentData.departmentId }
            }
            )
            ))
            .catch(reject('unable to update department'))
        })
    };

    exports.getDepartmentById=(id)=>{
        return new Promise(function (resolve, reject) {
           Department.findAll({where: {
                departmentId:id
                  }
            }).then((data)=>{
                resolve(data[0]);
            }).catch(() =>{
                    reject("no results returned");
            });
        }
        )}

        exports.deleteDepartmentByNum = (num) => {
            return new Promise((resolve,reject) => {
                Department.destroy({
                    where: {
                        departmentId: num
                    }
                })
                .then(resolve())
                .catch(reject('unable to delete employee'))
            })
        };

        exports.deleteEmployeeByNum = num => {
            return new Promise((resolve,reject) => {
                Employee.destroy({
                    where: {
                        employeeNum: num
                    }
                })
                .then(resolve())
                .catch(reject('unable to delete employee'))
            })
        };
        