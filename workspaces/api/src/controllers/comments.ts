import Queue from 'better-queue';
import { Server } from 'socket.io';

import { Comment, Nullable } from 'types';
import { getDocumentCommentsService } from '../services/comments';

let queue: Nullable<Queue> = null;

export const createCommentsQueue = (io: Server) => {
  queue = new Queue(async (task, cb) => {
    const { clientId, documentId } = task;
    const comments = await getDocumentCommentsService({
      onReceiveComment: (comment: Comment) => {
        io.to(clientId).emit('comment', comment);
      },
      documentId,
    });
    cb(undefined, { clientId: '', comments });
  });
};

export async function getDocumentCommentsController({
  clientId,
  documentId,
  io,
}: {
  clientId: string;
  documentId: string;
  io: Server;
}) {
  if (queue) {
    queue.push({ clientId, documentId });
    queue
      .on('task_finish', (_, result) => {
        io.to(clientId).emit('complete', result.comments);
      })
      .on('task_failed', (taskId, err) => {
        console.error({ taskId, err });
      })
      .on('empty', () => {
        console.log('Queue empty.');
      });
  }
}
