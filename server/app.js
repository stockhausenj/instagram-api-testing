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

app.get('/', async (req, res) => {
	var mirror = await ig.get('users/self', async (err, data) => {
		if (err) {
      console.log(err);
			res.redirect('/authorize_user');
		}
	});
	const	username = mirror.data.username;
	const	bio = mirror.data.bio;
	const	profilePicture = mirror.data.profile_picture;
  var media = await ig.get('users/self/media/recent', (err, data) => {
    if (err) {
      console.log(err);
    }
  });
  var mediaIds = media.data.map(value => value.id);
  var mediaDetails = mediaIds.map(x => ig.get('media/' + x, (err, data) => {
    if (err) {
      console.log(err);
    }
  }));
  Promise.all(mediaDetails).then(function(results) {
    var mediaUrls = results.map(x => x.data.images.standard_resolution.url);
    console.log(mediaUrls);
    res.render("index", {
			username: username,
			bio: bio,
			profilePicture: profilePicture,
//			mediaUrls: mediaUrls
		});
  });
});

/*
app.get('/media', async (req, res) => {
	// Get information about this media.
	var media = await ig.get('users/self/media/recent', (err, data) => {
		if (err) {
			res.redirect('/authorize_user');
		} 
	});
	var mediaIds = media.data.map(value => value.id);
	var mediaDetails = mediaIds.map(x => ig.get('media/' + x, (err, data) => {
		if (err) {
			console.log(err);
		}
	}));
	Promise.all(mediaDetails).then(function(results) {
		var mediaUrls = results.map(x => x.data.images.standard_resolution.url);
		console.log(mediaUrls);
		res.render("index");
	});
});
*/

// First redirect user to instagram oauth
app.get('/authorize_user', (req, res) => {
	res.redirect(ig.getAuthorizationUrl(redirectUri, {
		// an array of scopes
		scope: ['basic', 'likes', 'public_content'],
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
