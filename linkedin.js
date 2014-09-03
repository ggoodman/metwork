var OAuth2 = require("./oauth2")
  , util = require('util')
  , genid = require("genid")
  
function LinkedIn(options) {
  this.code.query = {
    response_type: "code",
    client_id: options.id,
    scope: (options.scope || []).join(" "),
    state: genid(32)
  }

  this.token.query = {
    client_id: options.id,
    client_secret: options.secret,
    grant_type: "authorization_code"
  }

  this.user.query = {}

  this.on("request", this.onRequest.bind(this))
  
  OAuth2.call(this)
}

util.inherits(LinkedIn, OAuth2)

LinkedIn.prototype.code = {
  protocol: "https",
  host: "www.linkedin.com",
  pathname: "/uas/oauth2/authorization"
}

LinkedIn.prototype.token = {
  method: "POST",
  host: "www.linkedin.com",
  pathname: "/uas/oauth2/accessToken",
  headers: { "Content-Type": "application/x-www-form-urlencoded" }
}

LinkedIn.prototype.user = {
  host: "api.linkedin.com",
  pathname: "/v1/people/~"
}

module.exports = LinkedIn
