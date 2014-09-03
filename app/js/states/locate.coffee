require "../services/location.coffee"


module = angular.module "metwork.state.locate", [
  "ui.bootstrap"
  "ui.router"
  
  "metwork.service.location"
]

debounce = (delay, fn) ->
  timeout = null
  ->
    context = @
    args = arguments
    
    clearTimeout timeout if timeout
    
    timeout = setTimeout ->
      fn.apply(context, args)
    , delay



module.config [ "$stateProvider", ($stateProvider) ->

  $stateProvider.state "locate",
    url: "/locate"
    abstract: true
    template: """<div ui-view></div>"""
    divert: [
      to: "locate.address"
      predicate: [ "location", (location) -> location.confirmedAddress ]
    ,
      to: "locate.address"
      predicate: [ "location", (location) -> location.confirmedAddress ]
    ]
    controller: ["$scope", "$state", "location", "gatekeeper", ($scope, $state, location, gatekeeper) ->
      
    ]
    

  $stateProvider.state "locate.position", 
    url: "/position"
    template: """
      <div class="container">
        <div class="row col-xs-12">
          <h1 class="text-center">Geolocating you</h1>
          <p class="lead text-center">For best results, please allow your browser access to your location</p>
          <p class="text-center text-muted"><span class="icon-bullseye" style="font-size:20em"></span></p>
          <p class="text-center"><button class="btn btn-default btn-lg" ng-click="cancel()">Skip</button></p>
        </div>
      </div>
    """
    controller: ["$scope", "$state", "$timeout", "location", ($scope, $state, $timeout, location) ->
      $timeout -> location.locate()
      #else $state.go "locate.address"
      
      $scope.cancel = -> location.cancelGeolocation()
    ]

  $stateProvider.state "locate.address", 
    url: "/address"
    template: """
      <div class="container">
        <div class="row">
          <div class="col-xs-12">
            <fieldset>
              <legend>Confirm your location</legend>
              <form name="searchByTimePlace" ng-submit="confirm(timeplace.position, timeplace.address)">
                <div class="form-group" ng-class="{'has-success': timeplace.position.lat, 'has-warning': !timeplace.position.lat}">
                  <div class="input-group">
                    <input name="address" ng-model="timeplace.address" class="form-control" type="text" placeholder="Address">
                    <span class="input-group-btn">
                      <button class="btn btn-default dropdown-toggle" ng-disabled="addresses.length==0 || !timeplace.address">
                        <span class="caret"></span>
                      </button>
                      <ul class="dropdown-menu pull-right">
                        <li ng-repeat="result in addresses">
                          <a ng-click="confirmPosition(result.address, result.position)">{{result.address}}</a>
                        </li>
                      </ul>
                    </span>
                  </div>
                  <p class="help-block" ng-show="!clickedAddress || clickedAddress != timeplace.address">Please select an address or click a marker on the map to proceed.</p>
                </div>
                <div class="form-group">
                  <mw-gmap address="map.center" on-update-geocode-results="updateGeocodeResults(results)" on-click-marker="updatePosition(position, address)"></mw-gmap>
                </div>
                <div class="form-group">
                  <button type="submit" ng-disabled="!clickedAddress || clickedAddress != timeplace.address" class="btn btn-primary">Confirm</button>
                  <button type="button" class="btn btn-default" ui-sref="landing">Cancel</button>
                </div>
              </fieldset>
            </form>
          </div>
        </div>
      </div>
    """
    divertUntil: [
      to: "locate.position"
      predicate: [ "location", (location) -> location.position ]
    ]
    controller: [ "$scope", "$state", "$timeout", "location", "geocoder", "session", ($scope, $state, $timeout, location, geocoder, session) ->      
      $scope.map = center: ""
      $scope.clickedAddress = ""
        
      $scope.timeplace =
        datetime: moment().format("YYYY-MM-DDTHH:mm:ss")
        address: ""
        position:
          lat: null
          lon: null
      
      $scope.updatePosition = (position, address) ->
        $scope.timeplace.address = address
        angular.copy position, $scope.timeplace.position
        
        $scope.clickedAddress = address
      
      $scope.updateGeocodeResults = (results) ->
        angular.copy results, $scope.addresses
      
      $scope.confirm = (position, address) ->
        location.confirmPosition(position)
        location.confirmAddress(address)
      
      geocoder.reverseGeocode(location.position.lat, location.position.lon).then (results) ->
        $scope.addresses = results
        $scope.timeplace.address = results[0]?.address unless $scope.searchByTimePlace.$dirty
        
        #$scope.confirmAddress(results[0].address) if results.length is 1
      
      $scope.$watch "timeplace.address", debounce 1000, (address) -> $scope.$apply ->
        $scope.map.center = address
        
      $scope.searchForId = (eventId) ->
        console.log "Search for", eventId
      
      $scope.searchForTimePlace = (timeplace) ->
        console.log "Search for", timeplace
        
    ]
]