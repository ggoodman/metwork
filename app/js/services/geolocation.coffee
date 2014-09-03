require "../services/gapi.coffee"

module = angular.module "metwork.service.geolocation", [
  "metwork.service.gapi"
]

module.factory "geolocator", [ "$q", "$rootScope", "$timeout", "$http", ($q, $rootScope, $timeout, $http) ->
  geolocate: ->
    dfd = $q.defer()
  
    if navigator.geolocation
      navigator.geolocation.getCurrentPosition (position) ->
        $rootScope.$apply -> dfd.resolve
          lat: position.coords.latitude
          lon: position.coords.longitude
          accuracy: position.coords.accuracy
      , (err) ->
        
        if google.loader?.ClientLocation? then $rootScope.$apply -> dfd.resolve
          lat: google.loader.ClientLocation.latitude
          lon: google.loader.ClientLocation.longitude
          accuracy: 1000 * 1000 # 1,000 km magic value
        else $rootScope.$apply -> dfd.reject "Unable to get location"
      , timeout: 10 * 1000
    
    dfd.promise
]
