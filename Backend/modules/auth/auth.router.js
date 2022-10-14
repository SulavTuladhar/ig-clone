const router = require('express').Router();
const upload = require('../../middlewares/uploader');
const authController = require('./auth.controller');

router.route('/register')
    .post(upload.single('image'), authController.insert);
router.route('/login')
    .post(authController.login);

module.exports = router;