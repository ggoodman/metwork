require "../services/gapi.coffee"

module = angular.module "metwork.service.geocoder", [
  "metwork.service.gapi"
]

module.factory "geocoder", [ "$q", "$rootScope", "$timeout", "gapi", ($q, $rootScope, $timeout, gapi) ->
  geocoder = null
  
  cache = {}
  
  issueRequest = (request) ->
    geocoder ||= new google.maps.Geocoder()
    dfd = $q.defer()
    
    geocoder.geocode request, (results, status) -> $rootScope.$apply ->
      if status == google.maps.GeocoderStatus.OK
        #cache[result.formatted_address] = [result] for result, idx in results
        #cache[address] = results
        
        return dfd.resolve _.map results, (result) ->
          address: result.formatted_address
          position:
            lat: result.geometry.location.lat()
            lon: result.geometry.location.lng()
      else if status == google.maps.GeocoderStatus.ZERO_RESULTS then return dfd.reject("Address not found")
      else if status == google.maps.GeocoderStatus.QUERY_OVER_LIMIT then return dfd.reject("Geocoding quota exceeded")
      else if status == google.maps.GeocoderStatus.REQUEST_DENIED then return dfd.reject("Geocoding request denied")
      else if status == google.maps.GeocoderStatus.INVALID_REQUEST
        dfd.reject("Geocoding quota exceeded")
        console.error("Invalid geocoding request:", request)
      else
        dfd.reject("Unknown geocoding error")
        console.error("Unknown geocoding error", results, status)
    
    dfd.promise 

  geocode: (address) ->
    gapi.loadMaps().then ->
      issueRequest address: address
  
  reverseGeocode: (lat, lon) ->
    gapi.loadMaps().then ->
      issueRequest latLng: new google.maps.LatLng(lat, lon)
    
]