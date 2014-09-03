require "angularytics"

require "./states/landing.coffee"
require "./states/checkin.coffee"
require "./states/event.coffee"
require "./states/user.coffee"
require "./states/locate.coffee"

require "./directives/userpanel.coffee"
require "./directives/flashmessage.coffee"


module = angular.module "metwork", [
  "ui.router"
  
  "angularytics"

  "metwork.state.landing"
  "metwork.state.checkin"
  "metwork.state.event"
  "metwork.state.user"
  "metwork.state.locate"

  "metwork.directive.flashmessage"
  "metwork.directive.userpanel"
]

module.config [ "AngularyticsProvider", (AngularyticsProvider) ->
  AngularyticsProvider.setEventHandlers("GoogleUniversal")
  #AngularyticsProvider.setPageChangeEvent("$stateChangeSuccess")
]

module.run [ "Angularytics", (Angularytics) ->
  Angularytics.init()
]

module.config [ "$stateProvider", "$urlRouterProvider", "$locationProvider", ($stateProvider, $urlRouterProvider, $locationProvider) ->

  $urlRouterProvider.otherwise("/")
  
  $locationProvider.html5Mode(true)
  
]

module.run [ "$rootScope", ($rootScope) ->
  #$rootScope.$on "$stateChangeSuccess", -> console.log "$stateChangeSuccess", arguments...
  #$rootScope.$on "$locationChangeSuccess", -> console.log "$locationChangeSuccess", arguments...
]

module.directive "ngBlur", [ "$interpolate", ($interpolate) ->
  link: ($scope, $element, $attrs) ->
    $element.bind "blur", -> $scope.$apply ->
      $scope.$eval($attrs.ngBlur)
]