'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const app = express().use(bodyParser.json()); // creates express http server
const Main = require('./routes/main')
const Webhook = require('./routes/webhook')

var allowCrossDomain = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');

  next();
}

app.use(allowCrossDomain);
app.use('/', Main);
app.use('/webhook', Webhook);
// Sets server port and logs message on success
app.listen(process.env.PORT || 9000, () => console.log('webhook is listening :9000'));
