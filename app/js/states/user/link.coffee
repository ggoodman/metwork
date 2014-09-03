module.exports = 
  url: "/link"
  template: """
    <div class="row">
      <div class="col-xs-12">
        <h4>Link social accounts</h4>
        <p>
          Click the buttons below and sign-in to add social profiles to your
          identity.
        </p>
        <p>
          These profiles will be used to help build your identity and will
          allow other users to connect with you via social networks once you
          are a member.
        </p>
      </div>
    </div>
    <div class="row">
      <p class="col-xs-6 col-sm-3" ng-repeat="service in services">
        <a class="btn btn-default btn-block" ng-class="{disabled: hasIdentity(service.id), 'btn-success': hasIdentity(service.id)}" ng-click="authTo(service.id)">
          <img ng-src="{{service.image}}"></i>
          {{service.name}}
        </a>
      </p>
    </div>
    <div class="row">
      <p class="col-xs-12" >
        <a class="btn btn-primary" ui-sref="user.create">Continue</a>
        <a class="btn btn-danger" ng-click="cancelRegistration()">Cancel</a>
      </p>
    </div>
  """
  controller: ["$scope", "$state", "oauth", "session", ($scope, $state, oauth, session) ->
    valid = true for service in oauth.services when oauth.hasIdentity(service.id)
    
    return $state.go "user.login" unless valid
    return $state.go "landing" if session.user
    
    $scope.hasIdentity = oauth.hasIdentity.bind(oauth)
    $scope.authTo = oauth.authTo.bind(oauth)
    $scope.services = oauth.services
    
    $scope.cancelRegistration = ->
      oauth.clearProfiles()
      
      $state.go "landing"
  ]