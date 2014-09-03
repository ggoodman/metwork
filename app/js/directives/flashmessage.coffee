module = angular.module "metwork.directive.flashmessage", [
  "ui.router"
  "ui.bootstrap"
]

module.directive "mwFlashmessage", [ "$rootScope", "$state", "$compile", ($rootScope, $state, $compile) ->
  restrict: "A"
  link: ($scope, $element, $attrs) ->
    template = """
      <div class="mw-flashmessage alert alert-danger alert-dismissable">
        <button type="button" class="close" ng-click="close()" aria-hidden="true">&times;</button>
        <strong ng-bind="error.message"></strong>
      </div>
    """
    
    $rootScope.$on "$stateChangeError", (e, toState, toParams, fromState, fromParams, error) ->
      scope = $scope.$new(true)
      scope.error = error.data
      scope.close = ->
        el.remove()
        $scope.$destroy()
      
      $element.prepend(el = angular.element(template))
      $compile(el)(scope)
]