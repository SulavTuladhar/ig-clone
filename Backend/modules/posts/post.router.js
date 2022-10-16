const router = require('express').Router();
const authenticate = require('../../middlewares/authenticate');
const upload = require('../../middlewares/uploader');
const postController = require('./post.controller');

router.route('/')
    .get(postController.getPostFromPublicUser);
router.route('/createPost')
    .post(authenticate,upload.array('images'), postController.createPost);
router.route('/:id')
    .put(authenticate, postController.update)
    .delete(authenticate, postController.removePost)

module.exports = router;