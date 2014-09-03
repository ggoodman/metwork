request = require("request")
LRU = require("lru-cache")

module.exports = sessions = new LRU
  size: 1024
  maxAge: 1000 * 5 # 5 seconds

module.exports.cache = false

module.exports.middleware = (options = {}) ->
  
  self = @
  
  middleware = (req, res, next) ->
    handleRequest = (err, innerRes, body) ->
      return next(err) if err
      
      return createSession() unless body?.data?.sessid?
      
      addCookie body.data
      
    createSession = ->
      request.post "http://metwork-api-c9-ggoodman.c9.io/sessions", json: true, handleRequest
      
    addCookie = (data) ->
      res.cookie "mwsessid", data.sessid,
        domain: "metwork-c9-ggoodman.c9.io"
        expires: new Date(data.expires_at)
      
      sessions.set data.sessid, data
      
      res.expose data, "metwork.session"
      
      next()
  
    if sessid = req.cookies.mwsessid
      if self.cache and session = sessions.get(sessid)
        addCookie(session)
      else
        request.get "http://metwork-api-c9-ggoodman.c9.io/sessions/#{sessid}", json: true, handleRequest
    else
      createSession()
