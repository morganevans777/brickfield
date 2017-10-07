var express = require('express');
var app = express();
var database = require('./firebase.js')
var bodyParser = require('body-parser')
var session = require('express-session')

var handlebars = require('express3-handlebars')
.create({defaultLayout: 'main'});

app.use(session({
    secret: 'keyboar cat',
    resave: false,
    saveUninitialized: true,
}))

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json 
app.use(bodyParser.json())


app.use(function(req, res, next){
    var path = req.path.split('/')[1];
    if(!req.session.user){
    
        if(path == 'settings'){
            res.redirect('/login');
        } else if(path == 'add'){
            res.redirect('/login');
        } else if (path == 'edit'){
            res.redirect('/login');
        } else if(path == 'remove'){
            res.redirect('/login');
        }
    }
    next();
})

app.get('/', function(req, res) {
    res.render('home', {user: req.session.user})
}); 

app.get('/login', function(req, res) {
        res.render('login');

        
})

//Morgans code

app.get('/logOut', function(req, res) {
    database.logOut(function(response, error){
        if(error === undefined){
            delete req.session.user; 
            res.redirect('/')
        } else {
            console.log(error)
        }
    })  
})

//Morgans code 

app.post('/login', function(req, res) {
    database.login(req.body.email, req.body.password, function(response, error){
        if(response !== undefined){
            req.session.user = response;
            res.redirect('/settings')
        } else if(error !== undefined) {
            console.log('error')
            res.redirect('/login')
        }
    })
 
})

app.get('/settings', function(req, res) {
    database.fetchData('all',function(data) {
        var values = {events: [], tenants: [], brokers: [], user: req.session.user}
        data.forEach(function(item){
            if(item.category === 'events'){
                values.events.push(item);
            } else if(item.category === 'tenants'){
                values.tenants.push(item);
            } else if(item.category === 'brokers'){
                values.brokers.push(item);
            }
        })
        res.render('settings', values);
    });
})

app.get('/edit/:category/:id', function(req, res) {
    database.fetchDataById(req.params.category, req.params.id, function(data){
        res.render('edit', {description: data.description, title: data.title , category: req.params.category, id: req.params.id, user: req.session.user})
    })
})

app.post('/edit/:category/:id', function(req, res){
    var data = {title: req.body.title, description: req.body.description};
    database.update(req.params.category, req.params.id,data );
    res.redirect('/settings')
})

app.get('/add/:category', function(req, res){
    switch(req.params.category){
        case 'events':
         res.render('add-events', {category: req.params.category, user: req.session.user});
        break;
        case 'brokers':
         res.render('add-brokers', {category: req.params.category, user: req.session.user});
        break;
        case 'tenants':
         res.render('add-tenants',{category: req.params.category, user: req.session.user});
        break;
    }
})

app.post('/add/:category', function(req, res){
    var data = req.body;
    database.writeData(req.params.category, data, function(response, error){
        if(error === undefined){
            res.redirect('/settings');
        } else {
            console.log(error)
        }
    });
})

app.get('/remove/:category/:id', function(req, res) {
    database.remove(req.params.category, req.params.id)
    res.redirect('/settings')
})

app.get('/events', function(req, res) {
    var data = {title: req.body.title, description: req.body.description}
    database.fetchData('events',function(data) {
        res.render('events', {events: data, user: req.session.user});
    });
})

app.get('/tenants', function(req, res) {
    database.fetchData('tenants',function(data) {
        res.render('tenants', {tenants: data, user: req.session.user});
    });
})

app.get('/brokers', function(req, res) {
    database.fetchData('brokers',function(data) {
        res.render('brokers', {brokers: data, user: req.session.user});
    });
})

app.listen(3000);