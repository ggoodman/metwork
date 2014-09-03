require "../services/geocoder.coffee"
require "../services/gapi.coffee"

module = angular.module "metwork.directive.gmap", [
  "metwork.service.geocoder"
  "metwork.service.gapi"
]

module.directive "mwGmap", [ "$interpolate", "geocoder", "gapi", ($interpolate, geocoder, gapi) ->
  restrict: "E"
  replace: true
  scope:
    address: "="
    onClickMarker: "&"
    onUpdateGeocodeResults: "&"
  template: """
    <div class="map-canvas" style="height: 200px"></div>
  """
  link: ($scope, $element, $attrs) ->
    markers = []
    
    gapi.loadMaps().then ->
      google.maps.visualRefresh = true
      
      gmap = new google.maps.Map $element[0],
        zoom: 8
        mapTypeId: google.maps.MapTypeId.ROADMAP
        mapTypeControl: false
        streetViewControl: false
        
      $scope.$watch "address", (address) ->
        marker.setMap(null) while marker = markers.pop()
        
        if address then geocoder.geocode(address).then (results) ->
          bounds = new google.maps.LatLngBounds
          
          for result in results then do (result) ->
            latlng = new google.maps.LatLng(result.position.lat, result.position.lon)
            markers.push marker = new google.maps.Marker
              map: gmap
              position: latlng
              title: result.formatted_address
              
            bounds.extend latlng
            
            google.maps.event.addListener marker, 'click', ->
              $scope.$apply ->
                $scope.onClickMarker(result)
          
          gmap.fitBounds bounds
          gmap.setZoom 15 if gmap.getZoom() > 15
]