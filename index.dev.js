// Dependencies
const express = require('express');
const ngrok = require('ngrok');
const env_yaml = require('env-yaml');

const app = express();
const port = 80;

env_yaml.config();
(async function() {
  const url = await ngrok.connect(port);
  console.log("Ngrok started at URL: ", url);
})();

const routes = require('./api')

app.use('/', routes);
app.listen(port);