require "../services/oauth.coffee"

module = angular.module "metwork.service.session", [
  "ngCookies"
  
  "restangular"

  "metwork.service.backend"
  "metwork.service.notifier"
  "metwork.service.oauth"
]

module.config [ "RestangularProvider", (RestangularProvider) ->
  RestangularProvider.setBaseUrl "http://metwork-api-c9-ggoodman.c9.io"
  RestangularProvider.setRestangularFields id: "_id"
]

module.factory "session", [ "$rootScope", "$state", "$q", "$window", "$http", "$cookies", "Restangular", "oauth", "users", ($rootScope, $state, $q, $window, $http, $cookies, Restangular, oauth, users) ->
  
  session = new class Session
    constructor: ->
      @user = null
      
      angular.copy metwork.session, @ 
        
      @user = users.wrap(@user) if @user
    
    hasIdentity: (service) -> !!@getIdentity(service)
    getIdentity: (service) ->
      @user?.identities? and _.find @user.identities, (identity) ->
        identity.service is service
    
    
    login: (identity) ->
      service = @
      
      req = $http.post "http://metwork-api-c9-ggoodman.c9.io/sessions/#{$cookies.mwsessid}/user", {},
        params:
          service: identity.service
          token: identity.token
          secret: identity.secret
      
      req.then (res) ->
        if res.data?.result? then switch res.data.result
          when "not_found", "conflict" then $q.reject(res.data)
          when "ok" then service.user = users.wrap(angular.copy(res.data.data))
  
    logout: ->
      service = @
      
      req = $http.delete "http://metwork-api-c9-ggoodman.c9.io/sessions/#{$cookies.mwsessid}/user"
      
      req.then (res) ->
        $window.location.reload()
        oauth.clearIdentities()
        service.user = null
  
  
]