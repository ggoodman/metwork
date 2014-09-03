express = require("express")
lactate = require("lactate")
request = require("request")
gravatar = require("gravatar")
_ = require("lodash")._


authom = require("authom")

oauthProviders =
  facebook: authom.createServer
    service: "facebook"
    id: "535139049890787"
    secret: "6fc1dc93fff8cb992ddca6e60b5eb3dd"
    #scope: ["email", "user_about_me","user_website", "user_events","user_location","user_photos"]
    fields: "id email name website location link".split(" ")
  github: authom.createServer
    service: "github"
    id: "2cafbeeb4df73240ddb9"
    secret: "415e9783db020b0174cc545b5e89a142d7e4b2a7"
    scope: ["user:email"]
  google: authom.createServer
    service: "google"
    id: "883046078541.apps.googleusercontent.com"
    secret: "8Q2XjVqzHrtvTNvfJrFSU_ar"
    scope: ["https://www.googleapis.com/auth/userinfo.email", "https://www.googleapis.com/auth/userinfo.profile"]
  twitter: authom.createServer
    service: "twitter"
    id: "rRGy214o7qUVKRvN0zcQ"
    secret: "tf8vBZ9fga4UO188Npha4eB2wYwm015khEN1pWc"
  linkedin: authom.createServer
    service: "linkedin"
    id: "s8085e93dpu0"
    secret: "Kiv2Y4jjbGMdiXBD"
    scope: ["r_basicprofile", "r_emailaddress"]
  meetup: authom.createServer
    service: "meetup"
    id: "qpghs89cjm5uutt3rdej64p17m"
    secret: "1tdhl4omgrr1kjfstabv977tme"
    fields: "bio country city state email id link name photo".split(" ")
  eventbrite: authom.createServer
    service: "eventbrite"
    id: "BVKLITCVKR7OHYII7O"
    secret: "2ODUR7SKYF2WWE6NPUCJ6VJNBLW33N7DC4DJW2YPNEYCG43JFB"
    
authom.on "error", (req, res, err) ->
  res.expose err, "_metwork.auth_error"
  res.send """
    <script type="text/javascript">
      {{{state}}}
      if (window.opener && window.opener.postMessage) {
        window.opener.postMessage('{"event": "auth_error","message": _metwork.auth_error}','http://metwork-c9-ggoodman.c9.io');
      }
      window.close()
    </script>
  """

