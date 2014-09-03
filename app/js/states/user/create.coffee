module.exports =
  url: "/create"
  template: """
    <div class="row">
      <form novalidate class="col-xs-12" ng-submit="createUser(profile)" name="userForm">
        <input type="hidden" ng-model="profile.picture_url">
        <div class="form-group clearfix">
          <div class="row">
            <div class="col-xs-4 col-sm-3 col-md-2" ng-class="{selected: profile.picture_url==picture_url}" ng-repeat="(service, picture_url) in userData.picture_url">
              <a ng-click="profile.picture_url=picture_url" class="thumbnail">
                <div class="crop-vertical">
                  <img ng-src="{{picture_url.bigger}}" style="width: 100%" />
                </div>
                <div class="caption">{{service}}</div>
              </a>
            </div>
          </div>
        </div>
        <div class="form-group" ng-class="{'has-error':userForm.name.$invalid}">
          <label class="control-label">Full name</label>
          <div class="input-group">
            <input class="form-control" type="text" required ng-maxlength="100" name="name" ng-model="profile.name" placeholder="Full name">
            <div class="input-group-btn">
              <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" ng-class="{disabled: !userData.name}">
                <span class="caret"></span>
              </button>
              <ul class="dropdown-menu pull-right">
                <li class="dropdown-header" ng-repeat-start="(value, services) in userData.name track by value">
                  {{services | join:', '}}
                </li>
                <li ng-repeat-end ng-class="{active: profile.name==value}">
                  <a ng-click="profile.name=value">{{value}}</a>
                </li>
              </ul>
            </div>
          </div>
          <p class="help-block">
            <span ng-show="userForm.name.$error.required">Required field</span>
            <span ng-show="userForm.name.$error.maxlength">Cannot exceed 100 characters</span>
          </p>
        </div>
        <div class="form-group profile-description" ng-class="{'has-error':userForm.description.$invalid}">
          <label class="control-label">Quick description of yourself</label>
          <div class="input-group">
            <textarea class="form-control" ng-maxlength="200" rows="2" type="text" name="description" ng-model="profile.description" placeholder="Full description"></textarea>
            <div class="input-group-btn">
              <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" ng-class="{disabled: !userData.description}">
                <span class="caret"></span>
              </button>
              <ul class="dropdown-menu pull-right">
                <li class="dropdown-header" ng-repeat-start="(value, services) in userData.description track by value">
                  {{services | join:', '}}
                </li>
                <li ng-repeat-end ng-class="{active: profile.description==value}">
                  <a ng-click="profile.description=value">{{value}}</a>
                </li>
              </ul>
            </div>
          </div>
          <p class="help-block">
            Characters remaining: <strong ng-bind="200 - userForm.description.$viewValue.length | number"></strong> (maximum 200)
          </p>
        </div>
        <div class="form-group" ng-class="{'has-error':userForm.company.$invalid}">
          <label class="control-label">Company</label>
          <div class="input-group">
            <input class="form-control" type="text" name="company" ng-maxlength="100" ng-model="profile.company" placeholder="Company">
            <div class="input-group-btn">
              <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" ng-class="{disabled: !userData.company}">
                <span class="caret"></span>
              </button>
              <ul class="dropdown-menu pull-right">
                <li class="dropdown-header" ng-repeat-start="(value, services) in userData.company track by value">
                  {{services | join:', '}}
                </li>
                <li ng-repeat-end ng-class="{active: profile.company==value}">
                  <a ng-click="profile.company=value">{{value}}</a>
                </li>
              </ul>
            </div>
          </div>
          <p class="help-block">
            <span ng-show="userForm.company.$error.maxlength">Cannot exceed 100 characters</span>
          </p>
        </div>
        <div class="form-group" ng-class="{'has-error':userForm.website_url.$invalid}">
          <label class="control-label">Website address</label>
          <div class="input-group">
            <input class="form-control" type="text" name="website_url" ng-maxlength="255" ng-model="profile.website_url" placeholder="Website">
            <div class="input-group-btn">
              <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" ng-class="{disabled: !userData.website_url}">
                <span class="caret"></span>
              </button>
              <ul class="dropdown-menu pull-right">
                <li class="dropdown-header" ng-repeat-start="(value, services) in userData.website_url track by value">
                  {{services | join:', '}}
                </li>
                <li ng-repeat-end ng-class="{active: profile.website_url==value}">
                  <a ng-click="profile.website_url=value">{{value}}</a>
                </li>
              </ul>
            </div>
          </div>
          <p class="help-block">
            <span ng-show="userForm.website_url.$error.maxlength">Cannot exceed 255 characters</span>
          </p>
        </div>
        <div class="form-group" ng-class="{'has-error':userForm.location.$invalid}">
          <label class="control-label">Location</label>
          <div class="input-group">
            <input class="form-control" type="text" name="location" ng-maxlength="100" ng-model="profile.location" placeholder="Location">
            <div class="input-group-btn">
              <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" ng-class="{disabled: !userData.location}">
                <span class="caret"></span>
              </button>
              <ul class="dropdown-menu pull-right">
                <li class="dropdown-header" ng-repeat-start="(value, services) in userData.location track by value">
                  {{services | join:', '}}
                </li>
                <li ng-repeat-end ng-class="{active: profile.location==value}">
                  <a ng-click="profile.location=value">{{value}}</a>
                </li>
              </ul>
            </div>
          </div>
          <p class="help-block">
            <span ng-show="userForm.location.$error.maxlength">Cannot exceed 100 characters</span>
          </p>
        </div>
        <div class="form-group">
          <button class="btn btn-primary" ng-disabled="userForm.$invalid" type="submit">Register</button>
          <a class="btn btn-danger" ui-sref="landing">Cancel</a>
          <a class="pull-right btn btn-default" ui-sref="user.link">Back</a>
        </div>
      </form>
    </div>
  """
  controller: ["$scope", "$state", "oauth", "users", "session", ($scope, $state, oauth, users, session) ->
    valid = true for service in oauth.services when oauth.hasIdentity(service.id)
    
    return $state.go "user.login" unless valid
    return $state.go "landing" if session.user
    
    $scope.userData = {}
    
    for service, identity of oauth.getIdentities()
      for field, value of identity when value
        serviceName = oauth.getService(service)?.name
        
        $scope.userData[field] ||= {}
        
        if angular.isObject(value)
          $scope.userData[field][serviceName] = value
        else
          $scope.userData[field][value] ||= []
          $scope.userData[field][value].push serviceName
    
    $scope.profile = oauth.buildProfile()
    
    $scope.createUser = (userInfo) ->
      userInfo.identities = _.map oauth.getIdentities(), (identity) -> identity
      
      users.create(userInfo).then (user) ->
        session.login(userInfo.identities[0])
        $state.go "landing"
      , (err) ->
        console.log "Failed to create user", arguments...
  ]