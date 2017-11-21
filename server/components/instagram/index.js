"use strict";

// Make modules available.
const instagram = require("node-instagram").default,
  path = require("path"),
  fs = require("fs");

const creds = fs.readFileSync(path.join(__dirname, "instagram.creds"));
const jsonContent = JSON.parse(creds);
const igId = jsonContent.id;
const igSecret = jsonContent.secret;

const ig = new instagram({
  clientId: igId,
  clientSecret: igSecret
});

module.exports = ig;
