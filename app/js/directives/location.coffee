require "../services/geocoder.coffee"

module = angular.module "metwork.directive.location", [
  "metwork.service.geocoder"
]


module.directive "mwLocation", [ "geocoder", (geocoder) ->
  require: "?ngModel"
  link: ($scope, $element, $attrs, model) ->
    return unless model
    
    
]