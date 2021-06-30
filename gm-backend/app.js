"use strict";

// Express app for Grace Music sight reading application. //

const express = require("express");
const cors = require("cors");

const { NotFoundError } = require("./expressError");

/* TODO: Add JWT authentication! //
 * const { authenticateJWT } = require("./middleware/auth");
 */

/* TODO: Add API routes! //
 * const usersRoutes = require("./routes/users");
 * const contactRoutes = require("./routes/contact");
 * const coursesRoutes = require("./routes/courses");
 * const authRoutes = require("./routes/auth");
 * const lessonsRoutes = require("./routes/lessons");
 * const courseLessonsRoutes = require("./courselessons");
 */

const app = express();

app.use(cors());
app.use(express.json());
// app.use(authenticateJWT);

/* TODO: add routes to app!
 * app.use("/users", usersRoutes);
 * app.use("/contact", contactRoutes);
 * app.use("/courses", coursesRoutes);
 * app.use("/auth", authRoutes);
 * app.use("/lessons", lessonsRoutes);
 * app.use("/courselessons", courseLessonsRoutes);
 */

/** Handle 404 errors -- this matches everything */
app.use(function (req, res, next) {
    return next(new NotFoundError());
  });
  
  /** Generic error handler; anything unhandled goes here. */
  app.use(function (err, req, res, next) {
    if (process.env.NODE_ENV !== "test") console.error(err.stack);
    const status = err.status || 500;
    const message = err.message;
  
    return res.status(status).json({
      error: { message, status },
    });
  });
  
  module.exports = app;
  
