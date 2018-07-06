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
  // console.log('router post was called');
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

        //#handle webhook events ============================================
        if(webhook_event.message) { // message hook
          let echoMsg = createEchoMessage(webhook_event.message);
          sendMessage(webhook_event.sender.id, echoMsg);
        } else if ( webhook_event.postback ){ // postback hook
          console.log(webhook_event.postback);
        }
        //==================================================================
      });
  
      // Returns a '200 OK' response to all requests
      res.status(200).send('EVENT_RECEIVED');
    } else {
      // Returns a '404 Not Found' if event is not from a page subscription
      res.sendStatus(404);
    }
  
  });

function sendMessage(recipientId, message) {
  // console.log('send msg' ,recipientId, message.attachments.payload , PAGE_ACCESS_TOKEN);
  request({
    url: 'https://graph.facebook.com/v2.6/me/messages',
    qs: { access_token: PAGE_ACCESS_TOKEN },
    method: 'POST',
    json: {
        messaging_type: "RESPONSE",
        recipient: { id: recipientId },
        message: message
    }
}, function(error, response, body) {
    // 'body' is response of facebook
    // console.log(body);
    if (error) {
        console.log('sendPublicMessage() err: ' + response.error);
    }
});
}

function createEchoMessage(originMsg) { 
  // console.log(originMsg);

  let echoMsg = Object.assign({}, originMsg);
  delete echoMsg.mid;
  delete echoMsg.seq;

  if(echoMsg.attachments) {    
    echoMsg.attachment = echoMsg.attachments[0];
    if(echoMsg.attachment.payload) {
      delete echoMsg.attachment.payload.sticker_id;
    }
    delete echoMsg.sticker_id;
    delete echoMsg.attachments;
  }   
  
  // console.log(echoMsg);
  return echoMsg;
}

function createButton(params) {
  return { "attachment":{
    "type":"template",
    "payload":{
      "template_type":"button",
      "text":"What do you want to do next?",
      "buttons":[
        {
          "type":"web_url",
          "url":"https://www.messenger.com",
          "title":"Visit Messenger"
        }
      ]
    }
  }  };
}

module.exports = router;
