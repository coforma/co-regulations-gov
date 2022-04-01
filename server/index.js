const cors = require('cors');
const createError = require('http-errors');
const express = require('express');
const http = require('http');
const logger = require('morgan');
const Queue = require('better-queue');

const commentsController = require('./controllers/comments');
const commentsService = require('./services/comments');

const app = express();
const port = process.env.PORT || '3001';
const server = http.createServer(app);

const io = require('socket.io')(server, { cors: { origin: '*' } });

server.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});

server.on('error', (error) => {
  console.error({ error });
});

const queue = new Queue(async (task, cb) => {
  const { clientId, documentId } = task;
  const comments = await commentsService.getDocumentComments({
    onReceiveComment: (comment) => {
      io.to(clientId).emit('comment', comment);
    },
    documentId,
  });
  cb(undefined, { clientId, comments });
});

app.use(logger('dev'));
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(cors());

app.get('/', (req, res) => {
  res.json({ message: 'Server Ready' });
});

app.post('/comments', (req, res) => {
  const { clientId, documentId } = req.body;
  commentsController.getDocumentComments({ clientId, documentId, queue, io });
  res.json({ clientId, documentId });
});

app.use((req, res, next) => {
  next(createError(404));
});

app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.json({ error: err });
});

module.exports = app;
