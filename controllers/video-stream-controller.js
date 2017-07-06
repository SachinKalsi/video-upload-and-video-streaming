const path = require('path');
const fs = require('fs');
const url = require('url');
const handleDb = require('../db/handle-db');

function getFile(file_name, callback){
  fs.readFile(path.resolve(process.env.FILE_UPLOAD_PATH, file_name), callback);
}

function streamVideoFile(req, res, video_file){
  const path = process.env.FILE_UPLOAD_PATH + req.params.file_name;
  const total = video_file.length;
  var range = req.headers.range;
  if (range) {
    var positions = range.replace(/bytes=/, "").split("-");
    var start = parseInt(positions[0], 10);
    var end = positions[1] ? parseInt(positions[1], 10) : total - 1;
    var chunksize = (end-start)+1;
    res.writeHead(206, { "Content-Range": "bytes " + start + "-" + end + "/" + total,
                                       "Accept-Ranges": "bytes",
                                       "Content-Length": chunksize,
                                       "Content-Type":"video/mp4"});
                  res.end(video_file.slice(start, end+1), "binary");

  } else {
    res.writeHead(200, { 'Content-Length': total, 'Content-Type': 'video/mp4' });
    fs.createReadStream(path).pipe(res);
  }

}

module.exports.renderVideo = function(req, res) {
  const fileDetails = handleDb.getFile(req.params.id);
  if(!fileDetails) {
    return res.send('INVALID FILE ID')
  }
  const storedFileName = fileDetails.path.split('/')[1];
  const videoDetails = fileDetails.details || 'NA';
  const videoName = fileDetails.name;
  const index_file = `
  <html>
    <title>Sample Video Stream</title>
    <body>
        <video width="320" height="240" controls>
            <source src="/video/`+ storedFileName +`/play" type="video/mp4"/>
            Your browser does not support the <code>video</code> element.
        </video>
        <br>
        <div>
          <strong>Video Details: </strong>
          `+ videoDetails + `
        </div>
        <div>
          <strong>Video Name: </strong>
          `+ videoName + `
        </div>
    </body>
  </html>`;
  res.send(index_file);

}

module.exports.streamVideo = function(req, res) {

  const file_name = req.params.file_name;

  function handleFile(error, file_data){
    if(error) {
      if(error.code === 'ENOENT') {
        return res.status(404).json({
          error: 'No such file found'
        });
      }
      return res.json(error);
    }
    streamVideoFile(req, res, file_data);
  }

  getFile(file_name, handleFile);

}
