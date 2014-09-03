module = angular.module "metwork.service.gatekeeper", [
  "ui.router"
]

module.factory "gatekeeper", [ "$rootScope", "$state", "$stateParams", "$injector", ($rootScope, $state, $stateParams, $injector) ->
  divertUntil: (target, predicate) ->
    throw new Error("gatekeeper.divertUntil requires a function predicate") unless angular.isFunction(predicate)
    unless valid = !!predicate()
      successState = $state.current
      successStateParams = angular.copy($stateParams)
      cancelWatch = $rootScope.$watch predicate, (valid) ->
        if !!valid
          cancelWatch()
          $rootScope.$evalAsync -> $state.transitionTo(successState, successStateParams)
      $state.go(target)
    
    return valid
]

module.run [ "$rootScope", "$state", "$stateParams", "$injector", "$timeout", ($rootScope, $state, $stateParams, $injector, $timeout) ->
  $rootScope.$on "$stateChangeSuccess", (e, toState, toParams, fromState, fromParams) ->
    console.log "$stateChangeSuccess", toState.name
  $rootScope.$on "$stateChangeStart", (e, toState, toParams, fromState, fromParams) ->
    console.log "$stateChangeStart", toState.name
    if toState.divertUntil and angular.isArray(toState.divertUntil)
    
      for diversion in toState.divertUntil
        throw new Error("Missing or invalid 'to' directive in diversion") unless diversion.to and angular.isString(diversion.to)
        
        predicate = -> !!$injector.invoke(diversion.predicate)
        
        unless predicate()
          do (diversion, toState, toParams) ->
            console.log "Predicate failed: ", diversion.predicate.toString()
            e.preventDefault() # Cancel route change
            cancelWatch = $rootScope.$watch predicate, (valid) ->
              if !!valid
                console.log "Predicate succeeded: ", diversion.predicate.toString()
                cancelWatch()
                $timeout ->
                  console.log "Success: Sending you to", toState, toParams
                  console.log "As requested by ", toState.name
                  $state.go(toState, toParams)
            # Change route during digest, but future cycle
            $timeout ->
              console.log "Timeout: Sending you to", diversion.to
              $state.go(diversion.to)
          break
    else if toState.divert and angular.isArray(toState.divert)
    
      for diversion in toState.divert
        throw new Error("Missing or invalid 'to' directive in diversion") unless diversion.to and angular.isString(diversion.to)
        
        unless !!$injector.invoke(diversion.predicate)
          do (diversion, toState, toParams) ->
            console.log "Predicate failed: ", diversion.predicate.toString()
            e.preventDefault() # Cancel route change
            
            # Change route during digest, but future cycle
            $timeout ->
              console.log "Timeout: Sending you to", diversion.to
              $state.go(diversion.to)
          break
]