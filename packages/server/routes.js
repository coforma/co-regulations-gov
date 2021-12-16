const createError = require('http-errors');

module.exports = (app, q) => {
  app.get('/', (req, res) => {
    res.json({ message: 'Server Ready' });
  });

  app.post('/comments', (req, res) => {
    const { clientId, documentId } = req.body;
    q.push({ clientId, documentId });

    console.log({ clientId, documentId });
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
};
