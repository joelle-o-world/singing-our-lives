const {PassThrough} = require('stream');

const ffmpeg = require('fluent-ffmpeg')

function saveWav(buffer, type, savePath) {
  console.log("## Calling saveWav(", buffer, type, savePath,')');
  if(!/\.wav$/.test(savePath))
    throw "Must specify a path with .wav extension."

  const stream = new PassThrough;
  stream.end(buffer);

  ffmpeg(stream) 
    .save(savePath)
    .on('end', () => console.log("Saved " + savePath));
}
exports.saveWav = saveWav