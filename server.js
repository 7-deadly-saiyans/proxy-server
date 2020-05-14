const http = require('http');
const express = require('express');
const app = express();

app.get('/', (request, response) => {
  const bundle = [];
  let nComponents = 4;
  while (nComponents) {
    bundle.unshift(new Promise((resolve, reject) => {
      http.get('http://localhost:300' + nComponents-- + '/bundle.js', response => {
        let data = [];
        response.on('data', data.push.bind(data));
        response.on('error', reject);
        response.on('end', () => {
          resolve(data.join(''));
        });
      });
    }));
  }
  Promise.all(bundle).then(results => {
    response.end(`
      <!DOCTYPE html>
      <html>
      <head><title>trulia</title></head>
      <body>
        <div id="image-gallery"></div>
        <div id="app"></div>
        <div id="commentSection"></div>
        <div id="mortgage-calculator"></div>
        <script>
          ${results.join('')}
        </script>
      </body>
      </html>
    `);
  });
});

app.listen(3000, () => console.log('listening on port 3000'));
