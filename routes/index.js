var express = require('express');
var path = require('path');
var router = express.Router();
var videoUpload = require('./video-upload-route')
var videoStream = require('./video-stream-route')

router.use('/', videoUpload);
router.use('/video', videoStream);


router.get('*', function(req, res){
    res.sendFile(path.resolve(__dirname + '/../public/404.html'));
});

module.exports = router;
