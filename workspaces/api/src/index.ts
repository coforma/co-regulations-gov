import cors from 'cors';
import createError from 'http-errors';
import express, { ErrorRequestHandler, Response } from 'express';
import http from 'http';
import logger from 'morgan';
import { Server } from 'socket.io';

import {
  createCommentsQueue,
  getDocumentCommentsController,
} from './controllers/comments';

const app = express();
const port = process.env.PORT || '3001';
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

createCommentsQueue(io);

server.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
server.on('error', (error: unknown) => {
  console.error({ error });
});

app.use(logger('dev'));
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(cors());

app.get('/', (_, res: Response) => {
  res.json({ message: 'Server Ready' });
});
app.post('/comments', (req, res) => {
  const { clientId, documentId } = req.body;
  getDocumentCommentsController({ clientId, documentId, io });
  res.json({ clientId, documentId });
});
app.use((_, __, next) => {
  next(createError(404, 'Not Found'));
});

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.json({ error: err });
  next();
};

app.use(errorHandler);

module.exports = app;
