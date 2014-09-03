module = angular.module "metwork.directive.userpanel", [
  "metwork.service.session"
]

module.directive "mwUserPanel", [ "session", (session) ->
  restrict: "E"
  replace: true
  scope: true
  template: """
    <div class="mw-user-panel">
      <a class="btn btn-default navbar-btn" ng-if="!session.user" ui-sref="user.login">Login</a>
      <div ng-if="session.user">
        <div class="btn-group">
          <a class="btn btn-default navbar-btn dropdown-toggle">
            <img ng-src="{{session.user.picture_url.mini}}">
            {{session.user.name}}
            <span class="caret"></span>
          </a>
          <ul class="dropdown-menu">
            <li><a ui-sref="user.profile">Edit profile</a></li>
            <li><a ui-sref="user.identities">Edit identities</a></li>
            <li class="divider"></li>
            <li><a ui-sref="user.logout">Logout</a></li>
          </ul>
        </div>
      </div>
    </div>
  """
  controller: ["$scope", ($scope) ->
    $scope.session = session
  ]
]