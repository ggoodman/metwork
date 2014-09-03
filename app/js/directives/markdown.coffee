marked = require "marked"

module = angular.module "metwork.directive.markdown", []

module.directive "mwMarkdown", ->
  restrict: "EA"
  link: ($scope, $element, $attrs) ->
    render = (code) -> $element.html marked(code)
    
    if $attrs.mwMarkdown then $scope.$watch $attrs.mwMarkdown, render
    else render $element.text()