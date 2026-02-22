const https = require('https');
const fs = require('fs');
const path = require('path');

const fonts = [
  { url: 'https://github.com/google/fonts/raw/main/apache/roboto/Roboto-Regular.ttf', dest: 'fonts/Roboto-Regular.ttf' },
  { url: 'https://github.com/google/fonts/raw/main/apache/roboto/Roboto-Medium.ttf', dest: 'fonts/Roboto-Medium.ttf' },
  { url: 'https://github.com/google/fonts/raw/main/apache/roboto/Roboto-Italic.ttf', dest: 'fonts/Roboto-Italic.ttf' },
  { url: 'https://github.com/google/fonts/raw/main/apache/roboto/Roboto-MediumItalic.ttf', dest: 'fonts/Roboto-MediumItalic.ttf' },
];

if (!fs.existsSync('fonts')) {
  fs.mkdirSync('fonts');
}

fonts.forEach(font => {
  const file = fs.createWriteStream(font.dest);
  https.get(font.url, function(response) {
    if (response.statusCode === 302 || response.statusCode === 301) {
       https.get(response.headers.location, function(newResponse) {
          newResponse.pipe(file);
          file.on('finish', () => {
              file.close();
              console.log(`Downloaded ${font.dest}`);
          });
       });
    } else {
        response.pipe(file);
        file.on('finish', () => {
            file.close();
            console.log(`Downloaded ${font.dest}`);
        });
    }
  }).on('error', (err) => {
    fs.unlink(font.dest, () => {}); // Delete the file async. (But we don't check the result)
    console.error(`Error downloading ${font.dest}: ${err.message}`);
  });
});
