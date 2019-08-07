// Dependencies
const express = require('express');
const ngrok = require('ngrok');
const env = require('dotenv').config();
const bodyParser = require('body-parser');

const app = express();
const port = 80;

(async function() {
  const url = await ngrok.connect(port);
  console.log("Ngrok started at URL: ", url);
})();

const routes = require('./api')

app.use(bodyParser.json());
app.use('/', routes);
app.listen(port);