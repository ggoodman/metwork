module = angular.module "metwork.service.notifier", []

module.factory "notifier", [ "$rootElement", "$rootScope", "$q", "$timeout", ($rootElement, $rootScope, $q, $timeout) ->
  alert: (messageOrOptions) ->
    dfd = $q.defer()
    options = if angular.isObject(messageOrOptions) then messageOrOptions else
      message: messageOrOptions
      
    return console.warn "Notifier requires a message" unless options.message
    
    $rootScope.$evalAsync ->
      alert(options.message)
      
      dfd.resolve(true)
    
    dfd.promise
    
  success: (messageOrOptions) ->
    dfd = $q.defer()
    options = if angular.isObject(messageOrOptions) then messageOrOptions else
      message: messageOrOptions
      
    return console.warn "Notifier requires a message" unless options.message
    
    $rootScope.$evalAsync ->
      alert("Success: #{options.message}")
      
      dfd.resolve(true)
    
    dfd.promise
    
  confirm: (messageOrOptions) ->
    dfd = $q.defer()
    options = if angular.isObject(messageOrOptions) then messageOrOptions else
      message: messageOrOptions
      
    return console.warn "Notifier requires a message" unless options.message
    
    $rootScope.$evalAsync ->
      dfd.resolve confirm(options.message)
    
    dfd.promise

]