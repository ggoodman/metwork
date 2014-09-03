require "../services/notifier.coffee"

module = angular.module "metwork.service.oauth", [
  "metwork.service.notifier"
]

module.config [ "RestangularProvider", (RestangularProvider) ->
  RestangularProvider.setBaseUrl("https://metwork-api-c9-ggoodman.c9.io")
]

module.factory "oauth", [ "$window", "$rootScope", "$q", "$timeout", "notifier", ($window, $rootScope, $q, $timeout, notifier) ->
  
  messageHandler = null
  
  handlePostMessage = (event) ->
    if messageHandler
      try
        messageHandler?(JSON.parse(event.data))
      catch e
        console.log "[ERR] JSON.parse", e
        
  registerMessageHandler = (handler) -> messageHandler = handler
  
  $window.addEventListener "message", handlePostMessage, false
  
  
  identities: {}
  
  clearIdentities: -> angular.copy({}, @identities)
  getIdentity: (service) -> @identities[service]
  hasIdentity: (service) -> !!@getIdentity(service)
  getIdentities: -> @identities
  
  buildProfile: ->
    order = 
      name: ["linkedin", "google", "facebook", "twitter", "github", "meetup", "eventbrite"]
      description: ["linkedin", "twitter", "google", "facebook", "github", "meetup", "eventbrite"]
      company: ["linkedin", "twitter", "google", "facebook", "github", "meetup", "eventbrite"]
      location: ["linkedin", "twitter", "google", "facebook", "github", "meetup", "eventbrite"]
      website_url: ["linkedin", "twitter", "google", "facebook", "github", "meetup", "eventbrite"]
      picture_url: ["linkedin", "google", "facebook", "twitter", "github", "meetup", "eventbrite"]
    
    profile = {}
    
    for field, fieldOrder of order
      for service in fieldOrder
        break if profile[field] ||= @getIdentity(service)?[field]
    
    #profile.emails = _.reduceRight @getIdentities(), (emails, profile) ->
    #  emails.push(email) for email in profile.profile.emails when email not in emails if profile.profile.emails
    #  emails
    #, []
    
    profile
  
  authTo: (service, width = 1000, height = 750) ->
    return $q.when(identity) if identity = @getIdentity(service)
    
    session = @
    dfd = $q.defer()
    resolved = false
    screenHeight = screen.height
    left = Math.round((screen.width / 2) - (width / 2))
    top = 0
    top = Math.round((screenHeight / 2) - (height / 2)) if (screenHeight > height)
    
    authWindow = window.open "/auth/#{service}", "mw-auth", """
      left=#{left},top=#{top},width=#{width},height=#{height},personalbar=0,toolbar=0,scrollbars=1,resizable=1
    """
    
    authWindow.focus()
    
    timeout = $timeout ->
      resolved = true
      
      clearInterval(interval)
      
      dfd.reject("Login timed out")
      null
    , 1000 * 60 * 2 # 2 minute timeout
    
    interval = setInterval ->
      if !authWindow or authWindow.closed != false
        resolved = true
        authWindow = null
      
        clearInterval(interval)
        $timeout.cancel(timeout)
        
        $rootScope.$apply -> dfd.reject("Auth window closed without logging in")
    , 200
    
    registerMessageHandler (event) ->
      return if resolved
      
      if event.event is "auth"
        session.identities[event.message.service] = event.message
        
        console.log "OAuth", event.message
        
        $rootScope.$apply -> dfd.resolve(event.message)
      else if event.event is "auth_error"
        notifier.error "Login failed"
        console.error "Login failed", event.message
        
        $rootScope.$apply -> dfd.reject(event.message)
    
    dfd.promise
  
  getService: (id) -> return service for service in @services when service.id is id
  
  services: [
    id: "linkedin"
    name: "LinkedIn"
    iconClass: "icon-linkedin"
    image: "/img/oauth/linkedin.ico"
  ,
    id: "facebook"
    name: "Facebook"
    iconClass: "icon-facebook"
    image: "/img/oauth/facebook.ico"
  ,
    id: "github"
    name: "Github"
    iconClass: "icon-github"
    image: "/img/oauth/github.ico"
  ,
    id: "google"
    name: "Google"
    iconClass: "icon-google-plus"
    image: "/img/oauth/google.ico"
  ,
    id: "twitter"
    name: "Twitter"
    iconClass: "icon-twitter"
    image: "/img/oauth/twitter.ico"
  ,
    id: "meetup"
    name: "Meetup"
    iconClass: ""
    image: "/img/oauth/meetup.ico"
  ,
    id: "eventbrite"
    name: "Eventbrite"
    iconClass: ""
    image: "/img/oauth/eventbrite.ico"
  ]
]