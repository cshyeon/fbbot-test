var express = require('express');
var request = require('request');
var router = express.Router();

PAGE_ACCESS_TOKEN = process.argv[2];

// Adds support for GET requests to our webhook
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
        let webhook_event = entry.messaging[0];
        // console.log(webhook_event);
        if(webhook_event.message && webhook_event.message.text) {
          sendTextMessage(webhook_event.sender.id, webhook_event.message.text);
        }
      });
  
      // Returns a '200 OK' response to all requests
      res.status(200).send('EVENT_RECEIVED');
    } else {
      // Returns a '404 Not Found' if event is not from a page subscription
      res.sendStatus(404);
    }
  
  });

  function sendTextMessage(recipientId, message) {
    //console.log('send msg' ,recipientId, message , PAGE_ACCESS_TOKEN);
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: { access_token: PAGE_ACCESS_TOKEN },
        method: 'POST',
        json: {
            messaging_type: "RESPONSE",
            recipient: { id: recipientId },
            message: { text: message }
        }
    }, function(error, response, body) {
        if (error) {
            console.log('sendTextMessage() err: ' + response.error);
        }
    });
}

module.exports = router;
