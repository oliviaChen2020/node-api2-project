const express = require('express');
const server = express();

const cors = require('cors');

// import router into server.js
const postsRouter = require('./posts-router');

server.use(cors()); // takes care of CORS errors hopefully
server.use(express.json()); // if req has json in body, it can be parsed and put inside req.body

server.use('/api/posts', postsRouter);

server.get('/', (req, res) => {
  res.send(`
    <h2>Welcome to the Lambda API</h2>
  `);
});

module.exports = server;
