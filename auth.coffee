passport = require("passport")

###
oauthProviders =
  facebook: authom.createServer
    service: "facebook"
    id: "535139049890787"
    secret: "6fc1dc93fff8cb992ddca6e60b5eb3dd"
    fields: ["id", "name", "website", "location", "link"]
  github: authom.createServer
    service: "github"
    id: "2cafbeeb4df240240ddb9"
    secret: "0587a1d7fba4e8751170ca2b98497a761e5d7a41"
  google: authom.createServer
    service: "google"
    id: "883046078541.apps.googleusercontent.com"
    secret: "8Q2XjVqzHrtvTNvfJrFSU_ar"
  twitter:authom.createServer
    service: "twitter"
    id: "rRGy214o7qUVKRvN0zcQ"
    secret: "tf8vBZ9fga4UO188Npha4eB2wYwm015khEN1pWc"
  linkedin: authom.createServer
    service: "linkedin"
    id: "s8085e93dpu0"
    secret: "Kiv2Y4jjbGMdiXBD"
###
    
FacebookStrategy = require("passport-facebook").Strategy
GithubStrategy = require("passport-github").Strategy
GoogleStrategy = require("passport-google").Strategy
TwitterStrategy = require("passport-twitter").Strategy
LinkedinStrategy = require("passport-linkedin").Strategy

callbackBaseUrl = "http://#{process.env.OPENSHIFT_APP_DNS}/auth/"

passport.use new FacebookStrategy
  clientID: "535139049890787"
  clientSecret: "6fc1dc93fff8cb992ddca6e60b5eb3dd"
  callbackURL: "#{callbackBaseUrl}/facebook/callback"


module.exports.augment = (server) ->
  
  server.get "/auth/facebook", passport.authenticate "facebook"
  server.get "/auth/facebook/callback", passport.authenticate "facebook"
