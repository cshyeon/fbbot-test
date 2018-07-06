var request = require('request');

PAGE_ACCESS_TOKEN = process.argv[2];

//set facebook profile API
function addProfile() {
    request({
        url: 'https://graph.facebook.com/v2.6/me/messenger_profile',
        qs: { access_token: PAGE_ACCESS_TOKEN },
        method: 'POST',
        json: {
            "greeting": [ {      "locale":"default",      "text":"Hello!"     } ]
        }
    }, function(error, response, body) {
        // 'body' is response of facebook
        console.log(body);
        if (error) {
            console.log('sendPublicMessage() err: ' + response.error);
        }
    });


    request({
        url: 'https://graph.facebook.com/v2.6/me/messenger_profile',
        qs: { access_token: PAGE_ACCESS_TOKEN },
        method: 'POST',
        json: {
        "get_started":{
            "payload":"GET_STARTED_PAYLOAD"
            }        
        }
    }, function(error, response, body) {
        // 'body' is response of facebook
        console.log(body);
        if (error) {
            console.log('sendPublicMessage() err: ' + response.error);
        }
    });

    // request({
    //     url: 'https://graph.facebook.com/v2.6/me/messenger_profile',
    //     qs: { access_token: PAGE_ACCESS_TOKEN },
    //     method: 'POST',
    //     json: {
    //         "persistent_menu": [
    //             {
    //             "locale":"default",
    //             "composer_input_disabled": true,
    //             "call_to_actions":[
    //                 {
    //                 "title":"My Account",
    //                 "type":"nested",
    //                 "call_to_actions":[
    //                     {
    //                     "type":"web_url",
    //                     "title":"Latest News",
    //                     "url":"https://www.messenger.com/",
    //                     "webview_height_ratio":"full"
    //                     }
    //                 ]
    //                 }
    //             ]
    //             }
    //         ]
    //     }
    // }, function(error, response, body) {
    //     // 'body' is response of facebook
    //     console.log(body);
    //     if (error) {
    //         console.log('sendPublicMessage() err: ' + response.error);
    //     }
    // });

}

//delete facebook profile API
function deleteProfile() {
    request({
        url: 'https://graph.facebook.com/v2.6/me/messenger_profile',
        qs: { access_token: PAGE_ACCESS_TOKEN },
        method: 'DELETE',
        json: {
            "fields": [
                "get_started",
                "persistent_menu"
              ]
        }
    }, function(error, response, body) {
        // 'body' is response of facebook
        console.log(body);
        if (error) {
            console.log('sendPublicMessage() err: ' + response.error);
        }
    });

}

addProfile();
// deleteProfile();