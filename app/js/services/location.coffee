require "../services/geolocation.coffee"
require "../services/geocoder.coffee"


module = angular.module "metwork.service.location", [
  "metwork.service.geolocation"
  "metwork.service.geocoder"
]

module.factory "location", [ "geolocator", "geocoder", (geolocator, geocoder) ->
  
  position: null
  address: null
  
  confirmedAddress: false
  confirmedPosition: false
  
  confirmAddress: (@address) -> @confirmedAddress = true
  confirmPosition: (@position) ->
    @confirmedPosition = true
    @position.accuracy = 10 # Magic number
  
  locate: ->
    service = @
    
    geolocator.geolocate().then (position) ->
      console.log "Location", position
      service.position = position
      service
    , ->
      service.position =
        lat: 45.5
        lon: 73.5667
        accuracy: 10000
      service
]