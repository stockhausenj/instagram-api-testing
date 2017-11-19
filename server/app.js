"use strict";

// Make modules available.
const express = require('express'),
			path = require('path'),
			fs = require("fs"),
			instagram = require('node-instagram').default;

// File System object returns contents of the path.
const creds = fs.readFileSync(path.join(__dirname, "instagram.creds"));
const jsonContent = JSON.parse(creds);
const igId = jsonContent.id;
const igSecret = jsonContent.secret;

// Create express application.
const	app = express();

app.set("view engine", "pug");

const clientPath = path.join(__dirname, '/../client');

// Express lookups files relative to the static directory so that it's not included in the URL.
app.use(express.static(clientPath));
app.set("views", clientPath);

const ig = new instagram({
	clientId: igId,
	clientSecret: igSecret
});

// Your redirect url where you will handle the code param
const redirectUri = 'http://18.216.205.96:8080/handleauth';

app.use(function(req, res, next) {
	var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
	console.log(fullUrl, 'debug');
	console.log(JSON.stringify(req.params), 'debug');
	console.log(JSON.stringify(req.query), 'debug');
	next();
});

app.get('/', function(req, res) {
	ig.get('users/self', (err, data) => {
		console.log(data);
		if (err) {
			res.redirect('/authorize_user');
		} else {
			res.render("index", { username: data.data.username });
		}
	});
});

// First redirect user to instagram oauth
app.get('/authorize_user', (req, res) => {
	res.redirect(ig.getAuthorizationUrl(redirectUri, {
		// an array of scopes
		scope: ['basic', 'likes'],
		// an optional state
		state: 'your state',
	}));
});

// Handle auth code and get access_token for user
app.get('/handleauth', async (req, res) => {
	try {
		// The code from the request, here req.query.code for express
		const code = req.query.code;
		const data = await ig.authorizeUser(code, redirectUri);
		// data.access_token contain the user access_token
		//res.json(data);
		ig.config.accessToken = data.access_token;
		res.redirect('/');
	} catch (err) {
		res.json(err);
	}
});

app.get('*', (req, res) => {
	res.render("index");
});

let server = app.listen(8080, function() {
	let port = server.address().port;
	console.log("Express server listening on port %s.", port);
});
