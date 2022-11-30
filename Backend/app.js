const express = require('express');
const app = express();
const PORT = 9090 || 1010;
const cors = require('cors');
const path = require('path');

// Importing APIr route
const API_ROUTER = require('./api.router');

// Initinlizing database connection
require('./db_init');

// Importing third party middlewares
app.use(cors()); //Enable all request

// Inbuilt middleware
app.use(express.urlencoded({ //UrlEncoded data
    extended: true
}));
app.use(express.json());
// app.use(express.static('uploads'));
app.use('/files', express.static(path.join(process.cwd(), 'uploads')));

app.use('/', API_ROUTER);

// 404 Error handler
app.use(function(req,res,next){
    next({
        msg: 'Page not found',
        status: 404
    })
})

// Error handler (application level middleware)
app.use(function(err,req,res,next){
    res.status(err.status || 400);
    res.json({
        msg: err.msg || err,
        status: err.status || 400
    })
});

app.listen(PORT, function(err,connected){
    if(err){
        console.log("Sever Listening failed ", err);
    }else{
        console.log("Server is Listening at port " + PORT);
    }
})