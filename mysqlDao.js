var mysql = require('promise-mysql')

var pool

//pool to request mysql data
mysql.createPool({
    connectionLimit :10,
    host : 'localhost',
    user:'root',
    password: '0rangetree',
    database: 'collegedb'
})
.then((result)=>{
    //if pool was successfully created, assignt result to pool variable
    pool = result
})
.catch((error)=>{ //error message printed if pool not created
    console.log(error)
})


//******************* MODULES */
var getModules = function(){
    
    return new Promise((resolve, reject) =>{
        pool.query('select * from module')

        //return promise
        .then((result)=>{
            resolve(result)
        })//then

        //return error
        .catch((error)=>{
            reject(error)
        })//catch
    })
}//getModules

var getModule = function(mid){
    return new Promise((resolve, reject) =>{
        pool.query(`select * from module where mid="${mid}" `)

        //return promise
        .then((result)=>{
            resolve(result)
        })//then

        //return error
        .catch((error)=>{
            reject(error)
        })//catch
    })
}//getModules

var updateModule = function(module){
    return new Promise((resolve, reject) =>{
        pool.query(`update module set name='${module.name}', credits='${module.credits}' where mid='${module.mid}'`)

        //return promise
        .then((result)=>{
            resolve(result)
        })//then

        //return error
        .catch((error)=>{
            reject(error)
        })//catch
    })
}//updateModules


//********************STUDENTS */
var getStudents = function(){
    return new Promise((resolve, reject) =>{
        pool.query('select * from student')

        //return promise
        .then((result)=>{
            resolve(result)
        })//then

        //return error
        .catch((error)=>{
            reject(error)
        })//catch
    })
}//getStudents


var deleteStudent = function(sid){
    return new Promise((resolve, reject) =>{
        pool.query(`delete from student where sid=?`)

        //return promise
        .then((result)=>{
            resolve(result)
        })//then

        //return error
        .catch((error)=>{
            reject(error)
        })//catch
    })
}//getStudents

var addStudent = function(student){
    return new Promise((resolve, reject) =>{
        pool.query(`insert into student (sid,name,gpa) values ('${student.sid}', '${student.name}', '${student.gpa}')`)

        //return promise
        .then((result)=>{
            resolve(result)
        })//then

        //return error
        .catch((error)=>{
            reject(error)
        })//catch
    })
}//getStudents


//export function
module.exports = {getModules, getModule, updateModule, getStudents, deleteStudent, addStudent}

