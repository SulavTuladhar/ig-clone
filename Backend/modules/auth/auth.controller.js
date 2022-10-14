const router = require("express").Router();
const userModel = require('../../models/user.model');
const MAP_USER_REQ = require('../../helpers/map_user_req');
const jwt = require('jsonwebtoken');
const configs = require('../../configs');

// Passowrd hashing libary
const passwordHash = require('password-hash');

/**
 * Create token with given data
 * @params {object} data
 * @return string
 */

function createToken(data){
    let token = jwt.sign({
        _id: data._id
    },configs.JWT_SEC);
    return token;
}

function insert(req,res,next){
    // console.log('req ko body >>', req.body);
    // console.log('req ko file >>', req.file);
    if(req.fileTypeError){
        return next({
            msg: "Invalid File Format",
            status: 400
        })
    }
    if(req.file){
        req.body.image = req.file.filename;
    }
    // Creating User
    var newUser = new userModel({});
    var newMappedUser = MAP_USER_REQ(newUser,req.body);
    newMappedUser.password = passwordHash.generate(req.body.password);
    // console.log("mapped user >> ", newMappedUser);
    newMappedUser.save(function(err,done){
        if(err){
            return next(err);
        }
        res.json(done);
    })
}

function login(req,res,next){
    console.log(req.body);
    userModel.findOne({
        username: req.body.username
    })
        .then(function(user){
            if(!user){
                return next({
                    msg: 'Invalid Username',
                    status: 400
                })
            }
            var isMatched = passwordHash.verify(req.body.password, user.password);
            if(isMatched){
                var token = createToken(user);
                res.json({
                    user: user,
                    token: token
                })
            }else{
                next({
                    msg: 'Invalid Password',
                    status: 400
                })
            }
        })
        .catch(err=>{
            next(err);
        })
}

module.exports = {
    insert,
    login
}