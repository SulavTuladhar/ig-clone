const router = require('express').Router();

// Importing routing level middleware
const AuthRouter = require('./modules/auth/auth.router');
const UserRouter = require('./modules/users/user.router');

router.use('/auth', AuthRouter);
router.use('/user', UserRouter);


module.exports = router;
