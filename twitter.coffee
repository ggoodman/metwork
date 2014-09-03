request = require("request")
genid = require("genid")
crypto = require("crypto")
_ = require("lodash")._

uriEncodeString = (text) ->
  encodeURIComponent(text).replace /[\!\*\'\(\)]/g, (chr) ->
    chr = chr.charCodeAt(0).toString(16)
    chr = "0" + chr while chr.length < 2
    "%" + chr

uriEncodePair = (key, val) -> "#{uriEncodeString(key)}=\"#{uirEncodeString(val)}\""


class TwitterAPI
  constructor: (@consumer_key, @consumer_secret, @token, @token_secret) ->
  

  signRequest: (options = {}) ->
    base = []
    base.push (options.method or "get").toUpperCase()
    base.push uirEncodeString(options.uri)
    
    params = []
    params.push uriEncodePair(key, val) for key, val of options.qs if options.qs
    params.push uriEncodePair(key, val) for key, val of options.form if options.form
    params.push uriEncodePair("oauth_consumer_key", @consumer_key)
    params.push uriEncodePair("oauth_nonce", genid(32))
    params.push uriEncodePair("oauth_signature_method", "HMAC-SHA1")
    params.push uriEncodePair("oauth_timestamp", Date.now())
    params.push uriEncodePair("oauth_token", @token)
    params.push uriEncodePair("oauth_version", "1.0")
    
    params.sort()
    
    signatureBaseString = base.join("&") + "&" + params.join("&")
    signingKey = uriEncodeString(@consumer_secret) + "&" + uriEncodeString(@token_secret)
    
    hmac = crypto.createHmac("sha1", signingKey)
    hmac.update(signatureBaseString)
    hmac.digest("base64")
    

  issueRequest: (options = {}, callback = ->) ->
    dst = []
  