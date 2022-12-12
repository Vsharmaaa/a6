const mongoose=require("mongoose");
var Schema =mongoose.Schema;
const bcrypt = require('bcryptjs');
var userSchema=new Schema({
    userName:{type: String,
        unique:true},
password: String,
email: String,
loginHistory :[{
    dateTime: Date,
    userAgent: String
}]


})
let User; // to be defined on new connection (see below)

exports.initialize = () => {
    return new Promise((resolve,reject) => {
   let myDB= mongoose.createConnection("mongodb+srv://Vish01:ABCD1234@senecaweb.zy7xc6b.mongodb.net/?retryWrites=true&w=majority",{ useNewUrlParser: true });
   myDB.on('error', (err)=>{
    reject("db1 error!");
  });
  
  myDB.once('open', ()=>{
    User= myDB.model("users",userSchema)
   resolve("Connect success!");
  });
})}

exports.registerUser = (userData) => {
    return new Promise((resolve, reject) => {
        if(userData.password === "" || userData.password2 === "" )

{
    reject("Error: user name cannot be empty or only white spaces! ");
}
else if(userData.password!=userData.password2)
{
    reject("Passwords Do not match");
}
else{
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(userData.password, salt, function(err, hash) {
            if (err) {
                reject("error in  encrypting password");
            }
            else {
                userData.password = hash;
                let newUser = new User(userData);
                newUser.save((err) => {
                    if (err) {
                        if (err.code === 11000) {
                            reject("User Name already taken");
                        }
                        else {
                            reject("There was an error creating the user: " + err);
                        }
                    }
                    else {
                        resolve();
                    }
                })
            }
        })
    })
}
})
}

    exports.checkUser = (userData) => {
       
            
                return new Promise(function (resolve, reject) {
                    User.find({ userName: userData.userName })
                        .exec()
                        .then((users) => {
                            if (users.length == 0) {
                                reject("Unable to find user: " + userData.userName);
                            } else {
                                bcrypt.compare(userData.password, users[0].password)
                                    .then((result) => {
                                        if (result == false) {
                                            reject("Incorrect Password for user: " + userData.userName);
                                        } else {
                                            users[0].loginHistory.push({
                                                "dateTime": (new Date()).toString(),
                                                "userAgent": userData.userAgent
                                            });
            
                                            User.updateOne(
                                                { userName: users[0].userName },
                                                { $set: { loginHistory: users[0].loginHistory } }
                                            )
                                                .exec()
                                                .then(() => {
                                                  
                                                    resolve(users[0]);
                                                })
                                                .catch((err) => {
                                                    reject("There was an error,verifying the user: " + err);
                                                })
                                        }
                                    })
                                    .catch((err) => {
                                        reject("w"+err);
                                    })
            
                            }
                        })
                        .catch((err) => {
                            reject("Unable to find user: " + userData.userName);
                        })
                });
            }

        
