require "../services/geolocation.coffee"


module = angular.module "metwork.service.backend", [
  "restangular"
  
  "metwork.service.geolocation"
]

module.config [ "RestangularProvider", (RestangularProvider) ->
  RestangularProvider.setBaseUrl "https://metwork-api-c9-ggoodman.c9.io"
  RestangularProvider.setRestangularFields id: "_id"
  RestangularProvider.setResponseExtractor (response, operation) -> response.data
]

module.factory "users", [ "Restangular", (Restangular) ->
  Restangular.extendModel "users", (model) ->
    model.addIdentity = (identity) ->
      @all("identities").post(identity)
    
    model.hasIdentity = (identity) ->
      !!_.find @identities, (ident) -> ident.service is identity.service and (not identity.user_id? or ident.user_id is identity.user_id)
        
    model
  
  UsersConfig = Restangular.withConfig (config) ->
  #  config.setParentless true
    
  Users = UsersConfig.all("users")
  
  wrap: (json) -> UsersConfig.restangularizeElement(null, json, "users")
  
  create: (json) -> Users.post(json)
]

module.factory "events", [ "$q", "Restangular", "location", ($q, Restangular, location) ->
  Restangular.extendModel "events", (model) ->
        
    model
  
  EventsConfig = Restangular.withConfig (config) ->
  #  config.setParentless true
  
  findByCode: (code) -> EventsConfig.one("events", code).get()
  
  findNearby: -> 
    return $q.reject("Unable to determine your location") unless location.position
    
    EventsConfig.all("events").customGETLIST("nearby", lat: location.position.lat, lon: location.position.lon).then (events) ->
      EventsConfig.restangularizeCollection(null, events, "events")

  create: (json) -> EventsConfig.all("events").post(json)
]
