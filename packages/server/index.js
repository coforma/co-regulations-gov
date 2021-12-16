const createError = require('http-errors');
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const Queue = require('better-queue');
const http = require('http');

const { getDocumentComments } = require('./services/comments');

/**
 * Create HTTP server.
 */
const app = express();
const port = process.env.PORT || '3001';
const server = http.createServer(app);
server.listen(port);
server.on('error', (error) => console.log({ error }));
server.on('listening', () => {
  const addr = server.address() || 'localhost';
  const { address, port } = addr;
  console.log(
    `Listening on http://${address === '::' ? 'localhost' : address}:${port}/`
  );
});
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));

app.use(cors());

/**
 * Connections
 */
const io = require('socket.io')(server, { cors: { origin: '*' } });
io.on('connection', (client) => {
  // forward the client their ID so they can include in their requests
  // to ensure they'll be the only one receiving comments for their particular Document
  client.send(client.id);
});

/**
 * Queue
 */
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

/**
 * Routing
 */
app.get('/', (req, res) => {
  res.json({ message: 'Server Ready' });
});

app.post('/comments', (req, res) => {
  const { clientId, documentId } = req.body;
  q.push({ clientId, documentId });
  res.json({ clientId, documentId });
});

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
