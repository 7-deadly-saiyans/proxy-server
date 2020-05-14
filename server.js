const http = require('http');
const express = require('express');
const app = express();

app.get('/', (request, response) => {
  let data = [];
  http.get('http://localhost:3001/bundle.js', res => {
    res.on('data', chunk => data.push(chunk));
    res.on('end', () => {
      http.get('http://localhost:3002/bundle.js', res => {
        res.on('data', chunk => data.push(chunk));
        res.on('end', () => {
          http.get('http://localhost:3003/bundle.js', res => {
            res.on('data', chunk => data.push(chunk));
            res.on('end', () => {
              http.get('http://localhost:3004/bundle.js', res => {
                res.on('data', chunk => data.push(chunk));
                res.on('end', () => {
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
                        ${data.join('')}
                      </script>
                    </body>
                    </html>
                  `);
                });
              });
            });
          });
        });
      });
    });
  });
});

app.listen(3000, () => console.log('listening on port 3000'));
