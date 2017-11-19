// Import modules.
const express = require("express"),
	path = require("path"),
	bodyParser = require("body-parser"),
	assert = require("assert");

// Create express application.
const app = express();

// Enables the return of an object that contains the parsed request body.
app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'pug')
app.set("views", path.join(__dirname, "/../client"));

app.get("/", function(req, res) {
	res.render("index");
});

let server = app.listen(8080, function() {
	let port = server.address().port;
	console.log("Express server listening on port %s.", port);
});
