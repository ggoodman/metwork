module = angular.module "metwork.directive.usercard", [
]

module.directive "mwUsercard", [ ->
  restrict: "E"
  replace: true
  scope:
    user: "="
  template: """
    <div class="mw-usercard clearfix" ng-class="{expanded: expanded}" ng-click="expanded=!expanded">
      <div class="innercard">
        <div class="picture pull-left"><img src="{{user.picture_url.normal}}"></div>
        <div class="contact">
          <h5 class="fullname">{{user.name}}</h5>
          <p class="tagline text-muted">{{user.description}}</p>
        </div>
      </div>
    </div>
  """
  controller: ["$scope", ($scope) ->
  ]
]