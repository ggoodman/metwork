require "../services/session.coffee"
require "../services/oauth.coffee"
require "../services/backend.coffee"
require "../services/notifier.coffee"

module = angular.module "metwork.state.user", [
  "ui.bootstrap"
  "ui.router"
  
  "metwork.service.session"
  "metwork.service.oauth"
  "metwork.service.backend"
  "metwork.service.notifier"
]

module.filter "join", ->
  (arr, sep = ", ") -> arr.join(sep)


module.config [ "$stateProvider", ($stateProvider) ->
  $stateProvider.state "user",
    url: "/user"
    template: """
      <div class="container">
        <div ui-view></div>
      </div>
    """
    controller: ["$scope", "$state", ($scope, $state) ->
      $state.transitionTo("user.login") if $state.is("user")
    ]

  $stateProvider.state "user.login", require("./user/login.coffee")

  $stateProvider.state "user.link", require("./user/link.coffee")

  $stateProvider.state "user.create", require("./user/create.coffee")
  
  $stateProvider.state "user.profile", require("./user/profile.coffee")

  $stateProvider.state "user.identities", require("./user/identities.coffee")

  $stateProvider.state "user.logout",
    url: "/logout"
    controller: ["$state", "session", ($state, session) ->
      session.logout()
      $state.go "landing"
    ]

]