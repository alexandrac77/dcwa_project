var express = require('express')
var mongoDao = require('./mongoDao')
const { body, validationResult } = require('express-validator');
var mysqlDao = require('./mysqlDao')
var bodyParser = require('body-parser')
//const http =require('http')
var app = express()
app.set('view engine', 'pug');
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());




app.get('/', (req,res)=>{
    res.sendFile(__dirname + '/views/home.html')
})


//   list module details
app.get('/modules',(req, res)=>{
    mysqlDao.getModules()
        .then((result)=>{
            res.render('modules',{result:result})
        //res.send(result)
        })
        .catch((error)=>{
            res.send(error)
        }) 
        
})


app.get('/modules/edit/:mid', (req,res)=>{
    mysqlDao.getModule(req.params.mid)
    .then((result)=>{
        var module = result[0]
        res.render('edit_modules', {module:module}) 
    //res.send(result)
    })
    .catch((error)=>{
        res.send(error)
    }) 
    //res.render('edit_modules', {mid:req.params.mid}) 
})


//   update modules 
app.post('/modules/update', body('name').isLength({min:5}), body('credits').isIn(['5','10','15']), (req,res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }
    console.log(req.body)
    mysqlDao.updateModule(req.body)
    .then((result)=>{
    res.redirect('/modules')
    })
    .catch((error)=>{
        res.send(error)
    }) 
})


//   list student details
app.get('/students',(req, res)=>{
    //res.sendFile(__dirname + "/views/students.html")
    mysqlDao.getStudents()
        .then((result)=>{
            res.render('students',{result:result})
        //res.send(result)
        })
        .catch((error)=>{
            res.send(error)
        }) 
})


//  delete student
app.get('/students/delete/:sid', (req,res) =>{
    mysqlDao.deleteStudent(req.params.sid)
    .then((result) =>{
        res.send(result)
    })
    .catch((error)=>{
        res.send("<h3>Error Message:" +req.params.sid+ "has associated modules. they cannot be deleted. </h3>" )
    })
})


//  add student
app.get('/addStudent', (req,res)=>{
    res.render("add_student")
})

app.post('/addStudent', body('sid').isLength({min:4, max:4}),body('name').isLength({min:5}),body('gpa').isLength({min:0.0,max:4.0}), (req,res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }
    console.log(req.body)
    mysqlDao.addStudent(req.body)
    .then((result)=>{
        res.redirect('/students')
    })
    .catch((error)=>{
        res.send(error)
    }) 
})


//  list lecturers from mongo db
app.get('/lecturers',(req, res)=>{
    //res.redirect('/lecturers')
    mongoDao.getLecturers()
        .then((documents)=>{
            console.log(documents)
            res.render('lecturers',{documents:documents})
        })
        .catch((error)=>{
            res.send(error)
        }) 
})


//  add lecturer
app.get('/addLecturer', (req,res)=>{
    res.render("add_lecturer")
})

app.post('/addLecturer', body('_id').isLength({min:4}),body('name').isLength({min:5}), body('dept').isLength(3),  (req,res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }
    console.log(req.body)
    mongoDao.addLecturer(req.body._id, req.body.name, req.body.dept)
    .then((result)=>{
        res.redirect('/lecturers')
    })
    .catch((error)=>{
        if(error.message.includes("11000")){
            res.send("_id already exists")
        } else{
        res.send(error.message)
        }
    }) 
})



app.listen(3000, () =>{
    console.log("listening on port 3000")    
}) 