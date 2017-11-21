"use strict";

// Make modules available.
const ig = require("../components/instagram/index"),
  express = require("express");

var router = express.Router();

const redirectUri = "https://localhost:8443/handleauth";

router.get("/", async (req, res) => {
  var mirror = await ig.get("users/self", async err => {
    if (err) {
      console.log(err);
      res.redirect("/authorize_user");
    }
  });
  const username = mirror.data.username;
  const bio = mirror.data.bio;
  const profilePicture = mirror.data.profile_picture;
  var media = await ig.get("users/self/media/recent", err => {
    if (err) {
      console.log(err);
    }
  });
  var mediaIds = media.data.map(value => value.id);
  var mediaDetails = mediaIds.map(x =>
    ig.get("media/" + x, err => {
      if (err) {
        console.log(err);
      }
    })
  );
  Promise.all(mediaDetails).then(function(results) {
    var mediaUrls = results.map(x => x.data.images.standard_resolution.url);
    res.render("index", {
      username: username,
      bio: bio,
      profilePicture: profilePicture,
      mediaUrls: mediaUrls
    });
  });
});

// First redirect user to instagram oauth
router.get("/authorize_user", (req, res) => {
  res.redirect(
    ig.getAuthorizationUrl(redirectUri, {
      // an array of scopes
      scope: ["basic", "likes", "public_content"],
      // an optional state
      state: "your state"
    })
  );
});

// Handle auth code and get access_token for user
router.get("/handleauth", async (req, res) => {
  try {
    // The code from the request, here req.query.code for express
    const code = req.query.code;
    const data = await ig.authorizeUser(code, redirectUri);
    // data.access_token contain the user access_token
    ig.config.accessToken = data.access_token;
    res.redirect("/");
  } catch (err) {
    res.json(err);
  }
});

module.exports = router;
