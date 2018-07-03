'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const app = express().use(bodyParser.json()); // creates express http server
const Main = require('./routes/main')
const Webhook = require('./routes/webhook')

app.use('/', Main);
app.use('/webhook', Webhook);
// Sets server port and logs message on success
app.listen(process.env.PORT || 1337, () => console.log('webhook is listening'));
