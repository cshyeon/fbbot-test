### Facebook bot practice

Echo bot for first app.

curl -X POST -H "Content-Type: application/json" -d '{
  "greeting": [
    {
      "locale":"default",
      "text":"Hello!" 
    }, {
      "locale":"en_US",
      "text":"Timeless apparel for the masses."
    }
  ]
}' "https://graph.facebook.com/v2.6/me/messenger_profile?access_token=EAAbIRMKnP2QBAHODxWZBe2iJavLAmJS4vxQMV6ayyfSMZBoZCkgyEijVH4zV0hBu4jms9cKsbT6vDQbeMFui4rPcdiWURZCm9oOQIB4tZBZB4u5uiRupbKLaSc3ZByy6Vaw5mCAY5NhYZCZC858OYnOdCPorDZBw3Sx9HXZCWsTds3Gj06QE659bQkH"