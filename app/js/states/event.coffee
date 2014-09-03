require "../services/backend.coffee"
require "../services/session.coffee"

require "../directives/gmap.coffee"

module = angular.module "metwork.state.event", [
  "ui.bootstrap"
  "ui.router"
  
  "metwork.service.backend"
  "metwork.service.session"
  
  "metwork.directive.gmap"
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
  $stateProvider.state "event",
    url: "/event"
    template: """
      <div class="container" ui-view>
      </div>
    """

  $stateProvider.state "event.create", 
    url: "/create"
    template: """
      <div class="row">
        <div class="col-xs-12">
          <h1>Import event</h1>
        </div>
        <p class="col-xs-6"><button class="btn btn-success btn-block" ng-class="{disabled: session.hasProfile('eventbrite')}">From Eventbrite</button></p>
        <p class="col-xs-6"><button class="btn btn-success btn-block" ng-class="{disabled: session.hasProfile('meetup')}">From Meetup.com</button></p>
      </div>
      <div class="row">
        <div class="col-xs-12">
          <fieldset>
            <legend>Create a new event</legend>
            <form name="event" ng-submit="createEvent(editing)">
              <div class="form-group" ng-class="{'has-error': !event.name.$valid && event.name.$dirty}">
                <input name="name" ng-model="editing.name" class="form-control" type="text" required ng-maxlength="200" placeholder="Event name">
              </div>
              <div class="form-group" ng-class="{'has-error': !event.description.$valid && event.description.$dirty}">
                <textarea name="description" ng-model="editing.description" class="form-control" rows="4" required ng-maxlength="2048" placeholder="Event description"></textarea>
              </div>
              <div class="form-group input-group" ng-class="{'has-error': !event.address.$valid && event.address.$dirty}">
                <input name="address" ng-model="editing.address" ng-change="updateCenter(editing.address)" ng-flur="center = editing.address" class="form-control" type="text" required placeholder="Address">
                <div class="input-group-addon">
                  <i class="icon-map-marker"></i>
                </div>
              </div>
              <div class="form-group">
                <mw-gmap address="map.center" on-click-marker="setLocation(address, position)"></mw-gmap>
              </div>
              <div class="form-group input-group" ng-class="{'has-error': !event.start_at.$valid && event.start_at.$dirty}">
                <input name="start_at" ng-model="editing.start_at" class="form-control" type="datetime-local" placeholder="Date">
                <div class="input-group-addon">
                  <i class="icon-time"></i>
                </div>
              </div>
              <div class="form-group input-group">
                <input name="end_at" ng-model="editing.end_at" class="form-control" type="datetime-local" placeholder="Date">
                <div class="input-group-addon">
                  <i class="icon-time"></i>
                </div>
              </div>
              <div class="form-group">
                <div class="checkbox">
                  <label>
                    <input ng-model="editing.is_private" type="checkbox"> This event is private
                  </label>
                  <span class="help-block" ng-if="editing.is_private">
                    Only people who know the event id can join.
                  </span>
                  <span class="help-block" ng-if="!editing.is_private">
                    Anyone can join this event.
                  </span>
                </div>
              </div>
              <div class="form-group">
                <button type="submit" class="btn btn-primary">Create event</button>
                <button class="btn btn-default" ui-sref="landing">Cancel</button>
              </div>
            </form>
          </fieldset>
        </div>
      </div>
    """
    divertUntil: [
      to: "user.login"
      predicate: [ "session", (session) -> session.user ]
    ]
    controller: [ "$scope", "events", "session", ($scope, events, session) ->
      $scope.map = center: null
      $scope.session = session
      $scope.editing =
        address: ""
      
      $scope.$watch "editing.address", debounce 1500, (address) ->
        console.log "chg", arguments...
        $scope.$apply -> $scope.map.center = address
      
      $scope.setLocation = (address, position) ->
        $scope.editing.address = address
        $scope.editing.position = position
      
      $scope.createEvent = (json) ->
        console.log "Creating", json
        events.create(json).then ->
          console.log "Event created", arguments...
    ]
]