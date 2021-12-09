const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const Queue = require("better-queue");
const http = require("http");
const { Server } = require("socket.io");

const { onError, onListening } = require("./helpers");
const { getComments } = require("./services/comments");

/**
 * Create HTTP server.
 */
const app = express();
const port = process.env.PORT || "3000";
const server = http.createServer(app);
server.listen(port);
server.on("error", onError);
server.on("listening", function () {
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

const io = new Server(server);
const emitResult = (result) => io.emit("result", result);

/**
 * Queue
 */
const q = new Queue(async function (documentId, cb) {
  const comments = await getComments(documentId, emitResult);
  cb(null, comments);
});

q.on("task_finish", function () {
  io.emit("complete", {});
});
q.on("task_failed", function (taskId, err, stats) {
  console.log({ taskId, err, stats });
});
q.on("empty", function () {
  console.log("Queue empty.");
});

/**
 * Routing
 */
app.get("/", function (req, res) {
  res.render("index", { title: "Express" });
});

app.post("/comments", function (req, res) {
  const { documentId } = req.body;
  q.push(documentId);
  res.json({ documentId });
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
