const cors = require('cors');
const express = require('express');
const http = require('http');
const logger = require('morgan');
const Queue = require('better-queue');

const { getDocumentComments } = require('./services/comments');

// Server
const app = express();
const port = process.env.PORT || '3001';
const server = http.createServer(app);
server.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
server.on('error', (error) => console.log({ error }));
app.use(logger('dev'));
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(cors());

// Sockets
const io = require('socket.io')(server, { cors: { origin: '*' } });

io.on('connection', (client) => {
  // forwards the client their ID to include in their requests
  client.send(client.id);
});

// Queue
const q = new Queue(async (task, cb) => {
  const { clientId, documentId } = task;
  const comments = await getDocumentComments({
    onReceiveComment: (comment) => {
      io.to(clientId).emit('comment', comment);
    },
    documentId,
  });
  ``;
  cb(null, { clientId, comments });
});

q.on('task_finish', (_, result) => {
  const { clientId, comments } = result;
  io.to(clientId).emit('complete', comments);
});

q.on('task_failed', (taskId, err, stats) => {
  console.log({ taskId, err, stats });
});

q.on('empty', () => {
  console.log('Queue empty.');
});

// Routing
require('./routes')(app, q);

module.exports = app;
