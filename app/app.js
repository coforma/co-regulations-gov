const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const Queue = require("better-queue");
const http = require("http");
const { Server } = require("socket.io");

const { onError, onListening } = require("./helpers");
const { getDocumentComments } = require("./services/comments");

/**
 * Create HTTP server.
 */
const app = express();
const port = process.env.PORT || "3000";
const server = http.createServer(app);
server.listen(port);
server.on("error", onError);
server.on("listening", () => {
  return onListening(server);
});
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

/**
 * Connections
 */
const io = new Server(server);
io.on("connection", (client) => {
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
    clientId,
    documentId,
    callback: ({ clientId, comment }) => {
      io.to(clientId).emit("comment", comment);
    },
  });
  cb(null, comments);
});

q.on("task_finish", () => {
  io.emit("complete", {});
});
q.on("task_failed", (taskId, err, stats) => {
  console.log({ taskId, err, stats });
});
q.on("empty", () => {
  console.log("Queue empty.");
});

/**
 * Routing
 */
app.get("/", (req, res) => {
  res.render("index", { title: "Express" });
});

app.post("/comments", (req, res) => {
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
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
