// new file w/o MongoDB url

const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const indexRouter = require("./routes/index");

const catalogRouter = require("./routes/catalog");
const exphbs = require('express-handlebars')
const compression = require('compression');
const helmet = require('helmet')
const dotenv = require('dotenv');
dotenv.config();






let app = express();
const mongoose = require("mongoose");


const mongoDB = process.env.MONGODB_URI ;

  mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

// view engine setup
app.engine('handlebars', exphbs({
  defaultLayout: 'layout',
})
);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

app.use(compression()); //Compress all routes

/**
 * 
 * write new content security policy that allows for bootstrap??
 * 
 */
// app.use(helmet())

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);

app.use("/catalog", catalogRouter);

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
