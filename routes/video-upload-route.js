const express = require('express');
const router = express.Router();
const videoUploadController = require('../controllers/video-upload-controller');


router.get('/', videoUploadController.initUploadPage);
router.post('/', videoUploadController.uploadFile);
module.exports = router;
