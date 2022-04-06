import Queue from 'better-queue';
import { Server } from 'socket.io';

export async function getDocumentCommentsController({
  clientId,
  documentId,
  io,
  queue,
}: {
  clientId: string;
  documentId: string;
  io: Server;
  queue: Queue;
}) {
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
