const jwt = require('jsonwebtoken');
const configs = require('../configs/');
const userModel = require('../models/user.model');

module.exports = function(req,res,next){
    let token;
    if(req.headers['authorization'])
        token = req.headers['authorization']
    if(req.headers['x-access-token'])
        token = req.headers['x-access-token']
    if(req.headers['token'])
        token = req.headers['token']
    if(req.query['token'])
        token = req.query['token']
    
    if(!token)
        return next({
            msg: 'Auth failed, token not provided',
            status: 401
        })
    
    // Token exists now validate
    jwt.verify(token, configs.JWT_SEC, function(err,decoded){
        if(err){
            return next(err);
        }
        userModel.findById(decoded._id, function(err,user){
            if(err){
                next(err)
            }
            if(!user){
                next({
                    msg: 'User does\'t exists in the system',
                    status: 400
                })
            }
            req.user = user;
            req.user.password = '';
            next();
        })
    })

}