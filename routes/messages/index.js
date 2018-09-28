var request = require('request');

PAGE_ACCESS_TOKEN = process.argv[2];

function messageHandler(webhook_event) {
  let sendMsg;

  if(webhook_event.message) {    // message hook
    
    if (webhook_event.message.quick_reply) { // quick_reply 버튼 누름

    } else if(webhook_event.message.text === 'test') {
      sendMsg = createButtonMessage({
        text: 'abc',
        buttons: [{
          type: "web_url",
          url: "https://d8i7i9qnk81fq.cloudfront.net",
          title: "test",
          messenger_extensions: true,
          webview_height_ratio: 'tall'
        }]
      });
          
      console.log(sendMsg.attachment);
    }else if(getRandomInt(0, 1) === 0) {  // 확률적으로 echo msg 전송
      sendMsg = createEchoMessage(webhook_event.message);        
      // return sendSenderAction(webhook_event.sender.id, 'mark_seen');
    } else {
      // sendMsg = createButtonMessage({text:'버튼 테스트 메세지 입니다.', buttons: [{
      //     "type":"web_url",
      //     "url":"https://www.messenger.com",
      //     "title":"Visit Messenger"
      //   }]
      // });
      sendMsg = createQuickReply({text: '퀵플 테스트', quick_replies: [
        {
          "content_type":"text",
          "title":"Search",
          "payload":"GET_STARTED_PAYLOAD",
          "image_url":"https://schoolmeritstickers.com/data/img/products/main/_cache/c866fcd2aa0c6b4ccb890f25b2dfae58.jpg?5964c031"
        },
        {
          "content_type":"location"
        }
      ]})
    }
  } else if ( webhook_event.postback ) { // postback hook
    if (webhook_event.postback.payload) {
      let payload = webhook_event.postback.payload;
      if ( payload === "GET_STARTED_PAYLOAD") {
        sendMsg = createTextMessage({text: '안녕하세요 에코봇 입니다. 당신을 가끔 따라 할게요'});
      }
        
    }
  }
  sendMessage(webhook_event.sender.id, sendMsg);
}

function sendSenderAction(recipientId, action) {
  // console.log('send msg' ,recipientId, message.attachments.payload , PAGE_ACCESS_TOKEN);
  request({
    url: 'https://graph.facebook.com/v2.6/me/messages',
    qs: { access_token: PAGE_ACCESS_TOKEN },
    method: 'POST',
    json: {
        messaging_type: "RESPONSE",        
        recipient: { id: recipientId },
        sender_action: action,
    }
  }, function(error, response, body) {
      // 'body' is response of facebook    
      if (error) {
          console.log('sendPublicMessage() err: ' + response.error);
      }
  });
}

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

function createQuickReply(params) {
  return {
    "text": params.text,
    "quick_replies":params.quick_replies
  };
}

function createButtonMessage (params) {
  return { 
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"button",
        "text":params.text,
        "buttons":params.buttons
      }
    }  
  };
}

function createTextMessage (params) {
  return {text: params.text};
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports = messageHandler;
