export async function getDocumentCommentsController({
  clientId,
  documentId,
  io,
  queue,
}) {
  queue.push({ clientId, documentId });

  queue
    .on('task_finish', (_, result) => {
      const { comments } = result;
      io.to(clientId).emit('complete', comments);
    })
    .on('task_failed', (taskId, err, stats) => {
      console.log({ taskId, err, stats });
    })
    .on('empty', () => {
      console.log('Queue empty.');
    });
}
