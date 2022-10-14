// Database connection 
const mongoose = require('mongoose');
const dbConfig = require('./configs/db.configs');

// mongodb://localhost;27017/db_name
mongoose.connect(dbConfig.connectionURL + '/' + dbConfig.dbName, {
    useUnifiedTopology: true,
    useNewUrlParser: true
}, function(err,done){
    if(err){
        console.log("Db connection failed");
    }else{
        console.log("Database connection open");
    }
})
