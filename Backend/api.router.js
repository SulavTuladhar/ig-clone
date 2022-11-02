const router = require('express').Router();

// Importing routing level middleware
const AuthRouter = require('./modules/auth/auth.router');
const UserRouter = require('./modules/users/user.router');
const PostRouter = require('./modules/posts/post.router');
const followerRouter = require('./modules/follower/follower.router');

router.use('/auth', AuthRouter);
router.use('/user', UserRouter);
router.use('/post', PostRouter);
router.use('/follower', followerRouter);


module.exports = router;
