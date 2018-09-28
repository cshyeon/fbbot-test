var express = require('express');

var messageHandler = require('./messages');
var router = express.Router();

PAGE_ACCESS_TOKEN = process.argv[2];

// # 라우팅 for Facebook webhook verification
router.get('/', (req, res) => {    
    // Your verify token. Should be a random string.
    let VERIFY_TOKEN = "ttt"
      
    // Parse the query params
    let mode = req.query['hub.mode'];
    let token = req.query['hub.verify_token'];
    let challenge = req.query['hub.challenge'];
      
    // Checks if a token and mode is in the query string of the request
    if (mode && token) {
    
      // Checks the mode and token sent is correct
      if (mode === 'subscribe' && token === VERIFY_TOKEN) {
        
        // Responds with the challenge token from the request
        console.log('WEBHOOK_VERIFIED');
        res.status(200).send(challenge);
      
      } else {
        // Responds with '403 Forbidden' if verify tokens do not match
        res.sendStatus(403);      
      }
    }
  });

// Creates the endpoint for our webhook 
router.post('/', (req, res) => {  
  let body = req.body;    

  // Checks this is an event from a page subscription
  if (body.object === 'page') {

    // Iterates over each entry - there may be multiple if batched
    body.entry.forEach(function(entry) {
      // console.log(entry);  
      // Gets the message. entry.messaging is an array, but 
      // will only ever contain one message, so we get index 0
      console.log('recievie msg:', entry.messaging[0]);
      let webhook_event = entry.messaging[0];     

      //#handle webhook events ============================================
      messageHandler(webhook_event);      
      //==================================================================
    });

    // Returns a '200 OK' response to all requests
    res.status(200).send('EVENT_RECEIVED');
  } else {
    // Returns a '404 Not Found' if event is not from a page subscription
    res.sendStatus(404);
  }

});



module.exports = router;
