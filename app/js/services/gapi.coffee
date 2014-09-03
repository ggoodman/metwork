module = angular.module "metwork.service.gapi", []

module.factory "gapi", ["$rootScope", "$q", ($rootScope, $q) ->
  
  loadMaps: do ->
    promise = null
    
    ->
      return promise if promise
      
      dfd = $q.defer()
      
      google.load "maps", "3",
        other_params: "key=AIzaSyB_2GhwrG6DenjUEK-Ubuv8O3hHQj09UvM&sensor=true"
        callback: -> $rootScope.$apply -> dfd.resolve()
      
      return promise = dfd.promise
]

