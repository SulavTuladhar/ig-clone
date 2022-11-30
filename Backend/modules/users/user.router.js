const router = require('express').Router();
const userController = require('./user.controller');
const authenticate = require('../../middlewares/authenticate');
const upload = require('../../middlewares/uploader');

router.route('/')
    .get(authenticate, userController.profile)
    .put(authenticate, upload.single('image'), userController.updateUser)
    
    
// router.route('/getAllUser')
//     .get(userController.getAllUsers)
    
router.route('/search/:username')
    .get(userController.searchUser)

router.route('/:username')
    .get(userController.findByUsername)

module.exports = router;