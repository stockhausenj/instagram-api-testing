"use strict";

// Make modules available.
const express = require("express"),
  https = require("https"),
  fs = require("fs"),
  path = require("path"),
	bodyParser = require('body-parser'),
  routes = require("./routes/index");

const key = fs.readFileSync("private.key");
const cert = fs.readFileSync("primary.crt");
const options = {
  key: key,
  cert: cert
};

const app = express();

const clientPath = path.join(__dirname, "/../client");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(clientPath));
app.set("view engine", "pug");
app.set("views", clientPath);
app.use(function(req, res, next) {
  var fullUrl = req.protocol + "://" + req.get("host") + req.originalUrl;
  console.log(fullUrl, "debug");
  console.log("params: " + JSON.stringify(req.params), "debug");
  console.log("query: " + JSON.stringify(req.query), "debug");
  next();
});
app.use("/", routes);

https.createServer(options, app).listen(8443);
