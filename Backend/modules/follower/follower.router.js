const router = require('express').Router();
const authenticate = require('../../middlewares/authenticate');
const followerController = require('./follower.controller');

router.route('/')
    .get(authenticate, followerController.getFollower)
    .post(authenticate, followerController.addFollower)
    .delete(authenticate, followerController.unFollow)
router.route('/following')
    .get(authenticate, followerController.getFollowing)

module.exports = router;