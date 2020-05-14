const http = require('http');
const express = require('express');
const app = express();

const parser = response => res => {
  const data = [];
  res.on('data', data.push.bind(data));
  res.on('end', () => {
    response.end(data.join(''));
  });
};

app.get('/:id?', (request, response) => {
  const bundle = [];
  let nComponents = 4;
  while (nComponents) {
    bundle.unshift(new Promise((resolve, reject) => {
      http.get('http://localhost:300' + nComponents-- + '/bundle.js', res => {
        const data = [];
        res.on('data', data.push.bind(data));
        res.on('error', reject);
        res.on('end', () => {
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

//routes for mortgage calculator
app.get('/mortgageId/:id', (request, response) => {
  http.get(
    'http://localhost:3004/mortgageId/' + request.params.id,
    parser(response)
  );
});

app.get('/mortgageRate/:zip', (request, response) => {
  http.get(
    'http://localhost:3004/mortgageRate/' + request.params.zip,
    parser(response)
  );
});

//route for image carousel
app.get('/homes/:id/images', (request, response) => {
  http.get(
    'http://localhost:3001/homes/' + request.params.id + '/images',
    parser(response)
  );
});

//routes for similar homes
app.get('/home/similar', (request, response) => {
  http.get(
    'http://localhost:3002/home/similar',
    parser(response)
  );
});

app.get('/home/newest', (request, response) => {
  http.get(
    'http://localhost:3002/home/newest',
    parser(response)
  );
});

//route for comment section
app.get('/house/comments/:id', (request, response) => {
  http.get(
    'http://localhost:3003/house/comments/' + request.params.id,
    parser(response)
  );
});

app.listen(3000, () => console.log('listening on port 3000'));
