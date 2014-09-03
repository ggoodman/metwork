require "../services/session.coffee"
require "../services/gatekeeper.coffee"
require "../services/backend.coffee"

require "../directives/markdown.coffee"


module = angular.module "metwork.state.checkin", [
  "ui.bootstrap"
  "ui.router"

  "metwork.service.session"
  "metwork.service.gatekeeper"
  "metwork.service.backend"
  
  "metwork.directive.markdown"
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
    

module.filter "segment", ->
  (value) -> value.split(",")[0]

module.config [ "$stateProvider", ($stateProvider) ->

  $stateProvider.state "checkin", 
    url: "/checkin"
    template: """<div ui-view></div>"""
      
    controller: [ "$scope", "$state", "$timeout", "geolocator", "geocoder", "session", "gatekeeper", ($scope, $state, $timeout, geolocator, geocoder, session, gatekeeper) ->
      if $state.is("checkin") then $state.go("checkin.search")
    ]
    
  $stateProvider.state "checkin.search", 
    url: "/search"
    template: """
      <div class="container">
        <div class="row" ng-if="events.length">
          <div class="col-xs-12">
            <h4>Nearby events</h4>
            <div class="list-group">
              <a class="list-group-item event-listing" ui-sref="checkin.event({eventCode: event.code})" ng-repeat="event in events">
                  <strong>{{event.name}}</strong>
                  <div class="text-muted">
                    <span ng-bind="event.start_at | date:'h:mma'"></span> to <span ng-bind="event.end_at | date:'h:mma'"></span>
                    at
                    <span ng-bind="event.address | segment"></span>
                  </div>
              </a>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-xs-12">
            <h4>Check in by event code</h4>
            <form ng-submit="checkin(eventCode)">
              <div class="form-group">
                <div class="input-group">
                  <input ng-model="eventCode" class="form-control" type="text" placeholder="Event code">
                  <div class="input-group-btn">
                    <button type="submit" ng-disabled="!eventCode" class="btn btn-success">Check in</a>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    """
      
    divertUntil: [
      to: "user.login"
      predicate: [ "session", (session) -> session.user ]
    ,
      to: "locate.position"
      predicate: [ "location", (location) -> location.position ]
    ,
      to: "locate.address"
      predicate: [ "location", (location) -> location.position.accuracy and location.position.accuracy < 200 ]
    ]
      
    controller: [ "$scope", "$state", "location", "events", ($scope, $state, location, events) ->
      console.log "Events", events
      
      $scope.events = events.findNearby(location.position)
      
      $scope.checkin = (eventCode) -> $state.go("checkin.event", eventCode: eventCode)
    ]
    
  $stateProvider.state "checkin.new", 
    url: "/new"
    template: """
      <div class="container">
        <div class="row" ng-if="nearbyEvents.length">
          <div class="col-xs-12">
            <h3>Are you at one of these events?</h3>
            <div class="event-listing" ng-repeat="event in nearbyEvents">
              <h4>{{event.title}}</h4>
              <p>{{event.description}}</p>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-xs-12">
            <fieldset>
              <legend>Check-in using the event's code</legend>
              <div class="form-group">
                <div class="input-group">
                  <input ng-model="event_id" class="form-control" type="text" placeholder="Event code">
                  <div class="input-group-btn">
                    <a ui-sref="event.view({id: event_id})" ng-disabled="!event_id" class="btn btn-success">Check in</a>
                  </div>
                </div>
                <p class="help-block">If you know the event's code, enter it here and click 'Check in'.</p>
              </div>
            </fieldset>
          </div>
        </div>
        <div class="row">
          <div class="col-xs-12">
          </div>
        </div>
      </div>
    """
      
    divertUntil: [
      to: "user.login"
      predicate: [ "session", (session) -> session.user ]
    ,
      to: "locate"
      predicate: [ "location", (location) -> location.confirmedPosition and location.confirmedAddress ]
    ]
    
    controller: [ "$scope", "$state", "$timeout", "location", "geocoder", "session", "gatekeeper", ($scope, $state, $timeout, location, geocoder, session, gatekeeper) ->
        
    ]

  $stateProvider.state "checkin.event", 
    url: "/:eventCode"
    template: """
      <div class="container">
        <div class="row" ng-if="nearbyEvents.length">
          <div class="col-xs-12">
            <h3>Are you at one of these events?</h3>
            <div class="event-listing" ng-repeat="event in nearbyEvents">
              <h4>{{event.title}}</h4>
              <p>{{event.description}}</p>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-xs-12">
            <fieldset>
              <legend>Check in!</legend>
              <div class="form-group">
                <div class="input-group">
                  <input ng-model="event_id" class="form-control" type="text" placeholder="Event code">
                  <div class="input-group-btn">
                    <a ui-sref="event.view({id: event_id})" ng-disabled="!event_id" class="btn btn-success">Check in</a>
                  </div>
                </div>
                <p class="help-block">If you know the event's code, enter it here and click 'Check in'.</p>
              </div>
            </fieldset>
          </div>
        </div>
        <div class="row">
          <div class="col-xs-12">
          </div>
        </div>
      </div>
    """
      
    divertUntil: [
      to: "user.login"
      predicate: [ "session", (session) -> session.user ]
    ]
    
    resolve:
      event: ["$stateParams", "events", ($stateParams, events) -> events.findByCode($stateParams.eventCode)
      ]
    controller: [ "$scope", "$state", "$timeout", "geolocator", "geocoder", "session", "gatekeeper", ($scope, $state, $timeout, geolocator, geocoder, session, gatekeeper) ->
        
    ]
]