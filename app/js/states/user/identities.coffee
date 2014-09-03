module.exports = 
  url: "/identities"
  template: """
    <div class="row">
      <div class="col-xs-12">
        <h4>Current social accounts</h4>
      </div>
      <p class="col-xs-6 col-sm-3" ng-repeat="service in services | filter:hasIdentity">
        <a class="btn btn-default btn-block" ng-class="{disabled: hasIdentity(service), 'btn-success': hasIdentity(service)}" ng-click="remove(service.id)">
          <img ng-src="{{service.image}}"></i>
          {{service.name}}
        </a>
      </p>
    </div>
    <div class="row">
      <div class="col-xs-12">
        <h4>Add social accounts</h4>
      </div>
      <p class="col-xs-6 col-sm-3" ng-repeat="service in services | filter:noIdentity">
        <a class="btn btn-default btn-block" ng-class="{disabled: hasIdentity(service), 'btn-success': hasIdentity(service)}" ng-click="add(service.id)">
          <img ng-src="{{service.image}}"></i>
          {{service.name}}
        </a>
      </p>
    </div>
    <div class="row">
      <p class="col-xs-12" >
        <a class="btn btn-default" ui-sref="landing">Home</a>
      </p>
    </div>
  """
  controller: ["$scope", "$state", "oauth", "session", ($scope, $state, oauth, session) ->
    return $state.go "user.login" unless session.user
    
    $scope.services = oauth.services
    $scope.hasIdentity = (service) -> session.hasIdentity(service.id)
    $scope.noIdentity = (service) -> !$scope.hasIdentity(service)
    $scope.add = (service) ->
      oauth.authTo(service).then (identity) ->
        session.user.addIdentity(identity).then ->
          session.user.identities.push(identity)
  ]