authom.on "auth", (req, res, data) ->
  send = (message) ->
    res.send """
      <script type="text/javascript">
        if (window.opener && window.opener.postMessage) {
          window.opener.postMessage('{"event": "auth","message": #{JSON.stringify(message)}}','http://metwork-c9-ggoodman.c9.io');
        }
        window.close()
      </script>
    """
  
  switch data.service
    when "facebook"
      message =
        name: data.data.name
        description: ""
        picture_url:
          mini: "https://graph.facebook.com/#{data.id}/picture?width=24&height=24"
          normal: "https://graph.facebook.com/#{data.id}/picture?width=48&height=48"
          bigger: "https://graph.facebook.com/#{data.id}/picture?width=240&height=240"
        company: ""
        website_url: data.data.website or ""
        profile_url: data.data.link or ""
        location: data.data.location?.name or ""
        email: data.data.email or ""
        
        service: "facebook"
        user_id: new String(data.id)
        token: data.token
        refresh_token: null
      
      
      return send(message)
    when "github"
      message =
        name: data.data.name or ""
        description: ""
        picture_url:
          mini: "https://secure.gravatar.com/avatar/#{data.data.gravatar_id}?s=24"
          normal: "https://secure.gravatar.com/avatar/#{data.data.gravatar_id}?s=48"
          bigger: "https://secure.gravatar.com/avatar/#{data.data.gravatar_id}?s=240"
        company: data.data.company or ""
        profile_url: "https://github.com/#{data.data.login}"
        website_url: data.data.blog or ""
        location: data.data.location or ""
        email: data.data.email or ""
        
        service: "github"
        user_id: new String(data.id)
        token: data.token
        refresh_token: null
      
      
      return send(message)
    
    when "google"
      message =
        name: data.data.name
        description: ""
        picture_url:
          mini: "#{data.data.picture}?sz=24"
          normal: "#{data.data.picture}?sz=48"
          bigger: "#{data.data.picture}?sz=240"
        company: ""
        website_url: ""
        profile_url: data.data.link or ""
        location: ""
        email: data.data.email or ""
        
        service: "google"
        user_id: new String(data.id)
        token: data.token
        refresh_token: data.refresh_token
      
      
      return send(message)
      
    when "twitter"
      message =
        service: "twitter"
        user_id: new String(data.id)
        token: data.token
        refresh_token: data.refresh_token
        secret: data.secret
        
      options =
        url: "https://api.twitter.com/1.1/users/show.json?"
        json: true
        qs:
          user_id: new String(data.id)
          scren_name: data.screen_name
        oauth:
          consumer_key: "rRGy214o7qUVKRvN0zcQ"
          consumer_secret: "tf8vBZ9fga4UO188Npha4eB2wYwm015khEN1pWc"
          token: data.token
          token_secret: data.secret
      
      request options, (err, res, body) ->
        message.data = body
        
        # TODO: Hack to prevent field that will fail JSON serialization
        delete message.data.status
        
        message = _.extend message,
          name: body.name
          description: body.description
          picture_url:
            mini: body.profile_image_url?.replace("normal", "mini")
            normal: body.profile_image_url
            bigger: body.profile_image_url?.replace("_normal", "")
          company: ""
          website_url: body.entities?.url?.urls[0]?.expanded_url or ""
          profile_url: "https://twitter.com/#{body.screen_name}"
          location: body.location or ""
        
        return send(message)
    
    when "meetup"
      location = [data.data.city, data.data.state, data.data.country]
      location = _.filter location, (item) -> !!item
    
      message =
        name: data.data.name or ""
        description: data.data.bio or ""
        company: ""
        website_url: ""
        profile_url: data.data.link or ""
        location: location.join(", ")
        email: data.data.email or ""
        
        service: "meetup"
        user_id: new String(data.id)
        token: data.token
        refresh_token: data.refresh_token
      
      if data.data.photo or data.data.email then message.picture_url =
        mini: data.data.photo?.thumb_link or (data.data.email and gravatar.url data.data.user.email, { s: 24 }) or ""
        normal: data.data.photo?.photo_link or (data.data.email and gravatar.url data.data.user.email, { s: 48 }) or ""
        bigger: data.data.photo?.highres_link or (data.data.email and gravatar.url data.data.user.email, { s: 240 }) or ""

      
      return send(message)
      
    when "eventbrite"
      message =
        name: "#{data.data.user.first_name} #{data.data.user.last_name}"
        description: ""
        picture_url:
          mini: gravatar.url data.data.user.email, { s: 24 }
          normal: gravatar.url data.data.user.email, { s: 48 }
          bigger: gravatar.url data.data.user.email, { s: 240 }
        company: ""
        website_url: ""
        profile_url: ""
        location: ""
        email: data.data.user.email or ""
        
        service: "eventbrite"
        user_id: new String(data.id)
        token: data.token
        refresh_token: data.refresh_token
        
      
      return send(message)

    when "linkedin"
      message =
        name: data.data.formattedName or ""
        description: data.data.headline or ""
        picture_url:
          mini: data.data.pictureUrl
          normal: data.data.pictureUrl
          bigger: data.data.pictureUrl
        company: ""
        website_url: ""
        profile_url: data.data.publicProfileUrl
        location: ""
        email: data.data.emailAddress or ""
        
        service: "linkedin"
        user_id: new String(data.id)
        token: data.token
        refresh_token: data.refresh_token
        
      
      return send(message)

assets = lactate.dir("public")
assets.set "cache", false

server = express()
sessions = require("./middleware/session.coffee")
expstate = require("express-state")

expstate.extend server

server.enable "trust proxy"

server.set "view engine", "html"
server.engine "html", require("hbs").__express
server.set "views", "#{__dirname}/views"

server.use express.cookieParser()
server.use lactate.static "#{__dirname}/public",
  "max age": "one week"
  "cache": false
server.use server.router

server.get "session.js", (req, res, next) ->
  
  
server.get "/auth/:service", (req, res, next) ->
  req.headers.host = "metwork-c9-ggoodman.c9.io"
  
  next()

server.get "/auth/:service", authom.app

server.get "/*", sessions.middleware(), (req, res) ->
  res.render "index", cachebuster: Date.now()

module.exports = server