module.exports =
  data:
    returnTo: ""
  url: "/login"
  template: """
    <div class="row">
      <div class="col-xs-12">
        <h1>Login / Register</h1>
        <p>
          Please sign in using any of the services listed below. If you don't
          have a profile on Metwork yet, we will set that up for you in less
          than one minute.
        </p>
        <p class="alert alert-danger" ng-if="authError">
          <strong>Login failed</strong> {{authError}}
        </p>
      </div>
    </div>
    <div class="row">
      <p class="col-xs-6 col-sm-3" ng-repeat="service in services">
        <a class="btn btn-default btn-block" ng-disabled="authenticating" ng-click="authTo(service.id)">
          <img ng-src="{{service.image}}"></i>
          {{service.name}}
        </a>
      </p>
    </div>
  """
  controller: ["$scope", "$state", "session", "oauth", "users", "notifier", ($scope, $state, session, oauth, users, notifier) ->
    $scope.services = oauth.services
    $scope.authTo = (service) ->
      $scope.authenticating = true
      
      auth = oauth.authTo(service).then (identity) ->
        if identity
          login = session.login(identity)
          
          login.catch (err) ->
            if err.result is "not_found" then $state.go "user.link"
            else if err.result is "conflict"
              notifier.alert "A user already exists with the same email. Please log in with the service used to create your account and then link your #{service} account to it"
            else
              $scope.authError = "Error communicating with the server. Please try again later."
        else
          $scope.authError = "Unable to log you in. Please try again."
          
      auth.finally ->
        $scope.authenticating = false
  ]