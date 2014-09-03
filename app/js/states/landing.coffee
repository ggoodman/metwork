require "../directives/usercard.coffee"
require "../services/session.coffee"


module = angular.module "metwork.state.landing", [
  "ui.bootstrap"
  "ui.router"

  "metwork.directive.usercard" #Temporary
  "metwork.service.session" #Temporary
]

module.config [ "$stateProvider", ($stateProvider) ->

  $stateProvider.state "landing", 
    url: "/"
    template: """
      <div class="container">
        <div class="row text-center">
          <div class="col-xs-12">
            <h1>Meet&nbsp;people. Build&nbsp;your Metwork.</h1>
            <p class="lead">Connect digitally with the people you meet</p>
          </div>
          <p class="col-xs-6 col-sm-3 col-sm-offset-3">
            <a class="btn btn-primary btn-lg btn-block" ui-sref="checkin">
              Check in
            </a>
          </p>
          <p class="col-xs-6 col-sm-3">
            <a class="btn btn-default btn-lg btn-block" ui-sref="event.create">
              Create event
            </a>
          </p>
        </div>
        <div class="row" ng-if="session.user">
          <div class="col-xs-12 col-lg-6"><mw-usercard user="session.user"></mw-usercard></div>
        </div>
        <div class="row">
          <div class="col-xs-12">
            <h2>What is Metwork?</h2>
            <p>Metwork is is many things.</p>
            <ul>
              <li>A record of people you meet</li>
              <li>A memory aid</li>
              <li>An address book</li>
              <li>A relationship management tool</li>
            </ul>
          </div>
        </div>
      </div>
    """
    controller: ["$scope", "$state", "session", ($scope, $state, session) ->
      $scope.session = session
    ]
]