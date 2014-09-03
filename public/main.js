;(function(e,t,n){function i(n,s){if(!t[n]){if(!e[n]){var o=typeof require=="function"&&require;if(!s&&o)return o(n,!0);if(r)return r(n,!0);throw new Error("Cannot find module '"+n+"'")}var u=t[n]={exports:{}};e[n][0].call(u.exports,function(t){var r=e[n][1][t];return i(r?r:t)},u,u.exports)}return t[n].exports}var r=typeof require=="function"&&require;for(var s=0;s<n.length;s++)i(n[s]);return i})({1:[function(require,module,exports){
(function() {
  var module;

  module = angular.module("metwork.directive.flashmessage", ["ui.router", "ui.bootstrap"]);

  module.directive("mwFlashmessage", [
    "$rootScope", "$state", "$compile", function($rootScope, $state, $compile) {
      return {
        restrict: "A",
        link: function($scope, $element, $attrs) {
          var template;
          template = "<div class=\"mw-flashmessage alert alert-danger alert-dismissable\">\n  <button type=\"button\" class=\"close\" ng-click=\"close()\" aria-hidden=\"true\">&times;</button>\n  <strong ng-bind=\"error.message\"></strong>\n</div>";
          return $rootScope.$on("$stateChangeError", function(e, toState, toParams, fromState, fromParams, error) {
            var el, scope;
            scope = $scope.$new(true);
            scope.error = error.data;
            scope.close = function() {
              el.remove();
              return $scope.$destroy();
            };
            $element.prepend(el = angular.element(template));
            return $compile(el)(scope);
          });
        }
      };
    }
  ]);

}).call(this);


},{}],2:[function(require,module,exports){
(function() {
  var module;

  module = angular.module("metwork.directive.usercard", []);

  module.directive("mwUsercard", [
    function() {
      return {
        restrict: "E",
        replace: true,
        scope: {
          user: "="
        },
        template: "<div class=\"mw-usercard clearfix\" ng-class=\"{expanded: expanded}\" ng-click=\"expanded=!expanded\">\n  <div class=\"innercard\">\n    <div class=\"picture pull-left\"><img src=\"{{user.picture_url.normal}}\"></div>\n    <div class=\"contact\">\n      <h5 class=\"fullname\">{{user.name}}</h5>\n      <p class=\"tagline text-muted\">{{user.description}}</p>\n    </div>\n  </div>\n</div>",
        controller: ["$scope", function($scope) {}]
      };
    }
  ]);

}).call(this);


},{}],3:[function(require,module,exports){
(function() {
  var module;

  module = angular.module("metwork.directive.userpanel", ["metwork.service.session"]);

  module.directive("mwUserPanel", [
    "session", function(session) {
      return {
        restrict: "E",
        replace: true,
        scope: true,
        template: "<div class=\"mw-user-panel\">\n  <a class=\"btn btn-default navbar-btn\" ng-if=\"!session.user\" ui-sref=\"user.login\">Login</a>\n  <div ng-if=\"session.user\">\n    <div class=\"btn-group\">\n      <a class=\"btn btn-default navbar-btn dropdown-toggle\">\n        <img ng-src=\"{{session.user.picture_url.mini}}\">\n        {{session.user.name}}\n        <span class=\"caret\"></span>\n      </a>\n      <ul class=\"dropdown-menu\">\n        <li><a ui-sref=\"user.profile\">Edit profile</a></li>\n        <li><a ui-sref=\"user.identities\">Edit identities</a></li>\n        <li class=\"divider\"></li>\n        <li><a ui-sref=\"user.logout\">Logout</a></li>\n      </ul>\n    </div>\n  </div>\n</div>",
        controller: [
          "$scope", function($scope) {
            return $scope.session = session;
          }
        ]
      };
    }
  ]);

}).call(this);


},{}],4:[function(require,module,exports){
(function() {
  var module;

  module = angular.module("metwork.service.gapi", []);

  module.factory("gapi", [
    "$rootScope", "$q", function($rootScope, $q) {
      return {
        loadMaps: (function() {
          var promise;
          promise = null;
          return function() {
            var dfd;
            if (promise) {
              return promise;
            }
            dfd = $q.defer();
            google.load("maps", "3", {
              other_params: "key=AIzaSyB_2GhwrG6DenjUEK-Ubuv8O3hHQj09UvM&sensor=true",
              callback: function() {
                return $rootScope.$apply(function() {
                  return dfd.resolve();
                });
              }
            });
            return promise = dfd.promise;
          };
        })()
      };
    }
  ]);

}).call(this);


},{}],5:[function(require,module,exports){
(function() {
  var module;

  module = angular.module("metwork.service.gatekeeper", ["ui.router"]);

  module.factory("gatekeeper", [
    "$rootScope", "$state", "$stateParams", "$injector", function($rootScope, $state, $stateParams, $injector) {
      return {
        divertUntil: function(target, predicate) {
          var cancelWatch, successState, successStateParams, valid;
          if (!angular.isFunction(predicate)) {
            throw new Error("gatekeeper.divertUntil requires a function predicate");
          }
          if (!(valid = !!predicate())) {
            successState = $state.current;
            successStateParams = angular.copy($stateParams);
            cancelWatch = $rootScope.$watch(predicate, function(valid) {
              if (!!valid) {
                cancelWatch();
                return $rootScope.$evalAsync(function() {
                  return $state.transitionTo(successState, successStateParams);
                });
              }
            });
            $state.go(target);
          }
          return valid;
        }
      };
    }
  ]);

  module.run([
    "$rootScope", "$state", "$stateParams", "$injector", "$timeout", function($rootScope, $state, $stateParams, $injector, $timeout) {
      $rootScope.$on("$stateChangeSuccess", function(e, toState, toParams, fromState, fromParams) {
        return console.log("$stateChangeSuccess", toState.name);
      });
      return $rootScope.$on("$stateChangeStart", function(e, toState, toParams, fromState, fromParams) {
        var diversion, predicate, _i, _j, _len, _len1, _ref, _ref1, _results, _results1;
        console.log("$stateChangeStart", toState.name);
        if (toState.divertUntil && angular.isArray(toState.divertUntil)) {
          _ref = toState.divertUntil;
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            diversion = _ref[_i];
            if (!(diversion.to && angular.isString(diversion.to))) {
              throw new Error("Missing or invalid 'to' directive in diversion");
            }
            predicate = function() {
              return !!$injector.invoke(diversion.predicate);
            };
            if (!predicate()) {
              (function(diversion, toState, toParams) {
                var cancelWatch;
                console.log("Predicate failed: ", diversion.predicate.toString());
                e.preventDefault();
                cancelWatch = $rootScope.$watch(predicate, function(valid) {
                  if (!!valid) {
                    console.log("Predicate succeeded: ", diversion.predicate.toString());
                    cancelWatch();
                    return $timeout(function() {
                      console.log("Success: Sending you to", toState, toParams);
                      console.log("As requested by ", toState.name);
                      return $state.go(toState, toParams);
                    });
                  }
                });
                return $timeout(function() {
                  console.log("Timeout: Sending you to", diversion.to);
                  return $state.go(diversion.to);
                });
              })(diversion, toState, toParams);
              break;
            } else {
              _results.push(void 0);
            }
          }
          return _results;
        } else if (toState.divert && angular.isArray(toState.divert)) {
          _ref1 = toState.divert;
          _results1 = [];
          for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
            diversion = _ref1[_j];
            if (!(diversion.to && angular.isString(diversion.to))) {
              throw new Error("Missing or invalid 'to' directive in diversion");
            }
            if (!$injector.invoke(diversion.predicate)) {
              (function(diversion, toState, toParams) {
                console.log("Predicate failed: ", diversion.predicate.toString());
                e.preventDefault();
                return $timeout(function() {
                  console.log("Timeout: Sending you to", diversion.to);
                  return $state.go(diversion.to);
                });
              })(diversion, toState, toParams);
              break;
            } else {
              _results1.push(void 0);
            }
          }
          return _results1;
        }
      });
    }
  ]);

}).call(this);


},{}],6:[function(require,module,exports){
(function() {
  var module;

  module = angular.module("metwork.service.notifier", []);

  module.factory("notifier", [
    "$rootElement", "$rootScope", "$q", "$timeout", function($rootElement, $rootScope, $q, $timeout) {
      return {
        alert: function(messageOrOptions) {
          var dfd, options;
          dfd = $q.defer();
          options = angular.isObject(messageOrOptions) ? messageOrOptions : {
            message: messageOrOptions
          };
          if (!options.message) {
            return console.warn("Notifier requires a message");
          }
          $rootScope.$evalAsync(function() {
            alert(options.message);
            return dfd.resolve(true);
          });
          return dfd.promise;
        },
        success: function(messageOrOptions) {
          var dfd, options;
          dfd = $q.defer();
          options = angular.isObject(messageOrOptions) ? messageOrOptions : {
            message: messageOrOptions
          };
          if (!options.message) {
            return console.warn("Notifier requires a message");
          }
          $rootScope.$evalAsync(function() {
            alert("Success: " + options.message);
            return dfd.resolve(true);
          });
          return dfd.promise;
        },
        confirm: function(messageOrOptions) {
          var dfd, options;
          dfd = $q.defer();
          options = angular.isObject(messageOrOptions) ? messageOrOptions : {
            message: messageOrOptions
          };
          if (!options.message) {
            return console.warn("Notifier requires a message");
          }
          $rootScope.$evalAsync(function() {
            return dfd.resolve(confirm(options.message));
          });
          return dfd.promise;
        }
      };
    }
  ]);

}).call(this);


},{}],7:[function(require,module,exports){
(function() {
  var module;

  module = angular.module("metwork.service.users", ["restangular"]);

  module.config([
    "RestangularProvider", function(RestangularProvider) {
      RestangularProvider.setBaseUrl("http://metwork-api.ggoodman.c9.io");
      return RestangularProvider.setRestangularFields({
        id: "_id"
      });
    }
  ]);

  module.factory("users", [
    "Restangular", function(Restangular) {
      var usersBase;
      usersBase = Restangular.all("users");
      return {
        augment: function(obj) {},
        create: function(json) {
          return usersBase.post(json);
        }
      };
    }
  ]);

}).call(this);


},{}],8:[function(require,module,exports){
(function() {
  var __slice = [].slice;

  module.exports = {
    url: "/create",
    template: "<div class=\"row\">\n  <form novalidate class=\"col-xs-12\" ng-submit=\"createUser(profile)\" name=\"userForm\">\n    <input type=\"hidden\" ng-model=\"profile.picture_url\">\n    <div class=\"form-group clearfix\">\n      <div class=\"row\">\n        <div class=\"col-xs-4 col-sm-3 col-md-2\" ng-class=\"{selected: profile.picture_url==picture_url}\" ng-repeat=\"(service, picture_url) in userData.picture_url\">\n          <a ng-click=\"profile.picture_url=picture_url\" class=\"thumbnail\">\n            <div class=\"crop-vertical\">\n              <img ng-src=\"{{picture_url.bigger}}\" style=\"width: 100%\" />\n            </div>\n            <div class=\"caption\">{{service}}</div>\n          </a>\n        </div>\n      </div>\n    </div>\n    <div class=\"form-group\" ng-class=\"{'has-error':userForm.name.$invalid}\">\n      <label class=\"control-label\">Full name</label>\n      <div class=\"input-group\">\n        <input class=\"form-control\" type=\"text\" required ng-maxlength=\"100\" name=\"name\" ng-model=\"profile.name\" placeholder=\"Full name\">\n        <div class=\"input-group-btn\">\n          <button type=\"button\" class=\"btn btn-default dropdown-toggle\" data-toggle=\"dropdown\" ng-class=\"{disabled: !userData.name}\">\n            <span class=\"caret\"></span>\n          </button>\n          <ul class=\"dropdown-menu pull-right\">\n            <li class=\"dropdown-header\" ng-repeat-start=\"(value, services) in userData.name track by value\">\n              {{services | join:', '}}\n            </li>\n            <li ng-repeat-end ng-class=\"{active: profile.name==value}\">\n              <a ng-click=\"profile.name=value\">{{value}}</a>\n            </li>\n          </ul>\n        </div>\n      </div>\n      <p class=\"help-block\">\n        <span ng-show=\"userForm.name.$error.required\">Required field</span>\n        <span ng-show=\"userForm.name.$error.maxlength\">Cannot exceed 100 characters</span>\n      </p>\n    </div>\n    <div class=\"form-group profile-description\" ng-class=\"{'has-error':userForm.description.$invalid}\">\n      <label class=\"control-label\">Quick description of yourself</label>\n      <div class=\"input-group\">\n        <textarea class=\"form-control\" ng-maxlength=\"200\" rows=\"2\" type=\"text\" name=\"description\" ng-model=\"profile.description\" placeholder=\"Full description\"></textarea>\n        <div class=\"input-group-btn\">\n          <button type=\"button\" class=\"btn btn-default dropdown-toggle\" data-toggle=\"dropdown\" ng-class=\"{disabled: !userData.description}\">\n            <span class=\"caret\"></span>\n          </button>\n          <ul class=\"dropdown-menu pull-right\">\n            <li class=\"dropdown-header\" ng-repeat-start=\"(value, services) in userData.description track by value\">\n              {{services | join:', '}}\n            </li>\n            <li ng-repeat-end ng-class=\"{active: profile.description==value}\">\n              <a ng-click=\"profile.description=value\">{{value}}</a>\n            </li>\n          </ul>\n        </div>\n      </div>\n      <p class=\"help-block\">\n        Characters remaining: <strong ng-bind=\"200 - userForm.description.$viewValue.length | number\"></strong> (maximum 200)\n      </p>\n    </div>\n    <div class=\"form-group\" ng-class=\"{'has-error':userForm.company.$invalid}\">\n      <label class=\"control-label\">Company</label>\n      <div class=\"input-group\">\n        <input class=\"form-control\" type=\"text\" name=\"company\" ng-maxlength=\"100\" ng-model=\"profile.company\" placeholder=\"Company\">\n        <div class=\"input-group-btn\">\n          <button type=\"button\" class=\"btn btn-default dropdown-toggle\" data-toggle=\"dropdown\" ng-class=\"{disabled: !userData.company}\">\n            <span class=\"caret\"></span>\n          </button>\n          <ul class=\"dropdown-menu pull-right\">\n            <li class=\"dropdown-header\" ng-repeat-start=\"(value, services) in userData.company track by value\">\n              {{services | join:', '}}\n            </li>\n            <li ng-repeat-end ng-class=\"{active: profile.company==value}\">\n              <a ng-click=\"profile.company=value\">{{value}}</a>\n            </li>\n          </ul>\n        </div>\n      </div>\n      <p class=\"help-block\">\n        <span ng-show=\"userForm.company.$error.maxlength\">Cannot exceed 100 characters</span>\n      </p>\n    </div>\n    <div class=\"form-group\" ng-class=\"{'has-error':userForm.website_url.$invalid}\">\n      <label class=\"control-label\">Website address</label>\n      <div class=\"input-group\">\n        <input class=\"form-control\" type=\"text\" name=\"website_url\" ng-maxlength=\"255\" ng-model=\"profile.website_url\" placeholder=\"Website\">\n        <div class=\"input-group-btn\">\n          <button type=\"button\" class=\"btn btn-default dropdown-toggle\" data-toggle=\"dropdown\" ng-class=\"{disabled: !userData.website_url}\">\n            <span class=\"caret\"></span>\n          </button>\n          <ul class=\"dropdown-menu pull-right\">\n            <li class=\"dropdown-header\" ng-repeat-start=\"(value, services) in userData.website_url track by value\">\n              {{services | join:', '}}\n            </li>\n            <li ng-repeat-end ng-class=\"{active: profile.website_url==value}\">\n              <a ng-click=\"profile.website_url=value\">{{value}}</a>\n            </li>\n          </ul>\n        </div>\n      </div>\n      <p class=\"help-block\">\n        <span ng-show=\"userForm.website_url.$error.maxlength\">Cannot exceed 255 characters</span>\n      </p>\n    </div>\n    <div class=\"form-group\" ng-class=\"{'has-error':userForm.location.$invalid}\">\n      <label class=\"control-label\">Location</label>\n      <div class=\"input-group\">\n        <input class=\"form-control\" type=\"text\" name=\"location\" ng-maxlength=\"100\" ng-model=\"profile.location\" placeholder=\"Location\">\n        <div class=\"input-group-btn\">\n          <button type=\"button\" class=\"btn btn-default dropdown-toggle\" data-toggle=\"dropdown\" ng-class=\"{disabled: !userData.location}\">\n            <span class=\"caret\"></span>\n          </button>\n          <ul class=\"dropdown-menu pull-right\">\n            <li class=\"dropdown-header\" ng-repeat-start=\"(value, services) in userData.location track by value\">\n              {{services | join:', '}}\n            </li>\n            <li ng-repeat-end ng-class=\"{active: profile.location==value}\">\n              <a ng-click=\"profile.location=value\">{{value}}</a>\n            </li>\n          </ul>\n        </div>\n      </div>\n      <p class=\"help-block\">\n        <span ng-show=\"userForm.location.$error.maxlength\">Cannot exceed 100 characters</span>\n      </p>\n    </div>\n    <div class=\"form-group\">\n      <button class=\"btn btn-primary\" ng-disabled=\"userForm.$invalid\" type=\"submit\">Register</button>\n      <a class=\"btn btn-danger\" ui-sref=\"landing\">Cancel</a>\n      <a class=\"pull-right btn btn-default\" ui-sref=\"user.link\">Back</a>\n    </div>\n  </form>\n</div>",
    controller: [
      "$scope", "$state", "oauth", "users", "session", function($scope, $state, oauth, users, session) {
        var field, identity, service, serviceName, valid, value, _base, _base1, _i, _len, _ref, _ref1, _ref2;
        _ref = oauth.services;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          service = _ref[_i];
          if (oauth.hasIdentity(service.id)) {
            valid = true;
          }
        }
        if (!valid) {
          return $state.go("user.login");
        }
        if (session.user) {
          return $state.go("landing");
        }
        $scope.userData = {};
        _ref1 = oauth.getIdentities();
        for (service in _ref1) {
          identity = _ref1[service];
          for (field in identity) {
            value = identity[field];
            if (!(value)) {
              continue;
            }
            serviceName = (_ref2 = oauth.getService(service)) != null ? _ref2.name : void 0;
            (_base = $scope.userData)[field] || (_base[field] = {});
            if (angular.isObject(value)) {
              $scope.userData[field][serviceName] = value;
            } else {
              (_base1 = $scope.userData[field])[value] || (_base1[value] = []);
              $scope.userData[field][value].push(serviceName);
            }
          }
        }
        $scope.profile = oauth.buildProfile();
        return $scope.createUser = function(userInfo) {
          userInfo.identities = _.map(oauth.getIdentities(), function(identity) {
            return identity;
          });
          return users.create(userInfo).then(function(user) {
            session.login(userInfo.identities[0]);
            return $state.go("landing");
          }, function(err) {
            return console.log.apply(console, ["Failed to create user"].concat(__slice.call(arguments)));
          });
        };
      }
    ]
  };

}).call(this);


},{}],9:[function(require,module,exports){
(function() {
  module.exports = {
    url: "/identities",
    template: "<div class=\"row\">\n  <div class=\"col-xs-12\">\n    <h4>Current social accounts</h4>\n  </div>\n  <p class=\"col-xs-6 col-sm-3\" ng-repeat=\"service in services | filter:hasIdentity\">\n    <a class=\"btn btn-default btn-block\" ng-class=\"{disabled: hasIdentity(service), 'btn-success': hasIdentity(service)}\" ng-click=\"remove(service.id)\">\n      <img ng-src=\"{{service.image}}\"></i>\n      {{service.name}}\n    </a>\n  </p>\n</div>\n<div class=\"row\">\n  <div class=\"col-xs-12\">\n    <h4>Add social accounts</h4>\n  </div>\n  <p class=\"col-xs-6 col-sm-3\" ng-repeat=\"service in services | filter:noIdentity\">\n    <a class=\"btn btn-default btn-block\" ng-class=\"{disabled: hasIdentity(service), 'btn-success': hasIdentity(service)}\" ng-click=\"add(service.id)\">\n      <img ng-src=\"{{service.image}}\"></i>\n      {{service.name}}\n    </a>\n  </p>\n</div>\n<div class=\"row\">\n  <p class=\"col-xs-12\" >\n    <a class=\"btn btn-default\" ui-sref=\"landing\">Home</a>\n  </p>\n</div>",
    controller: [
      "$scope", "$state", "oauth", "session", function($scope, $state, oauth, session) {
        if (!session.user) {
          return $state.go("user.login");
        }
        $scope.services = oauth.services;
        $scope.hasIdentity = function(service) {
          return session.hasIdentity(service.id);
        };
        $scope.noIdentity = function(service) {
          return !$scope.hasIdentity(service);
        };
        return $scope.add = function(service) {
          return oauth.authTo(service).then(function(identity) {
            return session.user.addIdentity(identity).then(function() {
              return session.user.identities.push(identity);
            });
          });
        };
      }
    ]
  };

}).call(this);


},{}],10:[function(require,module,exports){
(function() {
  module.exports = {
    url: "/link",
    template: "<div class=\"row\">\n  <div class=\"col-xs-12\">\n    <h4>Link social accounts</h4>\n    <p>\n      Click the buttons below and sign-in to add social profiles to your\n      identity.\n    </p>\n    <p>\n      These profiles will be used to help build your identity and will\n      allow other users to connect with you via social networks once you\n      are a member.\n    </p>\n  </div>\n</div>\n<div class=\"row\">\n  <p class=\"col-xs-6 col-sm-3\" ng-repeat=\"service in services\">\n    <a class=\"btn btn-default btn-block\" ng-class=\"{disabled: hasIdentity(service.id), 'btn-success': hasIdentity(service.id)}\" ng-click=\"authTo(service.id)\">\n      <img ng-src=\"{{service.image}}\"></i>\n      {{service.name}}\n    </a>\n  </p>\n</div>\n<div class=\"row\">\n  <p class=\"col-xs-12\" >\n    <a class=\"btn btn-primary\" ui-sref=\"user.create\">Continue</a>\n    <a class=\"btn btn-danger\" ng-click=\"cancelRegistration()\">Cancel</a>\n  </p>\n</div>",
    controller: [
      "$scope", "$state", "oauth", "session", function($scope, $state, oauth, session) {
        var service, valid, _i, _len, _ref;
        _ref = oauth.services;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          service = _ref[_i];
          if (oauth.hasIdentity(service.id)) {
            valid = true;
          }
        }
        if (!valid) {
          return $state.go("user.login");
        }
        if (session.user) {
          return $state.go("landing");
        }
        $scope.hasIdentity = oauth.hasIdentity.bind(oauth);
        $scope.authTo = oauth.authTo.bind(oauth);
        $scope.services = oauth.services;
        return $scope.cancelRegistration = function() {
          oauth.clearProfiles();
          return $state.go("landing");
        };
      }
    ]
  };

}).call(this);


},{}],11:[function(require,module,exports){
(function() {
  module.exports = {
    data: {
      returnTo: ""
    },
    url: "/login",
    template: "<div class=\"row\">\n  <div class=\"col-xs-12\">\n    <h1>Login / Register</h1>\n    <p>\n      Please sign in using any of the services listed below. If you don't\n      have a profile on Metwork yet, we will set that up for you in less\n      than one minute.\n    </p>\n    <p class=\"alert alert-danger\" ng-if=\"authError\">\n      <strong>Login failed</strong> {{authError}}\n    </p>\n  </div>\n</div>\n<div class=\"row\">\n  <p class=\"col-xs-6 col-sm-3\" ng-repeat=\"service in services\">\n    <a class=\"btn btn-default btn-block\" ng-disabled=\"authenticating\" ng-click=\"authTo(service.id)\">\n      <img ng-src=\"{{service.image}}\"></i>\n      {{service.name}}\n    </a>\n  </p>\n</div>",
    controller: [
      "$scope", "$state", "session", "oauth", "users", "notifier", function($scope, $state, session, oauth, users, notifier) {
        $scope.services = oauth.services;
        return $scope.authTo = function(service) {
          var auth;
          $scope.authenticating = true;
          auth = oauth.authTo(service).then(function(identity) {
            var login;
            if (identity) {
              login = session.login(identity);
              return login["catch"](function(err) {
                if (err.result === "not_found") {
                  return $state.go("user.link");
                } else if (err.result === "conflict") {
                  return notifier.alert("A user already exists with the same email. Please log in with the service used to create your account and then link your " + service + " account to it");
                } else {
                  return $scope.authError = "Error communicating with the server. Please try again later.";
                }
              });
            } else {
              return $scope.authError = "Unable to log you in. Please try again.";
            }
          });
          return auth["finally"](function() {
            return $scope.authenticating = false;
          });
        };
      }
    ]
  };

}).call(this);


},{}],12:[function(require,module,exports){
(function() {
  module.exports = {
    url: "/profile",
    template: "<div class=\"row\">\n  <form novalidate class=\"col-xs-12\" ng-submit=\"updateUser(profile)\" name=\"userForm\">\n    <input type=\"hidden\" ng-model=\"profile.picture_url\">\n    <div class=\"form-group clearfix\">\n      <div class=\"row\">\n        <div class=\"col-xs-4 col-sm-3 col-md-2\" ng-class=\"{selected: equals(profile.picture_url,picture_url)}\" ng-repeat=\"(service, picture_url) in userData.picture_url\">\n          <a ng-click=\"profile.picture_url=picture_url\" class=\"thumbnail\">\n            <div class=\"crop-vertical\">\n              <img ng-src=\"{{picture_url.bigger}}\" style=\"width: 100%\" />\n            </div>\n            <div class=\"caption\">{{service}}</div>\n          </a>\n        </div>\n      </div>\n    </div>\n    <div class=\"form-group\" ng-class=\"{'has-error':userForm.name.$invalid}\">\n      <label class=\"control-label\">Full name</label>\n      <div class=\"input-group\">\n        <input class=\"form-control\" type=\"text\" required ng-maxlength=\"100\" name=\"name\" ng-model=\"profile.name\" placeholder=\"Full name\">\n        <div class=\"input-group-btn\">\n          <button type=\"button\" class=\"btn btn-default dropdown-toggle\" data-toggle=\"dropdown\" ng-class=\"{disabled: !userData.name}\">\n            <span class=\"caret\"></span>\n          </button>\n          <ul class=\"dropdown-menu pull-right\">\n            <li class=\"dropdown-header\" ng-repeat-start=\"(value, services) in userData.name track by value\">\n              {{services | join:', '}}\n            </li>\n            <li ng-repeat-end ng-class=\"{active: profile.name==value}\">\n              <a ng-click=\"profile.name=value\">{{value}}</a>\n            </li>\n          </ul>\n        </div>\n      </div>\n      <p class=\"help-block\">\n        <span ng-show=\"userForm.name.$error.required\">Required field</span>\n        <span ng-show=\"userForm.name.$error.maxlength\">Cannot exceed 100 characters</span>\n      </p>\n    </div>\n    <div class=\"form-group profile-description\" ng-class=\"{'has-error':userForm.description.$invalid}\">\n      <label class=\"control-label\">Quick description of yourself</label>\n      <div class=\"input-group\">\n        <textarea class=\"form-control\" ng-maxlength=\"200\" rows=\"2\" type=\"text\" name=\"description\" ng-model=\"profile.description\" placeholder=\"Full description\"></textarea>\n        <div class=\"input-group-btn\">\n          <button type=\"button\" class=\"btn btn-default dropdown-toggle\" data-toggle=\"dropdown\" ng-class=\"{disabled: !userData.description}\">\n            <span class=\"caret\"></span>\n          </button>\n          <ul class=\"dropdown-menu pull-right\">\n            <li class=\"dropdown-header\" ng-repeat-start=\"(value, services) in userData.description track by value\">\n              {{services | join:', '}}\n            </li>\n            <li ng-repeat-end ng-class=\"{active: profile.description==value}\">\n              <a ng-click=\"profile.description=value\">{{value}}</a>\n            </li>\n          </ul>\n        </div>\n      </div>\n      <p class=\"help-block\">\n        Characters remaining: <strong ng-bind=\"200 - userForm.description.$viewValue.length | number\"></strong> (maximum 200)\n      </p>\n    </div>\n    <div class=\"form-group\" ng-class=\"{'has-error':userForm.company.$invalid}\">\n      <label class=\"control-label\">Company</label>\n      <div class=\"input-group\">\n        <input class=\"form-control\" type=\"text\" name=\"company\" ng-maxlength=\"100\" ng-model=\"profile.company\" placeholder=\"Company\">\n        <div class=\"input-group-btn\">\n          <button type=\"button\" class=\"btn btn-default dropdown-toggle\" data-toggle=\"dropdown\" ng-class=\"{disabled: !userData.company}\">\n            <span class=\"caret\"></span>\n          </button>\n          <ul class=\"dropdown-menu pull-right\">\n            <li class=\"dropdown-header\" ng-repeat-start=\"(value, services) in userData.company track by value\">\n              {{services | join:', '}}\n            </li>\n            <li ng-repeat-end ng-class=\"{active: profile.company==value}\">\n              <a ng-click=\"profile.company=value\">{{value}}</a>\n            </li>\n          </ul>\n        </div>\n      </div>\n      <p class=\"help-block\">\n        <span ng-show=\"userForm.company.$error.maxlength\">Cannot exceed 100 characters</span>\n      </p>\n    </div>\n    <div class=\"form-group\" ng-class=\"{'has-error':userForm.website_url.$invalid}\">\n      <label class=\"control-label\">Website address</label>\n      <div class=\"input-group\">\n        <input class=\"form-control\" type=\"text\" name=\"website_url\" ng-maxlength=\"255\" ng-model=\"profile.website_url\" placeholder=\"Website\">\n        <div class=\"input-group-btn\">\n          <button type=\"button\" class=\"btn btn-default dropdown-toggle\" data-toggle=\"dropdown\" ng-class=\"{disabled: !userData.website_url}\">\n            <span class=\"caret\"></span>\n          </button>\n          <ul class=\"dropdown-menu pull-right\">\n            <li class=\"dropdown-header\" ng-repeat-start=\"(value, services) in userData.website_url track by value\">\n              {{services | join:', '}}\n            </li>\n            <li ng-repeat-end ng-class=\"{active: profile.website_url==value}\">\n              <a ng-click=\"profile.website_url=value\">{{value}}</a>\n            </li>\n          </ul>\n        </div>\n      </div>\n      <p class=\"help-block\">\n        <span ng-show=\"userForm.website_url.$error.maxlength\">Cannot exceed 255 characters</span>\n      </p>\n    </div>\n    <div class=\"form-group\" ng-class=\"{'has-error':userForm.location.$invalid}\">\n      <label class=\"control-label\">Location</label>\n      <div class=\"input-group\">\n        <input class=\"form-control\" type=\"text\" name=\"location\" ng-maxlength=\"100\" ng-model=\"profile.location\" placeholder=\"Location\">\n        <div class=\"input-group-btn\">\n          <button type=\"button\" class=\"btn btn-default dropdown-toggle\" data-toggle=\"dropdown\" ng-class=\"{disabled: !userData.location}\">\n            <span class=\"caret\"></span>\n          </button>\n          <ul class=\"dropdown-menu pull-right\">\n            <li class=\"dropdown-header\" ng-repeat-start=\"(value, services) in userData.location track by value\">\n              {{services | join:', '}}\n            </li>\n            <li ng-repeat-end ng-class=\"{active: profile.location==value}\">\n              <a ng-click=\"profile.location=value\">{{value}}</a>\n            </li>\n          </ul>\n        </div>\n      </div>\n      <p class=\"help-block\">\n        <span ng-show=\"userForm.location.$error.maxlength\">Cannot exceed 100 characters</span>\n      </p>\n    </div>\n    <div class=\"form-group\">\n      <button class=\"btn btn-primary\" ng-disabled=\"userForm.$invalid\" type=\"submit\">Update</button>\n      <a class=\"btn btn-danger\" ui-sref=\"landing\">Cancel</a>\n    </div>\n  </form>\n</div>",
    controller: [
      "$scope", "$state", "oauth", "users", "session", "notifier", function($scope, $state, oauth, users, session, notifier) {
        var field, identity, serviceName, value, _base, _base1, _i, _len, _ref, _ref1;
        if (!session.user) {
          return $state.go("user.login");
        }
        $scope.userData = {};
        $scope.equals = angular.equals;
        _ref = session.user.identities;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          identity = _ref[_i];
          for (field in identity) {
            value = identity[field];
            if (!(value)) {
              continue;
            }
            serviceName = (_ref1 = oauth.getService(identity.service)) != null ? _ref1.name : void 0;
            (_base = $scope.userData)[field] || (_base[field] = {});
            if (angular.isObject(value)) {
              $scope.userData[field][serviceName] = value;
            } else {
              (_base1 = $scope.userData[field])[value] || (_base1[value] = []);
              $scope.userData[field][value].push(serviceName);
            }
          }
        }
        $scope.profile = angular.copy(session.user);
        $scope.$watch("profile", function(profile) {
          return console.log("Profile", profile);
        }, true);
        return $scope.updateUser = function(userInfo) {
          for (field in userInfo) {
            value = userInfo[field];
            session.user[field] = value;
          }
          return session.user.put().then(function() {
            return notifier.success("User updated");
          });
        };
      }
    ]
  };

}).call(this);


},{}],13:[function(require,module,exports){
(function() {
  var module;

  require("../services/geocoder.coffee");

  require("../services/gapi.coffee");

  module = angular.module("metwork.directive.gmap", ["metwork.service.geocoder", "metwork.service.gapi"]);

  module.directive("mwGmap", [
    "$interpolate", "geocoder", "gapi", function($interpolate, geocoder, gapi) {
      return {
        restrict: "E",
        replace: true,
        scope: {
          address: "=",
          onClickMarker: "&",
          onUpdateGeocodeResults: "&"
        },
        template: "<div class=\"map-canvas\" style=\"height: 200px\"></div>",
        link: function($scope, $element, $attrs) {
          var markers;
          markers = [];
          return gapi.loadMaps().then(function() {
            var gmap;
            google.maps.visualRefresh = true;
            gmap = new google.maps.Map($element[0], {
              zoom: 8,
              mapTypeId: google.maps.MapTypeId.ROADMAP,
              mapTypeControl: false,
              streetViewControl: false
            });
            return $scope.$watch("address", function(address) {
              var marker;
              while (marker = markers.pop()) {
                marker.setMap(null);
              }
              if (address) {
                return geocoder.geocode(address).then(function(results) {
                  var bounds, result, _fn, _i, _len;
                  bounds = new google.maps.LatLngBounds;
                  _fn = function(result) {
                    var latlng;
                    latlng = new google.maps.LatLng(result.position.lat, result.position.lon);
                    markers.push(marker = new google.maps.Marker({
                      map: gmap,
                      position: latlng,
                      title: result.formatted_address
                    }));
                    bounds.extend(latlng);
                    return google.maps.event.addListener(marker, 'click', function() {
                      return $scope.$apply(function() {
                        return $scope.onClickMarker(result);
                      });
                    });
                  };
                  for (_i = 0, _len = results.length; _i < _len; _i++) {
                    result = results[_i];
                    _fn(result);
                  }
                  gmap.fitBounds(bounds);
                  if (gmap.getZoom() > 15) {
                    return gmap.setZoom(15);
                  }
                });
              }
            });
          });
        }
      };
    }
  ]);

}).call(this);


},{"../services/gapi.coffee":4,"../services/geocoder.coffee":14}],15:[function(require,module,exports){
(function() {
  var module;

  require("../services/geocoder.coffee");

  module = angular.module("metwork.directive.location", ["metwork.service.geocoder"]);

  module.directive("mwLocation", [
    "geocoder", function(geocoder) {
      return {
        require: "?ngModel",
        link: function($scope, $element, $attrs, model) {
          if (!model) {

          }
        }
      };
    }
  ]);

}).call(this);


},{"../services/geocoder.coffee":14}],16:[function(require,module,exports){
(function() {
  var module;

  require("../services/geolocation.coffee");

  module = angular.module("metwork.service.backend", ["restangular", "metwork.service.geolocation"]);

  module.config([
    "RestangularProvider", function(RestangularProvider) {
      RestangularProvider.setBaseUrl("https://metwork-api-c9-ggoodman.c9.io");
      RestangularProvider.setRestangularFields({
        id: "_id"
      });
      return RestangularProvider.setResponseExtractor(function(response, operation) {
        return response.data;
      });
    }
  ]);

  module.factory("users", [
    "Restangular", function(Restangular) {
      var Users, UsersConfig;
      Restangular.extendModel("users", function(model) {
        model.addIdentity = function(identity) {
          return this.all("identities").post(identity);
        };
        model.hasIdentity = function(identity) {
          return !!_.find(this.identities, function(ident) {
            return ident.service === identity.service && ((identity.user_id == null) || ident.user_id === identity.user_id);
          });
        };
        return model;
      });
      UsersConfig = Restangular.withConfig(function(config) {});
      Users = UsersConfig.all("users");
      return {
        wrap: function(json) {
          return UsersConfig.restangularizeElement(null, json, "users");
        },
        create: function(json) {
          return Users.post(json);
        }
      };
    }
  ]);

  module.factory("events", [
    "$q", "Restangular", "location", function($q, Restangular, location) {
      var EventsConfig;
      Restangular.extendModel("events", function(model) {
        return model;
      });
      EventsConfig = Restangular.withConfig(function(config) {});
      return {
        findByCode: function(code) {
          return EventsConfig.one("events", code).get();
        },
        findNearby: function() {
          if (!location.position) {
            return $q.reject("Unable to determine your location");
          }
          return EventsConfig.all("events").customGETLIST("nearby", {
            lat: location.position.lat,
            lon: location.position.lon
          }).then(function(events) {
            return EventsConfig.restangularizeCollection(null, events, "events");
          });
        },
        create: function(json) {
          return EventsConfig.all("events").post(json);
        }
      };
    }
  ]);

}).call(this);


},{"../services/geolocation.coffee":17}],14:[function(require,module,exports){
(function() {
  var module;

  require("../services/gapi.coffee");

  module = angular.module("metwork.service.geocoder", ["metwork.service.gapi"]);

  module.factory("geocoder", [
    "$q", "$rootScope", "$timeout", "gapi", function($q, $rootScope, $timeout, gapi) {
      var cache, geocoder, issueRequest;
      geocoder = null;
      cache = {};
      issueRequest = function(request) {
        var dfd;
        geocoder || (geocoder = new google.maps.Geocoder());
        dfd = $q.defer();
        geocoder.geocode(request, function(results, status) {
          return $rootScope.$apply(function() {
            if (status === google.maps.GeocoderStatus.OK) {
              return dfd.resolve(_.map(results, function(result) {
                return {
                  address: result.formatted_address,
                  position: {
                    lat: result.geometry.location.lat(),
                    lon: result.geometry.location.lng()
                  }
                };
              }));
            } else if (status === google.maps.GeocoderStatus.ZERO_RESULTS) {
              return dfd.reject("Address not found");
            } else if (status === google.maps.GeocoderStatus.QUERY_OVER_LIMIT) {
              return dfd.reject("Geocoding quota exceeded");
            } else if (status === google.maps.GeocoderStatus.REQUEST_DENIED) {
              return dfd.reject("Geocoding request denied");
            } else if (status === google.maps.GeocoderStatus.INVALID_REQUEST) {
              dfd.reject("Geocoding quota exceeded");
              return console.error("Invalid geocoding request:", request);
            } else {
              dfd.reject("Unknown geocoding error");
              return console.error("Unknown geocoding error", results, status);
            }
          });
        });
        return dfd.promise;
      };
      return {
        geocode: function(address) {
          return gapi.loadMaps().then(function() {
            return issueRequest({
              address: address
            });
          });
        },
        reverseGeocode: function(lat, lon) {
          return gapi.loadMaps().then(function() {
            return issueRequest({
              latLng: new google.maps.LatLng(lat, lon)
            });
          });
        }
      };
    }
  ]);

}).call(this);


},{"../services/gapi.coffee":4}],17:[function(require,module,exports){
(function() {
  var module;

  require("../services/gapi.coffee");

  module = angular.module("metwork.service.geolocation", ["metwork.service.gapi"]);

  module.factory("geolocator", [
    "$q", "$rootScope", "$timeout", "$http", function($q, $rootScope, $timeout, $http) {
      return {
        geolocate: function() {
          var dfd;
          dfd = $q.defer();
          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
              return $rootScope.$apply(function() {
                return dfd.resolve({
                  lat: position.coords.latitude,
                  lon: position.coords.longitude,
                  accuracy: position.coords.accuracy
                });
              });
            }, function(err) {
              var _ref;
              if (((_ref = google.loader) != null ? _ref.ClientLocation : void 0) != null) {
                return $rootScope.$apply(function() {
                  return dfd.resolve({
                    lat: google.loader.ClientLocation.latitude,
                    lon: google.loader.ClientLocation.longitude,
                    accuracy: 1000 * 1000
                  });
                });
              } else {
                return $rootScope.$apply(function() {
                  return dfd.reject("Unable to get location");
                });
              }
            }, {
              timeout: 10 * 1000
            });
          }
          return dfd.promise;
        }
      };
    }
  ]);

}).call(this);


},{"../services/gapi.coffee":4}],18:[function(require,module,exports){
(function() {
  var module;

  require("../services/geolocation.coffee");

  require("../services/geocoder.coffee");

  module = angular.module("metwork.service.location", ["metwork.service.geolocation", "metwork.service.geocoder"]);

  module.factory("location", [
    "geolocator", "geocoder", function(geolocator, geocoder) {
      return {
        position: null,
        address: null,
        confirmedAddress: false,
        confirmedPosition: false,
        confirmAddress: function(address) {
          this.address = address;
          return this.confirmedAddress = true;
        },
        confirmPosition: function(position) {
          this.position = position;
          this.confirmedPosition = true;
          return this.position.accuracy = 10;
        },
        locate: function() {
          var service;
          service = this;
          return geolocator.geolocate().then(function(position) {
            console.log("Location", position);
            service.position = position;
            return service;
          }, function() {
            service.position = {
              lat: 45.5,
              lon: 73.5667,
              accuracy: 10000
            };
            return service;
          });
        }
      };
    }
  ]);

}).call(this);


},{"../services/geocoder.coffee":14,"../services/geolocation.coffee":17}],19:[function(require,module,exports){
(function() {
  var module;

  require("../services/notifier.coffee");

  module = angular.module("metwork.service.oauth", ["metwork.service.notifier"]);

  module.config([
    "RestangularProvider", function(RestangularProvider) {
      return RestangularProvider.setBaseUrl("https://metwork-api-c9-ggoodman.c9.io");
    }
  ]);

  module.factory("oauth", [
    "$window", "$rootScope", "$q", "$timeout", "notifier", function($window, $rootScope, $q, $timeout, notifier) {
      var handlePostMessage, messageHandler, registerMessageHandler;
      messageHandler = null;
      handlePostMessage = function(event) {
        var e;
        if (messageHandler) {
          try {
            return typeof messageHandler === "function" ? messageHandler(JSON.parse(event.data)) : void 0;
          } catch (_error) {
            e = _error;
            return console.log("[ERR] JSON.parse", e);
          }
        }
      };
      registerMessageHandler = function(handler) {
        return messageHandler = handler;
      };
      $window.addEventListener("message", handlePostMessage, false);
      return {
        identities: {},
        clearIdentities: function() {
          return angular.copy({}, this.identities);
        },
        getIdentity: function(service) {
          return this.identities[service];
        },
        hasIdentity: function(service) {
          return !!this.getIdentity(service);
        },
        getIdentities: function() {
          return this.identities;
        },
        buildProfile: function() {
          var field, fieldOrder, order, profile, service, _i, _len, _ref;
          order = {
            name: ["linkedin", "google", "facebook", "twitter", "github", "meetup", "eventbrite"],
            description: ["linkedin", "twitter", "google", "facebook", "github", "meetup", "eventbrite"],
            company: ["linkedin", "twitter", "google", "facebook", "github", "meetup", "eventbrite"],
            location: ["linkedin", "twitter", "google", "facebook", "github", "meetup", "eventbrite"],
            website_url: ["linkedin", "twitter", "google", "facebook", "github", "meetup", "eventbrite"],
            picture_url: ["linkedin", "google", "facebook", "twitter", "github", "meetup", "eventbrite"]
          };
          profile = {};
          for (field in order) {
            fieldOrder = order[field];
            for (_i = 0, _len = fieldOrder.length; _i < _len; _i++) {
              service = fieldOrder[_i];
              if (profile[field] || (profile[field] = (_ref = this.getIdentity(service)) != null ? _ref[field] : void 0)) {
                break;
              }
            }
          }
          return profile;
        },
        authTo: function(service, width, height) {
          var authWindow, dfd, identity, interval, left, resolved, screenHeight, session, timeout, top;
          if (width == null) {
            width = 1000;
          }
          if (height == null) {
            height = 750;
          }
          if (identity = this.getIdentity(service)) {
            return $q.when(identity);
          }
          session = this;
          dfd = $q.defer();
          resolved = false;
          screenHeight = screen.height;
          left = Math.round((screen.width / 2) - (width / 2));
          top = 0;
          if (screenHeight > height) {
            top = Math.round((screenHeight / 2) - (height / 2));
          }
          authWindow = window.open("/auth/" + service, "mw-auth", "left=" + left + ",top=" + top + ",width=" + width + ",height=" + height + ",personalbar=0,toolbar=0,scrollbars=1,resizable=1");
          authWindow.focus();
          timeout = $timeout(function() {
            resolved = true;
            clearInterval(interval);
            dfd.reject("Login timed out");
            return null;
          }, 1000 * 60 * 2);
          interval = setInterval(function() {
            if (!authWindow || authWindow.closed !== false) {
              resolved = true;
              authWindow = null;
              clearInterval(interval);
              $timeout.cancel(timeout);
              return $rootScope.$apply(function() {
                return dfd.reject("Auth window closed without logging in");
              });
            }
          }, 200);
          registerMessageHandler(function(event) {
            if (resolved) {
              return;
            }
            if (event.event === "auth") {
              session.identities[event.message.service] = event.message;
              console.log("OAuth", event.message);
              return $rootScope.$apply(function() {
                return dfd.resolve(event.message);
              });
            } else if (event.event === "auth_error") {
              notifier.error("Login failed");
              console.error("Login failed", event.message);
              return $rootScope.$apply(function() {
                return dfd.reject(event.message);
              });
            }
          });
          return dfd.promise;
        },
        getService: function(id) {
          var service, _i, _len, _ref;
          _ref = this.services;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            service = _ref[_i];
            if (service.id === id) {
              return service;
            }
          }
        },
        services: [
          {
            id: "linkedin",
            name: "LinkedIn",
            iconClass: "icon-linkedin",
            image: "/img/oauth/linkedin.ico"
          }, {
            id: "facebook",
            name: "Facebook",
            iconClass: "icon-facebook",
            image: "/img/oauth/facebook.ico"
          }, {
            id: "github",
            name: "Github",
            iconClass: "icon-github",
            image: "/img/oauth/github.ico"
          }, {
            id: "google",
            name: "Google",
            iconClass: "icon-google-plus",
            image: "/img/oauth/google.ico"
          }, {
            id: "twitter",
            name: "Twitter",
            iconClass: "icon-twitter",
            image: "/img/oauth/twitter.ico"
          }, {
            id: "meetup",
            name: "Meetup",
            iconClass: "",
            image: "/img/oauth/meetup.ico"
          }, {
            id: "eventbrite",
            name: "Eventbrite",
            iconClass: "",
            image: "/img/oauth/eventbrite.ico"
          }
        ]
      };
    }
  ]);

}).call(this);


},{"../services/notifier.coffee":6}],20:[function(require,module,exports){
(function() {
  var module;

  require("../services/oauth.coffee");

  module = angular.module("metwork.service.session", ["ngCookies", "restangular", "metwork.service.backend", "metwork.service.notifier", "metwork.service.oauth"]);

  module.config([
    "RestangularProvider", function(RestangularProvider) {
      RestangularProvider.setBaseUrl("http://metwork-api-c9-ggoodman.c9.io");
      return RestangularProvider.setRestangularFields({
        id: "_id"
      });
    }
  ]);

  module.factory("session", [
    "$rootScope", "$state", "$q", "$window", "$http", "$cookies", "Restangular", "oauth", "users", function($rootScope, $state, $q, $window, $http, $cookies, Restangular, oauth, users) {
      var Session, session;
      return session = new (Session = (function() {
        function Session() {
          this.user = null;
          angular.copy(metwork.session, this);
          if (this.user) {
            this.user = users.wrap(this.user);
          }
        }

        Session.prototype.hasIdentity = function(service) {
          return !!this.getIdentity(service);
        };

        Session.prototype.getIdentity = function(service) {
          var _ref;
          return (((_ref = this.user) != null ? _ref.identities : void 0) != null) && _.find(this.user.identities, function(identity) {
            return identity.service === service;
          });
        };

        Session.prototype.login = function(identity) {
          var req, service;
          service = this;
          req = $http.post("http://metwork-api-c9-ggoodman.c9.io/sessions/" + $cookies.mwsessid + "/user", {}, {
            params: {
              service: identity.service,
              token: identity.token,
              secret: identity.secret
            }
          });
          return req.then(function(res) {
            var _ref;
            if (((_ref = res.data) != null ? _ref.result : void 0) != null) {
              switch (res.data.result) {
                case "not_found":
                case "conflict":
                  return $q.reject(res.data);
                case "ok":
                  return service.user = users.wrap(angular.copy(res.data.data));
              }
            }
          });
        };

        Session.prototype.logout = function() {
          var req, service;
          service = this;
          req = $http["delete"]("http://metwork-api-c9-ggoodman.c9.io/sessions/" + $cookies.mwsessid + "/user");
          return req.then(function(res) {
            $window.location.reload();
            oauth.clearIdentities();
            return service.user = null;
          });
        };

        return Session;

      })());
    }
  ]);

}).call(this);


},{"../services/oauth.coffee":19}],21:[function(require,module,exports){
(function() {
  var debounce, module;

  require("../services/session.coffee");

  require("../services/gatekeeper.coffee");

  require("../services/backend.coffee");

  require("../directives/markdown.coffee");

  module = angular.module("metwork.state.checkin", ["ui.bootstrap", "ui.router", "metwork.service.session", "metwork.service.gatekeeper", "metwork.service.backend", "metwork.directive.markdown"]);

  debounce = function(delay, fn) {
    var timeout;
    timeout = null;
    return function() {
      var args, context;
      context = this;
      args = arguments;
      if (timeout) {
        clearTimeout(timeout);
      }
      return timeout = setTimeout(function() {
        return fn.apply(context, args);
      }, delay);
    };
  };

  module.filter("segment", function() {
    return function(value) {
      return value.split(",")[0];
    };
  });

  module.config([
    "$stateProvider", function($stateProvider) {
      $stateProvider.state("checkin", {
        url: "/checkin",
        template: "<div ui-view></div>",
        controller: [
          "$scope", "$state", "$timeout", "geolocator", "geocoder", "session", "gatekeeper", function($scope, $state, $timeout, geolocator, geocoder, session, gatekeeper) {
            if ($state.is("checkin")) {
              return $state.go("checkin.search");
            }
          }
        ]
      });
      $stateProvider.state("checkin.search", {
        url: "/search",
        template: "<div class=\"container\">\n  <div class=\"row\" ng-if=\"events.length\">\n    <div class=\"col-xs-12\">\n      <h4>Nearby events</h4>\n      <div class=\"list-group\">\n        <a class=\"list-group-item event-listing\" ui-sref=\"checkin.event({eventCode: event.code})\" ng-repeat=\"event in events\">\n            <strong>{{event.name}}</strong>\n            <div class=\"text-muted\">\n              <span ng-bind=\"event.start_at | date:'h:mma'\"></span> to <span ng-bind=\"event.end_at | date:'h:mma'\"></span>\n              at\n              <span ng-bind=\"event.address | segment\"></span>\n            </div>\n        </a>\n      </div>\n    </div>\n  </div>\n  <div class=\"row\">\n    <div class=\"col-xs-12\">\n      <h4>Check in by event code</h4>\n      <form ng-submit=\"checkin(eventCode)\">\n        <div class=\"form-group\">\n          <div class=\"input-group\">\n            <input ng-model=\"eventCode\" class=\"form-control\" type=\"text\" placeholder=\"Event code\">\n            <div class=\"input-group-btn\">\n              <button type=\"submit\" ng-disabled=\"!eventCode\" class=\"btn btn-success\">Check in</a>\n            </div>\n          </div>\n        </div>\n      </form>\n    </div>\n  </div>\n</div>",
        divertUntil: [
          {
            to: "user.login",
            predicate: [
              "session", function(session) {
                return session.user;
              }
            ]
          }, {
            to: "locate.position",
            predicate: [
              "location", function(location) {
                return location.position;
              }
            ]
          }, {
            to: "locate.address",
            predicate: [
              "location", function(location) {
                return location.position.accuracy && location.position.accuracy < 200;
              }
            ]
          }
        ],
        controller: [
          "$scope", "$state", "location", "events", function($scope, $state, location, events) {
            console.log("Events", events);
            $scope.events = events.findNearby(location.position);
            return $scope.checkin = function(eventCode) {
              return $state.go("checkin.event", {
                eventCode: eventCode
              });
            };
          }
        ]
      });
      $stateProvider.state("checkin.new", {
        url: "/new",
        template: "<div class=\"container\">\n  <div class=\"row\" ng-if=\"nearbyEvents.length\">\n    <div class=\"col-xs-12\">\n      <h3>Are you at one of these events?</h3>\n      <div class=\"event-listing\" ng-repeat=\"event in nearbyEvents\">\n        <h4>{{event.title}}</h4>\n        <p>{{event.description}}</p>\n      </div>\n    </div>\n  </div>\n  <div class=\"row\">\n    <div class=\"col-xs-12\">\n      <fieldset>\n        <legend>Check-in using the event's code</legend>\n        <div class=\"form-group\">\n          <div class=\"input-group\">\n            <input ng-model=\"event_id\" class=\"form-control\" type=\"text\" placeholder=\"Event code\">\n            <div class=\"input-group-btn\">\n              <a ui-sref=\"event.view({id: event_id})\" ng-disabled=\"!event_id\" class=\"btn btn-success\">Check in</a>\n            </div>\n          </div>\n          <p class=\"help-block\">If you know the event's code, enter it here and click 'Check in'.</p>\n        </div>\n      </fieldset>\n    </div>\n  </div>\n  <div class=\"row\">\n    <div class=\"col-xs-12\">\n    </div>\n  </div>\n</div>",
        divertUntil: [
          {
            to: "user.login",
            predicate: [
              "session", function(session) {
                return session.user;
              }
            ]
          }, {
            to: "locate",
            predicate: [
              "location", function(location) {
                return location.confirmedPosition && location.confirmedAddress;
              }
            ]
          }
        ],
        controller: ["$scope", "$state", "$timeout", "location", "geocoder", "session", "gatekeeper", function($scope, $state, $timeout, location, geocoder, session, gatekeeper) {}]
      });
      return $stateProvider.state("checkin.event", {
        url: "/:eventCode",
        template: "<div class=\"container\">\n  <div class=\"row\" ng-if=\"nearbyEvents.length\">\n    <div class=\"col-xs-12\">\n      <h3>Are you at one of these events?</h3>\n      <div class=\"event-listing\" ng-repeat=\"event in nearbyEvents\">\n        <h4>{{event.title}}</h4>\n        <p>{{event.description}}</p>\n      </div>\n    </div>\n  </div>\n  <div class=\"row\">\n    <div class=\"col-xs-12\">\n      <fieldset>\n        <legend>Check in!</legend>\n        <div class=\"form-group\">\n          <div class=\"input-group\">\n            <input ng-model=\"event_id\" class=\"form-control\" type=\"text\" placeholder=\"Event code\">\n            <div class=\"input-group-btn\">\n              <a ui-sref=\"event.view({id: event_id})\" ng-disabled=\"!event_id\" class=\"btn btn-success\">Check in</a>\n            </div>\n          </div>\n          <p class=\"help-block\">If you know the event's code, enter it here and click 'Check in'.</p>\n        </div>\n      </fieldset>\n    </div>\n  </div>\n  <div class=\"row\">\n    <div class=\"col-xs-12\">\n    </div>\n  </div>\n</div>",
        divertUntil: [
          {
            to: "user.login",
            predicate: [
              "session", function(session) {
                return session.user;
              }
            ]
          }
        ],
        resolve: {
          event: [
            "$stateParams", "events", function($stateParams, events) {
              return events.findByCode($stateParams.eventCode);
            }
          ]
        },
        controller: ["$scope", "$state", "$timeout", "geolocator", "geocoder", "session", "gatekeeper", function($scope, $state, $timeout, geolocator, geocoder, session, gatekeeper) {}]
      });
    }
  ]);

}).call(this);


},{"../directives/markdown.coffee":22,"../services/backend.coffee":16,"../services/gatekeeper.coffee":5,"../services/session.coffee":20}],23:[function(require,module,exports){
(function() {
  var debounce, module,
    __slice = [].slice;

  require("../services/backend.coffee");

  require("../services/session.coffee");

  require("../directives/gmap.coffee");

  module = angular.module("metwork.state.event", ["ui.bootstrap", "ui.router", "metwork.service.backend", "metwork.service.session", "metwork.directive.gmap"]);

  debounce = function(delay, fn) {
    var timeout;
    timeout = null;
    return function() {
      var args, context;
      context = this;
      args = arguments;
      if (timeout) {
        clearTimeout(timeout);
      }
      return timeout = setTimeout(function() {
        return fn.apply(context, args);
      }, delay);
    };
  };

  module.config([
    "$stateProvider", function($stateProvider) {
      $stateProvider.state("event", {
        url: "/event",
        template: "<div class=\"container\" ui-view>\n</div>"
      });
      return $stateProvider.state("event.create", {
        url: "/create",
        template: "<div class=\"row\">\n  <div class=\"col-xs-12\">\n    <h1>Import event</h1>\n  </div>\n  <p class=\"col-xs-6\"><button class=\"btn btn-success btn-block\" ng-class=\"{disabled: session.hasProfile('eventbrite')}\">From Eventbrite</button></p>\n  <p class=\"col-xs-6\"><button class=\"btn btn-success btn-block\" ng-class=\"{disabled: session.hasProfile('meetup')}\">From Meetup.com</button></p>\n</div>\n<div class=\"row\">\n  <div class=\"col-xs-12\">\n    <fieldset>\n      <legend>Create a new event</legend>\n      <form name=\"event\" ng-submit=\"createEvent(editing)\">\n        <div class=\"form-group\" ng-class=\"{'has-error': !event.name.$valid && event.name.$dirty}\">\n          <input name=\"name\" ng-model=\"editing.name\" class=\"form-control\" type=\"text\" required ng-maxlength=\"200\" placeholder=\"Event name\">\n        </div>\n        <div class=\"form-group\" ng-class=\"{'has-error': !event.description.$valid && event.description.$dirty}\">\n          <textarea name=\"description\" ng-model=\"editing.description\" class=\"form-control\" rows=\"4\" required ng-maxlength=\"2048\" placeholder=\"Event description\"></textarea>\n        </div>\n        <div class=\"form-group input-group\" ng-class=\"{'has-error': !event.address.$valid && event.address.$dirty}\">\n          <input name=\"address\" ng-model=\"editing.address\" ng-change=\"updateCenter(editing.address)\" ng-flur=\"center = editing.address\" class=\"form-control\" type=\"text\" required placeholder=\"Address\">\n          <div class=\"input-group-addon\">\n            <i class=\"icon-map-marker\"></i>\n          </div>\n        </div>\n        <div class=\"form-group\">\n          <mw-gmap address=\"map.center\" on-click-marker=\"setLocation(address, position)\"></mw-gmap>\n        </div>\n        <div class=\"form-group input-group\" ng-class=\"{'has-error': !event.start_at.$valid && event.start_at.$dirty}\">\n          <input name=\"start_at\" ng-model=\"editing.start_at\" class=\"form-control\" type=\"datetime-local\" placeholder=\"Date\">\n          <div class=\"input-group-addon\">\n            <i class=\"icon-time\"></i>\n          </div>\n        </div>\n        <div class=\"form-group input-group\">\n          <input name=\"end_at\" ng-model=\"editing.end_at\" class=\"form-control\" type=\"datetime-local\" placeholder=\"Date\">\n          <div class=\"input-group-addon\">\n            <i class=\"icon-time\"></i>\n          </div>\n        </div>\n        <div class=\"form-group\">\n          <div class=\"checkbox\">\n            <label>\n              <input ng-model=\"editing.is_private\" type=\"checkbox\"> This event is private\n            </label>\n            <span class=\"help-block\" ng-if=\"editing.is_private\">\n              Only people who know the event id can join.\n            </span>\n            <span class=\"help-block\" ng-if=\"!editing.is_private\">\n              Anyone can join this event.\n            </span>\n          </div>\n        </div>\n        <div class=\"form-group\">\n          <button type=\"submit\" class=\"btn btn-primary\">Create event</button>\n          <button class=\"btn btn-default\" ui-sref=\"landing\">Cancel</button>\n        </div>\n      </form>\n    </fieldset>\n  </div>\n</div>",
        divertUntil: [
          {
            to: "user.login",
            predicate: [
              "session", function(session) {
                return session.user;
              }
            ]
          }
        ],
        controller: [
          "$scope", "events", "session", function($scope, events, session) {
            $scope.map = {
              center: null
            };
            $scope.session = session;
            $scope.editing = {
              address: ""
            };
            $scope.$watch("editing.address", debounce(1500, function(address) {
              console.log.apply(console, ["chg"].concat(__slice.call(arguments)));
              return $scope.$apply(function() {
                return $scope.map.center = address;
              });
            }));
            $scope.setLocation = function(address, position) {
              $scope.editing.address = address;
              return $scope.editing.position = position;
            };
            return $scope.createEvent = function(json) {
              console.log("Creating", json);
              return events.create(json).then(function() {
                return console.log.apply(console, ["Event created"].concat(__slice.call(arguments)));
              });
            };
          }
        ]
      });
    }
  ]);

}).call(this);


},{"../directives/gmap.coffee":13,"../services/backend.coffee":16,"../services/session.coffee":20}],24:[function(require,module,exports){
(function() {
  var module;

  require("../directives/usercard.coffee");

  require("../services/session.coffee");

  module = angular.module("metwork.state.landing", ["ui.bootstrap", "ui.router", "metwork.directive.usercard", "metwork.service.session"]);

  module.config([
    "$stateProvider", function($stateProvider) {
      return $stateProvider.state("landing", {
        url: "/",
        template: "<div class=\"container\">\n  <div class=\"row text-center\">\n    <div class=\"col-xs-12\">\n      <h1>Meet&nbsp;people. Build&nbsp;your Metwork.</h1>\n      <p class=\"lead\">Connect digitally with the people you meet</p>\n    </div>\n    <p class=\"col-xs-6 col-sm-3 col-sm-offset-3\">\n      <a class=\"btn btn-primary btn-lg btn-block\" ui-sref=\"checkin\">\n        Check in\n      </a>\n    </p>\n    <p class=\"col-xs-6 col-sm-3\">\n      <a class=\"btn btn-default btn-lg btn-block\" ui-sref=\"event.create\">\n        Create event\n      </a>\n    </p>\n  </div>\n  <div class=\"row\" ng-if=\"session.user\">\n    <div class=\"col-xs-12 col-lg-6\"><mw-usercard user=\"session.user\"></mw-usercard></div>\n  </div>\n  <div class=\"row\">\n    <div class=\"col-xs-12\">\n      <h2>What is Metwork?</h2>\n      <p>Metwork is is many things.</p>\n      <ul>\n        <li>A record of people you meet</li>\n        <li>A memory aid</li>\n        <li>An address book</li>\n        <li>A relationship management tool</li>\n      </ul>\n    </div>\n  </div>\n</div>",
        controller: [
          "$scope", "$state", "session", function($scope, $state, session) {
            return $scope.session = session;
          }
        ]
      });
    }
  ]);

}).call(this);


},{"../directives/usercard.coffee":2,"../services/session.coffee":20}],25:[function(require,module,exports){
(function() {
  var debounce, module;

  require("../services/location.coffee");

  module = angular.module("metwork.state.locate", ["ui.bootstrap", "ui.router", "metwork.service.location"]);

  debounce = function(delay, fn) {
    var timeout;
    timeout = null;
    return function() {
      var args, context;
      context = this;
      args = arguments;
      if (timeout) {
        clearTimeout(timeout);
      }
      return timeout = setTimeout(function() {
        return fn.apply(context, args);
      }, delay);
    };
  };

  module.config([
    "$stateProvider", function($stateProvider) {
      $stateProvider.state("locate", {
        url: "/locate",
        abstract: true,
        template: "<div ui-view></div>",
        divert: [
          {
            to: "locate.address",
            predicate: [
              "location", function(location) {
                return location.confirmedAddress;
              }
            ]
          }, {
            to: "locate.address",
            predicate: [
              "location", function(location) {
                return location.confirmedAddress;
              }
            ]
          }
        ],
        controller: ["$scope", "$state", "location", "gatekeeper", function($scope, $state, location, gatekeeper) {}]
      });
      $stateProvider.state("locate.position", {
        url: "/position",
        template: "<div class=\"container\">\n  <div class=\"row col-xs-12\">\n    <h1 class=\"text-center\">Geolocating you</h1>\n    <p class=\"lead text-center\">For best results, please allow your browser access to your location</p>\n    <p class=\"text-center text-muted\"><span class=\"icon-bullseye\" style=\"font-size:20em\"></span></p>\n    <p class=\"text-center\"><button class=\"btn btn-default btn-lg\" ng-click=\"cancel()\">Skip</button></p>\n  </div>\n</div>",
        controller: [
          "$scope", "$state", "$timeout", "location", function($scope, $state, $timeout, location) {
            $timeout(function() {
              return location.locate();
            });
            return $scope.cancel = function() {
              return location.cancelGeolocation();
            };
          }
        ]
      });
      return $stateProvider.state("locate.address", {
        url: "/address",
        template: "<div class=\"container\">\n  <div class=\"row\">\n    <div class=\"col-xs-12\">\n      <fieldset>\n        <legend>Confirm your location</legend>\n        <form name=\"searchByTimePlace\" ng-submit=\"confirm(timeplace.position, timeplace.address)\">\n          <div class=\"form-group\" ng-class=\"{'has-success': timeplace.position.lat, 'has-warning': !timeplace.position.lat}\">\n            <div class=\"input-group\">\n              <input name=\"address\" ng-model=\"timeplace.address\" class=\"form-control\" type=\"text\" placeholder=\"Address\">\n              <span class=\"input-group-btn\">\n                <button class=\"btn btn-default dropdown-toggle\" ng-disabled=\"addresses.length==0 || !timeplace.address\">\n                  <span class=\"caret\"></span>\n                </button>\n                <ul class=\"dropdown-menu pull-right\">\n                  <li ng-repeat=\"result in addresses\">\n                    <a ng-click=\"confirmPosition(result.address, result.position)\">{{result.address}}</a>\n                  </li>\n                </ul>\n              </span>\n            </div>\n            <p class=\"help-block\" ng-show=\"!clickedAddress || clickedAddress != timeplace.address\">Please select an address or click a marker on the map to proceed.</p>\n          </div>\n          <div class=\"form-group\">\n            <mw-gmap address=\"map.center\" on-update-geocode-results=\"updateGeocodeResults(results)\" on-click-marker=\"updatePosition(position, address)\"></mw-gmap>\n          </div>\n          <div class=\"form-group\">\n            <button type=\"submit\" ng-disabled=\"!clickedAddress || clickedAddress != timeplace.address\" class=\"btn btn-primary\">Confirm</button>\n            <button type=\"button\" class=\"btn btn-default\" ui-sref=\"landing\">Cancel</button>\n          </div>\n        </fieldset>\n      </form>\n    </div>\n  </div>\n</div>",
        divertUntil: [
          {
            to: "locate.position",
            predicate: [
              "location", function(location) {
                return location.position;
              }
            ]
          }
        ],
        controller: [
          "$scope", "$state", "$timeout", "location", "geocoder", "session", function($scope, $state, $timeout, location, geocoder, session) {
            $scope.map = {
              center: ""
            };
            $scope.clickedAddress = "";
            $scope.timeplace = {
              datetime: moment().format("YYYY-MM-DDTHH:mm:ss"),
              address: "",
              position: {
                lat: null,
                lon: null
              }
            };
            $scope.updatePosition = function(position, address) {
              $scope.timeplace.address = address;
              angular.copy(position, $scope.timeplace.position);
              return $scope.clickedAddress = address;
            };
            $scope.updateGeocodeResults = function(results) {
              return angular.copy(results, $scope.addresses);
            };
            $scope.confirm = function(position, address) {
              location.confirmPosition(position);
              return location.confirmAddress(address);
            };
            geocoder.reverseGeocode(location.position.lat, location.position.lon).then(function(results) {
              var _ref;
              $scope.addresses = results;
              if (!$scope.searchByTimePlace.$dirty) {
                return $scope.timeplace.address = (_ref = results[0]) != null ? _ref.address : void 0;
              }
            });
            $scope.$watch("timeplace.address", debounce(1000, function(address) {
              return $scope.$apply(function() {
                return $scope.map.center = address;
              });
            }));
            $scope.searchForId = function(eventId) {
              return console.log("Search for", eventId);
            };
            return $scope.searchForTimePlace = function(timeplace) {
              return console.log("Search for", timeplace);
            };
          }
        ]
      });
    }
  ]);

}).call(this);


},{"../services/location.coffee":18}],26:[function(require,module,exports){
(function() {
  var module;

  require("../services/session.coffee");

  require("../services/oauth.coffee");

  require("../services/backend.coffee");

  require("../services/notifier.coffee");

  module = angular.module("metwork.state.user", ["ui.bootstrap", "ui.router", "metwork.service.session", "metwork.service.oauth", "metwork.service.backend", "metwork.service.notifier"]);

  module.filter("join", function() {
    return function(arr, sep) {
      if (sep == null) {
        sep = ", ";
      }
      return arr.join(sep);
    };
  });

  module.config([
    "$stateProvider", function($stateProvider) {
      $stateProvider.state("user", {
        url: "/user",
        template: "<div class=\"container\">\n  <div ui-view></div>\n</div>",
        controller: [
          "$scope", "$state", function($scope, $state) {
            if ($state.is("user")) {
              return $state.transitionTo("user.login");
            }
          }
        ]
      });
      $stateProvider.state("user.login", require("./user/login.coffee"));
      $stateProvider.state("user.link", require("./user/link.coffee"));
      $stateProvider.state("user.create", require("./user/create.coffee"));
      $stateProvider.state("user.profile", require("./user/profile.coffee"));
      $stateProvider.state("user.identities", require("./user/identities.coffee"));
      return $stateProvider.state("user.logout", {
        url: "/logout",
        controller: [
          "$state", "session", function($state, session) {
            session.logout();
            return $state.go("landing");
          }
        ]
      });
    }
  ]);

}).call(this);


},{"../services/backend.coffee":16,"../services/notifier.coffee":6,"../services/oauth.coffee":19,"../services/session.coffee":20,"./user/create.coffee":8,"./user/identities.coffee":9,"./user/link.coffee":10,"./user/login.coffee":11,"./user/profile.coffee":12}],27:[function(require,module,exports){
(function() {
  var module;

  require("angularytics");

  require("./states/landing.coffee");

  require("./states/checkin.coffee");

  require("./states/event.coffee");

  require("./states/user.coffee");

  require("./states/locate.coffee");

  require("./directives/userpanel.coffee");

  require("./directives/flashmessage.coffee");

  module = angular.module("metwork", ["ui.router", "angularytics", "metwork.state.landing", "metwork.state.checkin", "metwork.state.event", "metwork.state.user", "metwork.state.locate", "metwork.directive.flashmessage", "metwork.directive.userpanel"]);

  module.config([
    "AngularyticsProvider", function(AngularyticsProvider) {
      return AngularyticsProvider.setEventHandlers("GoogleUniversal");
    }
  ]);

  module.run([
    "Angularytics", function(Angularytics) {
      return Angularytics.init();
    }
  ]);

  module.config([
    "$stateProvider", "$urlRouterProvider", "$locationProvider", function($stateProvider, $urlRouterProvider, $locationProvider) {
      $urlRouterProvider.otherwise("/");
      return $locationProvider.html5Mode(true);
    }
  ]);

  module.run(["$rootScope", function($rootScope) {}]);

  module.directive("ngBlur", [
    "$interpolate", function($interpolate) {
      return {
        link: function($scope, $element, $attrs) {
          return $element.bind("blur", function() {
            return $scope.$apply(function() {
              return $scope.$eval($attrs.ngBlur);
            });
          });
        }
      };
    }
  ]);

}).call(this);


},{"./directives/flashmessage.coffee":1,"./directives/userpanel.coffee":3,"./states/checkin.coffee":21,"./states/event.coffee":23,"./states/landing.coffee":24,"./states/locate.coffee":25,"./states/user.coffee":26,"angularytics":28}],28:[function(require,module,exports){
(function () {
  angular.module('angularytics', []).provider('Angularytics', function () {
    var eventHandlersNames = ['Google'];
    this.setEventHandlers = function (handlers) {
      if (angular.isString(handlers)) {
        handlers = [handlers];
      }
      eventHandlersNames = [];
      angular.forEach(handlers, function (handler) {
        eventHandlersNames.push(capitalizeHandler(handler));
      });
    };
    var capitalizeHandler = function (handler) {
      return handler.charAt(0).toUpperCase() + handler.substring(1);
    };
    this.$get = [
      '$injector',
      '$rootScope',
      '$location',
      function ($injector, $rootScope, $location) {
        var eventHandlers = [];
        angular.forEach(eventHandlersNames, function (handler) {
          eventHandlers.push($injector.get('Angularytics' + handler + 'Handler'));
        });
        var forEachHandlerDo = function (action) {
          angular.forEach(eventHandlers, function (handler) {
            action(handler);
          });
        };
        $rootScope.$on('$locationChangeSuccess', function () {
          forEachHandlerDo(function (handler) {
            var url = $location.path();
            if (url) {
              handler.trackPageView(url);
            }
          });
        });
        var service = {};
        service.init = function () {
        };
        service.trackEvent = function (category, action, opt_label, opt_value, opt_noninteraction) {
          forEachHandlerDo(function (handler) {
            if (category && action) {
              handler.trackEvent(category, action, opt_label, opt_value, opt_noninteraction);
            }
          });
        };
        return service;
      }
    ];
  });
}());
(function () {
  angular.module('angularytics').factory('AngularyticsConsoleHandler', [
    '$log',
    function ($log) {
      var service = {};
      service.trackPageView = function (url) {
        $log.log('URL visited', url);
      };
      service.trackEvent = function (category, action, opt_label, opt_value, opt_noninteraction) {
        $log.log('Event tracked', category, action, opt_label, opt_value, opt_noninteraction);
      };
      return service;
    }
  ]);
}());
(function () {
  angular.module('angularytics').factory('AngularyticsGoogleHandler', [
    '$log',
    function ($log) {
      var service = {};
      service.trackPageView = function (url) {
        _gaq.push([
          '_set',
          'page',
          url
        ]);
        _gaq.push([
          '_trackPageview',
          url
        ]);
      };
      service.trackEvent = function (category, action, opt_label, opt_value, opt_noninteraction) {
        _gaq.push([
          '_trackEvent',
          category,
          action,
          opt_label,
          opt_value,
          opt_noninteraction
        ]);
      };
      return service;
    }
  ]).factory('AngularyticsGoogleUniversalHandler', function () {
    var service = {};
    service.trackPageView = function (url) {
      ga('send', 'pageView', url);
    };
    service.trackEvent = function (category, action, opt_label, opt_value, opt_noninteraction) {
      ga('send', 'event', category, action, opt_label, opt_value, { 'nonInteraction': opt_noninteraction });
    };
    return service;
  });
}());
(function () {
  angular.module('angularytics').filter('trackEvent', [
    'Angularytics',
    function (Angularytics) {
      return function (entry, category, action, opt_label, opt_value, opt_noninteraction) {
        Angularytics.trackEvent(category, action, opt_label, opt_value, opt_noninteraction);
        return entry;
      };
    }
  ]);
}());
},{}],22:[function(require,module,exports){
(function() {
  var marked, module;

  marked = require("marked");

  module = angular.module("metwork.directive.markdown", []);

  module.directive("mwMarkdown", function() {
    return {
      restrict: "EA",
      link: function($scope, $element, $attrs) {
        var render;
        render = function(code) {
          return $element.html(marked(code));
        };
        if ($attrs.mwMarkdown) {
          return $scope.$watch($attrs.mwMarkdown, render);
        } else {
          return render($element.text());
        }
      }
    };
  });

}).call(this);


},{"marked":29}],29:[function(require,module,exports){
(function(global){/**
 * marked - a markdown parser
 * Copyright (c) 2011-2013, Christopher Jeffrey. (MIT Licensed)
 * https://github.com/chjj/marked
 */

;(function() {

/**
 * Block-Level Grammar
 */

var block = {
  newline: /^\n+/,
  code: /^( {4}[^\n]+\n*)+/,
  fences: noop,
  hr: /^( *[-*_]){3,} *(?:\n+|$)/,
  heading: /^ *(#{1,6}) *([^\n]+?) *#* *(?:\n+|$)/,
  nptable: noop,
  lheading: /^([^\n]+)\n *(=|-){3,} *\n*/,
  blockquote: /^( *>[^\n]+(\n[^\n]+)*\n*)+/,
  list: /^( *)(bull) [\s\S]+?(?:hr|\n{2,}(?! )(?!\1bull )\n*|\s*$)/,
  html: /^ *(?:comment|closed|closing) *(?:\n{2,}|\s*$)/,
  def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +["(]([^\n]+)[")])? *(?:\n+|$)/,
  table: noop,
  paragraph: /^((?:[^\n]+\n?(?!hr|heading|lheading|blockquote|tag|def))+)\n*/,
  text: /^[^\n]+/
};

block.bullet = /(?:[*+-]|\d+\.)/;
block.item = /^( *)(bull) [^\n]*(?:\n(?!\1bull )[^\n]*)*/;
block.item = replace(block.item, 'gm')
  (/bull/g, block.bullet)
  ();

block.list = replace(block.list)
  (/bull/g, block.bullet)
  ('hr', /\n+(?=(?: *[-*_]){3,} *(?:\n+|$))/)
  ();

block._tag = '(?!(?:'
  + 'a|em|strong|small|s|cite|q|dfn|abbr|data|time|code'
  + '|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo'
  + '|span|br|wbr|ins|del|img)\\b)\\w+(?!:/|@)\\b';

block.html = replace(block.html)
  ('comment', /<!--[\s\S]*?-->/)
  ('closed', /<(tag)[\s\S]+?<\/\1>/)
  ('closing', /<tag(?:"[^"]*"|'[^']*'|[^'">])*?>/)
  (/tag/g, block._tag)
  ();

block.paragraph = replace(block.paragraph)
  ('hr', block.hr)
  ('heading', block.heading)
  ('lheading', block.lheading)
  ('blockquote', block.blockquote)
  ('tag', '<' + block._tag)
  ('def', block.def)
  ();

/**
 * Normal Block Grammar
 */

block.normal = merge({}, block);

/**
 * GFM Block Grammar
 */

block.gfm = merge({}, block.normal, {
  fences: /^ *(`{3,}|~{3,}) *(\S+)? *\n([\s\S]+?)\s*\1 *(?:\n+|$)/,
  paragraph: /^/
});

block.gfm.paragraph = replace(block.paragraph)
  ('(?!', '(?!' + block.gfm.fences.source.replace('\\1', '\\2') + '|')
  ();

/**
 * GFM + Tables Block Grammar
 */

block.tables = merge({}, block.gfm, {
  nptable: /^ *(\S.*\|.*)\n *([-:]+ *\|[-| :]*)\n((?:.*\|.*(?:\n|$))*)\n*/,
  table: /^ *\|(.+)\n *\|( *[-:]+[-| :]*)\n((?: *\|.*(?:\n|$))*)\n*/
});

/**
 * Block Lexer
 */

function Lexer(options) {
  this.tokens = [];
  this.tokens.links = {};
  this.options = options || marked.defaults;
  this.rules = block.normal;

  if (this.options.gfm) {
    if (this.options.tables) {
      this.rules = block.tables;
    } else {
      this.rules = block.gfm;
    }
  }
}

/**
 * Expose Block Rules
 */

Lexer.rules = block;

/**
 * Static Lex Method
 */

Lexer.lex = function(src, options) {
  var lexer = new Lexer(options);
  return lexer.lex(src);
};

/**
 * Preprocessing
 */

Lexer.prototype.lex = function(src) {
  src = src
    .replace(/\r\n|\r/g, '\n')
    .replace(/\t/g, '    ')
    .replace(/\u00a0/g, ' ')
    .replace(/\u2424/g, '\n');

  return this.token(src, true);
};

/**
 * Lexing
 */

Lexer.prototype.token = function(src, top) {
  var src = src.replace(/^ +$/gm, '')
    , next
    , loose
    , cap
    , bull
    , b
    , item
    , space
    , i
    , l;

  while (src) {
    // newline
    if (cap = this.rules.newline.exec(src)) {
      src = src.substring(cap[0].length);
      if (cap[0].length > 1) {
        this.tokens.push({
          type: 'space'
        });
      }
    }

    // code
    if (cap = this.rules.code.exec(src)) {
      src = src.substring(cap[0].length);
      cap = cap[0].replace(/^ {4}/gm, '');
      this.tokens.push({
        type: 'code',
        text: !this.options.pedantic
          ? cap.replace(/\n+$/, '')
          : cap
      });
      continue;
    }

    // fences (gfm)
    if (cap = this.rules.fences.exec(src)) {
      src = src.substring(cap[0].length);
      this.tokens.push({
        type: 'code',
        lang: cap[2],
        text: cap[3]
      });
      continue;
    }

    // heading
    if (cap = this.rules.heading.exec(src)) {
      src = src.substring(cap[0].length);
      this.tokens.push({
        type: 'heading',
        depth: cap[1].length,
        text: cap[2]
      });
      continue;
    }

    // table no leading pipe (gfm)
    if (top && (cap = this.rules.nptable.exec(src))) {
      src = src.substring(cap[0].length);

      item = {
        type: 'table',
        header: cap[1].replace(/^ *| *\| *$/g, '').split(/ *\| */),
        align: cap[2].replace(/^ *|\| *$/g, '').split(/ *\| */),
        cells: cap[3].replace(/\n$/, '').split('\n')
      };

      for (i = 0; i < item.align.length; i++) {
        if (/^ *-+: *$/.test(item.align[i])) {
          item.align[i] = 'right';
        } else if (/^ *:-+: *$/.test(item.align[i])) {
          item.align[i] = 'center';
        } else if (/^ *:-+ *$/.test(item.align[i])) {
          item.align[i] = 'left';
        } else {
          item.align[i] = null;
        }
      }

      for (i = 0; i < item.cells.length; i++) {
        item.cells[i] = item.cells[i].split(/ *\| */);
      }

      this.tokens.push(item);

      continue;
    }

    // lheading
    if (cap = this.rules.lheading.exec(src)) {
      src = src.substring(cap[0].length);
      this.tokens.push({
        type: 'heading',
        depth: cap[2] === '=' ? 1 : 2,
        text: cap[1]
      });
      continue;
    }

    // hr
    if (cap = this.rules.hr.exec(src)) {
      src = src.substring(cap[0].length);
      this.tokens.push({
        type: 'hr'
      });
      continue;
    }

    // blockquote
    if (cap = this.rules.blockquote.exec(src)) {
      src = src.substring(cap[0].length);

      this.tokens.push({
        type: 'blockquote_start'
      });

      cap = cap[0].replace(/^ *> ?/gm, '');

      // Pass `top` to keep the current
      // "toplevel" state. This is exactly
      // how markdown.pl works.
      this.token(cap, top);

      this.tokens.push({
        type: 'blockquote_end'
      });

      continue;
    }

    // list
    if (cap = this.rules.list.exec(src)) {
      src = src.substring(cap[0].length);
      bull = cap[2];

      this.tokens.push({
        type: 'list_start',
        ordered: bull.length > 1
      });

      // Get each top-level item.
      cap = cap[0].match(this.rules.item);

      next = false;
      l = cap.length;
      i = 0;

      for (; i < l; i++) {
        item = cap[i];

        // Remove the list item's bullet
        // so it is seen as the next token.
        space = item.length;
        item = item.replace(/^ *([*+-]|\d+\.) +/, '');

        // Outdent whatever the
        // list item contains. Hacky.
        if (~item.indexOf('\n ')) {
          space -= item.length;
          item = !this.options.pedantic
            ? item.replace(new RegExp('^ {1,' + space + '}', 'gm'), '')
            : item.replace(/^ {1,4}/gm, '');
        }

        // Determine whether the next list item belongs here.
        // Backpedal if it does not belong in this list.
        if (this.options.smartLists && i !== l - 1) {
          b = block.bullet.exec(cap[i+1])[0];
          if (bull !== b && !(bull.length > 1 && b.length > 1)) {
            src = cap.slice(i + 1).join('\n') + src;
            i = l - 1;
          }
        }

        // Determine whether item is loose or not.
        // Use: /(^|\n)(?! )[^\n]+\n\n(?!\s*$)/
        // for discount behavior.
        loose = next || /\n\n(?!\s*$)/.test(item);
        if (i !== l - 1) {
          next = item[item.length-1] === '\n';
          if (!loose) loose = next;
        }

        this.tokens.push({
          type: loose
            ? 'loose_item_start'
            : 'list_item_start'
        });

        // Recurse.
        this.token(item, false);

        this.tokens.push({
          type: 'list_item_end'
        });
      }

      this.tokens.push({
        type: 'list_end'
      });

      continue;
    }

    // html
    if (cap = this.rules.html.exec(src)) {
      src = src.substring(cap[0].length);
      this.tokens.push({
        type: this.options.sanitize
          ? 'paragraph'
          : 'html',
        pre: cap[1] === 'pre' || cap[1] === 'script',
        text: cap[0]
      });
      continue;
    }

    // def
    if (top && (cap = this.rules.def.exec(src))) {
      src = src.substring(cap[0].length);
      this.tokens.links[cap[1].toLowerCase()] = {
        href: cap[2],
        title: cap[3]
      };
      continue;
    }

    // table (gfm)
    if (top && (cap = this.rules.table.exec(src))) {
      src = src.substring(cap[0].length);

      item = {
        type: 'table',
        header: cap[1].replace(/^ *| *\| *$/g, '').split(/ *\| */),
        align: cap[2].replace(/^ *|\| *$/g, '').split(/ *\| */),
        cells: cap[3].replace(/(?: *\| *)?\n$/, '').split('\n')
      };

      for (i = 0; i < item.align.length; i++) {
        if (/^ *-+: *$/.test(item.align[i])) {
          item.align[i] = 'right';
        } else if (/^ *:-+: *$/.test(item.align[i])) {
          item.align[i] = 'center';
        } else if (/^ *:-+ *$/.test(item.align[i])) {
          item.align[i] = 'left';
        } else {
          item.align[i] = null;
        }
      }

      for (i = 0; i < item.cells.length; i++) {
        item.cells[i] = item.cells[i]
          .replace(/^ *\| *| *\| *$/g, '')
          .split(/ *\| */);
      }

      this.tokens.push(item);

      continue;
    }

    // top-level paragraph
    if (top && (cap = this.rules.paragraph.exec(src))) {
      src = src.substring(cap[0].length);
      this.tokens.push({
        type: 'paragraph',
        text: cap[1][cap[1].length-1] === '\n'
          ? cap[1].slice(0, -1)
          : cap[1]
      });
      continue;
    }

    // text
    if (cap = this.rules.text.exec(src)) {
      // Top-level should never reach here.
      src = src.substring(cap[0].length);
      this.tokens.push({
        type: 'text',
        text: cap[0]
      });
      continue;
    }

    if (src) {
      throw new
        Error('Infinite loop on byte: ' + src.charCodeAt(0));
    }
  }

  return this.tokens;
};

/**
 * Inline-Level Grammar
 */

var inline = {
  escape: /^\\([\\`*{}\[\]()#+\-.!_>])/,
  autolink: /^<([^ >]+(@|:\/)[^ >]+)>/,
  url: noop,
  tag: /^<!--[\s\S]*?-->|^<\/?\w+(?:"[^"]*"|'[^']*'|[^'">])*?>/,
  link: /^!?\[(inside)\]\(href\)/,
  reflink: /^!?\[(inside)\]\s*\[([^\]]*)\]/,
  nolink: /^!?\[((?:\[[^\]]*\]|[^\[\]])*)\]/,
  strong: /^__([\s\S]+?)__(?!_)|^\*\*([\s\S]+?)\*\*(?!\*)/,
  em: /^\b_((?:__|[\s\S])+?)_\b|^\*((?:\*\*|[\s\S])+?)\*(?!\*)/,
  code: /^(`+)\s*([\s\S]*?[^`])\s*\1(?!`)/,
  br: /^ {2,}\n(?!\s*$)/,
  del: noop,
  text: /^[\s\S]+?(?=[\\<!\[_*`]| {2,}\n|$)/
};

inline._inside = /(?:\[[^\]]*\]|[^\]]|\](?=[^\[]*\]))*/;
inline._href = /\s*<?([^\s]*?)>?(?:\s+['"]([\s\S]*?)['"])?\s*/;

inline.link = replace(inline.link)
  ('inside', inline._inside)
  ('href', inline._href)
  ();

inline.reflink = replace(inline.reflink)
  ('inside', inline._inside)
  ();

/**
 * Normal Inline Grammar
 */

inline.normal = merge({}, inline);

/**
 * Pedantic Inline Grammar
 */

inline.pedantic = merge({}, inline.normal, {
  strong: /^__(?=\S)([\s\S]*?\S)__(?!_)|^\*\*(?=\S)([\s\S]*?\S)\*\*(?!\*)/,
  em: /^_(?=\S)([\s\S]*?\S)_(?!_)|^\*(?=\S)([\s\S]*?\S)\*(?!\*)/
});

/**
 * GFM Inline Grammar
 */

inline.gfm = merge({}, inline.normal, {
  escape: replace(inline.escape)('])', '~|])')(),
  url: /^(https?:\/\/[^\s<]+[^<.,:;"')\]\s])/,
  del: /^~~(?=\S)([\s\S]*?\S)~~/,
  text: replace(inline.text)
    (']|', '~]|')
    ('|', '|https?://|')
    ()
});

/**
 * GFM + Line Breaks Inline Grammar
 */

inline.breaks = merge({}, inline.gfm, {
  br: replace(inline.br)('{2,}', '*')(),
  text: replace(inline.gfm.text)('{2,}', '*')()
});

/**
 * Inline Lexer & Compiler
 */

function InlineLexer(links, options) {
  this.options = options || marked.defaults;
  this.links = links;
  this.rules = inline.normal;

  if (!this.links) {
    throw new
      Error('Tokens array requires a `links` property.');
  }

  if (this.options.gfm) {
    if (this.options.breaks) {
      this.rules = inline.breaks;
    } else {
      this.rules = inline.gfm;
    }
  } else if (this.options.pedantic) {
    this.rules = inline.pedantic;
  }
}

/**
 * Expose Inline Rules
 */

InlineLexer.rules = inline;

/**
 * Static Lexing/Compiling Method
 */

InlineLexer.output = function(src, links, options) {
  var inline = new InlineLexer(links, options);
  return inline.output(src);
};

/**
 * Lexing/Compiling
 */

InlineLexer.prototype.output = function(src) {
  var out = ''
    , link
    , text
    , href
    , cap;

  while (src) {
    // escape
    if (cap = this.rules.escape.exec(src)) {
      src = src.substring(cap[0].length);
      out += cap[1];
      continue;
    }

    // autolink
    if (cap = this.rules.autolink.exec(src)) {
      src = src.substring(cap[0].length);
      if (cap[2] === '@') {
        text = cap[1][6] === ':'
          ? this.mangle(cap[1].substring(7))
          : this.mangle(cap[1]);
        href = this.mangle('mailto:') + text;
      } else {
        text = escape(cap[1]);
        href = text;
      }
      out += '<a href="'
        + href
        + '">'
        + text
        + '</a>';
      continue;
    }

    // url (gfm)
    if (cap = this.rules.url.exec(src)) {
      src = src.substring(cap[0].length);
      text = escape(cap[1]);
      href = text;
      out += '<a href="'
        + href
        + '">'
        + text
        + '</a>';
      continue;
    }

    // tag
    if (cap = this.rules.tag.exec(src)) {
      src = src.substring(cap[0].length);
      out += this.options.sanitize
        ? escape(cap[0])
        : cap[0];
      continue;
    }

    // link
    if (cap = this.rules.link.exec(src)) {
      src = src.substring(cap[0].length);
      out += this.outputLink(cap, {
        href: cap[2],
        title: cap[3]
      });
      continue;
    }

    // reflink, nolink
    if ((cap = this.rules.reflink.exec(src))
        || (cap = this.rules.nolink.exec(src))) {
      src = src.substring(cap[0].length);
      link = (cap[2] || cap[1]).replace(/\s+/g, ' ');
      link = this.links[link.toLowerCase()];
      if (!link || !link.href) {
        out += cap[0][0];
        src = cap[0].substring(1) + src;
        continue;
      }
      out += this.outputLink(cap, link);
      continue;
    }

    // strong
    if (cap = this.rules.strong.exec(src)) {
      src = src.substring(cap[0].length);
      out += '<strong>'
        + this.output(cap[2] || cap[1])
        + '</strong>';
      continue;
    }

    // em
    if (cap = this.rules.em.exec(src)) {
      src = src.substring(cap[0].length);
      out += '<em>'
        + this.output(cap[2] || cap[1])
        + '</em>';
      continue;
    }

    // code
    if (cap = this.rules.code.exec(src)) {
      src = src.substring(cap[0].length);
      out += '<code>'
        + escape(cap[2], true)
        + '</code>';
      continue;
    }

    // br
    if (cap = this.rules.br.exec(src)) {
      src = src.substring(cap[0].length);
      out += '<br>';
      continue;
    }

    // del (gfm)
    if (cap = this.rules.del.exec(src)) {
      src = src.substring(cap[0].length);
      out += '<del>'
        + this.output(cap[1])
        + '</del>';
      continue;
    }

    // text
    if (cap = this.rules.text.exec(src)) {
      src = src.substring(cap[0].length);
      out += escape(this.smartypants(cap[0]));
      continue;
    }

    if (src) {
      throw new
        Error('Infinite loop on byte: ' + src.charCodeAt(0));
    }
  }

  return out;
};

/**
 * Compile Link
 */

InlineLexer.prototype.outputLink = function(cap, link) {
  if (cap[0][0] !== '!') {
    return '<a href="'
      + escape(link.href)
      + '"'
      + (link.title
      ? ' title="'
      + escape(link.title)
      + '"'
      : '')
      + '>'
      + this.output(cap[1])
      + '</a>';
  } else {
    return '<img src="'
      + escape(link.href)
      + '" alt="'
      + escape(cap[1])
      + '"'
      + (link.title
      ? ' title="'
      + escape(link.title)
      + '"'
      : '')
      + '>';
  }
};

/**
 * Smartypants Transformations
 */

InlineLexer.prototype.smartypants = function(text) {
  if (!this.options.smartypants) return text;
  return text
    .replace(/--/g, '\u2014')
    .replace(/'([^']*)'/g, '\u2018$1\u2019')
    .replace(/"([^"]*)"/g, '\u201C$1\u201D')
    .replace(/\.{3}/g, '\u2026');
};

/**
 * Mangle Links
 */

InlineLexer.prototype.mangle = function(text) {
  var out = ''
    , l = text.length
    , i = 0
    , ch;

  for (; i < l; i++) {
    ch = text.charCodeAt(i);
    if (Math.random() > 0.5) {
      ch = 'x' + ch.toString(16);
    }
    out += '&#' + ch + ';';
  }

  return out;
};

/**
 * Parsing & Compiling
 */

function Parser(options) {
  this.tokens = [];
  this.token = null;
  this.options = options || marked.defaults;
}

/**
 * Static Parse Method
 */

Parser.parse = function(src, options) {
  var parser = new Parser(options);
  return parser.parse(src);
};

/**
 * Parse Loop
 */

Parser.prototype.parse = function(src) {
  this.inline = new InlineLexer(src.links, this.options);
  this.tokens = src.reverse();

  var out = '';
  while (this.next()) {
    out += this.tok();
  }

  return out;
};

/**
 * Next Token
 */

Parser.prototype.next = function() {
  return this.token = this.tokens.pop();
};

/**
 * Preview Next Token
 */

Parser.prototype.peek = function() {
  return this.tokens[this.tokens.length-1] || 0;
};

/**
 * Parse Text Tokens
 */

Parser.prototype.parseText = function() {
  var body = this.token.text;

  while (this.peek().type === 'text') {
    body += '\n' + this.next().text;
  }

  return this.inline.output(body);
};

/**
 * Parse Current Token
 */

Parser.prototype.tok = function() {
  switch (this.token.type) {
    case 'space': {
      return '';
    }
    case 'hr': {
      return '<hr>\n';
    }
    case 'heading': {
      return '<h'
        + this.token.depth
        + '>'
        + this.inline.output(this.token.text)
        + '</h'
        + this.token.depth
        + '>\n';
    }
    case 'code': {
      if (this.options.highlight) {
        var code = this.options.highlight(this.token.text, this.token.lang);
        if (code != null && code !== this.token.text) {
          this.token.escaped = true;
          this.token.text = code;
        }
      }

      if (!this.token.escaped) {
        this.token.text = escape(this.token.text, true);
      }

      return '<pre><code'
        + (this.token.lang
        ? ' class="'
        + this.options.langPrefix
        + this.token.lang
        + '"'
        : '')
        + '>'
        + this.token.text
        + '</code></pre>\n';
    }
    case 'table': {
      var body = ''
        , heading
        , i
        , row
        , cell
        , j;

      // header
      body += '<thead>\n<tr>\n';
      for (i = 0; i < this.token.header.length; i++) {
        heading = this.inline.output(this.token.header[i]);
        body += this.token.align[i]
          ? '<th align="' + this.token.align[i] + '">' + heading + '</th>\n'
          : '<th>' + heading + '</th>\n';
      }
      body += '</tr>\n</thead>\n';

      // body
      body += '<tbody>\n'
      for (i = 0; i < this.token.cells.length; i++) {
        row = this.token.cells[i];
        body += '<tr>\n';
        for (j = 0; j < row.length; j++) {
          cell = this.inline.output(row[j]);
          body += this.token.align[j]
            ? '<td align="' + this.token.align[j] + '">' + cell + '</td>\n'
            : '<td>' + cell + '</td>\n';
        }
        body += '</tr>\n';
      }
      body += '</tbody>\n';

      return '<table>\n'
        + body
        + '</table>\n';
    }
    case 'blockquote_start': {
      var body = '';

      while (this.next().type !== 'blockquote_end') {
        body += this.tok();
      }

      return '<blockquote>\n'
        + body
        + '</blockquote>\n';
    }
    case 'list_start': {
      var type = this.token.ordered ? 'ol' : 'ul'
        , body = '';

      while (this.next().type !== 'list_end') {
        body += this.tok();
      }

      return '<'
        + type
        + '>\n'
        + body
        + '</'
        + type
        + '>\n';
    }
    case 'list_item_start': {
      var body = '';

      while (this.next().type !== 'list_item_end') {
        body += this.token.type === 'text'
          ? this.parseText()
          : this.tok();
      }

      return '<li>'
        + body
        + '</li>\n';
    }
    case 'loose_item_start': {
      var body = '';

      while (this.next().type !== 'list_item_end') {
        body += this.tok();
      }

      return '<li>'
        + body
        + '</li>\n';
    }
    case 'html': {
      return !this.token.pre && !this.options.pedantic
        ? this.inline.output(this.token.text)
        : this.token.text;
    }
    case 'paragraph': {
      return '<p>'
        + this.inline.output(this.token.text)
        + '</p>\n';
    }
    case 'text': {
      return '<p>'
        + this.parseText()
        + '</p>\n';
    }
  }
};

/**
 * Helpers
 */

function escape(html, encode) {
  return html
    .replace(!encode ? /&(?!#?\w+;)/g : /&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function replace(regex, opt) {
  regex = regex.source;
  opt = opt || '';
  return function self(name, val) {
    if (!name) return new RegExp(regex, opt);
    val = val.source || val;
    val = val.replace(/(^|[^\[])\^/g, '$1');
    regex = regex.replace(name, val);
    return self;
  };
}

function noop() {}
noop.exec = noop;

function merge(obj) {
  var i = 1
    , target
    , key;

  for (; i < arguments.length; i++) {
    target = arguments[i];
    for (key in target) {
      if (Object.prototype.hasOwnProperty.call(target, key)) {
        obj[key] = target[key];
      }
    }
  }

  return obj;
}

/**
 * Marked
 */

function marked(src, opt, callback) {
  if (callback || typeof opt === 'function') {
    if (!callback) {
      callback = opt;
      opt = null;
    }

    if (opt) opt = merge({}, marked.defaults, opt);

    var highlight = opt.highlight
      , tokens
      , pending
      , i = 0;

    try {
      tokens = Lexer.lex(src, opt)
    } catch (e) {
      return callback(e);
    }

    pending = tokens.length;

    var done = function(hi) {
      var out, err;

      if (hi !== true) {
        delete opt.highlight;
      }

      try {
        out = Parser.parse(tokens, opt);
      } catch (e) {
        err = e;
      }

      opt.highlight = highlight;

      return err
        ? callback(err)
        : callback(null, out);
    };

    if (!highlight || highlight.length < 3) {
      return done(true);
    }

    if (!pending) return done();

    for (; i < tokens.length; i++) {
      (function(token) {
        if (token.type !== 'code') {
          return --pending || done();
        }
        return highlight(token.text, token.lang, function(err, code) {
          if (code == null || code === token.text) {
            return --pending || done();
          }
          token.text = code;
          token.escaped = true;
          --pending || done();
        });
      })(tokens[i]);
    }

    return;
  }
  try {
    if (opt) opt = merge({}, marked.defaults, opt);
    return Parser.parse(Lexer.lex(src, opt), opt);
  } catch (e) {
    e.message += '\nPlease report this to https://github.com/chjj/marked.';
    if ((opt || marked.defaults).silent) {
      return '<p>An error occured:</p><pre>'
        + escape(e.message + '', true)
        + '</pre>';
    }
    throw e;
  }
}

/**
 * Options
 */

marked.options =
marked.setOptions = function(opt) {
  merge(marked.defaults, opt);
  return marked;
};

marked.defaults = {
  gfm: true,
  tables: true,
  breaks: false,
  pedantic: false,
  sanitize: false,
  smartLists: false,
  silent: false,
  highlight: null,
  langPrefix: 'lang-',
  smartypants: false
};

/**
 * Expose
 */

marked.Parser = Parser;
marked.parser = Parser.parse;

marked.Lexer = Lexer;
marked.lexer = Lexer.lex;

marked.InlineLexer = InlineLexer;
marked.inlineLexer = InlineLexer.output;

marked.parse = marked;

if (typeof exports === 'object') {
  module.exports = marked;
} else if (typeof define === 'function' && define.amd) {
  define(function() { return marked; });
} else {
  this.marked = marked;
}

}).call(function() {
  return this || (typeof window !== 'undefined' ? window : global);
}());

})(window)
},{}]},{},[1,13,15,22,2,3,27,16,4,5,14,17,18,6,19,20,7,21,23,24,25,26,8,9,10,11,12])
//@ sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvdmFyL2xpYi9zdGlja3NoaWZ0LzUxZjY5NTMwNDM4MmVjZDM5MzAwMWVjZS9hcHAtcm9vdC9kYXRhLzU3MjEzOC9hcHAvanMvZGlyZWN0aXZlcy9mbGFzaG1lc3NhZ2UuY29mZmVlIiwiL3Zhci9saWIvc3RpY2tzaGlmdC81MWY2OTUzMDQzODJlY2QzOTMwMDFlY2UvYXBwLXJvb3QvZGF0YS81NzIxMzgvYXBwL2pzL2RpcmVjdGl2ZXMvdXNlcmNhcmQuY29mZmVlIiwiL3Zhci9saWIvc3RpY2tzaGlmdC81MWY2OTUzMDQzODJlY2QzOTMwMDFlY2UvYXBwLXJvb3QvZGF0YS81NzIxMzgvYXBwL2pzL2RpcmVjdGl2ZXMvdXNlcnBhbmVsLmNvZmZlZSIsIi92YXIvbGliL3N0aWNrc2hpZnQvNTFmNjk1MzA0MzgyZWNkMzkzMDAxZWNlL2FwcC1yb290L2RhdGEvNTcyMTM4L2FwcC9qcy9zZXJ2aWNlcy9nYXBpLmNvZmZlZSIsIi92YXIvbGliL3N0aWNrc2hpZnQvNTFmNjk1MzA0MzgyZWNkMzkzMDAxZWNlL2FwcC1yb290L2RhdGEvNTcyMTM4L2FwcC9qcy9zZXJ2aWNlcy9nYXRla2VlcGVyLmNvZmZlZSIsIi92YXIvbGliL3N0aWNrc2hpZnQvNTFmNjk1MzA0MzgyZWNkMzkzMDAxZWNlL2FwcC1yb290L2RhdGEvNTcyMTM4L2FwcC9qcy9zZXJ2aWNlcy9ub3RpZmllci5jb2ZmZWUiLCIvdmFyL2xpYi9zdGlja3NoaWZ0LzUxZjY5NTMwNDM4MmVjZDM5MzAwMWVjZS9hcHAtcm9vdC9kYXRhLzU3MjEzOC9hcHAvanMvc2VydmljZXMvdXNlcnMuY29mZmVlIiwiL3Zhci9saWIvc3RpY2tzaGlmdC81MWY2OTUzMDQzODJlY2QzOTMwMDFlY2UvYXBwLXJvb3QvZGF0YS81NzIxMzgvYXBwL2pzL3N0YXRlcy91c2VyL2NyZWF0ZS5jb2ZmZWUiLCIvdmFyL2xpYi9zdGlja3NoaWZ0LzUxZjY5NTMwNDM4MmVjZDM5MzAwMWVjZS9hcHAtcm9vdC9kYXRhLzU3MjEzOC9hcHAvanMvc3RhdGVzL3VzZXIvaWRlbnRpdGllcy5jb2ZmZWUiLCIvdmFyL2xpYi9zdGlja3NoaWZ0LzUxZjY5NTMwNDM4MmVjZDM5MzAwMWVjZS9hcHAtcm9vdC9kYXRhLzU3MjEzOC9hcHAvanMvc3RhdGVzL3VzZXIvbGluay5jb2ZmZWUiLCIvdmFyL2xpYi9zdGlja3NoaWZ0LzUxZjY5NTMwNDM4MmVjZDM5MzAwMWVjZS9hcHAtcm9vdC9kYXRhLzU3MjEzOC9hcHAvanMvc3RhdGVzL3VzZXIvbG9naW4uY29mZmVlIiwiL3Zhci9saWIvc3RpY2tzaGlmdC81MWY2OTUzMDQzODJlY2QzOTMwMDFlY2UvYXBwLXJvb3QvZGF0YS81NzIxMzgvYXBwL2pzL3N0YXRlcy91c2VyL3Byb2ZpbGUuY29mZmVlIiwiL3Zhci9saWIvc3RpY2tzaGlmdC81MWY2OTUzMDQzODJlY2QzOTMwMDFlY2UvYXBwLXJvb3QvZGF0YS81NzIxMzgvYXBwL2pzL2RpcmVjdGl2ZXMvZ21hcC5jb2ZmZWUiLCIvdmFyL2xpYi9zdGlja3NoaWZ0LzUxZjY5NTMwNDM4MmVjZDM5MzAwMWVjZS9hcHAtcm9vdC9kYXRhLzU3MjEzOC9hcHAvanMvZGlyZWN0aXZlcy9sb2NhdGlvbi5jb2ZmZWUiLCIvdmFyL2xpYi9zdGlja3NoaWZ0LzUxZjY5NTMwNDM4MmVjZDM5MzAwMWVjZS9hcHAtcm9vdC9kYXRhLzU3MjEzOC9hcHAvanMvc2VydmljZXMvYmFja2VuZC5jb2ZmZWUiLCIvdmFyL2xpYi9zdGlja3NoaWZ0LzUxZjY5NTMwNDM4MmVjZDM5MzAwMWVjZS9hcHAtcm9vdC9kYXRhLzU3MjEzOC9hcHAvanMvc2VydmljZXMvZ2VvY29kZXIuY29mZmVlIiwiL3Zhci9saWIvc3RpY2tzaGlmdC81MWY2OTUzMDQzODJlY2QzOTMwMDFlY2UvYXBwLXJvb3QvZGF0YS81NzIxMzgvYXBwL2pzL3NlcnZpY2VzL2dlb2xvY2F0aW9uLmNvZmZlZSIsIi92YXIvbGliL3N0aWNrc2hpZnQvNTFmNjk1MzA0MzgyZWNkMzkzMDAxZWNlL2FwcC1yb290L2RhdGEvNTcyMTM4L2FwcC9qcy9zZXJ2aWNlcy9sb2NhdGlvbi5jb2ZmZWUiLCIvdmFyL2xpYi9zdGlja3NoaWZ0LzUxZjY5NTMwNDM4MmVjZDM5MzAwMWVjZS9hcHAtcm9vdC9kYXRhLzU3MjEzOC9hcHAvanMvc2VydmljZXMvb2F1dGguY29mZmVlIiwiL3Zhci9saWIvc3RpY2tzaGlmdC81MWY2OTUzMDQzODJlY2QzOTMwMDFlY2UvYXBwLXJvb3QvZGF0YS81NzIxMzgvYXBwL2pzL3NlcnZpY2VzL3Nlc3Npb24uY29mZmVlIiwiL3Zhci9saWIvc3RpY2tzaGlmdC81MWY2OTUzMDQzODJlY2QzOTMwMDFlY2UvYXBwLXJvb3QvZGF0YS81NzIxMzgvYXBwL2pzL3N0YXRlcy9jaGVja2luLmNvZmZlZSIsIi92YXIvbGliL3N0aWNrc2hpZnQvNTFmNjk1MzA0MzgyZWNkMzkzMDAxZWNlL2FwcC1yb290L2RhdGEvNTcyMTM4L2FwcC9qcy9zdGF0ZXMvZXZlbnQuY29mZmVlIiwiL3Zhci9saWIvc3RpY2tzaGlmdC81MWY2OTUzMDQzODJlY2QzOTMwMDFlY2UvYXBwLXJvb3QvZGF0YS81NzIxMzgvYXBwL2pzL3N0YXRlcy9sYW5kaW5nLmNvZmZlZSIsIi92YXIvbGliL3N0aWNrc2hpZnQvNTFmNjk1MzA0MzgyZWNkMzkzMDAxZWNlL2FwcC1yb290L2RhdGEvNTcyMTM4L2FwcC9qcy9zdGF0ZXMvbG9jYXRlLmNvZmZlZSIsIi92YXIvbGliL3N0aWNrc2hpZnQvNTFmNjk1MzA0MzgyZWNkMzkzMDAxZWNlL2FwcC1yb290L2RhdGEvNTcyMTM4L2FwcC9qcy9zdGF0ZXMvdXNlci5jb2ZmZWUiLCIvdmFyL2xpYi9zdGlja3NoaWZ0LzUxZjY5NTMwNDM4MmVjZDM5MzAwMWVjZS9hcHAtcm9vdC9kYXRhLzU3MjEzOC9hcHAvanMvbWFpbi5jb2ZmZWUiLCIvdmFyL2xpYi9zdGlja3NoaWZ0LzUxZjY5NTMwNDM4MmVjZDM5MzAwMWVjZS9hcHAtcm9vdC9kYXRhLzU3MjEzOC9ub2RlX21vZHVsZXMvYW5ndWxhcnl0aWNzL2Rpc3QvYW5ndWxhcnl0aWNzLmpzIiwiL3Zhci9saWIvc3RpY2tzaGlmdC81MWY2OTUzMDQzODJlY2QzOTMwMDFlY2UvYXBwLXJvb3QvZGF0YS81NzIxMzgvYXBwL2pzL2RpcmVjdGl2ZXMvbWFya2Rvd24uY29mZmVlIiwiL3Zhci9saWIvc3RpY2tzaGlmdC81MWY2OTUzMDQzODJlY2QzOTMwMDFlY2UvYXBwLXJvb3QvZGF0YS81NzIxMzgvbm9kZV9tb2R1bGVzL21hcmtlZC9saWIvbWFya2VkLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtDQUFBLEtBQUE7O0NBQUEsQ0FBQSxDQUFTLEdBQVQsQ0FBZ0IsSUFBMEMsR0FBQSxrQkFBakQ7O0NBQVQsQ0FLQSxJQUFNLEdBQU4sT0FBQTtFQUFtRCxDQUFzQixFQUFwQyxDQUFvQyxFQUF0QyxDQUF1QyxDQUF2QyxFQUFBO2FBQ2pDO0NBQUEsQ0FBVSxDQUFWLEtBQUE7Q0FBQSxDQUNNLENBQUEsQ0FBTixFQUFNLEVBQU4sQ0FBTztDQUNMLE9BQUEsTUFBQTtDQUFBLEVBQVcsS0FBWCxFQUFBLHlOQUFBO0NBT1csQ0FBeUIsQ0FBcEMsRUFBb0MsRUFBQSxDQUFBLENBQUMsQ0FBM0IsT0FBVixFQUFBO0NBQ0UsUUFBQSxPQUFBO0NBQUEsRUFBUSxDQUFBLENBQVIsQ0FBYyxNQUFkO0NBQUEsRUFDYyxDQURkLENBQ0ssT0FBTDtDQURBLEVBRWMsRUFBVCxJQUFTLEdBQWQ7Q0FDRSxDQUFFLElBQUYsUUFBQTtDQUNPLEtBQUQsRUFBTixhQUFBO0NBSkYsWUFFYztDQUZkLENBTWlCLENBQUssSUFBdEIsQ0FBUSxJQUFSO0NBQ1MsQ0FBVCxHQUFBLEdBQUEsV0FBQTtDQVJGLFVBQW9DO0NBVHRDLFFBQ007Q0FGaUU7Q0FBdEMsSUFBc0M7Q0FMekUsR0FLQTtDQUxBOzs7OztBQ0FBO0NBQUEsS0FBQTs7Q0FBQSxDQUFBLENBQVMsR0FBVCxDQUFnQixxQkFBUDs7Q0FBVCxDQUdBLElBQU0sR0FBTixHQUFBO0dBQWlDLEVB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QixHQUF6QixHQUFOLEdBQUE7V0FDRTtDQUFBLENBQVUsRUFBVixFQUFBLEVBQUE7Q0FBQSxDQUNNLENBQUEsQ0FBTixFQUFBLEVBQU0sQ0FBQztDQUNMLEtBQUEsTUFBQTtDQUFBLEVBQVMsQ0FBQSxFQUFULEVBQUEsQ0FBVTtDQUFrQixHQUFULEVBQWMsRUFBTixTQUFSO0NBQW5CLFFBQVM7Q0FFVCxHQUFHLEVBQU0sRUFBVCxFQUFBO0NBQWlDLENBQTBCLElBQTNCLElBQU4sT0FBQTtNQUExQixJQUFBO0NBQ1ksR0FBQSxFQUFQLEVBQWUsU0FBZjtVQUpEO0NBRE4sTUFDTTtDQUZ1QjtDQUEvQixFQUErQjtDQUovQjs7Ozs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZSA9IGFuZ3VsYXIubW9kdWxlIFwibWV0d29yay5kaXJlY3RpdmUuZmxhc2htZXNzYWdlXCIsIFtcbiAgXCJ1aS5yb3V0ZXJcIlxuICBcInVpLmJvb3RzdHJhcFwiXG5dXG5cbm1vZHVsZS5kaXJlY3RpdmUgXCJtd0ZsYXNobWVzc2FnZVwiLCBbIFwiJHJvb3RTY29wZVwiLCBcIiRzdGF0ZVwiLCBcIiRjb21waWxlXCIsICgkcm9vdFNjb3BlLCAkc3RhdGUsICRjb21waWxlKSAtPlxuICByZXN0cmljdDogXCJBXCJcbiAgbGluazogKCRzY29wZSwgJGVsZW1lbnQsICRhdHRycykgLT5cbiAgICB0ZW1wbGF0ZSA9IFwiXCJcIlxuICAgICAgPGRpdiBjbGFzcz1cIm13LWZsYXNobWVzc2FnZSBhbGVydCBhbGVydC1kYW5nZXIgYWxlcnQtZGlzbWlzc2FibGVcIj5cbiAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJjbG9zZVwiIG5nLWNsaWNrPVwiY2xvc2UoKVwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPiZ0aW1lczs8L2J1dHRvbj5cbiAgICAgICAgPHN0cm9uZyBuZy1iaW5kPVwiZXJyb3IubWVzc2FnZVwiPjwvc3Ryb25nPlxuICAgICAgPC9kaXY+XG4gICAgXCJcIlwiXG4gICAgXG4gICAgJHJvb3RTY29wZS4kb24gXCIkc3RhdGVDaGFuZ2VFcnJvclwiLCAoZSwgdG9TdGF0ZSwgdG9QYXJhbXMsIGZyb21TdGF0ZSwgZnJvbVBhcmFtcywgZXJyb3IpIC0+XG4gICAgICBzY29wZSA9ICRzY29wZS4kbmV3KHRydWUpXG4gICAgICBzY29wZS5lcnJvciA9IGVycm9yLmRhdGFcbiAgICAgIHNjb3BlLmNsb3NlID0gLT5cbiAgICAgICAgZWwucmVtb3ZlKClcbiAgICAgICAgJHNjb3BlLiRkZXN0cm95KClcbiAgICAgIFxuICAgICAgJGVsZW1lbnQucHJlcGVuZChlbCA9IGFuZ3VsYXIuZWxlbWVudCh0ZW1wbGF0ZSkpXG4gICAgICAkY29tcGlsZShlbCkoc2NvcGUpXG5dIiwibW9kdWxlID0gYW5ndWxhci5tb2R1bGUgXCJtZXR3b3JrLmRpcmVjdGl2ZS51c2VyY2FyZFwiLCBbXG5dXG5cbm1vZHVsZS5kaXJlY3RpdmUgXCJtd1VzZXJjYXJkXCIsIFsgLT5cbiAgcmVzdHJpY3Q6IFwiRVwiXG4gIHJlcGxhY2U6IHRydWVcbiAgc2NvcGU6XG4gICAgdXNlcjogXCI9XCJcbiAgdGVtcGxhdGU6IFwiXCJcIlxuICAgIDxkaXYgY2xhc3M9XCJtdy11c2VyY2FyZCBjbGVhcmZpeFwiIG5nLWNsYXNzPVwie2V4cGFuZGVkOiBleHBhbmRlZH1cIiBuZy1jbGljaz1cImV4cGFuZGVkPSFleHBhbmRlZFwiPlxuICAgICAgPGRpdiBjbGFzcz1cImlubmVyY2FyZFwiPlxuICAgICAgICA8ZGl2IGNsYXNzPVwicGljdHVyZSBwdWxsLWxlZnRcIj48aW1nIHNyYz1cInt7dXNlci5waWN0dXJlX3VybC5ub3JtYWx9fVwiPjwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzPVwiY29udGFjdFwiPlxuICAgICAgICAgIDxoNSBjbGFzcz1cImZ1bGxuYW1lXCI+e3t1c2VyLm5hbWV9fTwvaDU+XG4gICAgICAgICAgPHAgY2xhc3M9XCJ0YWdsaW5lIHRleHQtbXV0ZWRcIj57e3VzZXIuZGVzY3JpcHRpb259fTwvcD5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgXCJcIlwiXG4gIGNvbnRyb2xsZXI6IFtcIiRzY29wZVwiLCAoJHNjb3BlKSAtPlxuICBdXG5dIiwibW9kdWxlID0gYW5ndWxhci5tb2R1bGUgXCJtZXR3b3JrLmRpcmVjdGl2ZS51c2VycGFuZWxcIiwgW1xuICBcIm1ldHdvcmsuc2VydmljZS5zZXNzaW9uXCJcbl1cblxubW9kdWxlLmRpcmVjdGl2ZSBcIm13VXNlclBhbmVsXCIsIFsgXCJzZXNzaW9uXCIsIChzZXNzaW9uKSAtPlxuICByZXN0cmljdDogXCJFXCJcbiAgcmVwbGFjZTogdHJ1ZVxuICBzY29wZTogdHJ1ZVxuICB0ZW1wbGF0ZTogXCJcIlwiXG4gICAgPGRpdiBjbGFzcz1cIm13LXVzZXItcGFuZWxcIj5cbiAgICAgIDxhIGNsYXNzPVwiYnRuIGJ0bi1kZWZhdWx0IG5hdmJhci1idG5cIiBuZy1pZj1cIiFzZXNzaW9uLnVzZXJcIiB1aS1zcmVmPVwidXNlci5sb2dpblwiPkxvZ2luPC9hPlxuICAgICAgPGRpdiBuZy1pZj1cInNlc3Npb24udXNlclwiPlxuICAgICAgICA8ZGl2IGNsYXNzPVwiYnRuLWdyb3VwXCI+XG4gICAgICAgICAgPGEgY2xhc3M9XCJidG4gYnRuLWRlZmF1bHQgbmF2YmFyLWJ0biBkcm9wZG93bi10b2dnbGVcIj5cbiAgICAgICAgICAgIDxpbWcgbmctc3JjPVwie3tzZXNzaW9uLnVzZXIucGljdHVyZV91cmwubWluaX19XCI+XG4gICAgICAgICAgICB7e3Nlc3Npb24udXNlci5uYW1lfX1cbiAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwiY2FyZXRcIj48L3NwYW4+XG4gICAgICAgICAgPC9hPlxuICAgICAgICAgIDx1bCBjbGFzcz1cImRyb3Bkb3duLW1lbnVcIj5cbiAgICAgICAgICAgIDxsaT48YSB1aS1zcmVmPVwidXNlci5wcm9maWxlXCI+RWRpdCBwcm9maWxlPC9hPjwvbGk+XG4gICAgICAgICAgICA8bGk+PGEgdWktc3JlZj1cInVzZXIuaWRlbnRpdGllc1wiPkVkaXQgaWRlbnRpdGllczwvYT48L2xpPlxuICAgICAgICAgICAgPGxpIGNsYXNzPVwiZGl2aWRlclwiPjwvbGk+XG4gICAgICAgICAgICA8bGk+PGEgdWktc3JlZj1cInVzZXIubG9nb3V0XCI+TG9nb3V0PC9hPjwvbGk+XG4gICAgICAgICAgPC91bD5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgXCJcIlwiXG4gIGNvbnRyb2xsZXI6IFtcIiRzY29wZVwiLCAoJHNjb3BlKSAtPlxuICAgICRzY29wZS5zZXNzaW9uID0gc2Vzc2lvblxuICBdXG5dIiwibW9kdWxlID0gYW5ndWxhci5tb2R1bGUgXCJtZXR3b3JrLnNlcnZpY2UuZ2FwaVwiLCBbXVxuXG5tb2R1bGUuZmFjdG9yeSBcImdhcGlcIiwgW1wiJHJvb3RTY29wZVwiLCBcIiRxXCIsICgkcm9vdFNjb3BlLCAkcSkgLT5cbiAgXG4gIGxvYWRNYXBzOiBkbyAtPlxuICAgIHByb21pc2UgPSBudWxsXG4gICAgXG4gICAgLT5cbiAgICAgIHJldHVybiBwcm9taXNlIGlmIHByb21pc2VcbiAgICAgIFxuICAgICAgZGZkID0gJHEuZGVmZXIoKVxuICAgICAgXG4gICAgICBnb29nbGUubG9hZCBcIm1hcHNcIiwgXCIzXCIsXG4gICAgICAgIG90aGVyX3BhcmFtczogXCJrZXk9QUl6YVN5Ql8yR2h3ckc2RGVualVFSy1VYnV2OE8zaEhRajA5VXZNJnNlbnNvcj10cnVlXCJcbiAgICAgICAgY2FsbGJhY2s6IC0+ICRyb290U2NvcGUuJGFwcGx5IC0+IGRmZC5yZXNvbHZlKClcbiAgICAgIFxuICAgICAgcmV0dXJuIHByb21pc2UgPSBkZmQucHJvbWlzZVxuXVxuXG4iLCJtb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSBcIm1ldHdvcmsuc2VydmljZS5nYXRla2VlcGVyXCIsIFtcbiAgXCJ1aS5yb3V0ZXJcIlxuXVxuXG5tb2R1bGUuZmFjdG9yeSBcImdhdGVrZWVwZXJcIiwgWyBcIiRyb290U2NvcGVcIiwgXCIkc3RhdGVcIiwgXCIkc3RhdGVQYXJhbXNcIiwgXCIkaW5qZWN0b3JcIiwgKCRyb290U2NvcGUsICRzdGF0ZSwgJHN0YXRlUGFyYW1zLCAkaW5qZWN0b3IpIC0+XG4gIGRpdmVydFVudGlsOiAodGFyZ2V0LCBwcmVkaWNhdGUpIC0+XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiZ2F0ZWtlZXBlci5kaXZlcnRVbnRpbCByZXF1aXJlcyBhIGZ1bmN0aW9uIHByZWRpY2F0ZVwiKSB1bmxlc3MgYW5ndWxhci5pc0Z1bmN0aW9uKHByZWRpY2F0ZSlcbiAgICB1bmxlc3MgdmFsaWQgPSAhIXByZWRpY2F0ZSgpXG4gICAgICBzdWNjZXNzU3RhdGUgPSAkc3RhdGUuY3VycmVudFxuICAgICAgc3VjY2Vzc1N0YXRlUGFyYW1zID0gYW5ndWxhci5jb3B5KCRzdGF0ZVBhcmFtcylcbiAgICAgIGNhbmNlbFdhdGNoID0gJHJvb3RTY29wZS4kd2F0Y2ggcHJlZGljYXRlLCAodmFsaWQpIC0+XG4gICAgICAgIGlmICEhdmFsaWRcbiAgICAgICAgICBjYW5jZWxXYXRjaCgpXG4gICAgICAgICAgJHJvb3RTY29wZS4kZXZhbEFzeW5jIC0+ICRzdGF0ZS50cmFuc2l0aW9uVG8oc3VjY2Vzc1N0YXRlLCBzdWNjZXNzU3RhdGVQYXJhbXMpXG4gICAgICAkc3RhdGUuZ28odGFyZ2V0KVxuICAgIFxuICAgIHJldHVybiB2YWxpZFxuXVxuXG5tb2R1bGUucnVuIFsgXCIkcm9vdFNjb3BlXCIsIFwiJHN0YXRlXCIsIFwiJHN0YXRlUGFyYW1zXCIsIFwiJGluamVjdG9yXCIsIFwiJHRpbWVvdXRcIiwgKCRyb290U2NvcGUsICRzdGF0ZSwgJHN0YXRlUGFyYW1zLCAkaW5qZWN0b3IsICR0aW1lb3V0KSAtPlxuICAkcm9vdFNjb3BlLiRvbiBcIiRzdGF0ZUNoYW5nZVN1Y2Nlc3NcIiwgKGUsIHRvU3RhdGUsIHRvUGFyYW1zLCBmcm9tU3RhdGUsIGZyb21QYXJhbXMpIC0+XG4gICAgY29uc29sZS5sb2cgXCIkc3RhdGVDaGFuZ2VTdWNjZXNzXCIsIHRvU3RhdGUubmFtZVxuICAkcm9vdFNjb3BlLiRvbiBcIiRzdGF0ZUNoYW5nZVN0YXJ0XCIsIChlLCB0b1N0YXRlLCB0b1BhcmFtcywgZnJvbVN0YXRlLCBmcm9tUGFyYW1zKSAtPlxuICAgIGNvbnNvbGUubG9nIFwiJHN0YXRlQ2hhbmdlU3RhcnRcIiwgdG9TdGF0ZS5uYW1lXG4gICAgaWYgdG9TdGF0ZS5kaXZlcnRVbnRpbCBhbmQgYW5ndWxhci5pc0FycmF5KHRvU3RhdGUuZGl2ZXJ0VW50aWwpXG4gICAgXG4gICAgICBmb3IgZGl2ZXJzaW9uIGluIHRvU3RhdGUuZGl2ZXJ0VW50aWxcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiTWlzc2luZyBvciBpbnZhbGlkICd0bycgZGlyZWN0aXZlIGluIGRpdmVyc2lvblwiKSB1bmxlc3MgZGl2ZXJzaW9uLnRvIGFuZCBhbmd1bGFyLmlzU3RyaW5nKGRpdmVyc2lvbi50bylcbiAgICAgICAgXG4gICAgICAgIHByZWRpY2F0ZSA9IC0+ICEhJGluamVjdG9yLmludm9rZShkaXZlcnNpb24ucHJlZGljYXRlKVxuICAgICAgICBcbiAgICAgICAgdW5sZXNzIHByZWRpY2F0ZSgpXG4gICAgICAgICAgZG8gKGRpdmVyc2lvbiwgdG9TdGF0ZSwgdG9QYXJhbXMpIC0+XG4gICAgICAgICAgICBjb25zb2xlLmxvZyBcIlByZWRpY2F0ZSBmYWlsZWQ6IFwiLCBkaXZlcnNpb24ucHJlZGljYXRlLnRvU3RyaW5nKClcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKSAjIENhbmNlbCByb3V0ZSBjaGFuZ2VcbiAgICAgICAgICAgIGNhbmNlbFdhdGNoID0gJHJvb3RTY29wZS4kd2F0Y2ggcHJlZGljYXRlLCAodmFsaWQpIC0+XG4gICAgICAgICAgICAgIGlmICEhdmFsaWRcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyBcIlByZWRpY2F0ZSBzdWNjZWVkZWQ6IFwiLCBkaXZlcnNpb24ucHJlZGljYXRlLnRvU3RyaW5nKClcbiAgICAgICAgICAgICAgICBjYW5jZWxXYXRjaCgpXG4gICAgICAgICAgICAgICAgJHRpbWVvdXQgLT5cbiAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nIFwiU3VjY2VzczogU2VuZGluZyB5b3UgdG9cIiwgdG9TdGF0ZSwgdG9QYXJhbXNcbiAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nIFwiQXMgcmVxdWVzdGVkIGJ5IFwiLCB0b1N0YXRlLm5hbWVcbiAgICAgICAgICAgICAgICAgICRzdGF0ZS5nbyh0b1N0YXRlLCB0b1BhcmFtcylcbiAgICAgICAgICAgICMgQ2hhbmdlIHJvdXRlIGR1cmluZyBkaWdlc3QsIGJ1dCBmdXR1cmUgY3ljbGVcbiAgICAgICAgICAgICR0aW1lb3V0IC0+XG4gICAgICAgICAgICAgIGNvbnNvbGUubG9nIFwiVGltZW91dDogU2VuZGluZyB5b3UgdG9cIiwgZGl2ZXJzaW9uLnRvXG4gICAgICAgICAgICAgICRzdGF0ZS5nbyhkaXZlcnNpb24udG8pXG4gICAgICAgICAgYnJlYWtcbiAgICBlbHNlIGlmIHRvU3RhdGUuZGl2ZXJ0IGFuZCBhbmd1bGFyLmlzQXJyYXkodG9TdGF0ZS5kaXZlcnQpXG4gICAgXG4gICAgICBmb3IgZGl2ZXJzaW9uIGluIHRvU3RhdGUuZGl2ZXJ0XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIk1pc3Npbmcgb3IgaW52YWxpZCAndG8nIGRpcmVjdGl2ZSBpbiBkaXZlcnNpb25cIikgdW5sZXNzIGRpdmVyc2lvbi50byBhbmQgYW5ndWxhci5pc1N0cmluZyhkaXZlcnNpb24udG8pXG4gICAgICAgIFxuICAgICAgICB1bmxlc3MgISEkaW5qZWN0b3IuaW52b2tlKGRpdmVyc2lvbi5wcmVkaWNhdGUpXG4gICAgICAgICAgZG8gKGRpdmVyc2lvbiwgdG9TdGF0ZSwgdG9QYXJhbXMpIC0+XG4gICAgICAgICAgICBjb25zb2xlLmxvZyBcIlByZWRpY2F0ZSBmYWlsZWQ6IFwiLCBkaXZlcnNpb24ucHJlZGljYXRlLnRvU3RyaW5nKClcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKSAjIENhbmNlbCByb3V0ZSBjaGFuZ2VcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgIyBDaGFuZ2Ugcm91dGUgZHVyaW5nIGRpZ2VzdCwgYnV0IGZ1dHVyZSBjeWNsZVxuICAgICAgICAgICAgJHRpbWVvdXQgLT5cbiAgICAgICAgICAgICAgY29uc29sZS5sb2cgXCJUaW1lb3V0OiBTZW5kaW5nIHlvdSB0b1wiLCBkaXZlcnNpb24udG9cbiAgICAgICAgICAgICAgJHN0YXRlLmdvKGRpdmVyc2lvbi50bylcbiAgICAgICAgICBicmVha1xuXSIsIm1vZHVsZSA9IGFuZ3VsYXIubW9kdWxlIFwibWV0d29yay5zZXJ2aWNlLm5vdGlmaWVyXCIsIFtdXG5cbm1vZHVsZS5mYWN0b3J5IFwibm90aWZpZXJcIiwgWyBcIiRyb290RWxlbWVudFwiLCBcIiRyb290U2NvcGVcIiwgXCIkcVwiLCBcIiR0aW1lb3V0XCIsICgkcm9vdEVsZW1lbnQsICRyb290U2NvcGUsICRxLCAkdGltZW91dCkgLT5cbiAgYWxlcnQ6IChtZXNzYWdlT3JPcHRpb25zKSAtPlxuICAgIGRmZCA9ICRxLmRlZmVyKClcbiAgICBvcHRpb25zID0gaWYgYW5ndWxhci5pc09iamVjdChtZXNzYWdlT3JPcHRpb25zKSB0aGVuIG1lc3NhZ2VPck9wdGlvbnMgZWxzZVxuICAgICAgbWVzc2FnZTogbWVzc2FnZU9yT3B0aW9uc1xuICAgICAgXG4gICAgcmV0dXJuIGNvbnNvbGUud2FybiBcIk5vdGlmaWVyIHJlcXVpcmVzIGEgbWVzc2FnZVwiIHVubGVzcyBvcHRpb25zLm1lc3NhZ2VcbiAgICBcbiAgICAkcm9vdFNjb3BlLiRldmFsQXN5bmMgLT5cbiAgICAgIGFsZXJ0KG9wdGlvbnMubWVzc2FnZSlcbiAgICAgIFxuICAgICAgZGZkLnJlc29sdmUodHJ1ZSlcbiAgICBcbiAgICBkZmQucHJvbWlzZVxuICAgIFxuICBzdWNjZXNzOiAobWVzc2FnZU9yT3B0aW9ucykgLT5cbiAgICBkZmQgPSAkcS5kZWZlcigpXG4gICAgb3B0aW9ucyA9IGlmIGFuZ3VsYXIuaXNPYmplY3QobWVzc2FnZU9yT3B0aW9ucykgdGhlbiBtZXNzYWdlT3JPcHRpb25zIGVsc2VcbiAgICAgIG1lc3NhZ2U6IG1lc3NhZ2VPck9wdGlvbnNcbiAgICAgIFxuICAgIHJldHVybiBjb25zb2xlLndhcm4gXCJOb3RpZmllciByZXF1aXJlcyBhIG1lc3NhZ2VcIiB1bmxlc3Mgb3B0aW9ucy5tZXNzYWdlXG4gICAgXG4gICAgJHJvb3RTY29wZS4kZXZhbEFzeW5jIC0+XG4gICAgICBhbGVydChcIlN1Y2Nlc3M6ICN7b3B0aW9ucy5tZXNzYWdlfVwiKVxuICAgICAgXG4gICAgICBkZmQucmVzb2x2ZSh0cnVlKVxuICAgIFxuICAgIGRmZC5wcm9taXNlXG4gICAgXG4gIGNvbmZpcm06IChtZXNzYWdlT3JPcHRpb25zKSAtPlxuICAgIGRmZCA9ICRxLmRlZmVyKClcbiAgICBvcHRpb25zID0gaWYgYW5ndWxhci5pc09iamVjdChtZXNzYWdlT3JPcHRpb25zKSB0aGVuIG1lc3NhZ2VPck9wdGlvbnMgZWxzZVxuICAgICAgbWVzc2FnZTogbWVzc2FnZU9yT3B0aW9uc1xuICAgICAgXG4gICAgcmV0dXJuIGNvbnNvbGUud2FybiBcIk5vdGlmaWVyIHJlcXVpcmVzIGEgbWVzc2FnZVwiIHVubGVzcyBvcHRpb25zLm1lc3NhZ2VcbiAgICBcbiAgICAkcm9vdFNjb3BlLiRldmFsQXN5bmMgLT5cbiAgICAgIGRmZC5yZXNvbHZlIGNvbmZpcm0ob3B0aW9ucy5tZXNzYWdlKVxuICAgIFxuICAgIGRmZC5wcm9taXNlXG5cbl0iLCJtb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSBcIm1ldHdvcmsuc2VydmljZS51c2Vyc1wiLCBbXG4gIFwicmVzdGFuZ3VsYXJcIlxuXVxuXG5tb2R1bGUuY29uZmlnIFsgXCJSZXN0YW5ndWxhclByb3ZpZGVyXCIsIChSZXN0YW5ndWxhclByb3ZpZGVyKSAtPlxuICBSZXN0YW5ndWxhclByb3ZpZGVyLnNldEJhc2VVcmwgXCJodHRwOi8vbWV0d29yay1hcGkuZ2dvb2RtYW4uYzkuaW9cIlxuICBSZXN0YW5ndWxhclByb3ZpZGVyLnNldFJlc3Rhbmd1bGFyRmllbGRzIGlkOiBcIl9pZFwiXG5dXG5cbm1vZHVsZS5mYWN0b3J5IFwidXNlcnNcIiwgWyBcIlJlc3Rhbmd1bGFyXCIsIChSZXN0YW5ndWxhcikgLT5cbiAgdXNlcnNCYXNlID0gUmVzdGFuZ3VsYXIuYWxsKFwidXNlcnNcIilcbiAgXG4gIGF1Z21lbnQ6IChvYmopIC0+IFxuICBjcmVhdGU6IChqc29uKSAtPiB1c2Vyc0Jhc2UucG9zdChqc29uKVxuXSIsIm1vZHVsZS5leHBvcnRzID1cbiAgdXJsOiBcIi9jcmVhdGVcIlxuICB0ZW1wbGF0ZTogXCJcIlwiXG4gICAgPGRpdiBjbGFzcz1cInJvd1wiPlxuICAgICAgPGZvcm0gbm92YWxpZGF0ZSBjbGFzcz1cImNvbC14cy0xMlwiIG5nLXN1Ym1pdD1cImNyZWF0ZVVzZXIocHJvZmlsZSlcIiBuYW1lPVwidXNlckZvcm1cIj5cbiAgICAgICAgPGlucHV0IHR5cGU9XCJoaWRkZW5cIiBuZy1tb2RlbD1cInByb2ZpbGUucGljdHVyZV91cmxcIj5cbiAgICAgICAgPGRpdiBjbGFzcz1cImZvcm0tZ3JvdXAgY2xlYXJmaXhcIj5cbiAgICAgICAgICA8ZGl2IGNsYXNzPVwicm93XCI+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29sLXhzLTQgY29sLXNtLTMgY29sLW1kLTJcIiBuZy1jbGFzcz1cIntzZWxlY3RlZDogcHJvZmlsZS5waWN0dXJlX3VybD09cGljdHVyZV91cmx9XCIgbmctcmVwZWF0PVwiKHNlcnZpY2UsIHBpY3R1cmVfdXJsKSBpbiB1c2VyRGF0YS5waWN0dXJlX3VybFwiPlxuICAgICAgICAgICAgICA8YSBuZy1jbGljaz1cInByb2ZpbGUucGljdHVyZV91cmw9cGljdHVyZV91cmxcIiBjbGFzcz1cInRodW1ibmFpbFwiPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjcm9wLXZlcnRpY2FsXCI+XG4gICAgICAgICAgICAgICAgICA8aW1nIG5nLXNyYz1cInt7cGljdHVyZV91cmwuYmlnZ2VyfX1cIiBzdHlsZT1cIndpZHRoOiAxMDAlXCIgLz5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY2FwdGlvblwiPnt7c2VydmljZX19PC9kaXY+XG4gICAgICAgICAgICAgIDwvYT5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGRpdiBjbGFzcz1cImZvcm0tZ3JvdXBcIiBuZy1jbGFzcz1cInsnaGFzLWVycm9yJzp1c2VyRm9ybS5uYW1lLiRpbnZhbGlkfVwiPlxuICAgICAgICAgIDxsYWJlbCBjbGFzcz1cImNvbnRyb2wtbGFiZWxcIj5GdWxsIG5hbWU8L2xhYmVsPlxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJpbnB1dC1ncm91cFwiPlxuICAgICAgICAgICAgPGlucHV0IGNsYXNzPVwiZm9ybS1jb250cm9sXCIgdHlwZT1cInRleHRcIiByZXF1aXJlZCBuZy1tYXhsZW5ndGg9XCIxMDBcIiBuYW1lPVwibmFtZVwiIG5nLW1vZGVsPVwicHJvZmlsZS5uYW1lXCIgcGxhY2Vob2xkZXI9XCJGdWxsIG5hbWVcIj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJpbnB1dC1ncm91cC1idG5cIj5cbiAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJidG4gYnRuLWRlZmF1bHQgZHJvcGRvd24tdG9nZ2xlXCIgZGF0YS10b2dnbGU9XCJkcm9wZG93blwiIG5nLWNsYXNzPVwie2Rpc2FibGVkOiAhdXNlckRhdGEubmFtZX1cIj5cbiAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cImNhcmV0XCI+PC9zcGFuPlxuICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgPHVsIGNsYXNzPVwiZHJvcGRvd24tbWVudSBwdWxsLXJpZ2h0XCI+XG4gICAgICAgICAgICAgICAgPGxpIGNsYXNzPVwiZHJvcGRvd24taGVhZGVyXCIgbmctcmVwZWF0LXN0YXJ0PVwiKHZhbHVlLCBzZXJ2aWNlcykgaW4gdXNlckRhdGEubmFtZSB0cmFjayBieSB2YWx1ZVwiPlxuICAgICAgICAgICAgICAgICAge3tzZXJ2aWNlcyB8IGpvaW46JywgJ319XG4gICAgICAgICAgICAgICAgPC9saT5cbiAgICAgICAgICAgICAgICA8bGkgbmctcmVwZWF0LWVuZCBuZy1jbGFzcz1cInthY3RpdmU6IHByb2ZpbGUubmFtZT09dmFsdWV9XCI+XG4gICAgICAgICAgICAgICAgICA8YSBuZy1jbGljaz1cInByb2ZpbGUubmFtZT12YWx1ZVwiPnt7dmFsdWV9fTwvYT5cbiAgICAgICAgICAgICAgICA8L2xpPlxuICAgICAgICAgICAgICA8L3VsPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPHAgY2xhc3M9XCJoZWxwLWJsb2NrXCI+XG4gICAgICAgICAgICA8c3BhbiBuZy1zaG93PVwidXNlckZvcm0ubmFtZS4kZXJyb3IucmVxdWlyZWRcIj5SZXF1aXJlZCBmaWVsZDwvc3Bhbj5cbiAgICAgICAgICAgIDxzcGFuIG5nLXNob3c9XCJ1c2VyRm9ybS5uYW1lLiRlcnJvci5tYXhsZW5ndGhcIj5DYW5ub3QgZXhjZWVkIDEwMCBjaGFyYWN0ZXJzPC9zcGFuPlxuICAgICAgICAgIDwvcD5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJmb3JtLWdyb3VwIHByb2ZpbGUtZGVzY3JpcHRpb25cIiBuZy1jbGFzcz1cInsnaGFzLWVycm9yJzp1c2VyRm9ybS5kZXNjcmlwdGlvbi4kaW52YWxpZH1cIj5cbiAgICAgICAgICA8bGFiZWwgY2xhc3M9XCJjb250cm9sLWxhYmVsXCI+UXVpY2sgZGVzY3JpcHRpb24gb2YgeW91cnNlbGY8L2xhYmVsPlxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJpbnB1dC1ncm91cFwiPlxuICAgICAgICAgICAgPHRleHRhcmVhIGNsYXNzPVwiZm9ybS1jb250cm9sXCIgbmctbWF4bGVuZ3RoPVwiMjAwXCIgcm93cz1cIjJcIiB0eXBlPVwidGV4dFwiIG5hbWU9XCJkZXNjcmlwdGlvblwiIG5nLW1vZGVsPVwicHJvZmlsZS5kZXNjcmlwdGlvblwiIHBsYWNlaG9sZGVyPVwiRnVsbCBkZXNjcmlwdGlvblwiPjwvdGV4dGFyZWE+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiaW5wdXQtZ3JvdXAtYnRuXCI+XG4gICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiYnRuIGJ0bi1kZWZhdWx0IGRyb3Bkb3duLXRvZ2dsZVwiIGRhdGEtdG9nZ2xlPVwiZHJvcGRvd25cIiBuZy1jbGFzcz1cIntkaXNhYmxlZDogIXVzZXJEYXRhLmRlc2NyaXB0aW9ufVwiPlxuICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwiY2FyZXRcIj48L3NwYW4+XG4gICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICA8dWwgY2xhc3M9XCJkcm9wZG93bi1tZW51IHB1bGwtcmlnaHRcIj5cbiAgICAgICAgICAgICAgICA8bGkgY2xhc3M9XCJkcm9wZG93bi1oZWFkZXJcIiBuZy1yZXBlYXQtc3RhcnQ9XCIodmFsdWUsIHNlcnZpY2VzKSBpbiB1c2VyRGF0YS5kZXNjcmlwdGlvbiB0cmFjayBieSB2YWx1ZVwiPlxuICAgICAgICAgICAgICAgICAge3tzZXJ2aWNlcyB8IGpvaW46JywgJ319XG4gICAgICAgICAgICAgICAgPC9saT5cbiAgICAgICAgICAgICAgICA8bGkgbmctcmVwZWF0LWVuZCBuZy1jbGFzcz1cInthY3RpdmU6IHByb2ZpbGUuZGVzY3JpcHRpb249PXZhbHVlfVwiPlxuICAgICAgICAgICAgICAgICAgPGEgbmctY2xpY2s9XCJwcm9maWxlLmRlc2NyaXB0aW9uPXZhbHVlXCI+e3t2YWx1ZX19PC9hPlxuICAgICAgICAgICAgICAgIDwvbGk+XG4gICAgICAgICAgICAgIDwvdWw+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8cCBjbGFzcz1cImhlbHAtYmxvY2tcIj5cbiAgICAgICAgICAgIENoYXJhY3RlcnMgcmVtYWluaW5nOiA8c3Ryb25nIG5nLWJpbmQ9XCIyMDAgLSB1c2VyRm9ybS5kZXNjcmlwdGlvbi4kdmlld1ZhbHVlLmxlbmd0aCB8IG51bWJlclwiPjwvc3Ryb25nPiAobWF4aW11bSAyMDApXG4gICAgICAgICAgPC9wPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGRpdiBjbGFzcz1cImZvcm0tZ3JvdXBcIiBuZy1jbGFzcz1cInsnaGFzLWVycm9yJzp1c2VyRm9ybS5jb21wYW55LiRpbnZhbGlkfVwiPlxuICAgICAgICAgIDxsYWJlbCBjbGFzcz1cImNvbnRyb2wtbGFiZWxcIj5Db21wYW55PC9sYWJlbD5cbiAgICAgICAgICA8ZGl2IGNsYXNzPVwiaW5wdXQtZ3JvdXBcIj5cbiAgICAgICAgICAgIDxpbnB1dCBjbGFzcz1cImZvcm0tY29udHJvbFwiIHR5cGU9XCJ0ZXh0XCIgbmFtZT1cImNvbXBhbnlcIiBuZy1tYXhsZW5ndGg9XCIxMDBcIiBuZy1tb2RlbD1cInByb2ZpbGUuY29tcGFueVwiIHBsYWNlaG9sZGVyPVwiQ29tcGFueVwiPlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImlucHV0LWdyb3VwLWJ0blwiPlxuICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImJ0biBidG4tZGVmYXVsdCBkcm9wZG93bi10b2dnbGVcIiBkYXRhLXRvZ2dsZT1cImRyb3Bkb3duXCIgbmctY2xhc3M9XCJ7ZGlzYWJsZWQ6ICF1c2VyRGF0YS5jb21wYW55fVwiPlxuICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwiY2FyZXRcIj48L3NwYW4+XG4gICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICA8dWwgY2xhc3M9XCJkcm9wZG93bi1tZW51IHB1bGwtcmlnaHRcIj5cbiAgICAgICAgICAgICAgICA8bGkgY2xhc3M9XCJkcm9wZG93bi1oZWFkZXJcIiBuZy1yZXBlYXQtc3RhcnQ9XCIodmFsdWUsIHNlcnZpY2VzKSBpbiB1c2VyRGF0YS5jb21wYW55IHRyYWNrIGJ5IHZhbHVlXCI+XG4gICAgICAgICAgICAgICAgICB7e3NlcnZpY2VzIHwgam9pbjonLCAnfX1cbiAgICAgICAgICAgICAgICA8L2xpPlxuICAgICAgICAgICAgICAgIDxsaSBuZy1yZXBlYXQtZW5kIG5nLWNsYXNzPVwie2FjdGl2ZTogcHJvZmlsZS5jb21wYW55PT12YWx1ZX1cIj5cbiAgICAgICAgICAgICAgICAgIDxhIG5nLWNsaWNrPVwicHJvZmlsZS5jb21wYW55PXZhbHVlXCI+e3t2YWx1ZX19PC9hPlxuICAgICAgICAgICAgICAgIDwvbGk+XG4gICAgICAgICAgICAgIDwvdWw+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8cCBjbGFzcz1cImhlbHAtYmxvY2tcIj5cbiAgICAgICAgICAgIDxzcGFuIG5nLXNob3c9XCJ1c2VyRm9ybS5jb21wYW55LiRlcnJvci5tYXhsZW5ndGhcIj5DYW5ub3QgZXhjZWVkIDEwMCBjaGFyYWN0ZXJzPC9zcGFuPlxuICAgICAgICAgIDwvcD5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJmb3JtLWdyb3VwXCIgbmctY2xhc3M9XCJ7J2hhcy1lcnJvcic6dXNlckZvcm0ud2Vic2l0ZV91cmwuJGludmFsaWR9XCI+XG4gICAgICAgICAgPGxhYmVsIGNsYXNzPVwiY29udHJvbC1sYWJlbFwiPldlYnNpdGUgYWRkcmVzczwvbGFiZWw+XG4gICAgICAgICAgPGRpdiBjbGFzcz1cImlucHV0LWdyb3VwXCI+XG4gICAgICAgICAgICA8aW5wdXQgY2xhc3M9XCJmb3JtLWNvbnRyb2xcIiB0eXBlPVwidGV4dFwiIG5hbWU9XCJ3ZWJzaXRlX3VybFwiIG5nLW1heGxlbmd0aD1cIjI1NVwiIG5nLW1vZGVsPVwicHJvZmlsZS53ZWJzaXRlX3VybFwiIHBsYWNlaG9sZGVyPVwiV2Vic2l0ZVwiPlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImlucHV0LWdyb3VwLWJ0blwiPlxuICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImJ0biBidG4tZGVmYXVsdCBkcm9wZG93bi10b2dnbGVcIiBkYXRhLXRvZ2dsZT1cImRyb3Bkb3duXCIgbmctY2xhc3M9XCJ7ZGlzYWJsZWQ6ICF1c2VyRGF0YS53ZWJzaXRlX3VybH1cIj5cbiAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cImNhcmV0XCI+PC9zcGFuPlxuICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgPHVsIGNsYXNzPVwiZHJvcGRvd24tbWVudSBwdWxsLXJpZ2h0XCI+XG4gICAgICAgICAgICAgICAgPGxpIGNsYXNzPVwiZHJvcGRvd24taGVhZGVyXCIgbmctcmVwZWF0LXN0YXJ0PVwiKHZhbHVlLCBzZXJ2aWNlcykgaW4gdXNlckRhdGEud2Vic2l0ZV91cmwgdHJhY2sgYnkgdmFsdWVcIj5cbiAgICAgICAgICAgICAgICAgIHt7c2VydmljZXMgfCBqb2luOicsICd9fVxuICAgICAgICAgICAgICAgIDwvbGk+XG4gICAgICAgICAgICAgICAgPGxpIG5nLXJlcGVhdC1lbmQgbmctY2xhc3M9XCJ7YWN0aXZlOiBwcm9maWxlLndlYnNpdGVfdXJsPT12YWx1ZX1cIj5cbiAgICAgICAgICAgICAgICAgIDxhIG5nLWNsaWNrPVwicHJvZmlsZS53ZWJzaXRlX3VybD12YWx1ZVwiPnt7dmFsdWV9fTwvYT5cbiAgICAgICAgICAgICAgICA8L2xpPlxuICAgICAgICAgICAgICA8L3VsPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPHAgY2xhc3M9XCJoZWxwLWJsb2NrXCI+XG4gICAgICAgICAgICA8c3BhbiBuZy1zaG93PVwidXNlckZvcm0ud2Vic2l0ZV91cmwuJGVycm9yLm1heGxlbmd0aFwiPkNhbm5vdCBleGNlZWQgMjU1IGNoYXJhY3RlcnM8L3NwYW4+XG4gICAgICAgICAgPC9wPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGRpdiBjbGFzcz1cImZvcm0tZ3JvdXBcIiBuZy1jbGFzcz1cInsnaGFzLWVycm9yJzp1c2VyRm9ybS5sb2NhdGlvbi4kaW52YWxpZH1cIj5cbiAgICAgICAgICA8bGFiZWwgY2xhc3M9XCJjb250cm9sLWxhYmVsXCI+TG9jYXRpb248L2xhYmVsPlxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJpbnB1dC1ncm91cFwiPlxuICAgICAgICAgICAgPGlucHV0IGNsYXNzPVwiZm9ybS1jb250cm9sXCIgdHlwZT1cInRleHRcIiBuYW1lPVwibG9jYXRpb25cIiBuZy1tYXhsZW5ndGg9XCIxMDBcIiBuZy1tb2RlbD1cInByb2ZpbGUubG9jYXRpb25cIiBwbGFjZWhvbGRlcj1cIkxvY2F0aW9uXCI+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiaW5wdXQtZ3JvdXAtYnRuXCI+XG4gICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiYnRuIGJ0bi1kZWZhdWx0IGRyb3Bkb3duLXRvZ2dsZVwiIGRhdGEtdG9nZ2xlPVwiZHJvcGRvd25cIiBuZy1jbGFzcz1cIntkaXNhYmxlZDogIXVzZXJEYXRhLmxvY2F0aW9ufVwiPlxuICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwiY2FyZXRcIj48L3NwYW4+XG4gICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICA8dWwgY2xhc3M9XCJkcm9wZG93bi1tZW51IHB1bGwtcmlnaHRcIj5cbiAgICAgICAgICAgICAgICA8bGkgY2xhc3M9XCJkcm9wZG93bi1oZWFkZXJcIiBuZy1yZXBlYXQtc3RhcnQ9XCIodmFsdWUsIHNlcnZpY2VzKSBpbiB1c2VyRGF0YS5sb2NhdGlvbiB0cmFjayBieSB2YWx1ZVwiPlxuICAgICAgICAgICAgICAgICAge3tzZXJ2aWNlcyB8IGpvaW46JywgJ319XG4gICAgICAgICAgICAgICAgPC9saT5cbiAgICAgICAgICAgICAgICA8bGkgbmctcmVwZWF0LWVuZCBuZy1jbGFzcz1cInthY3RpdmU6IHByb2ZpbGUubG9jYXRpb249PXZhbHVlfVwiPlxuICAgICAgICAgICAgICAgICAgPGEgbmctY2xpY2s9XCJwcm9maWxlLmxvY2F0aW9uPXZhbHVlXCI+e3t2YWx1ZX19PC9hPlxuICAgICAgICAgICAgICAgIDwvbGk+XG4gICAgICAgICAgICAgIDwvdWw+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8cCBjbGFzcz1cImhlbHAtYmxvY2tcIj5cbiAgICAgICAgICAgIDxzcGFuIG5nLXNob3c9XCJ1c2VyRm9ybS5sb2NhdGlvbi4kZXJyb3IubWF4bGVuZ3RoXCI+Q2Fubm90IGV4Y2VlZCAxMDAgY2hhcmFjdGVyczwvc3Bhbj5cbiAgICAgICAgICA8L3A+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzPVwiZm9ybS1ncm91cFwiPlxuICAgICAgICAgIDxidXR0b24gY2xhc3M9XCJidG4gYnRuLXByaW1hcnlcIiBuZy1kaXNhYmxlZD1cInVzZXJGb3JtLiRpbnZhbGlkXCIgdHlwZT1cInN1Ym1pdFwiPlJlZ2lzdGVyPC9idXR0b24+XG4gICAgICAgICAgPGEgY2xhc3M9XCJidG4gYnRuLWRhbmdlclwiIHVpLXNyZWY9XCJsYW5kaW5nXCI+Q2FuY2VsPC9hPlxuICAgICAgICAgIDxhIGNsYXNzPVwicHVsbC1yaWdodCBidG4gYnRuLWRlZmF1bHRcIiB1aS1zcmVmPVwidXNlci5saW5rXCI+QmFjazwvYT5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Zvcm0+XG4gICAgPC9kaXY+XG4gIFwiXCJcIlxuICBjb250cm9sbGVyOiBbXCIkc2NvcGVcIiwgXCIkc3RhdGVcIiwgXCJvYXV0aFwiLCBcInVzZXJzXCIsIFwic2Vzc2lvblwiLCAoJHNjb3BlLCAkc3RhdGUsIG9hdXRoLCB1c2Vycywgc2Vzc2lvbikgLT5cbiAgICB2YWxpZCA9IHRydWUgZm9yIHNlcnZpY2UgaW4gb2F1dGguc2VydmljZXMgd2hlbiBvYXV0aC5oYXNJZGVudGl0eShzZXJ2aWNlLmlkKVxuICAgIFxuICAgIHJldHVybiAkc3RhdGUuZ28gXCJ1c2VyLmxvZ2luXCIgdW5sZXNzIHZhbGlkXG4gICAgcmV0dXJuICRzdGF0ZS5nbyBcImxhbmRpbmdcIiBpZiBzZXNzaW9uLnVzZXJcbiAgICBcbiAgICAkc2NvcGUudXNlckRhdGEgPSB7fVxuICAgIFxuICAgIGZvciBzZXJ2aWNlLCBpZGVudGl0eSBvZiBvYXV0aC5nZXRJZGVudGl0aWVzKClcbiAgICAgIGZvciBmaWVsZCwgdmFsdWUgb2YgaWRlbnRpdHkgd2hlbiB2YWx1ZVxuICAgICAgICBzZXJ2aWNlTmFtZSA9IG9hdXRoLmdldFNlcnZpY2Uoc2VydmljZSk/Lm5hbWVcbiAgICAgICAgXG4gICAgICAgICRzY29wZS51c2VyRGF0YVtmaWVsZF0gfHw9IHt9XG4gICAgICAgIFxuICAgICAgICBpZiBhbmd1bGFyLmlzT2JqZWN0KHZhbHVlKVxuICAgICAgICAgICRzY29wZS51c2VyRGF0YVtmaWVsZF1bc2VydmljZU5hbWVdID0gdmFsdWVcbiAgICAgICAgZWxzZVxuICAgICAgICAgICRzY29wZS51c2VyRGF0YVtmaWVsZF1bdmFsdWVdIHx8PSBbXVxuICAgICAgICAgICRzY29wZS51c2VyRGF0YVtmaWVsZF1bdmFsdWVdLnB1c2ggc2VydmljZU5hbWVcbiAgICBcbiAgICAkc2NvcGUucHJvZmlsZSA9IG9hdXRoLmJ1aWxkUHJvZmlsZSgpXG4gICAgXG4gICAgJHNjb3BlLmNyZWF0ZVVzZXIgPSAodXNlckluZm8pIC0+XG4gICAgICB1c2VySW5mby5pZGVudGl0aWVzID0gXy5tYXAgb2F1dGguZ2V0SWRlbnRpdGllcygpLCAoaWRlbnRpdHkpIC0+IGlkZW50aXR5XG4gICAgICBcbiAgICAgIHVzZXJzLmNyZWF0ZSh1c2VySW5mbykudGhlbiAodXNlcikgLT5cbiAgICAgICAgc2Vzc2lvbi5sb2dpbih1c2VySW5mby5pZGVudGl0aWVzWzBdKVxuICAgICAgICAkc3RhdGUuZ28gXCJsYW5kaW5nXCJcbiAgICAgICwgKGVycikgLT5cbiAgICAgICAgY29uc29sZS5sb2cgXCJGYWlsZWQgdG8gY3JlYXRlIHVzZXJcIiwgYXJndW1lbnRzLi4uXG4gIF0iLCJtb2R1bGUuZXhwb3J0cyA9IFxuICB1cmw6IFwiL2lkZW50aXRpZXNcIlxuICB0ZW1wbGF0ZTogXCJcIlwiXG4gICAgPGRpdiBjbGFzcz1cInJvd1wiPlxuICAgICAgPGRpdiBjbGFzcz1cImNvbC14cy0xMlwiPlxuICAgICAgICA8aDQ+Q3VycmVudCBzb2NpYWwgYWNjb3VudHM8L2g0PlxuICAgICAgPC9kaXY+XG4gICAgICA8cCBjbGFzcz1cImNvbC14cy02IGNvbC1zbS0zXCIgbmctcmVwZWF0PVwic2VydmljZSBpbiBzZXJ2aWNlcyB8IGZpbHRlcjpoYXNJZGVudGl0eVwiPlxuICAgICAgICA8YSBjbGFzcz1cImJ0biBidG4tZGVmYXVsdCBidG4tYmxvY2tcIiBuZy1jbGFzcz1cIntkaXNhYmxlZDogaGFzSWRlbnRpdHkoc2VydmljZSksICdidG4tc3VjY2Vzcyc6IGhhc0lkZW50aXR5KHNlcnZpY2UpfVwiIG5nLWNsaWNrPVwicmVtb3ZlKHNlcnZpY2UuaWQpXCI+XG4gICAgICAgICAgPGltZyBuZy1zcmM9XCJ7e3NlcnZpY2UuaW1hZ2V9fVwiPjwvaT5cbiAgICAgICAgICB7e3NlcnZpY2UubmFtZX19XG4gICAgICAgIDwvYT5cbiAgICAgIDwvcD5cbiAgICA8L2Rpdj5cbiAgICA8ZGl2IGNsYXNzPVwicm93XCI+XG4gICAgICA8ZGl2IGNsYXNzPVwiY29sLXhzLTEyXCI+XG4gICAgICAgIDxoND5BZGQgc29jaWFsIGFjY291bnRzPC9oND5cbiAgICAgIDwvZGl2PlxuICAgICAgPHAgY2xhc3M9XCJjb2wteHMtNiBjb2wtc20tM1wiIG5nLXJlcGVhdD1cInNlcnZpY2UgaW4gc2VydmljZXMgfCBmaWx0ZXI6bm9JZGVudGl0eVwiPlxuICAgICAgICA8YSBjbGFzcz1cImJ0biBidG4tZGVmYXVsdCBidG4tYmxvY2tcIiBuZy1jbGFzcz1cIntkaXNhYmxlZDogaGFzSWRlbnRpdHkoc2VydmljZSksICdidG4tc3VjY2Vzcyc6IGhhc0lkZW50aXR5KHNlcnZpY2UpfVwiIG5nLWNsaWNrPVwiYWRkKHNlcnZpY2UuaWQpXCI+XG4gICAgICAgICAgPGltZyBuZy1zcmM9XCJ7e3NlcnZpY2UuaW1hZ2V9fVwiPjwvaT5cbiAgICAgICAgICB7e3NlcnZpY2UubmFtZX19XG4gICAgICAgIDwvYT5cbiAgICAgIDwvcD5cbiAgICA8L2Rpdj5cbiAgICA8ZGl2IGNsYXNzPVwicm93XCI+XG4gICAgICA8cCBjbGFzcz1cImNvbC14cy0xMlwiID5cbiAgICAgICAgPGEgY2xhc3M9XCJidG4gYnRuLWRlZmF1bHRcIiB1aS1zcmVmPVwibGFuZGluZ1wiPkhvbWU8L2E+XG4gICAgICA8L3A+XG4gICAgPC9kaXY+XG4gIFwiXCJcIlxuICBjb250cm9sbGVyOiBbXCIkc2NvcGVcIiwgXCIkc3RhdGVcIiwgXCJvYXV0aFwiLCBcInNlc3Npb25cIiwgKCRzY29wZSwgJHN0YXRlLCBvYXV0aCwgc2Vzc2lvbikgLT5cbiAgICByZXR1cm4gJHN0YXRlLmdvIFwidXNlci5sb2dpblwiIHVubGVzcyBzZXNzaW9uLnVzZXJcbiAgICBcbiAgICAkc2NvcGUuc2VydmljZXMgPSBvYXV0aC5zZXJ2aWNlc1xuICAgICRzY29wZS5oYXNJZGVudGl0eSA9IChzZXJ2aWNlKSAtPiBzZXNzaW9uLmhhc0lkZW50aXR5KHNlcnZpY2UuaWQpXG4gICAgJHNjb3BlLm5vSWRlbnRpdHkgPSAoc2VydmljZSkgLT4gISRzY29wZS5oYXNJZGVudGl0eShzZXJ2aWNlKVxuICAgICRzY29wZS5hZGQgPSAoc2VydmljZSkgLT5cbiAgICAgIG9hdXRoLmF1dGhUbyhzZXJ2aWNlKS50aGVuIChpZGVudGl0eSkgLT5cbiAgICAgICAgc2Vzc2lvbi51c2VyLmFkZElkZW50aXR5KGlkZW50aXR5KS50aGVuIC0+XG4gICAgICAgICAgc2Vzc2lvbi51c2VyLmlkZW50aXRpZXMucHVzaChpZGVudGl0eSlcbiAgXSIsIm1vZHVsZS5leHBvcnRzID0gXG4gIHVybDogXCIvbGlua1wiXG4gIHRlbXBsYXRlOiBcIlwiXCJcbiAgICA8ZGl2IGNsYXNzPVwicm93XCI+XG4gICAgICA8ZGl2IGNsYXNzPVwiY29sLXhzLTEyXCI+XG4gICAgICAgIDxoND5MaW5rIHNvY2lhbCBhY2NvdW50czwvaDQ+XG4gICAgICAgIDxwPlxuICAgICAgICAgIENsaWNrIHRoZSBidXR0b25zIGJlbG93IGFuZCBzaWduLWluIHRvIGFkZCBzb2NpYWwgcHJvZmlsZXMgdG8geW91clxuICAgICAgICAgIGlkZW50aXR5LlxuICAgICAgICA8L3A+XG4gICAgICAgIDxwPlxuICAgICAgICAgIFRoZXNlIHByb2ZpbGVzIHdpbGwgYmUgdXNlZCB0byBoZWxwIGJ1aWxkIHlvdXIgaWRlbnRpdHkgYW5kIHdpbGxcbiAgICAgICAgICBhbGxvdyBvdGhlciB1c2VycyB0byBjb25uZWN0IHdpdGggeW91IHZpYSBzb2NpYWwgbmV0d29ya3Mgb25jZSB5b3VcbiAgICAgICAgICBhcmUgYSBtZW1iZXIuXG4gICAgICAgIDwvcD5cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICAgIDxkaXYgY2xhc3M9XCJyb3dcIj5cbiAgICAgIDxwIGNsYXNzPVwiY29sLXhzLTYgY29sLXNtLTNcIiBuZy1yZXBlYXQ9XCJzZXJ2aWNlIGluIHNlcnZpY2VzXCI+XG4gICAgICAgIDxhIGNsYXNzPVwiYnRuIGJ0bi1kZWZhdWx0IGJ0bi1ibG9ja1wiIG5nLWNsYXNzPVwie2Rpc2FibGVkOiBoYXNJZGVudGl0eShzZXJ2aWNlLmlkKSwgJ2J0bi1zdWNjZXNzJzogaGFzSWRlbnRpdHkoc2VydmljZS5pZCl9XCIgbmctY2xpY2s9XCJhdXRoVG8oc2VydmljZS5pZClcIj5cbiAgICAgICAgICA8aW1nIG5nLXNyYz1cInt7c2VydmljZS5pbWFnZX19XCI+PC9pPlxuICAgICAgICAgIHt7c2VydmljZS5uYW1lfX1cbiAgICAgICAgPC9hPlxuICAgICAgPC9wPlxuICAgIDwvZGl2PlxuICAgIDxkaXYgY2xhc3M9XCJyb3dcIj5cbiAgICAgIDxwIGNsYXNzPVwiY29sLXhzLTEyXCIgPlxuICAgICAgICA8YSBjbGFzcz1cImJ0biBidG4tcHJpbWFyeVwiIHVpLXNyZWY9XCJ1c2VyLmNyZWF0ZVwiPkNvbnRpbnVlPC9hPlxuICAgICAgICA8YSBjbGFzcz1cImJ0biBidG4tZGFuZ2VyXCIgbmctY2xpY2s9XCJjYW5jZWxSZWdpc3RyYXRpb24oKVwiPkNhbmNlbDwvYT5cbiAgICAgIDwvcD5cbiAgICA8L2Rpdj5cbiAgXCJcIlwiXG4gIGNvbnRyb2xsZXI6IFtcIiRzY29wZVwiLCBcIiRzdGF0ZVwiLCBcIm9hdXRoXCIsIFwic2Vzc2lvblwiLCAoJHNjb3BlLCAkc3RhdGUsIG9hdXRoLCBzZXNzaW9uKSAtPlxuICAgIHZhbGlkID0gdHJ1ZSBmb3Igc2VydmljZSBpbiBvYXV0aC5zZXJ2aWNlcyB3aGVuIG9hdXRoLmhhc0lkZW50aXR5KHNlcnZpY2UuaWQpXG4gICAgXG4gICAgcmV0dXJuICRzdGF0ZS5nbyBcInVzZXIubG9naW5cIiB1bmxlc3MgdmFsaWRcbiAgICByZXR1cm4gJHN0YXRlLmdvIFwibGFuZGluZ1wiIGlmIHNlc3Npb24udXNlclxuICAgIFxuICAgICRzY29wZS5oYXNJZGVudGl0eSA9IG9hdXRoLmhhc0lkZW50aXR5LmJpbmQob2F1dGgpXG4gICAgJHNjb3BlLmF1dGhUbyA9IG9hdXRoLmF1dGhUby5iaW5kKG9hdXRoKVxuICAgICRzY29wZS5zZXJ2aWNlcyA9IG9hdXRoLnNlcnZpY2VzXG4gICAgXG4gICAgJHNjb3BlLmNhbmNlbFJlZ2lzdHJhdGlvbiA9IC0+XG4gICAgICBvYXV0aC5jbGVhclByb2ZpbGVzKClcbiAgICAgIFxuICAgICAgJHN0YXRlLmdvIFwibGFuZGluZ1wiXG4gIF0iLCJtb2R1bGUuZXhwb3J0cyA9XG4gIGRhdGE6XG4gICAgcmV0dXJuVG86IFwiXCJcbiAgdXJsOiBcIi9sb2dpblwiXG4gIHRlbXBsYXRlOiBcIlwiXCJcbiAgICA8ZGl2IGNsYXNzPVwicm93XCI+XG4gICAgICA8ZGl2IGNsYXNzPVwiY29sLXhzLTEyXCI+XG4gICAgICAgIDxoMT5Mb2dpbiAvIFJlZ2lzdGVyPC9oMT5cbiAgICAgICAgPHA+XG4gICAgICAgICAgUGxlYXNlIHNpZ24gaW4gdXNpbmcgYW55IG9mIHRoZSBzZXJ2aWNlcyBsaXN0ZWQgYmVsb3cuIElmIHlvdSBkb24ndFxuICAgICAgICAgIGhhdmUgYSBwcm9maWxlIG9uIE1ldHdvcmsgeWV0LCB3ZSB3aWxsIHNldCB0aGF0IHVwIGZvciB5b3UgaW4gbGVzc1xuICAgICAgICAgIHRoYW4gb25lIG1pbnV0ZS5cbiAgICAgICAgPC9wPlxuICAgICAgICA8cCBjbGFzcz1cImFsZXJ0IGFsZXJ0LWRhbmdlclwiIG5nLWlmPVwiYXV0aEVycm9yXCI+XG4gICAgICAgICAgPHN0cm9uZz5Mb2dpbiBmYWlsZWQ8L3N0cm9uZz4ge3thdXRoRXJyb3J9fVxuICAgICAgICA8L3A+XG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgICA8ZGl2IGNsYXNzPVwicm93XCI+XG4gICAgICA8cCBjbGFzcz1cImNvbC14cy02IGNvbC1zbS0zXCIgbmctcmVwZWF0PVwic2VydmljZSBpbiBzZXJ2aWNlc1wiPlxuICAgICAgICA8YSBjbGFzcz1cImJ0biBidG4tZGVmYXVsdCBidG4tYmxvY2tcIiBuZy1kaXNhYmxlZD1cImF1dGhlbnRpY2F0aW5nXCIgbmctY2xpY2s9XCJhdXRoVG8oc2VydmljZS5pZClcIj5cbiAgICAgICAgICA8aW1nIG5nLXNyYz1cInt7c2VydmljZS5pbWFnZX19XCI+PC9pPlxuICAgICAgICAgIHt7c2VydmljZS5uYW1lfX1cbiAgICAgICAgPC9hPlxuICAgICAgPC9wPlxuICAgIDwvZGl2PlxuICBcIlwiXCJcbiAgY29udHJvbGxlcjogW1wiJHNjb3BlXCIsIFwiJHN0YXRlXCIsIFwic2Vzc2lvblwiLCBcIm9hdXRoXCIsIFwidXNlcnNcIiwgXCJub3RpZmllclwiLCAoJHNjb3BlLCAkc3RhdGUsIHNlc3Npb24sIG9hdXRoLCB1c2Vycywgbm90aWZpZXIpIC0+XG4gICAgJHNjb3BlLnNlcnZpY2VzID0gb2F1dGguc2VydmljZXNcbiAgICAkc2NvcGUuYXV0aFRvID0gKHNlcnZpY2UpIC0+XG4gICAgICAkc2NvcGUuYXV0aGVudGljYXRpbmcgPSB0cnVlXG4gICAgICBcbiAgICAgIGF1dGggPSBvYXV0aC5hdXRoVG8oc2VydmljZSkudGhlbiAoaWRlbnRpdHkpIC0+XG4gICAgICAgIGlmIGlkZW50aXR5XG4gICAgICAgICAgbG9naW4gPSBzZXNzaW9uLmxvZ2luKGlkZW50aXR5KVxuICAgICAgICAgIFxuICAgICAgICAgIGxvZ2luLmNhdGNoIChlcnIpIC0+XG4gICAgICAgICAgICBpZiBlcnIucmVzdWx0IGlzIFwibm90X2ZvdW5kXCIgdGhlbiAkc3RhdGUuZ28gXCJ1c2VyLmxpbmtcIlxuICAgICAgICAgICAgZWxzZSBpZiBlcnIucmVzdWx0IGlzIFwiY29uZmxpY3RcIlxuICAgICAgICAgICAgICBub3RpZmllci5hbGVydCBcIkEgdXNlciBhbHJlYWR5IGV4aXN0cyB3aXRoIHRoZSBzYW1lIGVtYWlsLiBQbGVhc2UgbG9nIGluIHdpdGggdGhlIHNlcnZpY2UgdXNlZCB0byBjcmVhdGUgeW91ciBhY2NvdW50IGFuZCB0aGVuIGxpbmsgeW91ciAje3NlcnZpY2V9IGFjY291bnQgdG8gaXRcIlxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAkc2NvcGUuYXV0aEVycm9yID0gXCJFcnJvciBjb21tdW5pY2F0aW5nIHdpdGggdGhlIHNlcnZlci4gUGxlYXNlIHRyeSBhZ2FpbiBsYXRlci5cIlxuICAgICAgICBlbHNlXG4gICAgICAgICAgJHNjb3BlLmF1dGhFcnJvciA9IFwiVW5hYmxlIHRvIGxvZyB5b3UgaW4uIFBsZWFzZSB0cnkgYWdhaW4uXCJcbiAgICAgICAgICBcbiAgICAgIGF1dGguZmluYWxseSAtPlxuICAgICAgICAkc2NvcGUuYXV0aGVudGljYXRpbmcgPSBmYWxzZVxuICBdIiwibW9kdWxlLmV4cG9ydHMgPVxuICB1cmw6IFwiL3Byb2ZpbGVcIlxuICB0ZW1wbGF0ZTogXCJcIlwiXG4gICAgPGRpdiBjbGFzcz1cInJvd1wiPlxuICAgICAgPGZvcm0gbm92YWxpZGF0ZSBjbGFzcz1cImNvbC14cy0xMlwiIG5nLXN1Ym1pdD1cInVwZGF0ZVVzZXIocHJvZmlsZSlcIiBuYW1lPVwidXNlckZvcm1cIj5cbiAgICAgICAgPGlucHV0IHR5cGU9XCJoaWRkZW5cIiBuZy1tb2RlbD1cInByb2ZpbGUucGljdHVyZV91cmxcIj5cbiAgICAgICAgPGRpdiBjbGFzcz1cImZvcm0tZ3JvdXAgY2xlYXJmaXhcIj5cbiAgICAgICAgICA8ZGl2IGNsYXNzPVwicm93XCI+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29sLXhzLTQgY29sLXNtLTMgY29sLW1kLTJcIiBuZy1jbGFzcz1cIntzZWxlY3RlZDogZXF1YWxzKHByb2ZpbGUucGljdHVyZV91cmwscGljdHVyZV91cmwpfVwiIG5nLXJlcGVhdD1cIihzZXJ2aWNlLCBwaWN0dXJlX3VybCkgaW4gdXNlckRhdGEucGljdHVyZV91cmxcIj5cbiAgICAgICAgICAgICAgPGEgbmctY2xpY2s9XCJwcm9maWxlLnBpY3R1cmVfdXJsPXBpY3R1cmVfdXJsXCIgY2xhc3M9XCJ0aHVtYm5haWxcIj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY3JvcC12ZXJ0aWNhbFwiPlxuICAgICAgICAgICAgICAgICAgPGltZyBuZy1zcmM9XCJ7e3BpY3R1cmVfdXJsLmJpZ2dlcn19XCIgc3R5bGU9XCJ3aWR0aDogMTAwJVwiIC8+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNhcHRpb25cIj57e3NlcnZpY2V9fTwvZGl2PlxuICAgICAgICAgICAgICA8L2E+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJmb3JtLWdyb3VwXCIgbmctY2xhc3M9XCJ7J2hhcy1lcnJvcic6dXNlckZvcm0ubmFtZS4kaW52YWxpZH1cIj5cbiAgICAgICAgICA8bGFiZWwgY2xhc3M9XCJjb250cm9sLWxhYmVsXCI+RnVsbCBuYW1lPC9sYWJlbD5cbiAgICAgICAgICA8ZGl2IGNsYXNzPVwiaW5wdXQtZ3JvdXBcIj5cbiAgICAgICAgICAgIDxpbnB1dCBjbGFzcz1cImZvcm0tY29udHJvbFwiIHR5cGU9XCJ0ZXh0XCIgcmVxdWlyZWQgbmctbWF4bGVuZ3RoPVwiMTAwXCIgbmFtZT1cIm5hbWVcIiBuZy1tb2RlbD1cInByb2ZpbGUubmFtZVwiIHBsYWNlaG9sZGVyPVwiRnVsbCBuYW1lXCI+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiaW5wdXQtZ3JvdXAtYnRuXCI+XG4gICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiYnRuIGJ0bi1kZWZhdWx0IGRyb3Bkb3duLXRvZ2dsZVwiIGRhdGEtdG9nZ2xlPVwiZHJvcGRvd25cIiBuZy1jbGFzcz1cIntkaXNhYmxlZDogIXVzZXJEYXRhLm5hbWV9XCI+XG4gICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJjYXJldFwiPjwvc3Bhbj5cbiAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgIDx1bCBjbGFzcz1cImRyb3Bkb3duLW1lbnUgcHVsbC1yaWdodFwiPlxuICAgICAgICAgICAgICAgIDxsaSBjbGFzcz1cImRyb3Bkb3duLWhlYWRlclwiIG5nLXJlcGVhdC1zdGFydD1cIih2YWx1ZSwgc2VydmljZXMpIGluIHVzZXJEYXRhLm5hbWUgdHJhY2sgYnkgdmFsdWVcIj5cbiAgICAgICAgICAgICAgICAgIHt7c2VydmljZXMgfCBqb2luOicsICd9fVxuICAgICAgICAgICAgICAgIDwvbGk+XG4gICAgICAgICAgICAgICAgPGxpIG5nLXJlcGVhdC1lbmQgbmctY2xhc3M9XCJ7YWN0aXZlOiBwcm9maWxlLm5hbWU9PXZhbHVlfVwiPlxuICAgICAgICAgICAgICAgICAgPGEgbmctY2xpY2s9XCJwcm9maWxlLm5hbWU9dmFsdWVcIj57e3ZhbHVlfX08L2E+XG4gICAgICAgICAgICAgICAgPC9saT5cbiAgICAgICAgICAgICAgPC91bD5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxwIGNsYXNzPVwiaGVscC1ibG9ja1wiPlxuICAgICAgICAgICAgPHNwYW4gbmctc2hvdz1cInVzZXJGb3JtLm5hbWUuJGVycm9yLnJlcXVpcmVkXCI+UmVxdWlyZWQgZmllbGQ8L3NwYW4+XG4gICAgICAgICAgICA8c3BhbiBuZy1zaG93PVwidXNlckZvcm0ubmFtZS4kZXJyb3IubWF4bGVuZ3RoXCI+Q2Fubm90IGV4Y2VlZCAxMDAgY2hhcmFjdGVyczwvc3Bhbj5cbiAgICAgICAgICA8L3A+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzPVwiZm9ybS1ncm91cCBwcm9maWxlLWRlc2NyaXB0aW9uXCIgbmctY2xhc3M9XCJ7J2hhcy1lcnJvcic6dXNlckZvcm0uZGVzY3JpcHRpb24uJGludmFsaWR9XCI+XG4gICAgICAgICAgPGxhYmVsIGNsYXNzPVwiY29udHJvbC1sYWJlbFwiPlF1aWNrIGRlc2NyaXB0aW9uIG9mIHlvdXJzZWxmPC9sYWJlbD5cbiAgICAgICAgICA8ZGl2IGNsYXNzPVwiaW5wdXQtZ3JvdXBcIj5cbiAgICAgICAgICAgIDx0ZXh0YXJlYSBjbGFzcz1cImZvcm0tY29udHJvbFwiIG5nLW1heGxlbmd0aD1cIjIwMFwiIHJvd3M9XCIyXCIgdHlwZT1cInRleHRcIiBuYW1lPVwiZGVzY3JpcHRpb25cIiBuZy1tb2RlbD1cInByb2ZpbGUuZGVzY3JpcHRpb25cIiBwbGFjZWhvbGRlcj1cIkZ1bGwgZGVzY3JpcHRpb25cIj48L3RleHRhcmVhPlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImlucHV0LWdyb3VwLWJ0blwiPlxuICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImJ0biBidG4tZGVmYXVsdCBkcm9wZG93bi10b2dnbGVcIiBkYXRhLXRvZ2dsZT1cImRyb3Bkb3duXCIgbmctY2xhc3M9XCJ7ZGlzYWJsZWQ6ICF1c2VyRGF0YS5kZXNjcmlwdGlvbn1cIj5cbiAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cImNhcmV0XCI+PC9zcGFuPlxuICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgPHVsIGNsYXNzPVwiZHJvcGRvd24tbWVudSBwdWxsLXJpZ2h0XCI+XG4gICAgICAgICAgICAgICAgPGxpIGNsYXNzPVwiZHJvcGRvd24taGVhZGVyXCIgbmctcmVwZWF0LXN0YXJ0PVwiKHZhbHVlLCBzZXJ2aWNlcykgaW4gdXNlckRhdGEuZGVzY3JpcHRpb24gdHJhY2sgYnkgdmFsdWVcIj5cbiAgICAgICAgICAgICAgICAgIHt7c2VydmljZXMgfCBqb2luOicsICd9fVxuICAgICAgICAgICAgICAgIDwvbGk+XG4gICAgICAgICAgICAgICAgPGxpIG5nLXJlcGVhdC1lbmQgbmctY2xhc3M9XCJ7YWN0aXZlOiBwcm9maWxlLmRlc2NyaXB0aW9uPT12YWx1ZX1cIj5cbiAgICAgICAgICAgICAgICAgIDxhIG5nLWNsaWNrPVwicHJvZmlsZS5kZXNjcmlwdGlvbj12YWx1ZVwiPnt7dmFsdWV9fTwvYT5cbiAgICAgICAgICAgICAgICA8L2xpPlxuICAgICAgICAgICAgICA8L3VsPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPHAgY2xhc3M9XCJoZWxwLWJsb2NrXCI+XG4gICAgICAgICAgICBDaGFyYWN0ZXJzIHJlbWFpbmluZzogPHN0cm9uZyBuZy1iaW5kPVwiMjAwIC0gdXNlckZvcm0uZGVzY3JpcHRpb24uJHZpZXdWYWx1ZS5sZW5ndGggfCBudW1iZXJcIj48L3N0cm9uZz4gKG1heGltdW0gMjAwKVxuICAgICAgICAgIDwvcD5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJmb3JtLWdyb3VwXCIgbmctY2xhc3M9XCJ7J2hhcy1lcnJvcic6dXNlckZvcm0uY29tcGFueS4kaW52YWxpZH1cIj5cbiAgICAgICAgICA8bGFiZWwgY2xhc3M9XCJjb250cm9sLWxhYmVsXCI+Q29tcGFueTwvbGFiZWw+XG4gICAgICAgICAgPGRpdiBjbGFzcz1cImlucHV0LWdyb3VwXCI+XG4gICAgICAgICAgICA8aW5wdXQgY2xhc3M9XCJmb3JtLWNvbnRyb2xcIiB0eXBlPVwidGV4dFwiIG5hbWU9XCJjb21wYW55XCIgbmctbWF4bGVuZ3RoPVwiMTAwXCIgbmctbW9kZWw9XCJwcm9maWxlLmNvbXBhbnlcIiBwbGFjZWhvbGRlcj1cIkNvbXBhbnlcIj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJpbnB1dC1ncm91cC1idG5cIj5cbiAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJidG4gYnRuLWRlZmF1bHQgZHJvcGRvd24tdG9nZ2xlXCIgZGF0YS10b2dnbGU9XCJkcm9wZG93blwiIG5nLWNsYXNzPVwie2Rpc2FibGVkOiAhdXNlckRhdGEuY29tcGFueX1cIj5cbiAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cImNhcmV0XCI+PC9zcGFuPlxuICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgPHVsIGNsYXNzPVwiZHJvcGRvd24tbWVudSBwdWxsLXJpZ2h0XCI+XG4gICAgICAgICAgICAgICAgPGxpIGNsYXNzPVwiZHJvcGRvd24taGVhZGVyXCIgbmctcmVwZWF0LXN0YXJ0PVwiKHZhbHVlLCBzZXJ2aWNlcykgaW4gdXNlckRhdGEuY29tcGFueSB0cmFjayBieSB2YWx1ZVwiPlxuICAgICAgICAgICAgICAgICAge3tzZXJ2aWNlcyB8IGpvaW46JywgJ319XG4gICAgICAgICAgICAgICAgPC9saT5cbiAgICAgICAgICAgICAgICA8bGkgbmctcmVwZWF0LWVuZCBuZy1jbGFzcz1cInthY3RpdmU6IHByb2ZpbGUuY29tcGFueT09dmFsdWV9XCI+XG4gICAgICAgICAgICAgICAgICA8YSBuZy1jbGljaz1cInByb2ZpbGUuY29tcGFueT12YWx1ZVwiPnt7dmFsdWV9fTwvYT5cbiAgICAgICAgICAgICAgICA8L2xpPlxuICAgICAgICAgICAgICA8L3VsPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPHAgY2xhc3M9XCJoZWxwLWJsb2NrXCI+XG4gICAgICAgICAgICA8c3BhbiBuZy1zaG93PVwidXNlckZvcm0uY29tcGFueS4kZXJyb3IubWF4bGVuZ3RoXCI+Q2Fubm90IGV4Y2VlZCAxMDAgY2hhcmFjdGVyczwvc3Bhbj5cbiAgICAgICAgICA8L3A+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzPVwiZm9ybS1ncm91cFwiIG5nLWNsYXNzPVwieydoYXMtZXJyb3InOnVzZXJGb3JtLndlYnNpdGVfdXJsLiRpbnZhbGlkfVwiPlxuICAgICAgICAgIDxsYWJlbCBjbGFzcz1cImNvbnRyb2wtbGFiZWxcIj5XZWJzaXRlIGFkZHJlc3M8L2xhYmVsPlxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJpbnB1dC1ncm91cFwiPlxuICAgICAgICAgICAgPGlucHV0IGNsYXNzPVwiZm9ybS1jb250cm9sXCIgdHlwZT1cInRleHRcIiBuYW1lPVwid2Vic2l0ZV91cmxcIiBuZy1tYXhsZW5ndGg9XCIyNTVcIiBuZy1tb2RlbD1cInByb2ZpbGUud2Vic2l0ZV91cmxcIiBwbGFjZWhvbGRlcj1cIldlYnNpdGVcIj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJpbnB1dC1ncm91cC1idG5cIj5cbiAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJidG4gYnRuLWRlZmF1bHQgZHJvcGRvd24tdG9nZ2xlXCIgZGF0YS10b2dnbGU9XCJkcm9wZG93blwiIG5nLWNsYXNzPVwie2Rpc2FibGVkOiAhdXNlckRhdGEud2Vic2l0ZV91cmx9XCI+XG4gICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJjYXJldFwiPjwvc3Bhbj5cbiAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgIDx1bCBjbGFzcz1cImRyb3Bkb3duLW1lbnUgcHVsbC1yaWdodFwiPlxuICAgICAgICAgICAgICAgIDxsaSBjbGFzcz1cImRyb3Bkb3duLWhlYWRlclwiIG5nLXJlcGVhdC1zdGFydD1cIih2YWx1ZSwgc2VydmljZXMpIGluIHVzZXJEYXRhLndlYnNpdGVfdXJsIHRyYWNrIGJ5IHZhbHVlXCI+XG4gICAgICAgICAgICAgICAgICB7e3NlcnZpY2VzIHwgam9pbjonLCAnfX1cbiAgICAgICAgICAgICAgICA8L2xpPlxuICAgICAgICAgICAgICAgIDxsaSBuZy1yZXBlYXQtZW5kIG5nLWNsYXNzPVwie2FjdGl2ZTogcHJvZmlsZS53ZWJzaXRlX3VybD09dmFsdWV9XCI+XG4gICAgICAgICAgICAgICAgICA8YSBuZy1jbGljaz1cInByb2ZpbGUud2Vic2l0ZV91cmw9dmFsdWVcIj57e3ZhbHVlfX08L2E+XG4gICAgICAgICAgICAgICAgPC9saT5cbiAgICAgICAgICAgICAgPC91bD5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxwIGNsYXNzPVwiaGVscC1ibG9ja1wiPlxuICAgICAgICAgICAgPHNwYW4gbmctc2hvdz1cInVzZXJGb3JtLndlYnNpdGVfdXJsLiRlcnJvci5tYXhsZW5ndGhcIj5DYW5ub3QgZXhjZWVkIDI1NSBjaGFyYWN0ZXJzPC9zcGFuPlxuICAgICAgICAgIDwvcD5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJmb3JtLWdyb3VwXCIgbmctY2xhc3M9XCJ7J2hhcy1lcnJvcic6dXNlckZvcm0ubG9jYXRpb24uJGludmFsaWR9XCI+XG4gICAgICAgICAgPGxhYmVsIGNsYXNzPVwiY29udHJvbC1sYWJlbFwiPkxvY2F0aW9uPC9sYWJlbD5cbiAgICAgICAgICA8ZGl2IGNsYXNzPVwiaW5wdXQtZ3JvdXBcIj5cbiAgICAgICAgICAgIDxpbnB1dCBjbGFzcz1cImZvcm0tY29udHJvbFwiIHR5cGU9XCJ0ZXh0XCIgbmFtZT1cImxvY2F0aW9uXCIgbmctbWF4bGVuZ3RoPVwiMTAwXCIgbmctbW9kZWw9XCJwcm9maWxlLmxvY2F0aW9uXCIgcGxhY2Vob2xkZXI9XCJMb2NhdGlvblwiPlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImlucHV0LWdyb3VwLWJ0blwiPlxuICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImJ0biBidG4tZGVmYXVsdCBkcm9wZG93bi10b2dnbGVcIiBkYXRhLXRvZ2dsZT1cImRyb3Bkb3duXCIgbmctY2xhc3M9XCJ7ZGlzYWJsZWQ6ICF1c2VyRGF0YS5sb2NhdGlvbn1cIj5cbiAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cImNhcmV0XCI+PC9zcGFuPlxuICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgPHVsIGNsYXNzPVwiZHJvcGRvd24tbWVudSBwdWxsLXJpZ2h0XCI+XG4gICAgICAgICAgICAgICAgPGxpIGNsYXNzPVwiZHJvcGRvd24taGVhZGVyXCIgbmctcmVwZWF0LXN0YXJ0PVwiKHZhbHVlLCBzZXJ2aWNlcykgaW4gdXNlckRhdGEubG9jYXRpb24gdHJhY2sgYnkgdmFsdWVcIj5cbiAgICAgICAgICAgICAgICAgIHt7c2VydmljZXMgfCBqb2luOicsICd9fVxuICAgICAgICAgICAgICAgIDwvbGk+XG4gICAgICAgICAgICAgICAgPGxpIG5nLXJlcGVhdC1lbmQgbmctY2xhc3M9XCJ7YWN0aXZlOiBwcm9maWxlLmxvY2F0aW9uPT12YWx1ZX1cIj5cbiAgICAgICAgICAgICAgICAgIDxhIG5nLWNsaWNrPVwicHJvZmlsZS5sb2NhdGlvbj12YWx1ZVwiPnt7dmFsdWV9fTwvYT5cbiAgICAgICAgICAgICAgICA8L2xpPlxuICAgICAgICAgICAgICA8L3VsPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPHAgY2xhc3M9XCJoZWxwLWJsb2NrXCI+XG4gICAgICAgICAgICA8c3BhbiBuZy1zaG93PVwidXNlckZvcm0ubG9jYXRpb24uJGVycm9yLm1heGxlbmd0aFwiPkNhbm5vdCBleGNlZWQgMTAwIGNoYXJhY3RlcnM8L3NwYW4+XG4gICAgICAgICAgPC9wPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGRpdiBjbGFzcz1cImZvcm0tZ3JvdXBcIj5cbiAgICAgICAgICA8YnV0dG9uIGNsYXNzPVwiYnRuIGJ0bi1wcmltYXJ5XCIgbmctZGlzYWJsZWQ9XCJ1c2VyRm9ybS4kaW52YWxpZFwiIHR5cGU9XCJzdWJtaXRcIj5VcGRhdGU8L2J1dHRvbj5cbiAgICAgICAgICA8YSBjbGFzcz1cImJ0biBidG4tZGFuZ2VyXCIgdWktc3JlZj1cImxhbmRpbmdcIj5DYW5jZWw8L2E+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9mb3JtPlxuICAgIDwvZGl2PlxuICBcIlwiXCJcbiAgY29udHJvbGxlcjogW1wiJHNjb3BlXCIsIFwiJHN0YXRlXCIsIFwib2F1dGhcIiwgXCJ1c2Vyc1wiLCBcInNlc3Npb25cIiwgXCJub3RpZmllclwiLCAoJHNjb3BlLCAkc3RhdGUsIG9hdXRoLCB1c2Vycywgc2Vzc2lvbiwgbm90aWZpZXIpIC0+XG4gICAgcmV0dXJuICRzdGF0ZS5nbyBcInVzZXIubG9naW5cIiB1bmxlc3Mgc2Vzc2lvbi51c2VyXG4gICAgXG4gICAgJHNjb3BlLnVzZXJEYXRhID0ge31cbiAgICAkc2NvcGUuZXF1YWxzID0gYW5ndWxhci5lcXVhbHNcbiAgICBcbiAgICBmb3IgaWRlbnRpdHkgaW4gc2Vzc2lvbi51c2VyLmlkZW50aXRpZXNcbiAgICAgIGZvciBmaWVsZCwgdmFsdWUgb2YgaWRlbnRpdHkgd2hlbiB2YWx1ZVxuICAgICAgICBzZXJ2aWNlTmFtZSA9IG9hdXRoLmdldFNlcnZpY2UoaWRlbnRpdHkuc2VydmljZSk/Lm5hbWVcbiAgICAgICAgXG4gICAgICAgICRzY29wZS51c2VyRGF0YVtmaWVsZF0gfHw9IHt9XG4gICAgICAgIFxuICAgICAgICBpZiBhbmd1bGFyLmlzT2JqZWN0KHZhbHVlKVxuICAgICAgICAgICRzY29wZS51c2VyRGF0YVtmaWVsZF1bc2VydmljZU5hbWVdID0gdmFsdWVcbiAgICAgICAgZWxzZVxuICAgICAgICAgICRzY29wZS51c2VyRGF0YVtmaWVsZF1bdmFsdWVdIHx8PSBbXVxuICAgICAgICAgICRzY29wZS51c2VyRGF0YVtmaWVsZF1bdmFsdWVdLnB1c2ggc2VydmljZU5hbWVcbiAgICBcbiAgICAkc2NvcGUucHJvZmlsZSA9IGFuZ3VsYXIuY29weShzZXNzaW9uLnVzZXIpXG4gICAgXG4gICAgJHNjb3BlLiR3YXRjaCBcInByb2ZpbGVcIiwgKHByb2ZpbGUpIC0+XG4gICAgICBjb25zb2xlLmxvZyBcIlByb2ZpbGVcIiwgcHJvZmlsZVxuICAgICwgdHJ1ZVxuICAgIFxuICAgICRzY29wZS51cGRhdGVVc2VyID0gKHVzZXJJbmZvKSAtPlxuICAgICAgc2Vzc2lvbi51c2VyW2ZpZWxkXSA9IHZhbHVlIGZvciBmaWVsZCwgdmFsdWUgb2YgdXNlckluZm9cbiAgICAgIHNlc3Npb24udXNlci5wdXQoKS50aGVuIC0+XG4gICAgICAgIG5vdGlmaWVyLnN1Y2Nlc3MgXCJVc2VyIHVwZGF0ZWRcIlxuICBdIiwicmVxdWlyZSBcIi4uL3NlcnZpY2VzL2dlb2NvZGVyLmNvZmZlZVwiXG5yZXF1aXJlIFwiLi4vc2VydmljZXMvZ2FwaS5jb2ZmZWVcIlxuXG5tb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSBcIm1ldHdvcmsuZGlyZWN0aXZlLmdtYXBcIiwgW1xuICBcIm1ldHdvcmsuc2VydmljZS5nZW9jb2RlclwiXG4gIFwibWV0d29yay5zZXJ2aWNlLmdhcGlcIlxuXVxuXG5tb2R1bGUuZGlyZWN0aXZlIFwibXdHbWFwXCIsIFsgXCIkaW50ZXJwb2xhdGVcIiwgXCJnZW9jb2RlclwiLCBcImdhcGlcIiwgKCRpbnRlcnBvbGF0ZSwgZ2VvY29kZXIsIGdhcGkpIC0+XG4gIHJlc3RyaWN0OiBcIkVcIlxuICByZXBsYWNlOiB0cnVlXG4gIHNjb3BlOlxuICAgIGFkZHJlc3M6IFwiPVwiXG4gICAgb25DbGlja01hcmtlcjogXCImXCJcbiAgICBvblVwZGF0ZUdlb2NvZGVSZXN1bHRzOiBcIiZcIlxuICB0ZW1wbGF0ZTogXCJcIlwiXG4gICAgPGRpdiBjbGFzcz1cIm1hcC1jYW52YXNcIiBzdHlsZT1cImhlaWdodDogMjAwcHhcIj48L2Rpdj5cbiAgXCJcIlwiXG4gIGxpbms6ICgkc2NvcGUsICRlbGVtZW50LCAkYXR0cnMpIC0+XG4gICAgbWFya2VycyA9IFtdXG4gICAgXG4gICAgZ2FwaS5sb2FkTWFwcygpLnRoZW4gLT5cbiAgICAgIGdvb2dsZS5tYXBzLnZpc3VhbFJlZnJlc2ggPSB0cnVlXG4gICAgICBcbiAgICAgIGdtYXAgPSBuZXcgZ29vZ2xlLm1hcHMuTWFwICRlbGVtZW50WzBdLFxuICAgICAgICB6b29tOiA4XG4gICAgICAgIG1hcFR5cGVJZDogZ29vZ2xlLm1hcHMuTWFwVHlwZUlkLlJPQURNQVBcbiAgICAgICAgbWFwVHlwZUNvbnRyb2w6IGZhbHNlXG4gICAgICAgIHN0cmVldFZpZXdDb250cm9sOiBmYWxzZVxuICAgICAgICBcbiAgICAgICRzY29wZS4kd2F0Y2ggXCJhZGRyZXNzXCIsIChhZGRyZXNzKSAtPlxuICAgICAgICBtYXJrZXIuc2V0TWFwKG51bGwpIHdoaWxlIG1hcmtlciA9IG1hcmtlcnMucG9wKClcbiAgICAgICAgXG4gICAgICAgIGlmIGFkZHJlc3MgdGhlbiBnZW9jb2Rlci5nZW9jb2RlKGFkZHJlc3MpLnRoZW4gKHJlc3VsdHMpIC0+XG4gICAgICAgICAgYm91bmRzID0gbmV3IGdvb2dsZS5tYXBzLkxhdExuZ0JvdW5kc1xuICAgICAgICAgIFxuICAgICAgICAgIGZvciByZXN1bHQgaW4gcmVzdWx0cyB0aGVuIGRvIChyZXN1bHQpIC0+XG4gICAgICAgICAgICBsYXRsbmcgPSBuZXcgZ29vZ2xlLm1hcHMuTGF0TG5nKHJlc3VsdC5wb3NpdGlvbi5sYXQsIHJlc3VsdC5wb3NpdGlvbi5sb24pXG4gICAgICAgICAgICBtYXJrZXJzLnB1c2ggbWFya2VyID0gbmV3IGdvb2dsZS5tYXBzLk1hcmtlclxuICAgICAgICAgICAgICBtYXA6IGdtYXBcbiAgICAgICAgICAgICAgcG9zaXRpb246IGxhdGxuZ1xuICAgICAgICAgICAgICB0aXRsZTogcmVzdWx0LmZvcm1hdHRlZF9hZGRyZXNzXG4gICAgICAgICAgICAgIFxuICAgICAgICAgICAgYm91bmRzLmV4dGVuZCBsYXRsbmdcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgZ29vZ2xlLm1hcHMuZXZlbnQuYWRkTGlzdGVuZXIgbWFya2VyLCAnY2xpY2snLCAtPlxuICAgICAgICAgICAgICAkc2NvcGUuJGFwcGx5IC0+XG4gICAgICAgICAgICAgICAgJHNjb3BlLm9uQ2xpY2tNYXJrZXIocmVzdWx0KVxuICAgICAgICAgIFxuICAgICAgICAgIGdtYXAuZml0Qm91bmRzIGJvdW5kc1xuICAgICAgICAgIGdtYXAuc2V0Wm9vbSAxNSBpZiBnbWFwLmdldFpvb20oKSA+IDE1XG5dIiwicmVxdWlyZSBcIi4uL3NlcnZpY2VzL2dlb2NvZGVyLmNvZmZlZVwiXG5cbm1vZHVsZSA9IGFuZ3VsYXIubW9kdWxlIFwibWV0d29yay5kaXJlY3RpdmUubG9jYXRpb25cIiwgW1xuICBcIm1ldHdvcmsuc2VydmljZS5nZW9jb2RlclwiXG5dXG5cblxubW9kdWxlLmRpcmVjdGl2ZSBcIm13TG9jYXRpb25cIiwgWyBcImdlb2NvZGVyXCIsIChnZW9jb2RlcikgLT5cbiAgcmVxdWlyZTogXCI/bmdNb2RlbFwiXG4gIGxpbms6ICgkc2NvcGUsICRlbGVtZW50LCAkYXR0cnMsIG1vZGVsKSAtPlxuICAgIHJldHVybiB1bmxlc3MgbW9kZWxcbiAgICBcbiAgICBcbl0iLCJyZXF1aXJlIFwiLi4vc2VydmljZXMvZ2VvbG9jYXRpb24uY29mZmVlXCJcblxuXG5tb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSBcIm1ldHdvcmsuc2VydmljZS5iYWNrZW5kXCIsIFtcbiAgXCJyZXN0YW5ndWxhclwiXG4gIFxuICBcIm1ldHdvcmsuc2VydmljZS5nZW9sb2NhdGlvblwiXG5dXG5cbm1vZHVsZS5jb25maWcgWyBcIlJlc3Rhbmd1bGFyUHJvdmlkZXJcIiwgKFJlc3Rhbmd1bGFyUHJvdmlkZXIpIC0+XG4gIFJlc3Rhbmd1bGFyUHJvdmlkZXIuc2V0QmFzZVVybCBcImh0dHBzOi8vbWV0d29yay1hcGktYzktZ2dvb2RtYW4uYzkuaW9cIlxuICBSZXN0YW5ndWxhclByb3ZpZGVyLnNldFJlc3Rhbmd1bGFyRmllbGRzIGlkOiBcIl9pZFwiXG4gIFJlc3Rhbmd1bGFyUHJvdmlkZXIuc2V0UmVzcG9uc2VFeHRyYWN0b3IgKHJlc3BvbnNlLCBvcGVyYXRpb24pIC0+IHJlc3BvbnNlLmRhdGFcbl1cblxubW9kdWxlLmZhY3RvcnkgXCJ1c2Vyc1wiLCBbIFwiUmVzdGFuZ3VsYXJcIiwgKFJlc3Rhbmd1bGFyKSAtPlxuICBSZXN0YW5ndWxhci5leHRlbmRNb2RlbCBcInVzZXJzXCIsIChtb2RlbCkgLT5cbiAgICBtb2RlbC5hZGRJZGVudGl0eSA9IChpZGVudGl0eSkgLT5cbiAgICAgIEBhbGwoXCJpZGVudGl0aWVzXCIpLnBvc3QoaWRlbnRpdHkpXG4gICAgXG4gICAgbW9kZWwuaGFzSWRlbnRpdHkgPSAoaWRlbnRpdHkpIC0+XG4gICAgICAhIV8uZmluZCBAaWRlbnRpdGllcywgKGlkZW50KSAtPiBpZGVudC5zZXJ2aWNlIGlzIGlkZW50aXR5LnNlcnZpY2UgYW5kIChub3QgaWRlbnRpdHkudXNlcl9pZD8gb3IgaWRlbnQudXNlcl9pZCBpcyBpZGVudGl0eS51c2VyX2lkKVxuICAgICAgICBcbiAgICBtb2RlbFxuICBcbiAgVXNlcnNDb25maWcgPSBSZXN0YW5ndWxhci53aXRoQ29uZmlnIChjb25maWcpIC0+XG4gICMgIGNvbmZpZy5zZXRQYXJlbnRsZXNzIHRydWVcbiAgICBcbiAgVXNlcnMgPSBVc2Vyc0NvbmZpZy5hbGwoXCJ1c2Vyc1wiKVxuICBcbiAgd3JhcDogKGpzb24pIC0+IFVzZXJzQ29uZmlnLnJlc3Rhbmd1bGFyaXplRWxlbWVudChudWxsLCBqc29uLCBcInVzZXJzXCIpXG4gIFxuICBjcmVhdGU6IChqc29uKSAtPiBVc2Vycy5wb3N0KGpzb24pXG5dXG5cbm1vZHVsZS5mYWN0b3J5IFwiZXZlbnRzXCIsIFsgXCIkcVwiLCBcIlJlc3Rhbmd1bGFyXCIsIFwibG9jYXRpb25cIiwgKCRxLCBSZXN0YW5ndWxhciwgbG9jYXRpb24pIC0+XG4gIFJlc3Rhbmd1bGFyLmV4dGVuZE1vZGVsIFwiZXZlbnRzXCIsIChtb2RlbCkgLT5cbiAgICAgICAgXG4gICAgbW9kZWxcbiAgXG4gIEV2ZW50c0NvbmZpZyA9IFJlc3Rhbmd1bGFyLndpdGhDb25maWcgKGNvbmZpZykgLT5cbiAgIyAgY29uZmlnLnNldFBhcmVudGxlc3MgdHJ1ZVxuICBcbiAgZmluZEJ5Q29kZTogKGNvZGUpIC0+IEV2ZW50c0NvbmZpZy5vbmUoXCJldmVudHNcIiwgY29kZSkuZ2V0KClcbiAgXG4gIGZpbmROZWFyYnk6IC0+IFxuICAgIHJldHVybiAkcS5yZWplY3QoXCJVbmFibGUgdG8gZGV0ZXJtaW5lIHlvdXIgbG9jYXRpb25cIikgdW5sZXNzIGxvY2F0aW9uLnBvc2l0aW9uXG4gICAgXG4gICAgRXZlbnRzQ29uZmlnLmFsbChcImV2ZW50c1wiKS5jdXN0b21HRVRMSVNUKFwibmVhcmJ5XCIsIGxhdDogbG9jYXRpb24ucG9zaXRpb24ubGF0LCBsb246IGxvY2F0aW9uLnBvc2l0aW9uLmxvbikudGhlbiAoZXZlbnRzKSAtPlxuICAgICAgRXZlbnRzQ29uZmlnLnJlc3Rhbmd1bGFyaXplQ29sbGVjdGlvbihudWxsLCBldmVudHMsIFwiZXZlbnRzXCIpXG5cbiAgY3JlYXRlOiAoanNvbikgLT4gRXZlbnRzQ29uZmlnLmFsbChcImV2ZW50c1wiKS5wb3N0KGpzb24pXG5dXG4iLCJyZXF1aXJlIFwiLi4vc2VydmljZXMvZ2FwaS5jb2ZmZWVcIlxuXG5tb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSBcIm1ldHdvcmsuc2VydmljZS5nZW9jb2RlclwiLCBbXG4gIFwibWV0d29yay5zZXJ2aWNlLmdhcGlcIlxuXVxuXG5tb2R1bGUuZmFjdG9yeSBcImdlb2NvZGVyXCIsIFsgXCIkcVwiLCBcIiRyb290U2NvcGVcIiwgXCIkdGltZW91dFwiLCBcImdhcGlcIiwgKCRxLCAkcm9vdFNjb3BlLCAkdGltZW91dCwgZ2FwaSkgLT5cbiAgZ2VvY29kZXIgPSBudWxsXG4gIFxuICBjYWNoZSA9IHt9XG4gIFxuICBpc3N1ZVJlcXVlc3QgPSAocmVxdWVzdCkgLT5cbiAgICBnZW9jb2RlciB8fD0gbmV3IGdvb2dsZS5tYXBzLkdlb2NvZGVyKClcbiAgICBkZmQgPSAkcS5kZWZlcigpXG4gICAgXG4gICAgZ2VvY29kZXIuZ2VvY29kZSByZXF1ZXN0LCAocmVzdWx0cywgc3RhdHVzKSAtPiAkcm9vdFNjb3BlLiRhcHBseSAtPlxuICAgICAgaWYgc3RhdHVzID09IGdvb2dsZS5tYXBzLkdlb2NvZGVyU3RhdHVzLk9LXG4gICAgICAgICNjYWNoZVtyZXN1bHQuZm9ybWF0dGVkX2FkZHJlc3NdID0gW3Jlc3VsdF0gZm9yIHJlc3VsdCwgaWR4IGluIHJlc3VsdHNcbiAgICAgICAgI2NhY2hlW2FkZHJlc3NdID0gcmVzdWx0c1xuICAgICAgICBcbiAgICAgICAgcmV0dXJuIGRmZC5yZXNvbHZlIF8ubWFwIHJlc3VsdHMsIChyZXN1bHQpIC0+XG4gICAgICAgICAgYWRkcmVzczogcmVzdWx0LmZvcm1hdHRlZF9hZGRyZXNzXG4gICAgICAgICAgcG9zaXRpb246XG4gICAgICAgICAgICBsYXQ6IHJlc3VsdC5nZW9tZXRyeS5sb2NhdGlvbi5sYXQoKVxuICAgICAgICAgICAgbG9uOiByZXN1bHQuZ2VvbWV0cnkubG9jYXRpb24ubG5nKClcbiAgICAgIGVsc2UgaWYgc3RhdHVzID09IGdvb2dsZS5tYXBzLkdlb2NvZGVyU3RhdHVzLlpFUk9fUkVTVUxUUyB0aGVuIHJldHVybiBkZmQucmVqZWN0KFwiQWRkcmVzcyBub3QgZm91bmRcIilcbiAgICAgIGVsc2UgaWYgc3RhdHVzID09IGdvb2dsZS5tYXBzLkdlb2NvZGVyU3RhdHVzLlFVRVJZX09WRVJfTElNSVQgdGhlbiByZXR1cm4gZGZkLnJlamVjdChcIkdlb2NvZGluZyBxdW90YSBleGNlZWRlZFwiKVxuICAgICAgZWxzZSBpZiBzdGF0dXMgPT0gZ29vZ2xlLm1hcHMuR2VvY29kZXJTdGF0dXMuUkVRVUVTVF9ERU5JRUQgdGhlbiByZXR1cm4gZGZkLnJlamVjdChcIkdlb2NvZGluZyByZXF1ZXN0IGRlbmllZFwiKVxuICAgICAgZWxzZSBpZiBzdGF0dXMgPT0gZ29vZ2xlLm1hcHMuR2VvY29kZXJTdGF0dXMuSU5WQUxJRF9SRVFVRVNUXG4gICAgICAgIGRmZC5yZWplY3QoXCJHZW9jb2RpbmcgcXVvdGEgZXhjZWVkZWRcIilcbiAgICAgICAgY29uc29sZS5lcnJvcihcIkludmFsaWQgZ2VvY29kaW5nIHJlcXVlc3Q6XCIsIHJlcXVlc3QpXG4gICAgICBlbHNlXG4gICAgICAgIGRmZC5yZWplY3QoXCJVbmtub3duIGdlb2NvZGluZyBlcnJvclwiKVxuICAgICAgICBjb25zb2xlLmVycm9yKFwiVW5rbm93biBnZW9jb2RpbmcgZXJyb3JcIiwgcmVzdWx0cywgc3RhdHVzKVxuICAgIFxuICAgIGRmZC5wcm9taXNlIFxuXG4gIGdlb2NvZGU6IChhZGRyZXNzKSAtPlxuICAgIGdhcGkubG9hZE1hcHMoKS50aGVuIC0+XG4gICAgICBpc3N1ZVJlcXVlc3QgYWRkcmVzczogYWRkcmVzc1xuICBcbiAgcmV2ZXJzZUdlb2NvZGU6IChsYXQsIGxvbikgLT5cbiAgICBnYXBpLmxvYWRNYXBzKCkudGhlbiAtPlxuICAgICAgaXNzdWVSZXF1ZXN0IGxhdExuZzogbmV3IGdvb2dsZS5tYXBzLkxhdExuZyhsYXQsIGxvbilcbiAgICBcbl0iLCJyZXF1aXJlIFwiLi4vc2VydmljZXMvZ2FwaS5jb2ZmZWVcIlxuXG5tb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSBcIm1ldHdvcmsuc2VydmljZS5nZW9sb2NhdGlvblwiLCBbXG4gIFwibWV0d29yay5zZXJ2aWNlLmdhcGlcIlxuXVxuXG5tb2R1bGUuZmFjdG9yeSBcImdlb2xvY2F0b3JcIiwgWyBcIiRxXCIsIFwiJHJvb3RTY29wZVwiLCBcIiR0aW1lb3V0XCIsIFwiJGh0dHBcIiwgKCRxLCAkcm9vdFNjb3BlLCAkdGltZW91dCwgJGh0dHApIC0+XG4gIGdlb2xvY2F0ZTogLT5cbiAgICBkZmQgPSAkcS5kZWZlcigpXG4gIFxuICAgIGlmIG5hdmlnYXRvci5nZW9sb2NhdGlvblxuICAgICAgbmF2aWdhdG9yLmdlb2xvY2F0aW9uLmdldEN1cnJlbnRQb3NpdGlvbiAocG9zaXRpb24pIC0+XG4gICAgICAgICRyb290U2NvcGUuJGFwcGx5IC0+IGRmZC5yZXNvbHZlXG4gICAgICAgICAgbGF0OiBwb3NpdGlvbi5jb29yZHMubGF0aXR1ZGVcbiAgICAgICAgICBsb246IHBvc2l0aW9uLmNvb3Jkcy5sb25naXR1ZGVcbiAgICAgICAgICBhY2N1cmFjeTogcG9zaXRpb24uY29vcmRzLmFjY3VyYWN5XG4gICAgICAsIChlcnIpIC0+XG4gICAgICAgIFxuICAgICAgICBpZiBnb29nbGUubG9hZGVyPy5DbGllbnRMb2NhdGlvbj8gdGhlbiAkcm9vdFNjb3BlLiRhcHBseSAtPiBkZmQucmVzb2x2ZVxuICAgICAgICAgIGxhdDogZ29vZ2xlLmxvYWRlci5DbGllbnRMb2NhdGlvbi5sYXRpdHVkZVxuICAgICAgICAgIGxvbjogZ29vZ2xlLmxvYWRlci5DbGllbnRMb2NhdGlvbi5sb25naXR1ZGVcbiAgICAgICAgICBhY2N1cmFjeTogMTAwMCAqIDEwMDAgIyAxLDAwMCBrbSBtYWdpYyB2YWx1ZVxuICAgICAgICBlbHNlICRyb290U2NvcGUuJGFwcGx5IC0+IGRmZC5yZWplY3QgXCJVbmFibGUgdG8gZ2V0IGxvY2F0aW9uXCJcbiAgICAgICwgdGltZW91dDogMTAgKiAxMDAwXG4gICAgXG4gICAgZGZkLnByb21pc2Vcbl1cbiIsInJlcXVpcmUgXCIuLi9zZXJ2aWNlcy9nZW9sb2NhdGlvbi5jb2ZmZWVcIlxucmVxdWlyZSBcIi4uL3NlcnZpY2VzL2dlb2NvZGVyLmNvZmZlZVwiXG5cblxubW9kdWxlID0gYW5ndWxhci5tb2R1bGUgXCJtZXR3b3JrLnNlcnZpY2UubG9jYXRpb25cIiwgW1xuICBcIm1ldHdvcmsuc2VydmljZS5nZW9sb2NhdGlvblwiXG4gIFwibWV0d29yay5zZXJ2aWNlLmdlb2NvZGVyXCJcbl1cblxubW9kdWxlLmZhY3RvcnkgXCJsb2NhdGlvblwiLCBbIFwiZ2VvbG9jYXRvclwiLCBcImdlb2NvZGVyXCIsIChnZW9sb2NhdG9yLCBnZW9jb2RlcikgLT5cbiAgXG4gIHBvc2l0aW9uOiBudWxsXG4gIGFkZHJlc3M6IG51bGxcbiAgXG4gIGNvbmZpcm1lZEFkZHJlc3M6IGZhbHNlXG4gIGNvbmZpcm1lZFBvc2l0aW9uOiBmYWxzZVxuICBcbiAgY29uZmlybUFkZHJlc3M6IChAYWRkcmVzcykgLT4gQGNvbmZpcm1lZEFkZHJlc3MgPSB0cnVlXG4gIGNvbmZpcm1Qb3NpdGlvbjogKEBwb3NpdGlvbikgLT5cbiAgICBAY29uZmlybWVkUG9zaXRpb24gPSB0cnVlXG4gICAgQHBvc2l0aW9uLmFjY3VyYWN5ID0gMTAgIyBNYWdpYyBudW1iZXJcbiAgXG4gIGxvY2F0ZTogLT5cbiAgICBzZXJ2aWNlID0gQFxuICAgIFxuICAgIGdlb2xvY2F0b3IuZ2VvbG9jYXRlKCkudGhlbiAocG9zaXRpb24pIC0+XG4gICAgICBjb25zb2xlLmxvZyBcIkxvY2F0aW9uXCIsIHBvc2l0aW9uXG4gICAgICBzZXJ2aWNlLnBvc2l0aW9uID0gcG9zaXRpb25cbiAgICAgIHNlcnZpY2VcbiAgICAsIC0+XG4gICAgICBzZXJ2aWNlLnBvc2l0aW9uID1cbiAgICAgICAgbGF0OiA0NS41XG4gICAgICAgIGxvbjogNzMuNTY2N1xuICAgICAgICBhY2N1cmFjeTogMTAwMDBcbiAgICAgIHNlcnZpY2Vcbl0iLCJyZXF1aXJlIFwiLi4vc2VydmljZXMvbm90aWZpZXIuY29mZmVlXCJcblxubW9kdWxlID0gYW5ndWxhci5tb2R1bGUgXCJtZXR3b3JrLnNlcnZpY2Uub2F1dGhcIiwgW1xuICBcIm1ldHdvcmsuc2VydmljZS5ub3RpZmllclwiXG5dXG5cbm1vZHVsZS5jb25maWcgWyBcIlJlc3Rhbmd1bGFyUHJvdmlkZXJcIiwgKFJlc3Rhbmd1bGFyUHJvdmlkZXIpIC0+XG4gIFJlc3Rhbmd1bGFyUHJvdmlkZXIuc2V0QmFzZVVybChcImh0dHBzOi8vbWV0d29yay1hcGktYzktZ2dvb2RtYW4uYzkuaW9cIilcbl1cblxubW9kdWxlLmZhY3RvcnkgXCJvYXV0aFwiLCBbIFwiJHdpbmRvd1wiLCBcIiRyb290U2NvcGVcIiwgXCIkcVwiLCBcIiR0aW1lb3V0XCIsIFwibm90aWZpZXJcIiwgKCR3aW5kb3csICRyb290U2NvcGUsICRxLCAkdGltZW91dCwgbm90aWZpZXIpIC0+XG4gIFxuICBtZXNzYWdlSGFuZGxlciA9IG51bGxcbiAgXG4gIGhhbmRsZVBvc3RNZXNzYWdlID0gKGV2ZW50KSAtPlxuICAgIGlmIG1lc3NhZ2VIYW5kbGVyXG4gICAgICB0cnlcbiAgICAgICAgbWVzc2FnZUhhbmRsZXI/KEpTT04ucGFyc2UoZXZlbnQuZGF0YSkpXG4gICAgICBjYXRjaCBlXG4gICAgICAgIGNvbnNvbGUubG9nIFwiW0VSUl0gSlNPTi5wYXJzZVwiLCBlXG4gICAgICAgIFxuICByZWdpc3Rlck1lc3NhZ2VIYW5kbGVyID0gKGhhbmRsZXIpIC0+IG1lc3NhZ2VIYW5kbGVyID0gaGFuZGxlclxuICBcbiAgJHdpbmRvdy5hZGRFdmVudExpc3RlbmVyIFwibWVzc2FnZVwiLCBoYW5kbGVQb3N0TWVzc2FnZSwgZmFsc2VcbiAgXG4gIFxuICBpZGVudGl0aWVzOiB7fVxuICBcbiAgY2xlYXJJZGVudGl0aWVzOiAtPiBhbmd1bGFyLmNvcHkoe30sIEBpZGVudGl0aWVzKVxuICBnZXRJZGVudGl0eTogKHNlcnZpY2UpIC0+IEBpZGVudGl0aWVzW3NlcnZpY2VdXG4gIGhhc0lkZW50aXR5OiAoc2VydmljZSkgLT4gISFAZ2V0SWRlbnRpdHkoc2VydmljZSlcbiAgZ2V0SWRlbnRpdGllczogLT4gQGlkZW50aXRpZXNcbiAgXG4gIGJ1aWxkUHJvZmlsZTogLT5cbiAgICBvcmRlciA9IFxuICAgICAgbmFtZTogW1wibGlua2VkaW5cIiwgXCJnb29nbGVcIiwgXCJmYWNlYm9va1wiLCBcInR3aXR0ZXJcIiwgXCJnaXRodWJcIiwgXCJtZWV0dXBcIiwgXCJldmVudGJyaXRlXCJdXG4gICAgICBkZXNjcmlwdGlvbjogW1wibGlua2VkaW5cIiwgXCJ0d2l0dGVyXCIsIFwiZ29vZ2xlXCIsIFwiZmFjZWJvb2tcIiwgXCJnaXRodWJcIiwgXCJtZWV0dXBcIiwgXCJldmVudGJyaXRlXCJdXG4gICAgICBjb21wYW55OiBbXCJsaW5rZWRpblwiLCBcInR3aXR0ZXJcIiwgXCJnb29nbGVcIiwgXCJmYWNlYm9va1wiLCBcImdpdGh1YlwiLCBcIm1lZXR1cFwiLCBcImV2ZW50YnJpdGVcIl1cbiAgICAgIGxvY2F0aW9uOiBbXCJsaW5rZWRpblwiLCBcInR3aXR0ZXJcIiwgXCJnb29nbGVcIiwgXCJmYWNlYm9va1wiLCBcImdpdGh1YlwiLCBcIm1lZXR1cFwiLCBcImV2ZW50YnJpdGVcIl1cbiAgICAgIHdlYnNpdGVfdXJsOiBbXCJsaW5rZWRpblwiLCBcInR3aXR0ZXJcIiwgXCJnb29nbGVcIiwgXCJmYWNlYm9va1wiLCBcImdpdGh1YlwiLCBcIm1lZXR1cFwiLCBcImV2ZW50YnJpdGVcIl1cbiAgICAgIHBpY3R1cmVfdXJsOiBbXCJsaW5rZWRpblwiLCBcImdvb2dsZVwiLCBcImZhY2Vib29rXCIsIFwidHdpdHRlclwiLCBcImdpdGh1YlwiLCBcIm1lZXR1cFwiLCBcImV2ZW50YnJpdGVcIl1cbiAgICBcbiAgICBwcm9maWxlID0ge31cbiAgICBcbiAgICBmb3IgZmllbGQsIGZpZWxkT3JkZXIgb2Ygb3JkZXJcbiAgICAgIGZvciBzZXJ2aWNlIGluIGZpZWxkT3JkZXJcbiAgICAgICAgYnJlYWsgaWYgcHJvZmlsZVtmaWVsZF0gfHw9IEBnZXRJZGVudGl0eShzZXJ2aWNlKT9bZmllbGRdXG4gICAgXG4gICAgI3Byb2ZpbGUuZW1haWxzID0gXy5yZWR1Y2VSaWdodCBAZ2V0SWRlbnRpdGllcygpLCAoZW1haWxzLCBwcm9maWxlKSAtPlxuICAgICMgIGVtYWlscy5wdXNoKGVtYWlsKSBmb3IgZW1haWwgaW4gcHJvZmlsZS5wcm9maWxlLmVtYWlscyB3aGVuIGVtYWlsIG5vdCBpbiBlbWFpbHMgaWYgcHJvZmlsZS5wcm9maWxlLmVtYWlsc1xuICAgICMgIGVtYWlsc1xuICAgICMsIFtdXG4gICAgXG4gICAgcHJvZmlsZVxuICBcbiAgYXV0aFRvOiAoc2VydmljZSwgd2lkdGggPSAxMDAwLCBoZWlnaHQgPSA3NTApIC0+XG4gICAgcmV0dXJuICRxLndoZW4oaWRlbnRpdHkpIGlmIGlkZW50aXR5ID0gQGdldElkZW50aXR5KHNlcnZpY2UpXG4gICAgXG4gICAgc2Vzc2lvbiA9IEBcbiAgICBkZmQgPSAkcS5kZWZlcigpXG4gICAgcmVzb2x2ZWQgPSBmYWxzZVxuICAgIHNjcmVlbkhlaWdodCA9IHNjcmVlbi5oZWlnaHRcbiAgICBsZWZ0ID0gTWF0aC5yb3VuZCgoc2NyZWVuLndpZHRoIC8gMikgLSAod2lkdGggLyAyKSlcbiAgICB0b3AgPSAwXG4gICAgdG9wID0gTWF0aC5yb3VuZCgoc2NyZWVuSGVpZ2h0IC8gMikgLSAoaGVpZ2h0IC8gMikpIGlmIChzY3JlZW5IZWlnaHQgPiBoZWlnaHQpXG4gICAgXG4gICAgYXV0aFdpbmRvdyA9IHdpbmRvdy5vcGVuIFwiL2F1dGgvI3tzZXJ2aWNlfVwiLCBcIm13LWF1dGhcIiwgXCJcIlwiXG4gICAgICBsZWZ0PSN7bGVmdH0sdG9wPSN7dG9wfSx3aWR0aD0je3dpZHRofSxoZWlnaHQ9I3toZWlnaHR9LHBlcnNvbmFsYmFyPTAsdG9vbGJhcj0wLHNjcm9sbGJhcnM9MSxyZXNpemFibGU9MVxuICAgIFwiXCJcIlxuICAgIFxuICAgIGF1dGhXaW5kb3cuZm9jdXMoKVxuICAgIFxuICAgIHRpbWVvdXQgPSAkdGltZW91dCAtPlxuICAgICAgcmVzb2x2ZWQgPSB0cnVlXG4gICAgICBcbiAgICAgIGNsZWFySW50ZXJ2YWwoaW50ZXJ2YWwpXG4gICAgICBcbiAgICAgIGRmZC5yZWplY3QoXCJMb2dpbiB0aW1lZCBvdXRcIilcbiAgICAgIG51bGxcbiAgICAsIDEwMDAgKiA2MCAqIDIgIyAyIG1pbnV0ZSB0aW1lb3V0XG4gICAgXG4gICAgaW50ZXJ2YWwgPSBzZXRJbnRlcnZhbCAtPlxuICAgICAgaWYgIWF1dGhXaW5kb3cgb3IgYXV0aFdpbmRvdy5jbG9zZWQgIT0gZmFsc2VcbiAgICAgICAgcmVzb2x2ZWQgPSB0cnVlXG4gICAgICAgIGF1dGhXaW5kb3cgPSBudWxsXG4gICAgICBcbiAgICAgICAgY2xlYXJJbnRlcnZhbChpbnRlcnZhbClcbiAgICAgICAgJHRpbWVvdXQuY2FuY2VsKHRpbWVvdXQpXG4gICAgICAgIFxuICAgICAgICAkcm9vdFNjb3BlLiRhcHBseSAtPiBkZmQucmVqZWN0KFwiQXV0aCB3aW5kb3cgY2xvc2VkIHdpdGhvdXQgbG9nZ2luZyBpblwiKVxuICAgICwgMjAwXG4gICAgXG4gICAgcmVnaXN0ZXJNZXNzYWdlSGFuZGxlciAoZXZlbnQpIC0+XG4gICAgICByZXR1cm4gaWYgcmVzb2x2ZWRcbiAgICAgIFxuICAgICAgaWYgZXZlbnQuZXZlbnQgaXMgXCJhdXRoXCJcbiAgICAgICAgc2Vzc2lvbi5pZGVudGl0aWVzW2V2ZW50Lm1lc3NhZ2Uuc2VydmljZV0gPSBldmVudC5tZXNzYWdlXG4gICAgICAgIFxuICAgICAgICBjb25zb2xlLmxvZyBcIk9BdXRoXCIsIGV2ZW50Lm1lc3NhZ2VcbiAgICAgICAgXG4gICAgICAgICRyb290U2NvcGUuJGFwcGx5IC0+IGRmZC5yZXNvbHZlKGV2ZW50Lm1lc3NhZ2UpXG4gICAgICBlbHNlIGlmIGV2ZW50LmV2ZW50IGlzIFwiYXV0aF9lcnJvclwiXG4gICAgICAgIG5vdGlmaWVyLmVycm9yIFwiTG9naW4gZmFpbGVkXCJcbiAgICAgICAgY29uc29sZS5lcnJvciBcIkxvZ2luIGZhaWxlZFwiLCBldmVudC5tZXNzYWdlXG4gICAgICAgIFxuICAgICAgICAkcm9vdFNjb3BlLiRhcHBseSAtPiBkZmQucmVqZWN0KGV2ZW50Lm1lc3NhZ2UpXG4gICAgXG4gICAgZGZkLnByb21pc2VcbiAgXG4gIGdldFNlcnZpY2U6IChpZCkgLT4gcmV0dXJuIHNlcnZpY2UgZm9yIHNlcnZpY2UgaW4gQHNlcnZpY2VzIHdoZW4gc2VydmljZS5pZCBpcyBpZFxuICBcbiAgc2VydmljZXM6IFtcbiAgICBpZDogXCJsaW5rZWRpblwiXG4gICAgbmFtZTogXCJMaW5rZWRJblwiXG4gICAgaWNvbkNsYXNzOiBcImljb24tbGlua2VkaW5cIlxuICAgIGltYWdlOiBcIi9pbWcvb2F1dGgvbGlua2VkaW4uaWNvXCJcbiAgLFxuICAgIGlkOiBcImZhY2Vib29rXCJcbiAgICBuYW1lOiBcIkZhY2Vib29rXCJcbiAgICBpY29uQ2xhc3M6IFwiaWNvbi1mYWNlYm9va1wiXG4gICAgaW1hZ2U6IFwiL2ltZy9vYXV0aC9mYWNlYm9vay5pY29cIlxuICAsXG4gICAgaWQ6IFwiZ2l0aHViXCJcbiAgICBuYW1lOiBcIkdpdGh1YlwiXG4gICAgaWNvbkNsYXNzOiBcImljb24tZ2l0aHViXCJcbiAgICBpbWFnZTogXCIvaW1nL29hdXRoL2dpdGh1Yi5pY29cIlxuICAsXG4gICAgaWQ6IFwiZ29vZ2xlXCJcbiAgICBuYW1lOiBcIkdvb2dsZVwiXG4gICAgaWNvbkNsYXNzOiBcImljb24tZ29vZ2xlLXBsdXNcIlxuICAgIGltYWdlOiBcIi9pbWcvb2F1dGgvZ29vZ2xlLmljb1wiXG4gICxcbiAgICBpZDogXCJ0d2l0dGVyXCJcbiAgICBuYW1lOiBcIlR3aXR0ZXJcIlxuICAgIGljb25DbGFzczogXCJpY29uLXR3aXR0ZXJcIlxuICAgIGltYWdlOiBcIi9pbWcvb2F1dGgvdHdpdHRlci5pY29cIlxuICAsXG4gICAgaWQ6IFwibWVldHVwXCJcbiAgICBuYW1lOiBcIk1lZXR1cFwiXG4gICAgaWNvbkNsYXNzOiBcIlwiXG4gICAgaW1hZ2U6IFwiL2ltZy9vYXV0aC9tZWV0dXAuaWNvXCJcbiAgLFxuICAgIGlkOiBcImV2ZW50YnJpdGVcIlxuICAgIG5hbWU6IFwiRXZlbnRicml0ZVwiXG4gICAgaWNvbkNsYXNzOiBcIlwiXG4gICAgaW1hZ2U6IFwiL2ltZy9vYXV0aC9ldmVudGJyaXRlLmljb1wiXG4gIF1cbl0iLCJyZXF1aXJlIFwiLi4vc2VydmljZXMvb2F1dGguY29mZmVlXCJcblxubW9kdWxlID0gYW5ndWxhci5tb2R1bGUgXCJtZXR3b3JrLnNlcnZpY2Uuc2Vzc2lvblwiLCBbXG4gIFwibmdDb29raWVzXCJcbiAgXG4gIFwicmVzdGFuZ3VsYXJcIlxuXG4gIFwibWV0d29yay5zZXJ2aWNlLmJhY2tlbmRcIlxuICBcIm1ldHdvcmsuc2VydmljZS5ub3RpZmllclwiXG4gIFwibWV0d29yay5zZXJ2aWNlLm9hdXRoXCJcbl1cblxubW9kdWxlLmNvbmZpZyBbIFwiUmVzdGFuZ3VsYXJQcm92aWRlclwiLCAoUmVzdGFuZ3VsYXJQcm92aWRlcikgLT5cbiAgUmVzdGFuZ3VsYXJQcm92aWRlci5zZXRCYXNlVXJsIFwiaHR0cDovL21ldHdvcmstYXBpLWM5LWdnb29kbWFuLmM5LmlvXCJcbiAgUmVzdGFuZ3VsYXJQcm92aWRlci5zZXRSZXN0YW5ndWxhckZpZWxkcyBpZDogXCJfaWRcIlxuXVxuXG5tb2R1bGUuZmFjdG9yeSBcInNlc3Npb25cIiwgWyBcIiRyb290U2NvcGVcIiwgXCIkc3RhdGVcIiwgXCIkcVwiLCBcIiR3aW5kb3dcIiwgXCIkaHR0cFwiLCBcIiRjb29raWVzXCIsIFwiUmVzdGFuZ3VsYXJcIiwgXCJvYXV0aFwiLCBcInVzZXJzXCIsICgkcm9vdFNjb3BlLCAkc3RhdGUsICRxLCAkd2luZG93LCAkaHR0cCwgJGNvb2tpZXMsIFJlc3Rhbmd1bGFyLCBvYXV0aCwgdXNlcnMpIC0+XG4gIFxuICBzZXNzaW9uID0gbmV3IGNsYXNzIFNlc3Npb25cbiAgICBjb25zdHJ1Y3RvcjogLT5cbiAgICAgIEB1c2VyID0gbnVsbFxuICAgICAgXG4gICAgICBhbmd1bGFyLmNvcHkgbWV0d29yay5zZXNzaW9uLCBAIFxuICAgICAgICBcbiAgICAgIEB1c2VyID0gdXNlcnMud3JhcChAdXNlcikgaWYgQHVzZXJcbiAgICBcbiAgICBoYXNJZGVudGl0eTogKHNlcnZpY2UpIC0+ICEhQGdldElkZW50aXR5KHNlcnZpY2UpXG4gICAgZ2V0SWRlbnRpdHk6IChzZXJ2aWNlKSAtPlxuICAgICAgQHVzZXI/LmlkZW50aXRpZXM/IGFuZCBfLmZpbmQgQHVzZXIuaWRlbnRpdGllcywgKGlkZW50aXR5KSAtPlxuICAgICAgICBpZGVudGl0eS5zZXJ2aWNlIGlzIHNlcnZpY2VcbiAgICBcbiAgICBcbiAgICBsb2dpbjogKGlkZW50aXR5KSAtPlxuICAgICAgc2VydmljZSA9IEBcbiAgICAgIFxuICAgICAgcmVxID0gJGh0dHAucG9zdCBcImh0dHA6Ly9tZXR3b3JrLWFwaS1jOS1nZ29vZG1hbi5jOS5pby9zZXNzaW9ucy8jeyRjb29raWVzLm13c2Vzc2lkfS91c2VyXCIsIHt9LFxuICAgICAgICBwYXJhbXM6XG4gICAgICAgICAgc2VydmljZTogaWRlbnRpdHkuc2VydmljZVxuICAgICAgICAgIHRva2VuOiBpZGVudGl0eS50b2tlblxuICAgICAgICAgIHNlY3JldDogaWRlbnRpdHkuc2VjcmV0XG4gICAgICBcbiAgICAgIHJlcS50aGVuIChyZXMpIC0+XG4gICAgICAgIGlmIHJlcy5kYXRhPy5yZXN1bHQ/IHRoZW4gc3dpdGNoIHJlcy5kYXRhLnJlc3VsdFxuICAgICAgICAgIHdoZW4gXCJub3RfZm91bmRcIiwgXCJjb25mbGljdFwiIHRoZW4gJHEucmVqZWN0KHJlcy5kYXRhKVxuICAgICAgICAgIHdoZW4gXCJva1wiIHRoZW4gc2VydmljZS51c2VyID0gdXNlcnMud3JhcChhbmd1bGFyLmNvcHkocmVzLmRhdGEuZGF0YSkpXG4gIFxuICAgIGxvZ291dDogLT5cbiAgICAgIHNlcnZpY2UgPSBAXG4gICAgICBcbiAgICAgIHJlcSA9ICRodHRwLmRlbGV0ZSBcImh0dHA6Ly9tZXR3b3JrLWFwaS1jOS1nZ29vZG1hbi5jOS5pby9zZXNzaW9ucy8jeyRjb29raWVzLm13c2Vzc2lkfS91c2VyXCJcbiAgICAgIFxuICAgICAgcmVxLnRoZW4gKHJlcykgLT5cbiAgICAgICAgJHdpbmRvdy5sb2NhdGlvbi5yZWxvYWQoKVxuICAgICAgICBvYXV0aC5jbGVhcklkZW50aXRpZXMoKVxuICAgICAgICBzZXJ2aWNlLnVzZXIgPSBudWxsXG4gIFxuICBcbl0iLCJyZXF1aXJlIFwiLi4vc2VydmljZXMvc2Vzc2lvbi5jb2ZmZWVcIlxucmVxdWlyZSBcIi4uL3NlcnZpY2VzL2dhdGVrZWVwZXIuY29mZmVlXCJcbnJlcXVpcmUgXCIuLi9zZXJ2aWNlcy9iYWNrZW5kLmNvZmZlZVwiXG5cbnJlcXVpcmUgXCIuLi9kaXJlY3RpdmVzL21hcmtkb3duLmNvZmZlZVwiXG5cblxubW9kdWxlID0gYW5ndWxhci5tb2R1bGUgXCJtZXR3b3JrLnN0YXRlLmNoZWNraW5cIiwgW1xuICBcInVpLmJvb3RzdHJhcFwiXG4gIFwidWkucm91dGVyXCJcblxuICBcIm1ldHdvcmsuc2VydmljZS5zZXNzaW9uXCJcbiAgXCJtZXR3b3JrLnNlcnZpY2UuZ2F0ZWtlZXBlclwiXG4gIFwibWV0d29yay5zZXJ2aWNlLmJhY2tlbmRcIlxuICBcbiAgXCJtZXR3b3JrLmRpcmVjdGl2ZS5tYXJrZG93blwiXG5dXG5cbmRlYm91bmNlID0gKGRlbGF5LCBmbikgLT5cbiAgdGltZW91dCA9IG51bGxcbiAgLT5cbiAgICBjb250ZXh0ID0gQFxuICAgIGFyZ3MgPSBhcmd1bWVudHNcbiAgICBcbiAgICBjbGVhclRpbWVvdXQgdGltZW91dCBpZiB0aW1lb3V0XG4gICAgXG4gICAgdGltZW91dCA9IHNldFRpbWVvdXQgLT5cbiAgICAgIGZuLmFwcGx5KGNvbnRleHQsIGFyZ3MpXG4gICAgLCBkZWxheVxuICAgIFxuXG5tb2R1bGUuZmlsdGVyIFwic2VnbWVudFwiLCAtPlxuICAodmFsdWUpIC0+IHZhbHVlLnNwbGl0KFwiLFwiKVswXVxuXG5tb2R1bGUuY29uZmlnIFsgXCIkc3RhdGVQcm92aWRlclwiLCAoJHN0YXRlUHJvdmlkZXIpIC0+XG5cbiAgJHN0YXRlUHJvdmlkZXIuc3RhdGUgXCJjaGVja2luXCIsIFxuICAgIHVybDogXCIvY2hlY2tpblwiXG4gICAgdGVtcGxhdGU6IFwiXCJcIjxkaXYgdWktdmlldz48L2Rpdj5cIlwiXCJcbiAgICAgIFxuICAgIGNvbnRyb2xsZXI6IFsgXCIkc2NvcGVcIiwgXCIkc3RhdGVcIiwgXCIkdGltZW91dFwiLCBcImdlb2xvY2F0b3JcIiwgXCJnZW9jb2RlclwiLCBcInNlc3Npb25cIiwgXCJnYXRla2VlcGVyXCIsICgkc2NvcGUsICRzdGF0ZSwgJHRpbWVvdXQsIGdlb2xvY2F0b3IsIGdlb2NvZGVyLCBzZXNzaW9uLCBnYXRla2VlcGVyKSAtPlxuICAgICAgaWYgJHN0YXRlLmlzKFwiY2hlY2tpblwiKSB0aGVuICRzdGF0ZS5nbyhcImNoZWNraW4uc2VhcmNoXCIpXG4gICAgXVxuICAgIFxuICAkc3RhdGVQcm92aWRlci5zdGF0ZSBcImNoZWNraW4uc2VhcmNoXCIsIFxuICAgIHVybDogXCIvc2VhcmNoXCJcbiAgICB0ZW1wbGF0ZTogXCJcIlwiXG4gICAgICA8ZGl2IGNsYXNzPVwiY29udGFpbmVyXCI+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJyb3dcIiBuZy1pZj1cImV2ZW50cy5sZW5ndGhcIj5cbiAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29sLXhzLTEyXCI+XG4gICAgICAgICAgICA8aDQ+TmVhcmJ5IGV2ZW50czwvaDQ+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwibGlzdC1ncm91cFwiPlxuICAgICAgICAgICAgICA8YSBjbGFzcz1cImxpc3QtZ3JvdXAtaXRlbSBldmVudC1saXN0aW5nXCIgdWktc3JlZj1cImNoZWNraW4uZXZlbnQoe2V2ZW50Q29kZTogZXZlbnQuY29kZX0pXCIgbmctcmVwZWF0PVwiZXZlbnQgaW4gZXZlbnRzXCI+XG4gICAgICAgICAgICAgICAgICA8c3Ryb25nPnt7ZXZlbnQubmFtZX19PC9zdHJvbmc+XG4gICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwidGV4dC1tdXRlZFwiPlxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBuZy1iaW5kPVwiZXZlbnQuc3RhcnRfYXQgfCBkYXRlOidoOm1tYSdcIj48L3NwYW4+IHRvIDxzcGFuIG5nLWJpbmQ9XCJldmVudC5lbmRfYXQgfCBkYXRlOidoOm1tYSdcIj48L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgIGF0XG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIG5nLWJpbmQ9XCJldmVudC5hZGRyZXNzIHwgc2VnbWVudFwiPjwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8L2E+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJyb3dcIj5cbiAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29sLXhzLTEyXCI+XG4gICAgICAgICAgICA8aDQ+Q2hlY2sgaW4gYnkgZXZlbnQgY29kZTwvaDQ+XG4gICAgICAgICAgICA8Zm9ybSBuZy1zdWJtaXQ9XCJjaGVja2luKGV2ZW50Q29kZSlcIj5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImZvcm0tZ3JvdXBcIj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiaW5wdXQtZ3JvdXBcIj5cbiAgICAgICAgICAgICAgICAgIDxpbnB1dCBuZy1tb2RlbD1cImV2ZW50Q29kZVwiIGNsYXNzPVwiZm9ybS1jb250cm9sXCIgdHlwZT1cInRleHRcIiBwbGFjZWhvbGRlcj1cIkV2ZW50IGNvZGVcIj5cbiAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJpbnB1dC1ncm91cC1idG5cIj5cbiAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwic3VibWl0XCIgbmctZGlzYWJsZWQ9XCIhZXZlbnRDb2RlXCIgY2xhc3M9XCJidG4gYnRuLXN1Y2Nlc3NcIj5DaGVjayBpbjwvYT5cbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZm9ybT5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICBcIlwiXCJcbiAgICAgIFxuICAgIGRpdmVydFVudGlsOiBbXG4gICAgICB0bzogXCJ1c2VyLmxvZ2luXCJcbiAgICAgIHByZWRpY2F0ZTogWyBcInNlc3Npb25cIiwgKHNlc3Npb24pIC0+IHNlc3Npb24udXNlciBdXG4gICAgLFxuICAgICAgdG86IFwibG9jYXRlLnBvc2l0aW9uXCJcbiAgICAgIHByZWRpY2F0ZTogWyBcImxvY2F0aW9uXCIsIChsb2NhdGlvbikgLT4gbG9jYXRpb24ucG9zaXRpb24gXVxuICAgICxcbiAgICAgIHRvOiBcImxvY2F0ZS5hZGRyZXNzXCJcbiAgICAgIHByZWRpY2F0ZTogWyBcImxvY2F0aW9uXCIsIChsb2NhdGlvbikgLT4gbG9jYXRpb24ucG9zaXRpb24uYWNjdXJhY3kgYW5kIGxvY2F0aW9uLnBvc2l0aW9uLmFjY3VyYWN5IDwgMjAwIF1cbiAgICBdXG4gICAgICBcbiAgICBjb250cm9sbGVyOiBbIFwiJHNjb3BlXCIsIFwiJHN0YXRlXCIsIFwibG9jYXRpb25cIiwgXCJldmVudHNcIiwgKCRzY29wZSwgJHN0YXRlLCBsb2NhdGlvbiwgZXZlbnRzKSAtPlxuICAgICAgY29uc29sZS5sb2cgXCJFdmVudHNcIiwgZXZlbnRzXG4gICAgICBcbiAgICAgICRzY29wZS5ldmVudHMgPSBldmVudHMuZmluZE5lYXJieShsb2NhdGlvbi5wb3NpdGlvbilcbiAgICAgIFxuICAgICAgJHNjb3BlLmNoZWNraW4gPSAoZXZlbnRDb2RlKSAtPiAkc3RhdGUuZ28oXCJjaGVja2luLmV2ZW50XCIsIGV2ZW50Q29kZTogZXZlbnRDb2RlKVxuICAgIF1cbiAgICBcbiAgJHN0YXRlUHJvdmlkZXIuc3RhdGUgXCJjaGVja2luLm5ld1wiLCBcbiAgICB1cmw6IFwiL25ld1wiXG4gICAgdGVtcGxhdGU6IFwiXCJcIlxuICAgICAgPGRpdiBjbGFzcz1cImNvbnRhaW5lclwiPlxuICAgICAgICA8ZGl2IGNsYXNzPVwicm93XCIgbmctaWY9XCJuZWFyYnlFdmVudHMubGVuZ3RoXCI+XG4gICAgICAgICAgPGRpdiBjbGFzcz1cImNvbC14cy0xMlwiPlxuICAgICAgICAgICAgPGgzPkFyZSB5b3UgYXQgb25lIG9mIHRoZXNlIGV2ZW50cz88L2gzPlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImV2ZW50LWxpc3RpbmdcIiBuZy1yZXBlYXQ9XCJldmVudCBpbiBuZWFyYnlFdmVudHNcIj5cbiAgICAgICAgICAgICAgPGg0Pnt7ZXZlbnQudGl0bGV9fTwvaDQ+XG4gICAgICAgICAgICAgIDxwPnt7ZXZlbnQuZGVzY3JpcHRpb259fTwvcD5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGRpdiBjbGFzcz1cInJvd1wiPlxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb2wteHMtMTJcIj5cbiAgICAgICAgICAgIDxmaWVsZHNldD5cbiAgICAgICAgICAgICAgPGxlZ2VuZD5DaGVjay1pbiB1c2luZyB0aGUgZXZlbnQncyBjb2RlPC9sZWdlbmQ+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJmb3JtLWdyb3VwXCI+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImlucHV0LWdyb3VwXCI+XG4gICAgICAgICAgICAgICAgICA8aW5wdXQgbmctbW9kZWw9XCJldmVudF9pZFwiIGNsYXNzPVwiZm9ybS1jb250cm9sXCIgdHlwZT1cInRleHRcIiBwbGFjZWhvbGRlcj1cIkV2ZW50IGNvZGVcIj5cbiAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJpbnB1dC1ncm91cC1idG5cIj5cbiAgICAgICAgICAgICAgICAgICAgPGEgdWktc3JlZj1cImV2ZW50LnZpZXcoe2lkOiBldmVudF9pZH0pXCIgbmctZGlzYWJsZWQ9XCIhZXZlbnRfaWRcIiBjbGFzcz1cImJ0biBidG4tc3VjY2Vzc1wiPkNoZWNrIGluPC9hPlxuICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPHAgY2xhc3M9XCJoZWxwLWJsb2NrXCI+SWYgeW91IGtub3cgdGhlIGV2ZW50J3MgY29kZSwgZW50ZXIgaXQgaGVyZSBhbmQgY2xpY2sgJ0NoZWNrIGluJy48L3A+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9maWVsZHNldD5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJyb3dcIj5cbiAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29sLXhzLTEyXCI+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgXCJcIlwiXG4gICAgICBcbiAgICBkaXZlcnRVbnRpbDogW1xuICAgICAgdG86IFwidXNlci5sb2dpblwiXG4gICAgICBwcmVkaWNhdGU6IFsgXCJzZXNzaW9uXCIsIChzZXNzaW9uKSAtPiBzZXNzaW9uLnVzZXIgXVxuICAgICxcbiAgICAgIHRvOiBcImxvY2F0ZVwiXG4gICAgICBwcmVkaWNhdGU6IFsgXCJsb2NhdGlvblwiLCAobG9jYXRpb24pIC0+IGxvY2F0aW9uLmNvbmZpcm1lZFBvc2l0aW9uIGFuZCBsb2NhdGlvbi5jb25maXJtZWRBZGRyZXNzIF1cbiAgICBdXG4gICAgXG4gICAgY29udHJvbGxlcjogWyBcIiRzY29wZVwiLCBcIiRzdGF0ZVwiLCBcIiR0aW1lb3V0XCIsIFwibG9jYXRpb25cIiwgXCJnZW9jb2RlclwiLCBcInNlc3Npb25cIiwgXCJnYXRla2VlcGVyXCIsICgkc2NvcGUsICRzdGF0ZSwgJHRpbWVvdXQsIGxvY2F0aW9uLCBnZW9jb2Rlciwgc2Vzc2lvbiwgZ2F0ZWtlZXBlcikgLT5cbiAgICAgICAgXG4gICAgXVxuXG4gICRzdGF0ZVByb3ZpZGVyLnN0YXRlIFwiY2hlY2tpbi5ldmVudFwiLCBcbiAgICB1cmw6IFwiLzpldmVudENvZGVcIlxuICAgIHRlbXBsYXRlOiBcIlwiXCJcbiAgICAgIDxkaXYgY2xhc3M9XCJjb250YWluZXJcIj5cbiAgICAgICAgPGRpdiBjbGFzcz1cInJvd1wiIG5nLWlmPVwibmVhcmJ5RXZlbnRzLmxlbmd0aFwiPlxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb2wteHMtMTJcIj5cbiAgICAgICAgICAgIDxoMz5BcmUgeW91IGF0IG9uZSBvZiB0aGVzZSBldmVudHM/PC9oMz5cbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJldmVudC1saXN0aW5nXCIgbmctcmVwZWF0PVwiZXZlbnQgaW4gbmVhcmJ5RXZlbnRzXCI+XG4gICAgICAgICAgICAgIDxoND57e2V2ZW50LnRpdGxlfX08L2g0PlxuICAgICAgICAgICAgICA8cD57e2V2ZW50LmRlc2NyaXB0aW9ufX08L3A+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJyb3dcIj5cbiAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29sLXhzLTEyXCI+XG4gICAgICAgICAgICA8ZmllbGRzZXQ+XG4gICAgICAgICAgICAgIDxsZWdlbmQ+Q2hlY2sgaW4hPC9sZWdlbmQ+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJmb3JtLWdyb3VwXCI+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImlucHV0LWdyb3VwXCI+XG4gICAgICAgICAgICAgICAgICA8aW5wdXQgbmctbW9kZWw9XCJldmVudF9pZFwiIGNsYXNzPVwiZm9ybS1jb250cm9sXCIgdHlwZT1cInRleHRcIiBwbGFjZWhvbGRlcj1cIkV2ZW50IGNvZGVcIj5cbiAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJpbnB1dC1ncm91cC1idG5cIj5cbiAgICAgICAgICAgICAgICAgICAgPGEgdWktc3JlZj1cImV2ZW50LnZpZXcoe2lkOiBldmVudF9pZH0pXCIgbmctZGlzYWJsZWQ9XCIhZXZlbnRfaWRcIiBjbGFzcz1cImJ0biBidG4tc3VjY2Vzc1wiPkNoZWNrIGluPC9hPlxuICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPHAgY2xhc3M9XCJoZWxwLWJsb2NrXCI+SWYgeW91IGtub3cgdGhlIGV2ZW50J3MgY29kZSwgZW50ZXIgaXQgaGVyZSBhbmQgY2xpY2sgJ0NoZWNrIGluJy48L3A+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9maWVsZHNldD5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJyb3dcIj5cbiAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29sLXhzLTEyXCI+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgXCJcIlwiXG4gICAgICBcbiAgICBkaXZlcnRVbnRpbDogW1xuICAgICAgdG86IFwidXNlci5sb2dpblwiXG4gICAgICBwcmVkaWNhdGU6IFsgXCJzZXNzaW9uXCIsIChzZXNzaW9uKSAtPiBzZXNzaW9uLnVzZXIgXVxuICAgIF1cbiAgICBcbiAgICByZXNvbHZlOlxuICAgICAgZXZlbnQ6IFtcIiRzdGF0ZVBhcmFtc1wiLCBcImV2ZW50c1wiLCAoJHN0YXRlUGFyYW1zLCBldmVudHMpIC0+IGV2ZW50cy5maW5kQnlDb2RlKCRzdGF0ZVBhcmFtcy5ldmVudENvZGUpXG4gICAgICBdXG4gICAgY29udHJvbGxlcjogWyBcIiRzY29wZVwiLCBcIiRzdGF0ZVwiLCBcIiR0aW1lb3V0XCIsIFwiZ2VvbG9jYXRvclwiLCBcImdlb2NvZGVyXCIsIFwic2Vzc2lvblwiLCBcImdhdGVrZWVwZXJcIiwgKCRzY29wZSwgJHN0YXRlLCAkdGltZW91dCwgZ2VvbG9jYXRvciwgZ2VvY29kZXIsIHNlc3Npb24sIGdhdGVrZWVwZXIpIC0+XG4gICAgICAgIFxuICAgIF1cbl0iLCJyZXF1aXJlIFwiLi4vc2VydmljZXMvYmFja2VuZC5jb2ZmZWVcIlxucmVxdWlyZSBcIi4uL3NlcnZpY2VzL3Nlc3Npb24uY29mZmVlXCJcblxucmVxdWlyZSBcIi4uL2RpcmVjdGl2ZXMvZ21hcC5jb2ZmZWVcIlxuXG5tb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSBcIm1ldHdvcmsuc3RhdGUuZXZlbnRcIiwgW1xuICBcInVpLmJvb3RzdHJhcFwiXG4gIFwidWkucm91dGVyXCJcbiAgXG4gIFwibWV0d29yay5zZXJ2aWNlLmJhY2tlbmRcIlxuICBcIm1ldHdvcmsuc2VydmljZS5zZXNzaW9uXCJcbiAgXG4gIFwibWV0d29yay5kaXJlY3RpdmUuZ21hcFwiXG5dXG5cbmRlYm91bmNlID0gKGRlbGF5LCBmbikgLT5cbiAgdGltZW91dCA9IG51bGxcbiAgLT5cbiAgICBjb250ZXh0ID0gQFxuICAgIGFyZ3MgPSBhcmd1bWVudHNcbiAgICBcbiAgICBjbGVhclRpbWVvdXQgdGltZW91dCBpZiB0aW1lb3V0XG4gICAgXG4gICAgdGltZW91dCA9IHNldFRpbWVvdXQgLT5cbiAgICAgIGZuLmFwcGx5KGNvbnRleHQsIGFyZ3MpXG4gICAgLCBkZWxheVxuXG5cblxubW9kdWxlLmNvbmZpZyBbIFwiJHN0YXRlUHJvdmlkZXJcIiwgKCRzdGF0ZVByb3ZpZGVyKSAtPlxuICAkc3RhdGVQcm92aWRlci5zdGF0ZSBcImV2ZW50XCIsXG4gICAgdXJsOiBcIi9ldmVudFwiXG4gICAgdGVtcGxhdGU6IFwiXCJcIlxuICAgICAgPGRpdiBjbGFzcz1cImNvbnRhaW5lclwiIHVpLXZpZXc+XG4gICAgICA8L2Rpdj5cbiAgICBcIlwiXCJcblxuICAkc3RhdGVQcm92aWRlci5zdGF0ZSBcImV2ZW50LmNyZWF0ZVwiLCBcbiAgICB1cmw6IFwiL2NyZWF0ZVwiXG4gICAgdGVtcGxhdGU6IFwiXCJcIlxuICAgICAgPGRpdiBjbGFzcz1cInJvd1wiPlxuICAgICAgICA8ZGl2IGNsYXNzPVwiY29sLXhzLTEyXCI+XG4gICAgICAgICAgPGgxPkltcG9ydCBldmVudDwvaDE+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8cCBjbGFzcz1cImNvbC14cy02XCI+PGJ1dHRvbiBjbGFzcz1cImJ0biBidG4tc3VjY2VzcyBidG4tYmxvY2tcIiBuZy1jbGFzcz1cIntkaXNhYmxlZDogc2Vzc2lvbi5oYXNQcm9maWxlKCdldmVudGJyaXRlJyl9XCI+RnJvbSBFdmVudGJyaXRlPC9idXR0b24+PC9wPlxuICAgICAgICA8cCBjbGFzcz1cImNvbC14cy02XCI+PGJ1dHRvbiBjbGFzcz1cImJ0biBidG4tc3VjY2VzcyBidG4tYmxvY2tcIiBuZy1jbGFzcz1cIntkaXNhYmxlZDogc2Vzc2lvbi5oYXNQcm9maWxlKCdtZWV0dXAnKX1cIj5Gcm9tIE1lZXR1cC5jb208L2J1dHRvbj48L3A+XG4gICAgICA8L2Rpdj5cbiAgICAgIDxkaXYgY2xhc3M9XCJyb3dcIj5cbiAgICAgICAgPGRpdiBjbGFzcz1cImNvbC14cy0xMlwiPlxuICAgICAgICAgIDxmaWVsZHNldD5cbiAgICAgICAgICAgIDxsZWdlbmQ+Q3JlYXRlIGEgbmV3IGV2ZW50PC9sZWdlbmQ+XG4gICAgICAgICAgICA8Zm9ybSBuYW1lPVwiZXZlbnRcIiBuZy1zdWJtaXQ9XCJjcmVhdGVFdmVudChlZGl0aW5nKVwiPlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZm9ybS1ncm91cFwiIG5nLWNsYXNzPVwieydoYXMtZXJyb3InOiAhZXZlbnQubmFtZS4kdmFsaWQgJiYgZXZlbnQubmFtZS4kZGlydHl9XCI+XG4gICAgICAgICAgICAgICAgPGlucHV0IG5hbWU9XCJuYW1lXCIgbmctbW9kZWw9XCJlZGl0aW5nLm5hbWVcIiBjbGFzcz1cImZvcm0tY29udHJvbFwiIHR5cGU9XCJ0ZXh0XCIgcmVxdWlyZWQgbmctbWF4bGVuZ3RoPVwiMjAwXCIgcGxhY2Vob2xkZXI9XCJFdmVudCBuYW1lXCI+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZm9ybS1ncm91cFwiIG5nLWNsYXNzPVwieydoYXMtZXJyb3InOiAhZXZlbnQuZGVzY3JpcHRpb24uJHZhbGlkICYmIGV2ZW50LmRlc2NyaXB0aW9uLiRkaXJ0eX1cIj5cbiAgICAgICAgICAgICAgICA8dGV4dGFyZWEgbmFtZT1cImRlc2NyaXB0aW9uXCIgbmctbW9kZWw9XCJlZGl0aW5nLmRlc2NyaXB0aW9uXCIgY2xhc3M9XCJmb3JtLWNvbnRyb2xcIiByb3dzPVwiNFwiIHJlcXVpcmVkIG5nLW1heGxlbmd0aD1cIjIwNDhcIiBwbGFjZWhvbGRlcj1cIkV2ZW50IGRlc2NyaXB0aW9uXCI+PC90ZXh0YXJlYT5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJmb3JtLWdyb3VwIGlucHV0LWdyb3VwXCIgbmctY2xhc3M9XCJ7J2hhcy1lcnJvcic6ICFldmVudC5hZGRyZXNzLiR2YWxpZCAmJiBldmVudC5hZGRyZXNzLiRkaXJ0eX1cIj5cbiAgICAgICAgICAgICAgICA8aW5wdXQgbmFtZT1cImFkZHJlc3NcIiBuZy1tb2RlbD1cImVkaXRpbmcuYWRkcmVzc1wiIG5nLWNoYW5nZT1cInVwZGF0ZUNlbnRlcihlZGl0aW5nLmFkZHJlc3MpXCIgbmctZmx1cj1cImNlbnRlciA9IGVkaXRpbmcuYWRkcmVzc1wiIGNsYXNzPVwiZm9ybS1jb250cm9sXCIgdHlwZT1cInRleHRcIiByZXF1aXJlZCBwbGFjZWhvbGRlcj1cIkFkZHJlc3NcIj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiaW5wdXQtZ3JvdXAtYWRkb25cIj5cbiAgICAgICAgICAgICAgICAgIDxpIGNsYXNzPVwiaWNvbi1tYXAtbWFya2VyXCI+PC9pPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImZvcm0tZ3JvdXBcIj5cbiAgICAgICAgICAgICAgICA8bXctZ21hcCBhZGRyZXNzPVwibWFwLmNlbnRlclwiIG9uLWNsaWNrLW1hcmtlcj1cInNldExvY2F0aW9uKGFkZHJlc3MsIHBvc2l0aW9uKVwiPjwvbXctZ21hcD5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJmb3JtLWdyb3VwIGlucHV0LWdyb3VwXCIgbmctY2xhc3M9XCJ7J2hhcy1lcnJvcic6ICFldmVudC5zdGFydF9hdC4kdmFsaWQgJiYgZXZlbnQuc3RhcnRfYXQuJGRpcnR5fVwiPlxuICAgICAgICAgICAgICAgIDxpbnB1dCBuYW1lPVwic3RhcnRfYXRcIiBuZy1tb2RlbD1cImVkaXRpbmcuc3RhcnRfYXRcIiBjbGFzcz1cImZvcm0tY29udHJvbFwiIHR5cGU9XCJkYXRldGltZS1sb2NhbFwiIHBsYWNlaG9sZGVyPVwiRGF0ZVwiPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJpbnB1dC1ncm91cC1hZGRvblwiPlxuICAgICAgICAgICAgICAgICAgPGkgY2xhc3M9XCJpY29uLXRpbWVcIj48L2k+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZm9ybS1ncm91cCBpbnB1dC1ncm91cFwiPlxuICAgICAgICAgICAgICAgIDxpbnB1dCBuYW1lPVwiZW5kX2F0XCIgbmctbW9kZWw9XCJlZGl0aW5nLmVuZF9hdFwiIGNsYXNzPVwiZm9ybS1jb250cm9sXCIgdHlwZT1cImRhdGV0aW1lLWxvY2FsXCIgcGxhY2Vob2xkZXI9XCJEYXRlXCI+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImlucHV0LWdyb3VwLWFkZG9uXCI+XG4gICAgICAgICAgICAgICAgICA8aSBjbGFzcz1cImljb24tdGltZVwiPjwvaT5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJmb3JtLWdyb3VwXCI+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNoZWNrYm94XCI+XG4gICAgICAgICAgICAgICAgICA8bGFiZWw+XG4gICAgICAgICAgICAgICAgICAgIDxpbnB1dCBuZy1tb2RlbD1cImVkaXRpbmcuaXNfcHJpdmF0ZVwiIHR5cGU9XCJjaGVja2JveFwiPiBUaGlzIGV2ZW50IGlzIHByaXZhdGVcbiAgICAgICAgICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cImhlbHAtYmxvY2tcIiBuZy1pZj1cImVkaXRpbmcuaXNfcHJpdmF0ZVwiPlxuICAgICAgICAgICAgICAgICAgICBPbmx5IHBlb3BsZSB3aG8ga25vdyB0aGUgZXZlbnQgaWQgY2FuIGpvaW4uXG4gICAgICAgICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cImhlbHAtYmxvY2tcIiBuZy1pZj1cIiFlZGl0aW5nLmlzX3ByaXZhdGVcIj5cbiAgICAgICAgICAgICAgICAgICAgQW55b25lIGNhbiBqb2luIHRoaXMgZXZlbnQuXG4gICAgICAgICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZm9ybS1ncm91cFwiPlxuICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cInN1Ym1pdFwiIGNsYXNzPVwiYnRuIGJ0bi1wcmltYXJ5XCI+Q3JlYXRlIGV2ZW50PC9idXR0b24+XG4gICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cImJ0biBidG4tZGVmYXVsdFwiIHVpLXNyZWY9XCJsYW5kaW5nXCI+Q2FuY2VsPC9idXR0b24+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9mb3JtPlxuICAgICAgICAgIDwvZmllbGRzZXQ+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgXCJcIlwiXG4gICAgZGl2ZXJ0VW50aWw6IFtcbiAgICAgIHRvOiBcInVzZXIubG9naW5cIlxuICAgICAgcHJlZGljYXRlOiBbIFwic2Vzc2lvblwiLCAoc2Vzc2lvbikgLT4gc2Vzc2lvbi51c2VyIF1cbiAgICBdXG4gICAgY29udHJvbGxlcjogWyBcIiRzY29wZVwiLCBcImV2ZW50c1wiLCBcInNlc3Npb25cIiwgKCRzY29wZSwgZXZlbnRzLCBzZXNzaW9uKSAtPlxuICAgICAgJHNjb3BlLm1hcCA9IGNlbnRlcjogbnVsbFxuICAgICAgJHNjb3BlLnNlc3Npb24gPSBzZXNzaW9uXG4gICAgICAkc2NvcGUuZWRpdGluZyA9XG4gICAgICAgIGFkZHJlc3M6IFwiXCJcbiAgICAgIFxuICAgICAgJHNjb3BlLiR3YXRjaCBcImVkaXRpbmcuYWRkcmVzc1wiLCBkZWJvdW5jZSAxNTAwLCAoYWRkcmVzcykgLT5cbiAgICAgICAgY29uc29sZS5sb2cgXCJjaGdcIiwgYXJndW1lbnRzLi4uXG4gICAgICAgICRzY29wZS4kYXBwbHkgLT4gJHNjb3BlLm1hcC5jZW50ZXIgPSBhZGRyZXNzXG4gICAgICBcbiAgICAgICRzY29wZS5zZXRMb2NhdGlvbiA9IChhZGRyZXNzLCBwb3NpdGlvbikgLT5cbiAgICAgICAgJHNjb3BlLmVkaXRpbmcuYWRkcmVzcyA9IGFkZHJlc3NcbiAgICAgICAgJHNjb3BlLmVkaXRpbmcucG9zaXRpb24gPSBwb3NpdGlvblxuICAgICAgXG4gICAgICAkc2NvcGUuY3JlYXRlRXZlbnQgPSAoanNvbikgLT5cbiAgICAgICAgY29uc29sZS5sb2cgXCJDcmVhdGluZ1wiLCBqc29uXG4gICAgICAgIGV2ZW50cy5jcmVhdGUoanNvbikudGhlbiAtPlxuICAgICAgICAgIGNvbnNvbGUubG9nIFwiRXZlbnQgY3JlYXRlZFwiLCBhcmd1bWVudHMuLi5cbiAgICBdXG5dIiwicmVxdWlyZSBcIi4uL2RpcmVjdGl2ZXMvdXNlcmNhcmQuY29mZmVlXCJcbnJlcXVpcmUgXCIuLi9zZXJ2aWNlcy9zZXNzaW9uLmNvZmZlZVwiXG5cblxubW9kdWxlID0gYW5ndWxhci5tb2R1bGUgXCJtZXR3b3JrLnN0YXRlLmxhbmRpbmdcIiwgW1xuICBcInVpLmJvb3RzdHJhcFwiXG4gIFwidWkucm91dGVyXCJcblxuICBcIm1ldHdvcmsuZGlyZWN0aXZlLnVzZXJjYXJkXCIgI1RlbXBvcmFyeVxuICBcIm1ldHdvcmsuc2VydmljZS5zZXNzaW9uXCIgI1RlbXBvcmFyeVxuXVxuXG5tb2R1bGUuY29uZmlnIFsgXCIkc3RhdGVQcm92aWRlclwiLCAoJHN0YXRlUHJvdmlkZXIpIC0+XG5cbiAgJHN0YXRlUHJvdmlkZXIuc3RhdGUgXCJsYW5kaW5nXCIsIFxuICAgIHVybDogXCIvXCJcbiAgICB0ZW1wbGF0ZTogXCJcIlwiXG4gICAgICA8ZGl2IGNsYXNzPVwiY29udGFpbmVyXCI+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJyb3cgdGV4dC1jZW50ZXJcIj5cbiAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29sLXhzLTEyXCI+XG4gICAgICAgICAgICA8aDE+TWVldCZuYnNwO3Blb3BsZS4gQnVpbGQmbmJzcDt5b3VyIE1ldHdvcmsuPC9oMT5cbiAgICAgICAgICAgIDxwIGNsYXNzPVwibGVhZFwiPkNvbm5lY3QgZGlnaXRhbGx5IHdpdGggdGhlIHBlb3BsZSB5b3UgbWVldDwvcD5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8cCBjbGFzcz1cImNvbC14cy02IGNvbC1zbS0zIGNvbC1zbS1vZmZzZXQtM1wiPlxuICAgICAgICAgICAgPGEgY2xhc3M9XCJidG4gYnRuLXByaW1hcnkgYnRuLWxnIGJ0bi1ibG9ja1wiIHVpLXNyZWY9XCJjaGVja2luXCI+XG4gICAgICAgICAgICAgIENoZWNrIGluXG4gICAgICAgICAgICA8L2E+XG4gICAgICAgICAgPC9wPlxuICAgICAgICAgIDxwIGNsYXNzPVwiY29sLXhzLTYgY29sLXNtLTNcIj5cbiAgICAgICAgICAgIDxhIGNsYXNzPVwiYnRuIGJ0bi1kZWZhdWx0IGJ0bi1sZyBidG4tYmxvY2tcIiB1aS1zcmVmPVwiZXZlbnQuY3JlYXRlXCI+XG4gICAgICAgICAgICAgIENyZWF0ZSBldmVudFxuICAgICAgICAgICAgPC9hPlxuICAgICAgICAgIDwvcD5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJyb3dcIiBuZy1pZj1cInNlc3Npb24udXNlclwiPlxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb2wteHMtMTIgY29sLWxnLTZcIj48bXctdXNlcmNhcmQgdXNlcj1cInNlc3Npb24udXNlclwiPjwvbXctdXNlcmNhcmQ+PC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzPVwicm93XCI+XG4gICAgICAgICAgPGRpdiBjbGFzcz1cImNvbC14cy0xMlwiPlxuICAgICAgICAgICAgPGgyPldoYXQgaXMgTWV0d29yaz88L2gyPlxuICAgICAgICAgICAgPHA+TWV0d29yayBpcyBpcyBtYW55IHRoaW5ncy48L3A+XG4gICAgICAgICAgICA8dWw+XG4gICAgICAgICAgICAgIDxsaT5BIHJlY29yZCBvZiBwZW9wbGUgeW91IG1lZXQ8L2xpPlxuICAgICAgICAgICAgICA8bGk+QSBtZW1vcnkgYWlkPC9saT5cbiAgICAgICAgICAgICAgPGxpPkFuIGFkZHJlc3MgYm9vazwvbGk+XG4gICAgICAgICAgICAgIDxsaT5BIHJlbGF0aW9uc2hpcCBtYW5hZ2VtZW50IHRvb2w8L2xpPlxuICAgICAgICAgICAgPC91bD5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICBcIlwiXCJcbiAgICBjb250cm9sbGVyOiBbXCIkc2NvcGVcIiwgXCIkc3RhdGVcIiwgXCJzZXNzaW9uXCIsICgkc2NvcGUsICRzdGF0ZSwgc2Vzc2lvbikgLT5cbiAgICAgICRzY29wZS5zZXNzaW9uID0gc2Vzc2lvblxuICAgIF1cbl0iLCJyZXF1aXJlIFwiLi4vc2VydmljZXMvbG9jYXRpb24uY29mZmVlXCJcblxuXG5tb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSBcIm1ldHdvcmsuc3RhdGUubG9jYXRlXCIsIFtcbiAgXCJ1aS5ib290c3RyYXBcIlxuICBcInVpLnJvdXRlclwiXG4gIFxuICBcIm1ldHdvcmsuc2VydmljZS5sb2NhdGlvblwiXG5dXG5cbmRlYm91bmNlID0gKGRlbGF5LCBmbikgLT5cbiAgdGltZW91dCA9IG51bGxcbiAgLT5cbiAgICBjb250ZXh0ID0gQFxuICAgIGFyZ3MgPSBhcmd1bWVudHNcbiAgICBcbiAgICBjbGVhclRpbWVvdXQgdGltZW91dCBpZiB0aW1lb3V0XG4gICAgXG4gICAgdGltZW91dCA9IHNldFRpbWVvdXQgLT5cbiAgICAgIGZuLmFwcGx5KGNvbnRleHQsIGFyZ3MpXG4gICAgLCBkZWxheVxuXG5cblxubW9kdWxlLmNvbmZpZyBbIFwiJHN0YXRlUHJvdmlkZXJcIiwgKCRzdGF0ZVByb3ZpZGVyKSAtPlxuXG4gICRzdGF0ZVByb3ZpZGVyLnN0YXRlIFwibG9jYXRlXCIsXG4gICAgdXJsOiBcIi9sb2NhdGVcIlxuICAgIGFic3RyYWN0OiB0cnVlXG4gICAgdGVtcGxhdGU6IFwiXCJcIjxkaXYgdWktdmlldz48L2Rpdj5cIlwiXCJcbiAgICBkaXZlcnQ6IFtcbiAgICAgIHRvOiBcImxvY2F0ZS5hZGRyZXNzXCJcbiAgICAgIHByZWRpY2F0ZTogWyBcImxvY2F0aW9uXCIsIChsb2NhdGlvbikgLT4gbG9jYXRpb24uY29uZmlybWVkQWRkcmVzcyBdXG4gICAgLFxuICAgICAgdG86IFwibG9jYXRlLmFkZHJlc3NcIlxuICAgICAgcHJlZGljYXRlOiBbIFwibG9jYXRpb25cIiwgKGxvY2F0aW9uKSAtPiBsb2NhdGlvbi5jb25maXJtZWRBZGRyZXNzIF1cbiAgICBdXG4gICAgY29udHJvbGxlcjogW1wiJHNjb3BlXCIsIFwiJHN0YXRlXCIsIFwibG9jYXRpb25cIiwgXCJnYXRla2VlcGVyXCIsICgkc2NvcGUsICRzdGF0ZSwgbG9jYXRpb24sIGdhdGVrZWVwZXIpIC0+XG4gICAgICBcbiAgICBdXG4gICAgXG5cbiAgJHN0YXRlUHJvdmlkZXIuc3RhdGUgXCJsb2NhdGUucG9zaXRpb25cIiwgXG4gICAgdXJsOiBcIi9wb3NpdGlvblwiXG4gICAgdGVtcGxhdGU6IFwiXCJcIlxuICAgICAgPGRpdiBjbGFzcz1cImNvbnRhaW5lclwiPlxuICAgICAgICA8ZGl2IGNsYXNzPVwicm93IGNvbC14cy0xMlwiPlxuICAgICAgICAgIDxoMSBjbGFzcz1cInRleHQtY2VudGVyXCI+R2VvbG9jYXRpbmcgeW91PC9oMT5cbiAgICAgICAgICA8cCBjbGFzcz1cImxlYWQgdGV4dC1jZW50ZXJcIj5Gb3IgYmVzdCByZXN1bHRzLCBwbGVhc2UgYWxsb3cgeW91ciBicm93c2VyIGFjY2VzcyB0byB5b3VyIGxvY2F0aW9uPC9wPlxuICAgICAgICAgIDxwIGNsYXNzPVwidGV4dC1jZW50ZXIgdGV4dC1tdXRlZFwiPjxzcGFuIGNsYXNzPVwiaWNvbi1idWxsc2V5ZVwiIHN0eWxlPVwiZm9udC1zaXplOjIwZW1cIj48L3NwYW4+PC9wPlxuICAgICAgICAgIDxwIGNsYXNzPVwidGV4dC1jZW50ZXJcIj48YnV0dG9uIGNsYXNzPVwiYnRuIGJ0bi1kZWZhdWx0IGJ0bi1sZ1wiIG5nLWNsaWNrPVwiY2FuY2VsKClcIj5Ta2lwPC9idXR0b24+PC9wPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIFwiXCJcIlxuICAgIGNvbnRyb2xsZXI6IFtcIiRzY29wZVwiLCBcIiRzdGF0ZVwiLCBcIiR0aW1lb3V0XCIsIFwibG9jYXRpb25cIiwgKCRzY29wZSwgJHN0YXRlLCAkdGltZW91dCwgbG9jYXRpb24pIC0+XG4gICAgICAkdGltZW91dCAtPiBsb2NhdGlvbi5sb2NhdGUoKVxuICAgICAgI2Vsc2UgJHN0YXRlLmdvIFwibG9jYXRlLmFkZHJlc3NcIlxuICAgICAgXG4gICAgICAkc2NvcGUuY2FuY2VsID0gLT4gbG9jYXRpb24uY2FuY2VsR2VvbG9jYXRpb24oKVxuICAgIF1cblxuICAkc3RhdGVQcm92aWRlci5zdGF0ZSBcImxvY2F0ZS5hZGRyZXNzXCIsIFxuICAgIHVybDogXCIvYWRkcmVzc1wiXG4gICAgdGVtcGxhdGU6IFwiXCJcIlxuICAgICAgPGRpdiBjbGFzcz1cImNvbnRhaW5lclwiPlxuICAgICAgICA8ZGl2IGNsYXNzPVwicm93XCI+XG4gICAgICAgICAgPGRpdiBjbGFzcz1cImNvbC14cy0xMlwiPlxuICAgICAgICAgICAgPGZpZWxkc2V0PlxuICAgICAgICAgICAgICA8bGVnZW5kPkNvbmZpcm0geW91ciBsb2NhdGlvbjwvbGVnZW5kPlxuICAgICAgICAgICAgICA8Zm9ybSBuYW1lPVwic2VhcmNoQnlUaW1lUGxhY2VcIiBuZy1zdWJtaXQ9XCJjb25maXJtKHRpbWVwbGFjZS5wb3NpdGlvbiwgdGltZXBsYWNlLmFkZHJlc3MpXCI+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImZvcm0tZ3JvdXBcIiBuZy1jbGFzcz1cInsnaGFzLXN1Y2Nlc3MnOiB0aW1lcGxhY2UucG9zaXRpb24ubGF0LCAnaGFzLXdhcm5pbmcnOiAhdGltZXBsYWNlLnBvc2l0aW9uLmxhdH1cIj5cbiAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJpbnB1dC1ncm91cFwiPlxuICAgICAgICAgICAgICAgICAgICA8aW5wdXQgbmFtZT1cImFkZHJlc3NcIiBuZy1tb2RlbD1cInRpbWVwbGFjZS5hZGRyZXNzXCIgY2xhc3M9XCJmb3JtLWNvbnRyb2xcIiB0eXBlPVwidGV4dFwiIHBsYWNlaG9sZGVyPVwiQWRkcmVzc1wiPlxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cImlucHV0LWdyb3VwLWJ0blwiPlxuICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3M9XCJidG4gYnRuLWRlZmF1bHQgZHJvcGRvd24tdG9nZ2xlXCIgbmctZGlzYWJsZWQ9XCJhZGRyZXNzZXMubGVuZ3RoPT0wIHx8ICF0aW1lcGxhY2UuYWRkcmVzc1wiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJjYXJldFwiPjwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgICAgICA8dWwgY2xhc3M9XCJkcm9wZG93bi1tZW51IHB1bGwtcmlnaHRcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxsaSBuZy1yZXBlYXQ9XCJyZXN1bHQgaW4gYWRkcmVzc2VzXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgIDxhIG5nLWNsaWNrPVwiY29uZmlybVBvc2l0aW9uKHJlc3VsdC5hZGRyZXNzLCByZXN1bHQucG9zaXRpb24pXCI+e3tyZXN1bHQuYWRkcmVzc319PC9hPlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9saT5cbiAgICAgICAgICAgICAgICAgICAgICA8L3VsPlxuICAgICAgICAgICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgIDxwIGNsYXNzPVwiaGVscC1ibG9ja1wiIG5nLXNob3c9XCIhY2xpY2tlZEFkZHJlc3MgfHwgY2xpY2tlZEFkZHJlc3MgIT0gdGltZXBsYWNlLmFkZHJlc3NcIj5QbGVhc2Ugc2VsZWN0IGFuIGFkZHJlc3Mgb3IgY2xpY2sgYSBtYXJrZXIgb24gdGhlIG1hcCB0byBwcm9jZWVkLjwvcD5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZm9ybS1ncm91cFwiPlxuICAgICAgICAgICAgICAgICAgPG13LWdtYXAgYWRkcmVzcz1cIm1hcC5jZW50ZXJcIiBvbi11cGRhdGUtZ2VvY29kZS1yZXN1bHRzPVwidXBkYXRlR2VvY29kZVJlc3VsdHMocmVzdWx0cylcIiBvbi1jbGljay1tYXJrZXI9XCJ1cGRhdGVQb3NpdGlvbihwb3NpdGlvbiwgYWRkcmVzcylcIj48L213LWdtYXA+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImZvcm0tZ3JvdXBcIj5cbiAgICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cInN1Ym1pdFwiIG5nLWRpc2FibGVkPVwiIWNsaWNrZWRBZGRyZXNzIHx8IGNsaWNrZWRBZGRyZXNzICE9IHRpbWVwbGFjZS5hZGRyZXNzXCIgY2xhc3M9XCJidG4gYnRuLXByaW1hcnlcIj5Db25maXJtPC9idXR0b24+XG4gICAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImJ0biBidG4tZGVmYXVsdFwiIHVpLXNyZWY9XCJsYW5kaW5nXCI+Q2FuY2VsPC9idXR0b24+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDwvZmllbGRzZXQ+XG4gICAgICAgICAgICA8L2Zvcm0+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgXCJcIlwiXG4gICAgZGl2ZXJ0VW50aWw6IFtcbiAgICAgIHRvOiBcImxvY2F0ZS5wb3NpdGlvblwiXG4gICAgICBwcmVkaWNhdGU6IFsgXCJsb2NhdGlvblwiLCAobG9jYXRpb24pIC0+IGxvY2F0aW9uLnBvc2l0aW9uIF1cbiAgICBdXG4gICAgY29udHJvbGxlcjogWyBcIiRzY29wZVwiLCBcIiRzdGF0ZVwiLCBcIiR0aW1lb3V0XCIsIFwibG9jYXRpb25cIiwgXCJnZW9jb2RlclwiLCBcInNlc3Npb25cIiwgKCRzY29wZSwgJHN0YXRlLCAkdGltZW91dCwgbG9jYXRpb24sIGdlb2NvZGVyLCBzZXNzaW9uKSAtPiAgICAgIFxuICAgICAgJHNjb3BlLm1hcCA9IGNlbnRlcjogXCJcIlxuICAgICAgJHNjb3BlLmNsaWNrZWRBZGRyZXNzID0gXCJcIlxuICAgICAgICBcbiAgICAgICRzY29wZS50aW1lcGxhY2UgPVxuICAgICAgICBkYXRldGltZTogbW9tZW50KCkuZm9ybWF0KFwiWVlZWS1NTS1ERFRISDptbTpzc1wiKVxuICAgICAgICBhZGRyZXNzOiBcIlwiXG4gICAgICAgIHBvc2l0aW9uOlxuICAgICAgICAgIGxhdDogbnVsbFxuICAgICAgICAgIGxvbjogbnVsbFxuICAgICAgXG4gICAgICAkc2NvcGUudXBkYXRlUG9zaXRpb24gPSAocG9zaXRpb24sIGFkZHJlc3MpIC0+XG4gICAgICAgICRzY29wZS50aW1lcGxhY2UuYWRkcmVzcyA9IGFkZHJlc3NcbiAgICAgICAgYW5ndWxhci5jb3B5IHBvc2l0aW9uLCAkc2NvcGUudGltZXBsYWNlLnBvc2l0aW9uXG4gICAgICAgIFxuICAgICAgICAkc2NvcGUuY2xpY2tlZEFkZHJlc3MgPSBhZGRyZXNzXG4gICAgICBcbiAgICAgICRzY29wZS51cGRhdGVHZW9jb2RlUmVzdWx0cyA9IChyZXN1bHRzKSAtPlxuICAgICAgICBhbmd1bGFyLmNvcHkgcmVzdWx0cywgJHNjb3BlLmFkZHJlc3Nlc1xuICAgICAgXG4gICAgICAkc2NvcGUuY29uZmlybSA9IChwb3NpdGlvbiwgYWRkcmVzcykgLT5cbiAgICAgICAgbG9jYXRpb24uY29uZmlybVBvc2l0aW9uKHBvc2l0aW9uKVxuICAgICAgICBsb2NhdGlvbi5jb25maXJtQWRkcmVzcyhhZGRyZXNzKVxuICAgICAgXG4gICAgICBnZW9jb2Rlci5yZXZlcnNlR2VvY29kZShsb2NhdGlvbi5wb3NpdGlvbi5sYXQsIGxvY2F0aW9uLnBvc2l0aW9uLmxvbikudGhlbiAocmVzdWx0cykgLT5cbiAgICAgICAgJHNjb3BlLmFkZHJlc3NlcyA9IHJlc3VsdHNcbiAgICAgICAgJHNjb3BlLnRpbWVwbGFjZS5hZGRyZXNzID0gcmVzdWx0c1swXT8uYWRkcmVzcyB1bmxlc3MgJHNjb3BlLnNlYXJjaEJ5VGltZVBsYWNlLiRkaXJ0eVxuICAgICAgICBcbiAgICAgICAgIyRzY29wZS5jb25maXJtQWRkcmVzcyhyZXN1bHRzWzBdLmFkZHJlc3MpIGlmIHJlc3VsdHMubGVuZ3RoIGlzIDFcbiAgICAgIFxuICAgICAgJHNjb3BlLiR3YXRjaCBcInRpbWVwbGFjZS5hZGRyZXNzXCIsIGRlYm91bmNlIDEwMDAsIChhZGRyZXNzKSAtPiAkc2NvcGUuJGFwcGx5IC0+XG4gICAgICAgICRzY29wZS5tYXAuY2VudGVyID0gYWRkcmVzc1xuICAgICAgICBcbiAgICAgICRzY29wZS5zZWFyY2hGb3JJZCA9IChldmVudElkKSAtPlxuICAgICAgICBjb25zb2xlLmxvZyBcIlNlYXJjaCBmb3JcIiwgZXZlbnRJZFxuICAgICAgXG4gICAgICAkc2NvcGUuc2VhcmNoRm9yVGltZVBsYWNlID0gKHRpbWVwbGFjZSkgLT5cbiAgICAgICAgY29uc29sZS5sb2cgXCJTZWFyY2ggZm9yXCIsIHRpbWVwbGFjZVxuICAgICAgICBcbiAgICBdXG5dIiwicmVxdWlyZSBcIi4uL3NlcnZpY2VzL3Nlc3Npb24uY29mZmVlXCJcbnJlcXVpcmUgXCIuLi9zZXJ2aWNlcy9vYXV0aC5jb2ZmZWVcIlxucmVxdWlyZSBcIi4uL3NlcnZpY2VzL2JhY2tlbmQuY29mZmVlXCJcbnJlcXVpcmUgXCIuLi9zZXJ2aWNlcy9ub3RpZmllci5jb2ZmZWVcIlxuXG5tb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSBcIm1ldHdvcmsuc3RhdGUudXNlclwiLCBbXG4gIFwidWkuYm9vdHN0cmFwXCJcbiAgXCJ1aS5yb3V0ZXJcIlxuICBcbiAgXCJtZXR3b3JrLnNlcnZpY2Uuc2Vzc2lvblwiXG4gIFwibWV0d29yay5zZXJ2aWNlLm9hdXRoXCJcbiAgXCJtZXR3b3JrLnNlcnZpY2UuYmFja2VuZFwiXG4gIFwibWV0d29yay5zZXJ2aWNlLm5vdGlmaWVyXCJcbl1cblxubW9kdWxlLmZpbHRlciBcImpvaW5cIiwgLT5cbiAgKGFyciwgc2VwID0gXCIsIFwiKSAtPiBhcnIuam9pbihzZXApXG5cblxubW9kdWxlLmNvbmZpZyBbIFwiJHN0YXRlUHJvdmlkZXJcIiwgKCRzdGF0ZVByb3ZpZGVyKSAtPlxuICAkc3RhdGVQcm92aWRlci5zdGF0ZSBcInVzZXJcIixcbiAgICB1cmw6IFwiL3VzZXJcIlxuICAgIHRlbXBsYXRlOiBcIlwiXCJcbiAgICAgIDxkaXYgY2xhc3M9XCJjb250YWluZXJcIj5cbiAgICAgICAgPGRpdiB1aS12aWV3PjwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgXCJcIlwiXG4gICAgY29udHJvbGxlcjogW1wiJHNjb3BlXCIsIFwiJHN0YXRlXCIsICgkc2NvcGUsICRzdGF0ZSkgLT5cbiAgICAgICRzdGF0ZS50cmFuc2l0aW9uVG8oXCJ1c2VyLmxvZ2luXCIpIGlmICRzdGF0ZS5pcyhcInVzZXJcIilcbiAgICBdXG5cbiAgJHN0YXRlUHJvdmlkZXIuc3RhdGUgXCJ1c2VyLmxvZ2luXCIsIHJlcXVpcmUoXCIuL3VzZXIvbG9naW4uY29mZmVlXCIpXG5cbiAgJHN0YXRlUHJvdmlkZXIuc3RhdGUgXCJ1c2VyLmxpbmtcIiwgcmVxdWlyZShcIi4vdXNlci9saW5rLmNvZmZlZVwiKVxuXG4gICRzdGF0ZVByb3ZpZGVyLnN0YXRlIFwidXNlci5jcmVhdGVcIiwgcmVxdWlyZShcIi4vdXNlci9jcmVhdGUuY29mZmVlXCIpXG4gIFxuICAkc3RhdGVQcm92aWRlci5zdGF0ZSBcInVzZXIucHJvZmlsZVwiLCByZXF1aXJlKFwiLi91c2VyL3Byb2ZpbGUuY29mZmVlXCIpXG5cbiAgJHN0YXRlUHJvdmlkZXIuc3RhdGUgXCJ1c2VyLmlkZW50aXRpZXNcIiwgcmVxdWlyZShcIi4vdXNlci9pZGVudGl0aWVzLmNvZmZlZVwiKVxuXG4gICRzdGF0ZVByb3ZpZGVyLnN0YXRlIFwidXNlci5sb2dvdXRcIixcbiAgICB1cmw6IFwiL2xvZ291dFwiXG4gICAgY29udHJvbGxlcjogW1wiJHN0YXRlXCIsIFwic2Vzc2lvblwiLCAoJHN0YXRlLCBzZXNzaW9uKSAtPlxuICAgICAgc2Vzc2lvbi5sb2dvdXQoKVxuICAgICAgJHN0YXRlLmdvIFwibGFuZGluZ1wiXG4gICAgXVxuXG5dIiwicmVxdWlyZSBcImFuZ3VsYXJ5dGljc1wiXG5cbnJlcXVpcmUgXCIuL3N0YXRlcy9sYW5kaW5nLmNvZmZlZVwiXG5yZXF1aXJlIFwiLi9zdGF0ZXMvY2hlY2tpbi5jb2ZmZWVcIlxucmVxdWlyZSBcIi4vc3RhdGVzL2V2ZW50LmNvZmZlZVwiXG5yZXF1aXJlIFwiLi9zdGF0ZXMvdXNlci5jb2ZmZWVcIlxucmVxdWlyZSBcIi4vc3RhdGVzL2xvY2F0ZS5jb2ZmZWVcIlxuXG5yZXF1aXJlIFwiLi9kaXJlY3RpdmVzL3VzZXJwYW5lbC5jb2ZmZWVcIlxucmVxdWlyZSBcIi4vZGlyZWN0aXZlcy9mbGFzaG1lc3NhZ2UuY29mZmVlXCJcblxuXG5tb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSBcIm1ldHdvcmtcIiwgW1xuICBcInVpLnJvdXRlclwiXG4gIFxuICBcImFuZ3VsYXJ5dGljc1wiXG5cbiAgXCJtZXR3b3JrLnN0YXRlLmxhbmRpbmdcIlxuICBcIm1ldHdvcmsuc3RhdGUuY2hlY2tpblwiXG4gIFwibWV0d29yay5zdGF0ZS5ldmVudFwiXG4gIFwibWV0d29yay5zdGF0ZS51c2VyXCJcbiAgXCJtZXR3b3JrLnN0YXRlLmxvY2F0ZVwiXG5cbiAgXCJtZXR3b3JrLmRpcmVjdGl2ZS5mbGFzaG1lc3NhZ2VcIlxuICBcIm1ldHdvcmsuZGlyZWN0aXZlLnVzZXJwYW5lbFwiXG5dXG5cbm1vZHVsZS5jb25maWcgWyBcIkFuZ3VsYXJ5dGljc1Byb3ZpZGVyXCIsIChBbmd1bGFyeXRpY3NQcm92aWRlcikgLT5cbiAgQW5ndWxhcnl0aWNzUHJvdmlkZXIuc2V0RXZlbnRIYW5kbGVycyhcIkdvb2dsZVVuaXZlcnNhbFwiKVxuICAjQW5ndWxhcnl0aWNzUHJvdmlkZXIuc2V0UGFnZUNoYW5nZUV2ZW50KFwiJHN0YXRlQ2hhbmdlU3VjY2Vzc1wiKVxuXVxuXG5tb2R1bGUucnVuIFsgXCJBbmd1bGFyeXRpY3NcIiwgKEFuZ3VsYXJ5dGljcykgLT5cbiAgQW5ndWxhcnl0aWNzLmluaXQoKVxuXVxuXG5tb2R1bGUuY29uZmlnIFsgXCIkc3RhdGVQcm92aWRlclwiLCBcIiR1cmxSb3V0ZXJQcm92aWRlclwiLCBcIiRsb2NhdGlvblByb3ZpZGVyXCIsICgkc3RhdGVQcm92aWRlciwgJHVybFJvdXRlclByb3ZpZGVyLCAkbG9jYXRpb25Qcm92aWRlcikgLT5cblxuICAkdXJsUm91dGVyUHJvdmlkZXIub3RoZXJ3aXNlKFwiL1wiKVxuICBcbiAgJGxvY2F0aW9uUHJvdmlkZXIuaHRtbDVNb2RlKHRydWUpXG4gIFxuXVxuXG5tb2R1bGUucnVuIFsgXCIkcm9vdFNjb3BlXCIsICgkcm9vdFNjb3BlKSAtPlxuICAjJHJvb3RTY29wZS4kb24gXCIkc3RhdGVDaGFuZ2VTdWNjZXNzXCIsIC0+IGNvbnNvbGUubG9nIFwiJHN0YXRlQ2hhbmdlU3VjY2Vzc1wiLCBhcmd1bWVudHMuLi5cbiAgIyRyb290U2NvcGUuJG9uIFwiJGxvY2F0aW9uQ2hhbmdlU3VjY2Vzc1wiLCAtPiBjb25zb2xlLmxvZyBcIiRsb2NhdGlvbkNoYW5nZVN1Y2Nlc3NcIiwgYXJndW1lbnRzLi4uXG5dXG5cbm1vZHVsZS5kaXJlY3RpdmUgXCJuZ0JsdXJcIiwgWyBcIiRpbnRlcnBvbGF0ZVwiLCAoJGludGVycG9sYXRlKSAtPlxuICBsaW5rOiAoJHNjb3BlLCAkZWxlbWVudCwgJGF0dHJzKSAtPlxuICAgICRlbGVtZW50LmJpbmQgXCJibHVyXCIsIC0+ICRzY29wZS4kYXBwbHkgLT5cbiAgICAgICRzY29wZS4kZXZhbCgkYXR0cnMubmdCbHVyKVxuXSIsIihmdW5jdGlvbiAoKSB7XG4gIGFuZ3VsYXIubW9kdWxlKCdhbmd1bGFyeXRpY3MnLCBbXSkucHJvdmlkZXIoJ0FuZ3VsYXJ5dGljcycsIGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgZXZlbnRIYW5kbGVyc05hbWVzID0gWydHb29nbGUnXTtcbiAgICB0aGlzLnNldEV2ZW50SGFuZGxlcnMgPSBmdW5jdGlvbiAoaGFuZGxlcnMpIHtcbiAgICAgIGlmIChhbmd1bGFyLmlzU3RyaW5nKGhhbmRsZXJzKSkge1xuICAgICAgICBoYW5kbGVycyA9IFtoYW5kbGVyc107XG4gICAgICB9XG4gICAgICBldmVudEhhbmRsZXJzTmFtZXMgPSBbXTtcbiAgICAgIGFuZ3VsYXIuZm9yRWFjaChoYW5kbGVycywgZnVuY3Rpb24gKGhhbmRsZXIpIHtcbiAgICAgICAgZXZlbnRIYW5kbGVyc05hbWVzLnB1c2goY2FwaXRhbGl6ZUhhbmRsZXIoaGFuZGxlcikpO1xuICAgICAgfSk7XG4gICAgfTtcbiAgICB2YXIgY2FwaXRhbGl6ZUhhbmRsZXIgPSBmdW5jdGlvbiAoaGFuZGxlcikge1xuICAgICAgcmV0dXJuIGhhbmRsZXIuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyBoYW5kbGVyLnN1YnN0cmluZygxKTtcbiAgICB9O1xuICAgIHRoaXMuJGdldCA9IFtcbiAgICAgICckaW5qZWN0b3InLFxuICAgICAgJyRyb290U2NvcGUnLFxuICAgICAgJyRsb2NhdGlvbicsXG4gICAgICBmdW5jdGlvbiAoJGluamVjdG9yLCAkcm9vdFNjb3BlLCAkbG9jYXRpb24pIHtcbiAgICAgICAgdmFyIGV2ZW50SGFuZGxlcnMgPSBbXTtcbiAgICAgICAgYW5ndWxhci5mb3JFYWNoKGV2ZW50SGFuZGxlcnNOYW1lcywgZnVuY3Rpb24gKGhhbmRsZXIpIHtcbiAgICAgICAgICBldmVudEhhbmRsZXJzLnB1c2goJGluamVjdG9yLmdldCgnQW5ndWxhcnl0aWNzJyArIGhhbmRsZXIgKyAnSGFuZGxlcicpKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHZhciBmb3JFYWNoSGFuZGxlckRvID0gZnVuY3Rpb24gKGFjdGlvbikge1xuICAgICAgICAgIGFuZ3VsYXIuZm9yRWFjaChldmVudEhhbmRsZXJzLCBmdW5jdGlvbiAoaGFuZGxlcikge1xuICAgICAgICAgICAgYWN0aW9uKGhhbmRsZXIpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuICAgICAgICAkcm9vdFNjb3BlLiRvbignJGxvY2F0aW9uQ2hhbmdlU3VjY2VzcycsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBmb3JFYWNoSGFuZGxlckRvKGZ1bmN0aW9uIChoYW5kbGVyKSB7XG4gICAgICAgICAgICB2YXIgdXJsID0gJGxvY2F0aW9uLnBhdGgoKTtcbiAgICAgICAgICAgIGlmICh1cmwpIHtcbiAgICAgICAgICAgICAgaGFuZGxlci50cmFja1BhZ2VWaWV3KHVybCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgICB2YXIgc2VydmljZSA9IHt9O1xuICAgICAgICBzZXJ2aWNlLmluaXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIH07XG4gICAgICAgIHNlcnZpY2UudHJhY2tFdmVudCA9IGZ1bmN0aW9uIChjYXRlZ29yeSwgYWN0aW9uLCBvcHRfbGFiZWwsIG9wdF92YWx1ZSwgb3B0X25vbmludGVyYWN0aW9uKSB7XG4gICAgICAgICAgZm9yRWFjaEhhbmRsZXJEbyhmdW5jdGlvbiAoaGFuZGxlcikge1xuICAgICAgICAgICAgaWYgKGNhdGVnb3J5ICYmIGFjdGlvbikge1xuICAgICAgICAgICAgICBoYW5kbGVyLnRyYWNrRXZlbnQoY2F0ZWdvcnksIGFjdGlvbiwgb3B0X2xhYmVsLCBvcHRfdmFsdWUsIG9wdF9ub25pbnRlcmFjdGlvbik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiBzZXJ2aWNlO1xuICAgICAgfVxuICAgIF07XG4gIH0pO1xufSgpKTtcbihmdW5jdGlvbiAoKSB7XG4gIGFuZ3VsYXIubW9kdWxlKCdhbmd1bGFyeXRpY3MnKS5mYWN0b3J5KCdBbmd1bGFyeXRpY3NDb25zb2xlSGFuZGxlcicsIFtcbiAgICAnJGxvZycsXG4gICAgZnVuY3Rpb24gKCRsb2cpIHtcbiAgICAgIHZhciBzZXJ2aWNlID0ge307XG4gICAgICBzZXJ2aWNlLnRyYWNrUGFnZVZpZXcgPSBmdW5jdGlvbiAodXJsKSB7XG4gICAgICAgICRsb2cubG9nKCdVUkwgdmlzaXRlZCcsIHVybCk7XG4gICAgICB9O1xuICAgICAgc2VydmljZS50cmFja0V2ZW50ID0gZnVuY3Rpb24gKGNhdGVnb3J5LCBhY3Rpb24sIG9wdF9sYWJlbCwgb3B0X3ZhbHVlLCBvcHRfbm9uaW50ZXJhY3Rpb24pIHtcbiAgICAgICAgJGxvZy5sb2coJ0V2ZW50IHRyYWNrZWQnLCBjYXRlZ29yeSwgYWN0aW9uLCBvcHRfbGFiZWwsIG9wdF92YWx1ZSwgb3B0X25vbmludGVyYWN0aW9uKTtcbiAgICAgIH07XG4gICAgICByZXR1cm4gc2VydmljZTtcbiAgICB9XG4gIF0pO1xufSgpKTtcbihmdW5jdGlvbiAoKSB7XG4gIGFuZ3VsYXIubW9kdWxlKCdhbmd1bGFyeXRpY3MnKS5mYWN0b3J5KCdBbmd1bGFyeXRpY3NHb29nbGVIYW5kbGVyJywgW1xuICAgICckbG9nJyxcbiAgICBmdW5jdGlvbiAoJGxvZykge1xuICAgICAgdmFyIHNlcnZpY2UgPSB7fTtcbiAgICAgIHNlcnZpY2UudHJhY2tQYWdlVmlldyA9IGZ1bmN0aW9uICh1cmwpIHtcbiAgICAgICAgX2dhcS5wdXNoKFtcbiAgICAgICAgICAnX3NldCcsXG4gICAgICAgICAgJ3BhZ2UnLFxuICAgICAgICAgIHVybFxuICAgICAgICBdKTtcbiAgICAgICAgX2dhcS5wdXNoKFtcbiAgICAgICAgICAnX3RyYWNrUGFnZXZpZXcnLFxuICAgICAgICAgIHVybFxuICAgICAgICBdKTtcbiAgICAgIH07XG4gICAgICBzZXJ2aWNlLnRyYWNrRXZlbnQgPSBmdW5jdGlvbiAoY2F0ZWdvcnksIGFjdGlvbiwgb3B0X2xhYmVsLCBvcHRfdmFsdWUsIG9wdF9ub25pbnRlcmFjdGlvbikge1xuICAgICAgICBfZ2FxLnB1c2goW1xuICAgICAgICAgICdfdHJhY2tFdmVudCcsXG4gICAgICAgICAgY2F0ZWdvcnksXG4gICAgICAgICAgYWN0aW9uLFxuICAgICAgICAgIG9wdF9sYWJlbCxcbiAgICAgICAgICBvcHRfdmFsdWUsXG4gICAgICAgICAgb3B0X25vbmludGVyYWN0aW9uXG4gICAgICAgIF0pO1xuICAgICAgfTtcbiAgICAgIHJldHVybiBzZXJ2aWNlO1xuICAgIH1cbiAgXSkuZmFjdG9yeSgnQW5ndWxhcnl0aWNzR29vZ2xlVW5pdmVyc2FsSGFuZGxlcicsIGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgc2VydmljZSA9IHt9O1xuICAgIHNlcnZpY2UudHJhY2tQYWdlVmlldyA9IGZ1bmN0aW9uICh1cmwpIHtcbiAgICAgIGdhKCdzZW5kJywgJ3BhZ2VWaWV3JywgdXJsKTtcbiAgICB9O1xuICAgIHNlcnZpY2UudHJhY2tFdmVudCA9IGZ1bmN0aW9uIChjYXRlZ29yeSwgYWN0aW9uLCBvcHRfbGFiZWwsIG9wdF92YWx1ZSwgb3B0X25vbmludGVyYWN0aW9uKSB7XG4gICAgICBnYSgnc2VuZCcsICdldmVudCcsIGNhdGVnb3J5LCBhY3Rpb24sIG9wdF9sYWJlbCwgb3B0X3ZhbHVlLCB7ICdub25JbnRlcmFjdGlvbic6IG9wdF9ub25pbnRlcmFjdGlvbiB9KTtcbiAgICB9O1xuICAgIHJldHVybiBzZXJ2aWNlO1xuICB9KTtcbn0oKSk7XG4oZnVuY3Rpb24gKCkge1xuICBhbmd1bGFyLm1vZHVsZSgnYW5ndWxhcnl0aWNzJykuZmlsdGVyKCd0cmFja0V2ZW50JywgW1xuICAgICdBbmd1bGFyeXRpY3MnLFxuICAgIGZ1bmN0aW9uIChBbmd1bGFyeXRpY3MpIHtcbiAgICAgIHJldHVybiBmdW5jdGlvbiAoZW50cnksIGNhdGVnb3J5LCBhY3Rpb24sIG9wdF9sYWJlbCwgb3B0X3ZhbHVlLCBvcHRfbm9uaW50ZXJhY3Rpb24pIHtcbiAgICAgICAgQW5ndWxhcnl0aWNzLnRyYWNrRXZlbnQoY2F0ZWdvcnksIGFjdGlvbiwgb3B0X2xhYmVsLCBvcHRfdmFsdWUsIG9wdF9ub25pbnRlcmFjdGlvbik7XG4gICAgICAgIHJldHVybiBlbnRyeTtcbiAgICAgIH07XG4gICAgfVxuICBdKTtcbn0oKSk7IiwibWFya2VkID0gcmVxdWlyZSBcIm1hcmtlZFwiXG5cbm1vZHVsZSA9IGFuZ3VsYXIubW9kdWxlIFwibWV0d29yay5kaXJlY3RpdmUubWFya2Rvd25cIiwgW11cblxubW9kdWxlLmRpcmVjdGl2ZSBcIm13TWFya2Rvd25cIiwgLT5cbiAgcmVzdHJpY3Q6IFwiRUFcIlxuICBsaW5rOiAoJHNjb3BlLCAkZWxlbWVudCwgJGF0dHJzKSAtPlxuICAgIHJlbmRlciA9IChjb2RlKSAtPiAkZWxlbWVudC5odG1sIG1hcmtlZChjb2RlKVxuICAgIFxuICAgIGlmICRhdHRycy5td01hcmtkb3duIHRoZW4gJHNjb3BlLiR3YXRjaCAkYXR0cnMubXdNYXJrZG93biwgcmVuZGVyXG4gICAgZWxzZSByZW5kZXIgJGVsZW1lbnQudGV4dCgpIiwiKGZ1bmN0aW9uKGdsb2JhbCl7LyoqXG4gKiBtYXJrZWQgLSBhIG1hcmtkb3duIHBhcnNlclxuICogQ29weXJpZ2h0IChjKSAyMDExLTIwMTMsIENocmlzdG9waGVyIEplZmZyZXkuIChNSVQgTGljZW5zZWQpXG4gKiBodHRwczovL2dpdGh1Yi5jb20vY2hqai9tYXJrZWRcbiAqL1xuXG47KGZ1bmN0aW9uKCkge1xuXG4vKipcbiAqIEJsb2NrLUxldmVsIEdyYW1tYXJcbiAqL1xuXG52YXIgYmxvY2sgPSB7XG4gIG5ld2xpbmU6IC9eXFxuKy8sXG4gIGNvZGU6IC9eKCB7NH1bXlxcbl0rXFxuKikrLyxcbiAgZmVuY2VzOiBub29wLFxuICBocjogL14oICpbLSpfXSl7Myx9ICooPzpcXG4rfCQpLyxcbiAgaGVhZGluZzogL14gKigjezEsNn0pICooW15cXG5dKz8pICojKiAqKD86XFxuK3wkKS8sXG4gIG5wdGFibGU6IG5vb3AsXG4gIGxoZWFkaW5nOiAvXihbXlxcbl0rKVxcbiAqKD18LSl7Myx9ICpcXG4qLyxcbiAgYmxvY2txdW90ZTogL14oICo+W15cXG5dKyhcXG5bXlxcbl0rKSpcXG4qKSsvLFxuICBsaXN0OiAvXiggKikoYnVsbCkgW1xcc1xcU10rPyg/OmhyfFxcbnsyLH0oPyEgKSg/IVxcMWJ1bGwgKVxcbip8XFxzKiQpLyxcbiAgaHRtbDogL14gKig/OmNvbW1lbnR8Y2xvc2VkfGNsb3NpbmcpICooPzpcXG57Mix9fFxccyokKS8sXG4gIGRlZjogL14gKlxcWyhbXlxcXV0rKVxcXTogKjw/KFteXFxzPl0rKT4/KD86ICtbXCIoXShbXlxcbl0rKVtcIildKT8gKig/Olxcbit8JCkvLFxuICB0YWJsZTogbm9vcCxcbiAgcGFyYWdyYXBoOiAvXigoPzpbXlxcbl0rXFxuPyg/IWhyfGhlYWRpbmd8bGhlYWRpbmd8YmxvY2txdW90ZXx0YWd8ZGVmKSkrKVxcbiovLFxuICB0ZXh0OiAvXlteXFxuXSsvXG59O1xuXG5ibG9jay5idWxsZXQgPSAvKD86WyorLV18XFxkK1xcLikvO1xuYmxvY2suaXRlbSA9IC9eKCAqKShidWxsKSBbXlxcbl0qKD86XFxuKD8hXFwxYnVsbCApW15cXG5dKikqLztcbmJsb2NrLml0ZW0gPSByZXBsYWNlKGJsb2NrLml0ZW0sICdnbScpXG4gICgvYnVsbC9nLCBibG9jay5idWxsZXQpXG4gICgpO1xuXG5ibG9jay5saXN0ID0gcmVwbGFjZShibG9jay5saXN0KVxuICAoL2J1bGwvZywgYmxvY2suYnVsbGV0KVxuICAoJ2hyJywgL1xcbisoPz0oPzogKlstKl9dKXszLH0gKig/Olxcbit8JCkpLylcbiAgKCk7XG5cbmJsb2NrLl90YWcgPSAnKD8hKD86J1xuICArICdhfGVtfHN0cm9uZ3xzbWFsbHxzfGNpdGV8cXxkZm58YWJicnxkYXRhfHRpbWV8Y29kZSdcbiAgKyAnfHZhcnxzYW1wfGtiZHxzdWJ8c3VwfGl8Ynx1fG1hcmt8cnVieXxydHxycHxiZGl8YmRvJ1xuICArICd8c3Bhbnxicnx3YnJ8aW5zfGRlbHxpbWcpXFxcXGIpXFxcXHcrKD8hOi98QClcXFxcYic7XG5cbmJsb2NrLmh0bWwgPSByZXBsYWNlKGJsb2NrLmh0bWwpXG4gICgnY29tbWVudCcsIC88IS0tW1xcc1xcU10qPy0tPi8pXG4gICgnY2xvc2VkJywgLzwodGFnKVtcXHNcXFNdKz88XFwvXFwxPi8pXG4gICgnY2xvc2luZycsIC88dGFnKD86XCJbXlwiXSpcInwnW14nXSonfFteJ1wiPl0pKj8+LylcbiAgKC90YWcvZywgYmxvY2suX3RhZylcbiAgKCk7XG5cbmJsb2NrLnBhcmFncmFwaCA9IHJlcGxhY2UoYmxvY2sucGFyYWdyYXBoKVxuICAoJ2hyJywgYmxvY2suaHIpXG4gICgnaGVhZGluZycsIGJsb2NrLmhlYWRpbmcpXG4gICgnbGhlYWRpbmcnLCBibG9jay5saGVhZGluZylcbiAgKCdibG9ja3F1b3RlJywgYmxvY2suYmxvY2txdW90ZSlcbiAgKCd0YWcnLCAnPCcgKyBibG9jay5fdGFnKVxuICAoJ2RlZicsIGJsb2NrLmRlZilcbiAgKCk7XG5cbi8qKlxuICogTm9ybWFsIEJsb2NrIEdyYW1tYXJcbiAqL1xuXG5ibG9jay5ub3JtYWwgPSBtZXJnZSh7fSwgYmxvY2spO1xuXG4vKipcbiAqIEdGTSBCbG9jayBHcmFtbWFyXG4gKi9cblxuYmxvY2suZ2ZtID0gbWVyZ2Uoe30sIGJsb2NrLm5vcm1hbCwge1xuICBmZW5jZXM6IC9eICooYHszLH18fnszLH0pICooXFxTKyk/ICpcXG4oW1xcc1xcU10rPylcXHMqXFwxICooPzpcXG4rfCQpLyxcbiAgcGFyYWdyYXBoOiAvXi9cbn0pO1xuXG5ibG9jay5nZm0ucGFyYWdyYXBoID0gcmVwbGFjZShibG9jay5wYXJhZ3JhcGgpXG4gICgnKD8hJywgJyg/IScgKyBibG9jay5nZm0uZmVuY2VzLnNvdXJjZS5yZXBsYWNlKCdcXFxcMScsICdcXFxcMicpICsgJ3wnKVxuICAoKTtcblxuLyoqXG4gKiBHRk0gKyBUYWJsZXMgQmxvY2sgR3JhbW1hclxuICovXG5cbmJsb2NrLnRhYmxlcyA9IG1lcmdlKHt9LCBibG9jay5nZm0sIHtcbiAgbnB0YWJsZTogL14gKihcXFMuKlxcfC4qKVxcbiAqKFstOl0rICpcXHxbLXwgOl0qKVxcbigoPzouKlxcfC4qKD86XFxufCQpKSopXFxuKi8sXG4gIHRhYmxlOiAvXiAqXFx8KC4rKVxcbiAqXFx8KCAqWy06XStbLXwgOl0qKVxcbigoPzogKlxcfC4qKD86XFxufCQpKSopXFxuKi9cbn0pO1xuXG4vKipcbiAqIEJsb2NrIExleGVyXG4gKi9cblxuZnVuY3Rpb24gTGV4ZXIob3B0aW9ucykge1xuICB0aGlzLnRva2VucyA9IFtdO1xuICB0aGlzLnRva2Vucy5saW5rcyA9IHt9O1xuICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zIHx8IG1hcmtlZC5kZWZhdWx0cztcbiAgdGhpcy5ydWxlcyA9IGJsb2NrLm5vcm1hbDtcblxuICBpZiAodGhpcy5vcHRpb25zLmdmbSkge1xuICAgIGlmICh0aGlzLm9wdGlvbnMudGFibGVzKSB7XG4gICAgICB0aGlzLnJ1bGVzID0gYmxvY2sudGFibGVzO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnJ1bGVzID0gYmxvY2suZ2ZtO1xuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIEV4cG9zZSBCbG9jayBSdWxlc1xuICovXG5cbkxleGVyLnJ1bGVzID0gYmxvY2s7XG5cbi8qKlxuICogU3RhdGljIExleCBNZXRob2RcbiAqL1xuXG5MZXhlci5sZXggPSBmdW5jdGlvbihzcmMsIG9wdGlvbnMpIHtcbiAgdmFyIGxleGVyID0gbmV3IExleGVyKG9wdGlvbnMpO1xuICByZXR1cm4gbGV4ZXIubGV4KHNyYyk7XG59O1xuXG4vKipcbiAqIFByZXByb2Nlc3NpbmdcbiAqL1xuXG5MZXhlci5wcm90b3R5cGUubGV4ID0gZnVuY3Rpb24oc3JjKSB7XG4gIHNyYyA9IHNyY1xuICAgIC5yZXBsYWNlKC9cXHJcXG58XFxyL2csICdcXG4nKVxuICAgIC5yZXBsYWNlKC9cXHQvZywgJyAgICAnKVxuICAgIC5yZXBsYWNlKC9cXHUwMGEwL2csICcgJylcbiAgICAucmVwbGFjZSgvXFx1MjQyNC9nLCAnXFxuJyk7XG5cbiAgcmV0dXJuIHRoaXMudG9rZW4oc3JjLCB0cnVlKTtcbn07XG5cbi8qKlxuICogTGV4aW5nXG4gKi9cblxuTGV4ZXIucHJvdG90eXBlLnRva2VuID0gZnVuY3Rpb24oc3JjLCB0b3ApIHtcbiAgdmFyIHNyYyA9IHNyYy5yZXBsYWNlKC9eICskL2dtLCAnJylcbiAgICAsIG5leHRcbiAgICAsIGxvb3NlXG4gICAgLCBjYXBcbiAgICAsIGJ1bGxcbiAgICAsIGJcbiAgICAsIGl0ZW1cbiAgICAsIHNwYWNlXG4gICAgLCBpXG4gICAgLCBsO1xuXG4gIHdoaWxlIChzcmMpIHtcbiAgICAvLyBuZXdsaW5lXG4gICAgaWYgKGNhcCA9IHRoaXMucnVsZXMubmV3bGluZS5leGVjKHNyYykpIHtcbiAgICAgIHNyYyA9IHNyYy5zdWJzdHJpbmcoY2FwWzBdLmxlbmd0aCk7XG4gICAgICBpZiAoY2FwWzBdLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgdGhpcy50b2tlbnMucHVzaCh7XG4gICAgICAgICAgdHlwZTogJ3NwYWNlJ1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBjb2RlXG4gICAgaWYgKGNhcCA9IHRoaXMucnVsZXMuY29kZS5leGVjKHNyYykpIHtcbiAgICAgIHNyYyA9IHNyYy5zdWJzdHJpbmcoY2FwWzBdLmxlbmd0aCk7XG4gICAgICBjYXAgPSBjYXBbMF0ucmVwbGFjZSgvXiB7NH0vZ20sICcnKTtcbiAgICAgIHRoaXMudG9rZW5zLnB1c2goe1xuICAgICAgICB0eXBlOiAnY29kZScsXG4gICAgICAgIHRleHQ6ICF0aGlzLm9wdGlvbnMucGVkYW50aWNcbiAgICAgICAgICA/IGNhcC5yZXBsYWNlKC9cXG4rJC8sICcnKVxuICAgICAgICAgIDogY2FwXG4gICAgICB9KTtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIC8vIGZlbmNlcyAoZ2ZtKVxuICAgIGlmIChjYXAgPSB0aGlzLnJ1bGVzLmZlbmNlcy5leGVjKHNyYykpIHtcbiAgICAgIHNyYyA9IHNyYy5zdWJzdHJpbmcoY2FwWzBdLmxlbmd0aCk7XG4gICAgICB0aGlzLnRva2Vucy5wdXNoKHtcbiAgICAgICAgdHlwZTogJ2NvZGUnLFxuICAgICAgICBsYW5nOiBjYXBbMl0sXG4gICAgICAgIHRleHQ6IGNhcFszXVxuICAgICAgfSk7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICAvLyBoZWFkaW5nXG4gICAgaWYgKGNhcCA9IHRoaXMucnVsZXMuaGVhZGluZy5leGVjKHNyYykpIHtcbiAgICAgIHNyYyA9IHNyYy5zdWJzdHJpbmcoY2FwWzBdLmxlbmd0aCk7XG4gICAgICB0aGlzLnRva2Vucy5wdXNoKHtcbiAgICAgICAgdHlwZTogJ2hlYWRpbmcnLFxuICAgICAgICBkZXB0aDogY2FwWzFdLmxlbmd0aCxcbiAgICAgICAgdGV4dDogY2FwWzJdXG4gICAgICB9KTtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIC8vIHRhYmxlIG5vIGxlYWRpbmcgcGlwZSAoZ2ZtKVxuICAgIGlmICh0b3AgJiYgKGNhcCA9IHRoaXMucnVsZXMubnB0YWJsZS5leGVjKHNyYykpKSB7XG4gICAgICBzcmMgPSBzcmMuc3Vic3RyaW5nKGNhcFswXS5sZW5ndGgpO1xuXG4gICAgICBpdGVtID0ge1xuICAgICAgICB0eXBlOiAndGFibGUnLFxuICAgICAgICBoZWFkZXI6IGNhcFsxXS5yZXBsYWNlKC9eICp8ICpcXHwgKiQvZywgJycpLnNwbGl0KC8gKlxcfCAqLyksXG4gICAgICAgIGFsaWduOiBjYXBbMl0ucmVwbGFjZSgvXiAqfFxcfCAqJC9nLCAnJykuc3BsaXQoLyAqXFx8ICovKSxcbiAgICAgICAgY2VsbHM6IGNhcFszXS5yZXBsYWNlKC9cXG4kLywgJycpLnNwbGl0KCdcXG4nKVxuICAgICAgfTtcblxuICAgICAgZm9yIChpID0gMDsgaSA8IGl0ZW0uYWxpZ24ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYgKC9eICotKzogKiQvLnRlc3QoaXRlbS5hbGlnbltpXSkpIHtcbiAgICAgICAgICBpdGVtLmFsaWduW2ldID0gJ3JpZ2h0JztcbiAgICAgICAgfSBlbHNlIGlmICgvXiAqOi0rOiAqJC8udGVzdChpdGVtLmFsaWduW2ldKSkge1xuICAgICAgICAgIGl0ZW0uYWxpZ25baV0gPSAnY2VudGVyJztcbiAgICAgICAgfSBlbHNlIGlmICgvXiAqOi0rICokLy50ZXN0KGl0ZW0uYWxpZ25baV0pKSB7XG4gICAgICAgICAgaXRlbS5hbGlnbltpXSA9ICdsZWZ0JztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpdGVtLmFsaWduW2ldID0gbnVsbDtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBmb3IgKGkgPSAwOyBpIDwgaXRlbS5jZWxscy5sZW5ndGg7IGkrKykge1xuICAgICAgICBpdGVtLmNlbGxzW2ldID0gaXRlbS5jZWxsc1tpXS5zcGxpdCgvICpcXHwgKi8pO1xuICAgICAgfVxuXG4gICAgICB0aGlzLnRva2Vucy5wdXNoKGl0ZW0pO1xuXG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICAvLyBsaGVhZGluZ1xuICAgIGlmIChjYXAgPSB0aGlzLnJ1bGVzLmxoZWFkaW5nLmV4ZWMoc3JjKSkge1xuICAgICAgc3JjID0gc3JjLnN1YnN0cmluZyhjYXBbMF0ubGVuZ3RoKTtcbiAgICAgIHRoaXMudG9rZW5zLnB1c2goe1xuICAgICAgICB0eXBlOiAnaGVhZGluZycsXG4gICAgICAgIGRlcHRoOiBjYXBbMl0gPT09ICc9JyA/IDEgOiAyLFxuICAgICAgICB0ZXh0OiBjYXBbMV1cbiAgICAgIH0pO1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgLy8gaHJcbiAgICBpZiAoY2FwID0gdGhpcy5ydWxlcy5oci5leGVjKHNyYykpIHtcbiAgICAgIHNyYyA9IHNyYy5zdWJzdHJpbmcoY2FwWzBdLmxlbmd0aCk7XG4gICAgICB0aGlzLnRva2Vucy5wdXNoKHtcbiAgICAgICAgdHlwZTogJ2hyJ1xuICAgICAgfSk7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICAvLyBibG9ja3F1b3RlXG4gICAgaWYgKGNhcCA9IHRoaXMucnVsZXMuYmxvY2txdW90ZS5leGVjKHNyYykpIHtcbiAgICAgIHNyYyA9IHNyYy5zdWJzdHJpbmcoY2FwWzBdLmxlbmd0aCk7XG5cbiAgICAgIHRoaXMudG9rZW5zLnB1c2goe1xuICAgICAgICB0eXBlOiAnYmxvY2txdW90ZV9zdGFydCdcbiAgICAgIH0pO1xuXG4gICAgICBjYXAgPSBjYXBbMF0ucmVwbGFjZSgvXiAqPiA/L2dtLCAnJyk7XG5cbiAgICAgIC8vIFBhc3MgYHRvcGAgdG8ga2VlcCB0aGUgY3VycmVudFxuICAgICAgLy8gXCJ0b3BsZXZlbFwiIHN0YXRlLiBUaGlzIGlzIGV4YWN0bHlcbiAgICAgIC8vIGhvdyBtYXJrZG93bi5wbCB3b3Jrcy5cbiAgICAgIHRoaXMudG9rZW4oY2FwLCB0b3ApO1xuXG4gICAgICB0aGlzLnRva2Vucy5wdXNoKHtcbiAgICAgICAgdHlwZTogJ2Jsb2NrcXVvdGVfZW5kJ1xuICAgICAgfSk7XG5cbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIC8vIGxpc3RcbiAgICBpZiAoY2FwID0gdGhpcy5ydWxlcy5saXN0LmV4ZWMoc3JjKSkge1xuICAgICAgc3JjID0gc3JjLnN1YnN0cmluZyhjYXBbMF0ubGVuZ3RoKTtcbiAgICAgIGJ1bGwgPSBjYXBbMl07XG5cbiAgICAgIHRoaXMudG9rZW5zLnB1c2goe1xuICAgICAgICB0eXBlOiAnbGlzdF9zdGFydCcsXG4gICAgICAgIG9yZGVyZWQ6IGJ1bGwubGVuZ3RoID4gMVxuICAgICAgfSk7XG5cbiAgICAgIC8vIEdldCBlYWNoIHRvcC1sZXZlbCBpdGVtLlxuICAgICAgY2FwID0gY2FwWzBdLm1hdGNoKHRoaXMucnVsZXMuaXRlbSk7XG5cbiAgICAgIG5leHQgPSBmYWxzZTtcbiAgICAgIGwgPSBjYXAubGVuZ3RoO1xuICAgICAgaSA9IDA7XG5cbiAgICAgIGZvciAoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgIGl0ZW0gPSBjYXBbaV07XG5cbiAgICAgICAgLy8gUmVtb3ZlIHRoZSBsaXN0IGl0ZW0ncyBidWxsZXRcbiAgICAgICAgLy8gc28gaXQgaXMgc2VlbiBhcyB0aGUgbmV4dCB0b2tlbi5cbiAgICAgICAgc3BhY2UgPSBpdGVtLmxlbmd0aDtcbiAgICAgICAgaXRlbSA9IGl0ZW0ucmVwbGFjZSgvXiAqKFsqKy1dfFxcZCtcXC4pICsvLCAnJyk7XG5cbiAgICAgICAgLy8gT3V0ZGVudCB3aGF0ZXZlciB0aGVcbiAgICAgICAgLy8gbGlzdCBpdGVtIGNvbnRhaW5zLiBIYWNreS5cbiAgICAgICAgaWYgKH5pdGVtLmluZGV4T2YoJ1xcbiAnKSkge1xuICAgICAgICAgIHNwYWNlIC09IGl0ZW0ubGVuZ3RoO1xuICAgICAgICAgIGl0ZW0gPSAhdGhpcy5vcHRpb25zLnBlZGFudGljXG4gICAgICAgICAgICA/IGl0ZW0ucmVwbGFjZShuZXcgUmVnRXhwKCdeIHsxLCcgKyBzcGFjZSArICd9JywgJ2dtJyksICcnKVxuICAgICAgICAgICAgOiBpdGVtLnJlcGxhY2UoL14gezEsNH0vZ20sICcnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIERldGVybWluZSB3aGV0aGVyIHRoZSBuZXh0IGxpc3QgaXRlbSBiZWxvbmdzIGhlcmUuXG4gICAgICAgIC8vIEJhY2twZWRhbCBpZiBpdCBkb2VzIG5vdCBiZWxvbmcgaW4gdGhpcyBsaXN0LlxuICAgICAgICBpZiAodGhpcy5vcHRpb25zLnNtYXJ0TGlzdHMgJiYgaSAhPT0gbCAtIDEpIHtcbiAgICAgICAgICBiID0gYmxvY2suYnVsbGV0LmV4ZWMoY2FwW2krMV0pWzBdO1xuICAgICAgICAgIGlmIChidWxsICE9PSBiICYmICEoYnVsbC5sZW5ndGggPiAxICYmIGIubGVuZ3RoID4gMSkpIHtcbiAgICAgICAgICAgIHNyYyA9IGNhcC5zbGljZShpICsgMSkuam9pbignXFxuJykgKyBzcmM7XG4gICAgICAgICAgICBpID0gbCAtIDE7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gRGV0ZXJtaW5lIHdoZXRoZXIgaXRlbSBpcyBsb29zZSBvciBub3QuXG4gICAgICAgIC8vIFVzZTogLyhefFxcbikoPyEgKVteXFxuXStcXG5cXG4oPyFcXHMqJCkvXG4gICAgICAgIC8vIGZvciBkaXNjb3VudCBiZWhhdmlvci5cbiAgICAgICAgbG9vc2UgPSBuZXh0IHx8IC9cXG5cXG4oPyFcXHMqJCkvLnRlc3QoaXRlbSk7XG4gICAgICAgIGlmIChpICE9PSBsIC0gMSkge1xuICAgICAgICAgIG5leHQgPSBpdGVtW2l0ZW0ubGVuZ3RoLTFdID09PSAnXFxuJztcbiAgICAgICAgICBpZiAoIWxvb3NlKSBsb29zZSA9IG5leHQ7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnRva2Vucy5wdXNoKHtcbiAgICAgICAgICB0eXBlOiBsb29zZVxuICAgICAgICAgICAgPyAnbG9vc2VfaXRlbV9zdGFydCdcbiAgICAgICAgICAgIDogJ2xpc3RfaXRlbV9zdGFydCdcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gUmVjdXJzZS5cbiAgICAgICAgdGhpcy50b2tlbihpdGVtLCBmYWxzZSk7XG5cbiAgICAgICAgdGhpcy50b2tlbnMucHVzaCh7XG4gICAgICAgICAgdHlwZTogJ2xpc3RfaXRlbV9lbmQnXG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICB0aGlzLnRva2Vucy5wdXNoKHtcbiAgICAgICAgdHlwZTogJ2xpc3RfZW5kJ1xuICAgICAgfSk7XG5cbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIC8vIGh0bWxcbiAgICBpZiAoY2FwID0gdGhpcy5ydWxlcy5odG1sLmV4ZWMoc3JjKSkge1xuICAgICAgc3JjID0gc3JjLnN1YnN0cmluZyhjYXBbMF0ubGVuZ3RoKTtcbiAgICAgIHRoaXMudG9rZW5zLnB1c2goe1xuICAgICAgICB0eXBlOiB0aGlzLm9wdGlvbnMuc2FuaXRpemVcbiAgICAgICAgICA/ICdwYXJhZ3JhcGgnXG4gICAgICAgICAgOiAnaHRtbCcsXG4gICAgICAgIHByZTogY2FwWzFdID09PSAncHJlJyB8fCBjYXBbMV0gPT09ICdzY3JpcHQnLFxuICAgICAgICB0ZXh0OiBjYXBbMF1cbiAgICAgIH0pO1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgLy8gZGVmXG4gICAgaWYgKHRvcCAmJiAoY2FwID0gdGhpcy5ydWxlcy5kZWYuZXhlYyhzcmMpKSkge1xuICAgICAgc3JjID0gc3JjLnN1YnN0cmluZyhjYXBbMF0ubGVuZ3RoKTtcbiAgICAgIHRoaXMudG9rZW5zLmxpbmtzW2NhcFsxXS50b0xvd2VyQ2FzZSgpXSA9IHtcbiAgICAgICAgaHJlZjogY2FwWzJdLFxuICAgICAgICB0aXRsZTogY2FwWzNdXG4gICAgICB9O1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgLy8gdGFibGUgKGdmbSlcbiAgICBpZiAodG9wICYmIChjYXAgPSB0aGlzLnJ1bGVzLnRhYmxlLmV4ZWMoc3JjKSkpIHtcbiAgICAgIHNyYyA9IHNyYy5zdWJzdHJpbmcoY2FwWzBdLmxlbmd0aCk7XG5cbiAgICAgIGl0ZW0gPSB7XG4gICAgICAgIHR5cGU6ICd0YWJsZScsXG4gICAgICAgIGhlYWRlcjogY2FwWzFdLnJlcGxhY2UoL14gKnwgKlxcfCAqJC9nLCAnJykuc3BsaXQoLyAqXFx8ICovKSxcbiAgICAgICAgYWxpZ246IGNhcFsyXS5yZXBsYWNlKC9eICp8XFx8ICokL2csICcnKS5zcGxpdCgvICpcXHwgKi8pLFxuICAgICAgICBjZWxsczogY2FwWzNdLnJlcGxhY2UoLyg/OiAqXFx8ICopP1xcbiQvLCAnJykuc3BsaXQoJ1xcbicpXG4gICAgICB9O1xuXG4gICAgICBmb3IgKGkgPSAwOyBpIDwgaXRlbS5hbGlnbi5sZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAoL14gKi0rOiAqJC8udGVzdChpdGVtLmFsaWduW2ldKSkge1xuICAgICAgICAgIGl0ZW0uYWxpZ25baV0gPSAncmlnaHQnO1xuICAgICAgICB9IGVsc2UgaWYgKC9eICo6LSs6ICokLy50ZXN0KGl0ZW0uYWxpZ25baV0pKSB7XG4gICAgICAgICAgaXRlbS5hbGlnbltpXSA9ICdjZW50ZXInO1xuICAgICAgICB9IGVsc2UgaWYgKC9eICo6LSsgKiQvLnRlc3QoaXRlbS5hbGlnbltpXSkpIHtcbiAgICAgICAgICBpdGVtLmFsaWduW2ldID0gJ2xlZnQnO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGl0ZW0uYWxpZ25baV0gPSBudWxsO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGZvciAoaSA9IDA7IGkgPCBpdGVtLmNlbGxzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGl0ZW0uY2VsbHNbaV0gPSBpdGVtLmNlbGxzW2ldXG4gICAgICAgICAgLnJlcGxhY2UoL14gKlxcfCAqfCAqXFx8ICokL2csICcnKVxuICAgICAgICAgIC5zcGxpdCgvICpcXHwgKi8pO1xuICAgICAgfVxuXG4gICAgICB0aGlzLnRva2Vucy5wdXNoKGl0ZW0pO1xuXG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICAvLyB0b3AtbGV2ZWwgcGFyYWdyYXBoXG4gICAgaWYgKHRvcCAmJiAoY2FwID0gdGhpcy5ydWxlcy5wYXJhZ3JhcGguZXhlYyhzcmMpKSkge1xuICAgICAgc3JjID0gc3JjLnN1YnN0cmluZyhjYXBbMF0ubGVuZ3RoKTtcbiAgICAgIHRoaXMudG9rZW5zLnB1c2goe1xuICAgICAgICB0eXBlOiAncGFyYWdyYXBoJyxcbiAgICAgICAgdGV4dDogY2FwWzFdW2NhcFsxXS5sZW5ndGgtMV0gPT09ICdcXG4nXG4gICAgICAgICAgPyBjYXBbMV0uc2xpY2UoMCwgLTEpXG4gICAgICAgICAgOiBjYXBbMV1cbiAgICAgIH0pO1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgLy8gdGV4dFxuICAgIGlmIChjYXAgPSB0aGlzLnJ1bGVzLnRleHQuZXhlYyhzcmMpKSB7XG4gICAgICAvLyBUb3AtbGV2ZWwgc2hvdWxkIG5ldmVyIHJlYWNoIGhlcmUuXG4gICAgICBzcmMgPSBzcmMuc3Vic3RyaW5nKGNhcFswXS5sZW5ndGgpO1xuICAgICAgdGhpcy50b2tlbnMucHVzaCh7XG4gICAgICAgIHR5cGU6ICd0ZXh0JyxcbiAgICAgICAgdGV4dDogY2FwWzBdXG4gICAgICB9KTtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIGlmIChzcmMpIHtcbiAgICAgIHRocm93IG5ld1xuICAgICAgICBFcnJvcignSW5maW5pdGUgbG9vcCBvbiBieXRlOiAnICsgc3JjLmNoYXJDb2RlQXQoMCkpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB0aGlzLnRva2Vucztcbn07XG5cbi8qKlxuICogSW5saW5lLUxldmVsIEdyYW1tYXJcbiAqL1xuXG52YXIgaW5saW5lID0ge1xuICBlc2NhcGU6IC9eXFxcXChbXFxcXGAqe31cXFtcXF0oKSMrXFwtLiFfPl0pLyxcbiAgYXV0b2xpbms6IC9ePChbXiA+XSsoQHw6XFwvKVteID5dKyk+LyxcbiAgdXJsOiBub29wLFxuICB0YWc6IC9ePCEtLVtcXHNcXFNdKj8tLT58XjxcXC8/XFx3Kyg/OlwiW15cIl0qXCJ8J1teJ10qJ3xbXidcIj5dKSo/Pi8sXG4gIGxpbms6IC9eIT9cXFsoaW5zaWRlKVxcXVxcKGhyZWZcXCkvLFxuICByZWZsaW5rOiAvXiE/XFxbKGluc2lkZSlcXF1cXHMqXFxbKFteXFxdXSopXFxdLyxcbiAgbm9saW5rOiAvXiE/XFxbKCg/OlxcW1teXFxdXSpcXF18W15cXFtcXF1dKSopXFxdLyxcbiAgc3Ryb25nOiAvXl9fKFtcXHNcXFNdKz8pX18oPyFfKXxeXFwqXFwqKFtcXHNcXFNdKz8pXFwqXFwqKD8hXFwqKS8sXG4gIGVtOiAvXlxcYl8oKD86X198W1xcc1xcU10pKz8pX1xcYnxeXFwqKCg/OlxcKlxcKnxbXFxzXFxTXSkrPylcXCooPyFcXCopLyxcbiAgY29kZTogL14oYCspXFxzKihbXFxzXFxTXSo/W15gXSlcXHMqXFwxKD8hYCkvLFxuICBicjogL14gezIsfVxcbig/IVxccyokKS8sXG4gIGRlbDogbm9vcCxcbiAgdGV4dDogL15bXFxzXFxTXSs/KD89W1xcXFw8IVxcW18qYF18IHsyLH1cXG58JCkvXG59O1xuXG5pbmxpbmUuX2luc2lkZSA9IC8oPzpcXFtbXlxcXV0qXFxdfFteXFxdXXxcXF0oPz1bXlxcW10qXFxdKSkqLztcbmlubGluZS5faHJlZiA9IC9cXHMqPD8oW15cXHNdKj8pPj8oPzpcXHMrWydcIl0oW1xcc1xcU10qPylbJ1wiXSk/XFxzKi87XG5cbmlubGluZS5saW5rID0gcmVwbGFjZShpbmxpbmUubGluaylcbiAgKCdpbnNpZGUnLCBpbmxpbmUuX2luc2lkZSlcbiAgKCdocmVmJywgaW5saW5lLl9ocmVmKVxuICAoKTtcblxuaW5saW5lLnJlZmxpbmsgPSByZXBsYWNlKGlubGluZS5yZWZsaW5rKVxuICAoJ2luc2lkZScsIGlubGluZS5faW5zaWRlKVxuICAoKTtcblxuLyoqXG4gKiBOb3JtYWwgSW5saW5lIEdyYW1tYXJcbiAqL1xuXG5pbmxpbmUubm9ybWFsID0gbWVyZ2Uoe30sIGlubGluZSk7XG5cbi8qKlxuICogUGVkYW50aWMgSW5saW5lIEdyYW1tYXJcbiAqL1xuXG5pbmxpbmUucGVkYW50aWMgPSBtZXJnZSh7fSwgaW5saW5lLm5vcm1hbCwge1xuICBzdHJvbmc6IC9eX18oPz1cXFMpKFtcXHNcXFNdKj9cXFMpX18oPyFfKXxeXFwqXFwqKD89XFxTKShbXFxzXFxTXSo/XFxTKVxcKlxcKig/IVxcKikvLFxuICBlbTogL15fKD89XFxTKShbXFxzXFxTXSo/XFxTKV8oPyFfKXxeXFwqKD89XFxTKShbXFxzXFxTXSo/XFxTKVxcKig/IVxcKikvXG59KTtcblxuLyoqXG4gKiBHRk0gSW5saW5lIEdyYW1tYXJcbiAqL1xuXG5pbmxpbmUuZ2ZtID0gbWVyZ2Uoe30sIGlubGluZS5ub3JtYWwsIHtcbiAgZXNjYXBlOiByZXBsYWNlKGlubGluZS5lc2NhcGUpKCddKScsICd+fF0pJykoKSxcbiAgdXJsOiAvXihodHRwcz86XFwvXFwvW15cXHM8XStbXjwuLDo7XCInKVxcXVxcc10pLyxcbiAgZGVsOiAvXn5+KD89XFxTKShbXFxzXFxTXSo/XFxTKX5+LyxcbiAgdGV4dDogcmVwbGFjZShpbmxpbmUudGV4dClcbiAgICAoJ118JywgJ35dfCcpXG4gICAgKCd8JywgJ3xodHRwcz86Ly98JylcbiAgICAoKVxufSk7XG5cbi8qKlxuICogR0ZNICsgTGluZSBCcmVha3MgSW5saW5lIEdyYW1tYXJcbiAqL1xuXG5pbmxpbmUuYnJlYWtzID0gbWVyZ2Uoe30sIGlubGluZS5nZm0sIHtcbiAgYnI6IHJlcGxhY2UoaW5saW5lLmJyKSgnezIsfScsICcqJykoKSxcbiAgdGV4dDogcmVwbGFjZShpbmxpbmUuZ2ZtLnRleHQpKCd7Mix9JywgJyonKSgpXG59KTtcblxuLyoqXG4gKiBJbmxpbmUgTGV4ZXIgJiBDb21waWxlclxuICovXG5cbmZ1bmN0aW9uIElubGluZUxleGVyKGxpbmtzLCBvcHRpb25zKSB7XG4gIHRoaXMub3B0aW9ucyA9IG9wdGlvbnMgfHwgbWFya2VkLmRlZmF1bHRzO1xuICB0aGlzLmxpbmtzID0gbGlua3M7XG4gIHRoaXMucnVsZXMgPSBpbmxpbmUubm9ybWFsO1xuXG4gIGlmICghdGhpcy5saW5rcykge1xuICAgIHRocm93IG5ld1xuICAgICAgRXJyb3IoJ1Rva2VucyBhcnJheSByZXF1aXJlcyBhIGBsaW5rc2AgcHJvcGVydHkuJyk7XG4gIH1cblxuICBpZiAodGhpcy5vcHRpb25zLmdmbSkge1xuICAgIGlmICh0aGlzLm9wdGlvbnMuYnJlYWtzKSB7XG4gICAgICB0aGlzLnJ1bGVzID0gaW5saW5lLmJyZWFrcztcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5ydWxlcyA9IGlubGluZS5nZm07XG4gICAgfVxuICB9IGVsc2UgaWYgKHRoaXMub3B0aW9ucy5wZWRhbnRpYykge1xuICAgIHRoaXMucnVsZXMgPSBpbmxpbmUucGVkYW50aWM7XG4gIH1cbn1cblxuLyoqXG4gKiBFeHBvc2UgSW5saW5lIFJ1bGVzXG4gKi9cblxuSW5saW5lTGV4ZXIucnVsZXMgPSBpbmxpbmU7XG5cbi8qKlxuICogU3RhdGljIExleGluZy9Db21waWxpbmcgTWV0aG9kXG4gKi9cblxuSW5saW5lTGV4ZXIub3V0cHV0ID0gZnVuY3Rpb24oc3JjLCBsaW5rcywgb3B0aW9ucykge1xuICB2YXIgaW5saW5lID0gbmV3IElubGluZUxleGVyKGxpbmtzLCBvcHRpb25zKTtcbiAgcmV0dXJuIGlubGluZS5vdXRwdXQoc3JjKTtcbn07XG5cbi8qKlxuICogTGV4aW5nL0NvbXBpbGluZ1xuICovXG5cbklubGluZUxleGVyLnByb3RvdHlwZS5vdXRwdXQgPSBmdW5jdGlvbihzcmMpIHtcbiAgdmFyIG91dCA9ICcnXG4gICAgLCBsaW5rXG4gICAgLCB0ZXh0XG4gICAgLCBocmVmXG4gICAgLCBjYXA7XG5cbiAgd2hpbGUgKHNyYykge1xuICAgIC8vIGVzY2FwZVxuICAgIGlmIChjYXAgPSB0aGlzLnJ1bGVzLmVzY2FwZS5leGVjKHNyYykpIHtcbiAgICAgIHNyYyA9IHNyYy5zdWJzdHJpbmcoY2FwWzBdLmxlbmd0aCk7XG4gICAgICBvdXQgKz0gY2FwWzFdO1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgLy8gYXV0b2xpbmtcbiAgICBpZiAoY2FwID0gdGhpcy5ydWxlcy5hdXRvbGluay5leGVjKHNyYykpIHtcbiAgICAgIHNyYyA9IHNyYy5zdWJzdHJpbmcoY2FwWzBdLmxlbmd0aCk7XG4gICAgICBpZiAoY2FwWzJdID09PSAnQCcpIHtcbiAgICAgICAgdGV4dCA9IGNhcFsxXVs2XSA9PT0gJzonXG4gICAgICAgICAgPyB0aGlzLm1hbmdsZShjYXBbMV0uc3Vic3RyaW5nKDcpKVxuICAgICAgICAgIDogdGhpcy5tYW5nbGUoY2FwWzFdKTtcbiAgICAgICAgaHJlZiA9IHRoaXMubWFuZ2xlKCdtYWlsdG86JykgKyB0ZXh0O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGV4dCA9IGVzY2FwZShjYXBbMV0pO1xuICAgICAgICBocmVmID0gdGV4dDtcbiAgICAgIH1cbiAgICAgIG91dCArPSAnPGEgaHJlZj1cIidcbiAgICAgICAgKyBocmVmXG4gICAgICAgICsgJ1wiPidcbiAgICAgICAgKyB0ZXh0XG4gICAgICAgICsgJzwvYT4nO1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgLy8gdXJsIChnZm0pXG4gICAgaWYgKGNhcCA9IHRoaXMucnVsZXMudXJsLmV4ZWMoc3JjKSkge1xuICAgICAgc3JjID0gc3JjLnN1YnN0cmluZyhjYXBbMF0ubGVuZ3RoKTtcbiAgICAgIHRleHQgPSBlc2NhcGUoY2FwWzFdKTtcbiAgICAgIGhyZWYgPSB0ZXh0O1xuICAgICAgb3V0ICs9ICc8YSBocmVmPVwiJ1xuICAgICAgICArIGhyZWZcbiAgICAgICAgKyAnXCI+J1xuICAgICAgICArIHRleHRcbiAgICAgICAgKyAnPC9hPic7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICAvLyB0YWdcbiAgICBpZiAoY2FwID0gdGhpcy5ydWxlcy50YWcuZXhlYyhzcmMpKSB7XG4gICAgICBzcmMgPSBzcmMuc3Vic3RyaW5nKGNhcFswXS5sZW5ndGgpO1xuICAgICAgb3V0ICs9IHRoaXMub3B0aW9ucy5zYW5pdGl6ZVxuICAgICAgICA/IGVzY2FwZShjYXBbMF0pXG4gICAgICAgIDogY2FwWzBdO1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgLy8gbGlua1xuICAgIGlmIChjYXAgPSB0aGlzLnJ1bGVzLmxpbmsuZXhlYyhzcmMpKSB7XG4gICAgICBzcmMgPSBzcmMuc3Vic3RyaW5nKGNhcFswXS5sZW5ndGgpO1xuICAgICAgb3V0ICs9IHRoaXMub3V0cHV0TGluayhjYXAsIHtcbiAgICAgICAgaHJlZjogY2FwWzJdLFxuICAgICAgICB0aXRsZTogY2FwWzNdXG4gICAgICB9KTtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIC8vIHJlZmxpbmssIG5vbGlua1xuICAgIGlmICgoY2FwID0gdGhpcy5ydWxlcy5yZWZsaW5rLmV4ZWMoc3JjKSlcbiAgICAgICAgfHwgKGNhcCA9IHRoaXMucnVsZXMubm9saW5rLmV4ZWMoc3JjKSkpIHtcbiAgICAgIHNyYyA9IHNyYy5zdWJzdHJpbmcoY2FwWzBdLmxlbmd0aCk7XG4gICAgICBsaW5rID0gKGNhcFsyXSB8fCBjYXBbMV0pLnJlcGxhY2UoL1xccysvZywgJyAnKTtcbiAgICAgIGxpbmsgPSB0aGlzLmxpbmtzW2xpbmsudG9Mb3dlckNhc2UoKV07XG4gICAgICBpZiAoIWxpbmsgfHwgIWxpbmsuaHJlZikge1xuICAgICAgICBvdXQgKz0gY2FwWzBdWzBdO1xuICAgICAgICBzcmMgPSBjYXBbMF0uc3Vic3RyaW5nKDEpICsgc3JjO1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICAgIG91dCArPSB0aGlzLm91dHB1dExpbmsoY2FwLCBsaW5rKTtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIC8vIHN0cm9uZ1xuICAgIGlmIChjYXAgPSB0aGlzLnJ1bGVzLnN0cm9uZy5leGVjKHNyYykpIHtcbiAgICAgIHNyYyA9IHNyYy5zdWJzdHJpbmcoY2FwWzBdLmxlbmd0aCk7XG4gICAgICBvdXQgKz0gJzxzdHJvbmc+J1xuICAgICAgICArIHRoaXMub3V0cHV0KGNhcFsyXSB8fCBjYXBbMV0pXG4gICAgICAgICsgJzwvc3Ryb25nPic7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICAvLyBlbVxuICAgIGlmIChjYXAgPSB0aGlzLnJ1bGVzLmVtLmV4ZWMoc3JjKSkge1xuICAgICAgc3JjID0gc3JjLnN1YnN0cmluZyhjYXBbMF0ubGVuZ3RoKTtcbiAgICAgIG91dCArPSAnPGVtPidcbiAgICAgICAgKyB0aGlzLm91dHB1dChjYXBbMl0gfHwgY2FwWzFdKVxuICAgICAgICArICc8L2VtPic7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICAvLyBjb2RlXG4gICAgaWYgKGNhcCA9IHRoaXMucnVsZXMuY29kZS5leGVjKHNyYykpIHtcbiAgICAgIHNyYyA9IHNyYy5zdWJzdHJpbmcoY2FwWzBdLmxlbmd0aCk7XG4gICAgICBvdXQgKz0gJzxjb2RlPidcbiAgICAgICAgKyBlc2NhcGUoY2FwWzJdLCB0cnVlKVxuICAgICAgICArICc8L2NvZGU+JztcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIC8vIGJyXG4gICAgaWYgKGNhcCA9IHRoaXMucnVsZXMuYnIuZXhlYyhzcmMpKSB7XG4gICAgICBzcmMgPSBzcmMuc3Vic3RyaW5nKGNhcFswXS5sZW5ndGgpO1xuICAgICAgb3V0ICs9ICc8YnI+JztcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIC8vIGRlbCAoZ2ZtKVxuICAgIGlmIChjYXAgPSB0aGlzLnJ1bGVzLmRlbC5leGVjKHNyYykpIHtcbiAgICAgIHNyYyA9IHNyYy5zdWJzdHJpbmcoY2FwWzBdLmxlbmd0aCk7XG4gICAgICBvdXQgKz0gJzxkZWw+J1xuICAgICAgICArIHRoaXMub3V0cHV0KGNhcFsxXSlcbiAgICAgICAgKyAnPC9kZWw+JztcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIC8vIHRleHRcbiAgICBpZiAoY2FwID0gdGhpcy5ydWxlcy50ZXh0LmV4ZWMoc3JjKSkge1xuICAgICAgc3JjID0gc3JjLnN1YnN0cmluZyhjYXBbMF0ubGVuZ3RoKTtcbiAgICAgIG91dCArPSBlc2NhcGUodGhpcy5zbWFydHlwYW50cyhjYXBbMF0pKTtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIGlmIChzcmMpIHtcbiAgICAgIHRocm93IG5ld1xuICAgICAgICBFcnJvcignSW5maW5pdGUgbG9vcCBvbiBieXRlOiAnICsgc3JjLmNoYXJDb2RlQXQoMCkpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBvdXQ7XG59O1xuXG4vKipcbiAqIENvbXBpbGUgTGlua1xuICovXG5cbklubGluZUxleGVyLnByb3RvdHlwZS5vdXRwdXRMaW5rID0gZnVuY3Rpb24oY2FwLCBsaW5rKSB7XG4gIGlmIChjYXBbMF1bMF0gIT09ICchJykge1xuICAgIHJldHVybiAnPGEgaHJlZj1cIidcbiAgICAgICsgZXNjYXBlKGxpbmsuaHJlZilcbiAgICAgICsgJ1wiJ1xuICAgICAgKyAobGluay50aXRsZVxuICAgICAgPyAnIHRpdGxlPVwiJ1xuICAgICAgKyBlc2NhcGUobGluay50aXRsZSlcbiAgICAgICsgJ1wiJ1xuICAgICAgOiAnJylcbiAgICAgICsgJz4nXG4gICAgICArIHRoaXMub3V0cHV0KGNhcFsxXSlcbiAgICAgICsgJzwvYT4nO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiAnPGltZyBzcmM9XCInXG4gICAgICArIGVzY2FwZShsaW5rLmhyZWYpXG4gICAgICArICdcIiBhbHQ9XCInXG4gICAgICArIGVzY2FwZShjYXBbMV0pXG4gICAgICArICdcIidcbiAgICAgICsgKGxpbmsudGl0bGVcbiAgICAgID8gJyB0aXRsZT1cIidcbiAgICAgICsgZXNjYXBlKGxpbmsudGl0bGUpXG4gICAgICArICdcIidcbiAgICAgIDogJycpXG4gICAgICArICc+JztcbiAgfVxufTtcblxuLyoqXG4gKiBTbWFydHlwYW50cyBUcmFuc2Zvcm1hdGlvbnNcbiAqL1xuXG5JbmxpbmVMZXhlci5wcm90b3R5cGUuc21hcnR5cGFudHMgPSBmdW5jdGlvbih0ZXh0KSB7XG4gIGlmICghdGhpcy5vcHRpb25zLnNtYXJ0eXBhbnRzKSByZXR1cm4gdGV4dDtcbiAgcmV0dXJuIHRleHRcbiAgICAucmVwbGFjZSgvLS0vZywgJ1xcdTIwMTQnKVxuICAgIC5yZXBsYWNlKC8nKFteJ10qKScvZywgJ1xcdTIwMTgkMVxcdTIwMTknKVxuICAgIC5yZXBsYWNlKC9cIihbXlwiXSopXCIvZywgJ1xcdTIwMUMkMVxcdTIwMUQnKVxuICAgIC5yZXBsYWNlKC9cXC57M30vZywgJ1xcdTIwMjYnKTtcbn07XG5cbi8qKlxuICogTWFuZ2xlIExpbmtzXG4gKi9cblxuSW5saW5lTGV4ZXIucHJvdG90eXBlLm1hbmdsZSA9IGZ1bmN0aW9uKHRleHQpIHtcbiAgdmFyIG91dCA9ICcnXG4gICAgLCBsID0gdGV4dC5sZW5ndGhcbiAgICAsIGkgPSAwXG4gICAgLCBjaDtcblxuICBmb3IgKDsgaSA8IGw7IGkrKykge1xuICAgIGNoID0gdGV4dC5jaGFyQ29kZUF0KGkpO1xuICAgIGlmIChNYXRoLnJhbmRvbSgpID4gMC41KSB7XG4gICAgICBjaCA9ICd4JyArIGNoLnRvU3RyaW5nKDE2KTtcbiAgICB9XG4gICAgb3V0ICs9ICcmIycgKyBjaCArICc7JztcbiAgfVxuXG4gIHJldHVybiBvdXQ7XG59O1xuXG4vKipcbiAqIFBhcnNpbmcgJiBDb21waWxpbmdcbiAqL1xuXG5mdW5jdGlvbiBQYXJzZXIob3B0aW9ucykge1xuICB0aGlzLnRva2VucyA9IFtdO1xuICB0aGlzLnRva2VuID0gbnVsbDtcbiAgdGhpcy5vcHRpb25zID0gb3B0aW9ucyB8fCBtYXJrZWQuZGVmYXVsdHM7XG59XG5cbi8qKlxuICogU3RhdGljIFBhcnNlIE1ldGhvZFxuICovXG5cblBhcnNlci5wYXJzZSA9IGZ1bmN0aW9uKHNyYywgb3B0aW9ucykge1xuICB2YXIgcGFyc2VyID0gbmV3IFBhcnNlcihvcHRpb25zKTtcbiAgcmV0dXJuIHBhcnNlci5wYXJzZShzcmMpO1xufTtcblxuLyoqXG4gKiBQYXJzZSBMb29wXG4gKi9cblxuUGFyc2VyLnByb3RvdHlwZS5wYXJzZSA9IGZ1bmN0aW9uKHNyYykge1xuICB0aGlzLmlubGluZSA9IG5ldyBJbmxpbmVMZXhlcihzcmMubGlua3MsIHRoaXMub3B0aW9ucyk7XG4gIHRoaXMudG9rZW5zID0gc3JjLnJldmVyc2UoKTtcblxuICB2YXIgb3V0ID0gJyc7XG4gIHdoaWxlICh0aGlzLm5leHQoKSkge1xuICAgIG91dCArPSB0aGlzLnRvaygpO1xuICB9XG5cbiAgcmV0dXJuIG91dDtcbn07XG5cbi8qKlxuICogTmV4dCBUb2tlblxuICovXG5cblBhcnNlci5wcm90b3R5cGUubmV4dCA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gdGhpcy50b2tlbiA9IHRoaXMudG9rZW5zLnBvcCgpO1xufTtcblxuLyoqXG4gKiBQcmV2aWV3IE5leHQgVG9rZW5cbiAqL1xuXG5QYXJzZXIucHJvdG90eXBlLnBlZWsgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHRoaXMudG9rZW5zW3RoaXMudG9rZW5zLmxlbmd0aC0xXSB8fCAwO1xufTtcblxuLyoqXG4gKiBQYXJzZSBUZXh0IFRva2Vuc1xuICovXG5cblBhcnNlci5wcm90b3R5cGUucGFyc2VUZXh0ID0gZnVuY3Rpb24oKSB7XG4gIHZhciBib2R5ID0gdGhpcy50b2tlbi50ZXh0O1xuXG4gIHdoaWxlICh0aGlzLnBlZWsoKS50eXBlID09PSAndGV4dCcpIHtcbiAgICBib2R5ICs9ICdcXG4nICsgdGhpcy5uZXh0KCkudGV4dDtcbiAgfVxuXG4gIHJldHVybiB0aGlzLmlubGluZS5vdXRwdXQoYm9keSk7XG59O1xuXG4vKipcbiAqIFBhcnNlIEN1cnJlbnQgVG9rZW5cbiAqL1xuXG5QYXJzZXIucHJvdG90eXBlLnRvayA9IGZ1bmN0aW9uKCkge1xuICBzd2l0Y2ggKHRoaXMudG9rZW4udHlwZSkge1xuICAgIGNhc2UgJ3NwYWNlJzoge1xuICAgICAgcmV0dXJuICcnO1xuICAgIH1cbiAgICBjYXNlICdocic6IHtcbiAgICAgIHJldHVybiAnPGhyPlxcbic7XG4gICAgfVxuICAgIGNhc2UgJ2hlYWRpbmcnOiB7XG4gICAgICByZXR1cm4gJzxoJ1xuICAgICAgICArIHRoaXMudG9rZW4uZGVwdGhcbiAgICAgICAgKyAnPidcbiAgICAgICAgKyB0aGlzLmlubGluZS5vdXRwdXQodGhpcy50b2tlbi50ZXh0KVxuICAgICAgICArICc8L2gnXG4gICAgICAgICsgdGhpcy50b2tlbi5kZXB0aFxuICAgICAgICArICc+XFxuJztcbiAgICB9XG4gICAgY2FzZSAnY29kZSc6IHtcbiAgICAgIGlmICh0aGlzLm9wdGlvbnMuaGlnaGxpZ2h0KSB7XG4gICAgICAgIHZhciBjb2RlID0gdGhpcy5vcHRpb25zLmhpZ2hsaWdodCh0aGlzLnRva2VuLnRleHQsIHRoaXMudG9rZW4ubGFuZyk7XG4gICAgICAgIGlmIChjb2RlICE9IG51bGwgJiYgY29kZSAhPT0gdGhpcy50b2tlbi50ZXh0KSB7XG4gICAgICAgICAgdGhpcy50b2tlbi5lc2NhcGVkID0gdHJ1ZTtcbiAgICAgICAgICB0aGlzLnRva2VuLnRleHQgPSBjb2RlO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmICghdGhpcy50b2tlbi5lc2NhcGVkKSB7XG4gICAgICAgIHRoaXMudG9rZW4udGV4dCA9IGVzY2FwZSh0aGlzLnRva2VuLnRleHQsIHRydWUpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gJzxwcmU+PGNvZGUnXG4gICAgICAgICsgKHRoaXMudG9rZW4ubGFuZ1xuICAgICAgICA/ICcgY2xhc3M9XCInXG4gICAgICAgICsgdGhpcy5vcHRpb25zLmxhbmdQcmVmaXhcbiAgICAgICAgKyB0aGlzLnRva2VuLmxhbmdcbiAgICAgICAgKyAnXCInXG4gICAgICAgIDogJycpXG4gICAgICAgICsgJz4nXG4gICAgICAgICsgdGhpcy50b2tlbi50ZXh0XG4gICAgICAgICsgJzwvY29kZT48L3ByZT5cXG4nO1xuICAgIH1cbiAgICBjYXNlICd0YWJsZSc6IHtcbiAgICAgIHZhciBib2R5ID0gJydcbiAgICAgICAgLCBoZWFkaW5nXG4gICAgICAgICwgaVxuICAgICAgICAsIHJvd1xuICAgICAgICAsIGNlbGxcbiAgICAgICAgLCBqO1xuXG4gICAgICAvLyBoZWFkZXJcbiAgICAgIGJvZHkgKz0gJzx0aGVhZD5cXG48dHI+XFxuJztcbiAgICAgIGZvciAoaSA9IDA7IGkgPCB0aGlzLnRva2VuLmhlYWRlci5sZW5ndGg7IGkrKykge1xuICAgICAgICBoZWFkaW5nID0gdGhpcy5pbmxpbmUub3V0cHV0KHRoaXMudG9rZW4uaGVhZGVyW2ldKTtcbiAgICAgICAgYm9keSArPSB0aGlzLnRva2VuLmFsaWduW2ldXG4gICAgICAgICAgPyAnPHRoIGFsaWduPVwiJyArIHRoaXMudG9rZW4uYWxpZ25baV0gKyAnXCI+JyArIGhlYWRpbmcgKyAnPC90aD5cXG4nXG4gICAgICAgICAgOiAnPHRoPicgKyBoZWFkaW5nICsgJzwvdGg+XFxuJztcbiAgICAgIH1cbiAgICAgIGJvZHkgKz0gJzwvdHI+XFxuPC90aGVhZD5cXG4nO1xuXG4gICAgICAvLyBib2R5XG4gICAgICBib2R5ICs9ICc8dGJvZHk+XFxuJ1xuICAgICAgZm9yIChpID0gMDsgaSA8IHRoaXMudG9rZW4uY2VsbHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgcm93ID0gdGhpcy50b2tlbi5jZWxsc1tpXTtcbiAgICAgICAgYm9keSArPSAnPHRyPlxcbic7XG4gICAgICAgIGZvciAoaiA9IDA7IGogPCByb3cubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICBjZWxsID0gdGhpcy5pbmxpbmUub3V0cHV0KHJvd1tqXSk7XG4gICAgICAgICAgYm9keSArPSB0aGlzLnRva2VuLmFsaWduW2pdXG4gICAgICAgICAgICA/ICc8dGQgYWxpZ249XCInICsgdGhpcy50b2tlbi5hbGlnbltqXSArICdcIj4nICsgY2VsbCArICc8L3RkPlxcbidcbiAgICAgICAgICAgIDogJzx0ZD4nICsgY2VsbCArICc8L3RkPlxcbic7XG4gICAgICAgIH1cbiAgICAgICAgYm9keSArPSAnPC90cj5cXG4nO1xuICAgICAgfVxuICAgICAgYm9keSArPSAnPC90Ym9keT5cXG4nO1xuXG4gICAgICByZXR1cm4gJzx0YWJsZT5cXG4nXG4gICAgICAgICsgYm9keVxuICAgICAgICArICc8L3RhYmxlPlxcbic7XG4gICAgfVxuICAgIGNhc2UgJ2Jsb2NrcXVvdGVfc3RhcnQnOiB7XG4gICAgICB2YXIgYm9keSA9ICcnO1xuXG4gICAgICB3aGlsZSAodGhpcy5uZXh0KCkudHlwZSAhPT0gJ2Jsb2NrcXVvdGVfZW5kJykge1xuICAgICAgICBib2R5ICs9IHRoaXMudG9rKCk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiAnPGJsb2NrcXVvdGU+XFxuJ1xuICAgICAgICArIGJvZHlcbiAgICAgICAgKyAnPC9ibG9ja3F1b3RlPlxcbic7XG4gICAgfVxuICAgIGNhc2UgJ2xpc3Rfc3RhcnQnOiB7XG4gICAgICB2YXIgdHlwZSA9IHRoaXMudG9rZW4ub3JkZXJlZCA/ICdvbCcgOiAndWwnXG4gICAgICAgICwgYm9keSA9ICcnO1xuXG4gICAgICB3aGlsZSAodGhpcy5uZXh0KCkudHlwZSAhPT0gJ2xpc3RfZW5kJykge1xuICAgICAgICBib2R5ICs9IHRoaXMudG9rKCk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiAnPCdcbiAgICAgICAgKyB0eXBlXG4gICAgICAgICsgJz5cXG4nXG4gICAgICAgICsgYm9keVxuICAgICAgICArICc8LydcbiAgICAgICAgKyB0eXBlXG4gICAgICAgICsgJz5cXG4nO1xuICAgIH1cbiAgICBjYXNlICdsaXN0X2l0ZW1fc3RhcnQnOiB7XG4gICAgICB2YXIgYm9keSA9ICcnO1xuXG4gICAgICB3aGlsZSAodGhpcy5uZXh0KCkudHlwZSAhPT0gJ2xpc3RfaXRlbV9lbmQnKSB7XG4gICAgICAgIGJvZHkgKz0gdGhpcy50b2tlbi50eXBlID09PSAndGV4dCdcbiAgICAgICAgICA/IHRoaXMucGFyc2VUZXh0KClcbiAgICAgICAgICA6IHRoaXMudG9rKCk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiAnPGxpPidcbiAgICAgICAgKyBib2R5XG4gICAgICAgICsgJzwvbGk+XFxuJztcbiAgICB9XG4gICAgY2FzZSAnbG9vc2VfaXRlbV9zdGFydCc6IHtcbiAgICAgIHZhciBib2R5ID0gJyc7XG5cbiAgICAgIHdoaWxlICh0aGlzLm5leHQoKS50eXBlICE9PSAnbGlzdF9pdGVtX2VuZCcpIHtcbiAgICAgICAgYm9keSArPSB0aGlzLnRvaygpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gJzxsaT4nXG4gICAgICAgICsgYm9keVxuICAgICAgICArICc8L2xpPlxcbic7XG4gICAgfVxuICAgIGNhc2UgJ2h0bWwnOiB7XG4gICAgICByZXR1cm4gIXRoaXMudG9rZW4ucHJlICYmICF0aGlzLm9wdGlvbnMucGVkYW50aWNcbiAgICAgICAgPyB0aGlzLmlubGluZS5vdXRwdXQodGhpcy50b2tlbi50ZXh0KVxuICAgICAgICA6IHRoaXMudG9rZW4udGV4dDtcbiAgICB9XG4gICAgY2FzZSAncGFyYWdyYXBoJzoge1xuICAgICAgcmV0dXJuICc8cD4nXG4gICAgICAgICsgdGhpcy5pbmxpbmUub3V0cHV0KHRoaXMudG9rZW4udGV4dClcbiAgICAgICAgKyAnPC9wPlxcbic7XG4gICAgfVxuICAgIGNhc2UgJ3RleHQnOiB7XG4gICAgICByZXR1cm4gJzxwPidcbiAgICAgICAgKyB0aGlzLnBhcnNlVGV4dCgpXG4gICAgICAgICsgJzwvcD5cXG4nO1xuICAgIH1cbiAgfVxufTtcblxuLyoqXG4gKiBIZWxwZXJzXG4gKi9cblxuZnVuY3Rpb24gZXNjYXBlKGh0bWwsIGVuY29kZSkge1xuICByZXR1cm4gaHRtbFxuICAgIC5yZXBsYWNlKCFlbmNvZGUgPyAvJig/ISM/XFx3KzspL2cgOiAvJi9nLCAnJmFtcDsnKVxuICAgIC5yZXBsYWNlKC88L2csICcmbHQ7JylcbiAgICAucmVwbGFjZSgvPi9nLCAnJmd0OycpXG4gICAgLnJlcGxhY2UoL1wiL2csICcmcXVvdDsnKVxuICAgIC5yZXBsYWNlKC8nL2csICcmIzM5OycpO1xufVxuXG5mdW5jdGlvbiByZXBsYWNlKHJlZ2V4LCBvcHQpIHtcbiAgcmVnZXggPSByZWdleC5zb3VyY2U7XG4gIG9wdCA9IG9wdCB8fCAnJztcbiAgcmV0dXJuIGZ1bmN0aW9uIHNlbGYobmFtZSwgdmFsKSB7XG4gICAgaWYgKCFuYW1lKSByZXR1cm4gbmV3IFJlZ0V4cChyZWdleCwgb3B0KTtcbiAgICB2YWwgPSB2YWwuc291cmNlIHx8IHZhbDtcbiAgICB2YWwgPSB2YWwucmVwbGFjZSgvKF58W15cXFtdKVxcXi9nLCAnJDEnKTtcbiAgICByZWdleCA9IHJlZ2V4LnJlcGxhY2UobmFtZSwgdmFsKTtcbiAgICByZXR1cm4gc2VsZjtcbiAgfTtcbn1cblxuZnVuY3Rpb24gbm9vcCgpIHt9XG5ub29wLmV4ZWMgPSBub29wO1xuXG5mdW5jdGlvbiBtZXJnZShvYmopIHtcbiAgdmFyIGkgPSAxXG4gICAgLCB0YXJnZXRcbiAgICAsIGtleTtcblxuICBmb3IgKDsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgIHRhcmdldCA9IGFyZ3VtZW50c1tpXTtcbiAgICBmb3IgKGtleSBpbiB0YXJnZXQpIHtcbiAgICAgIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwodGFyZ2V0LCBrZXkpKSB7XG4gICAgICAgIG9ialtrZXldID0gdGFyZ2V0W2tleV07XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIG9iajtcbn1cblxuLyoqXG4gKiBNYXJrZWRcbiAqL1xuXG5mdW5jdGlvbiBtYXJrZWQoc3JjLCBvcHQsIGNhbGxiYWNrKSB7XG4gIGlmIChjYWxsYmFjayB8fCB0eXBlb2Ygb3B0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgaWYgKCFjYWxsYmFjaykge1xuICAgICAgY2FsbGJhY2sgPSBvcHQ7XG4gICAgICBvcHQgPSBudWxsO1xuICAgIH1cblxuICAgIGlmIChvcHQpIG9wdCA9IG1lcmdlKHt9LCBtYXJrZWQuZGVmYXVsdHMsIG9wdCk7XG5cbiAgICB2YXIgaGlnaGxpZ2h0ID0gb3B0LmhpZ2hsaWdodFxuICAgICAgLCB0b2tlbnNcbiAgICAgICwgcGVuZGluZ1xuICAgICAgLCBpID0gMDtcblxuICAgIHRyeSB7XG4gICAgICB0b2tlbnMgPSBMZXhlci5sZXgoc3JjLCBvcHQpXG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgcmV0dXJuIGNhbGxiYWNrKGUpO1xuICAgIH1cblxuICAgIHBlbmRpbmcgPSB0b2tlbnMubGVuZ3RoO1xuXG4gICAgdmFyIGRvbmUgPSBmdW5jdGlvbihoaSkge1xuICAgICAgdmFyIG91dCwgZXJyO1xuXG4gICAgICBpZiAoaGkgIT09IHRydWUpIHtcbiAgICAgICAgZGVsZXRlIG9wdC5oaWdobGlnaHQ7XG4gICAgICB9XG5cbiAgICAgIHRyeSB7XG4gICAgICAgIG91dCA9IFBhcnNlci5wYXJzZSh0b2tlbnMsIG9wdCk7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGVyciA9IGU7XG4gICAgICB9XG5cbiAgICAgIG9wdC5oaWdobGlnaHQgPSBoaWdobGlnaHQ7XG5cbiAgICAgIHJldHVybiBlcnJcbiAgICAgICAgPyBjYWxsYmFjayhlcnIpXG4gICAgICAgIDogY2FsbGJhY2sobnVsbCwgb3V0KTtcbiAgICB9O1xuXG4gICAgaWYgKCFoaWdobGlnaHQgfHwgaGlnaGxpZ2h0Lmxlbmd0aCA8IDMpIHtcbiAgICAgIHJldHVybiBkb25lKHRydWUpO1xuICAgIH1cblxuICAgIGlmICghcGVuZGluZykgcmV0dXJuIGRvbmUoKTtcblxuICAgIGZvciAoOyBpIDwgdG9rZW5zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAoZnVuY3Rpb24odG9rZW4pIHtcbiAgICAgICAgaWYgKHRva2VuLnR5cGUgIT09ICdjb2RlJykge1xuICAgICAgICAgIHJldHVybiAtLXBlbmRpbmcgfHwgZG9uZSgpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBoaWdobGlnaHQodG9rZW4udGV4dCwgdG9rZW4ubGFuZywgZnVuY3Rpb24oZXJyLCBjb2RlKSB7XG4gICAgICAgICAgaWYgKGNvZGUgPT0gbnVsbCB8fCBjb2RlID09PSB0b2tlbi50ZXh0KSB7XG4gICAgICAgICAgICByZXR1cm4gLS1wZW5kaW5nIHx8IGRvbmUoKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgdG9rZW4udGV4dCA9IGNvZGU7XG4gICAgICAgICAgdG9rZW4uZXNjYXBlZCA9IHRydWU7XG4gICAgICAgICAgLS1wZW5kaW5nIHx8IGRvbmUoKTtcbiAgICAgICAgfSk7XG4gICAgICB9KSh0b2tlbnNbaV0pO1xuICAgIH1cblxuICAgIHJldHVybjtcbiAgfVxuICB0cnkge1xuICAgIGlmIChvcHQpIG9wdCA9IG1lcmdlKHt9LCBtYXJrZWQuZGVmYXVsdHMsIG9wdCk7XG4gICAgcmV0dXJuIFBhcnNlci5wYXJzZShMZXhlci5sZXgoc3JjLCBvcHQpLCBvcHQpO1xuICB9IGNhdGNoIChlKSB7XG4gICAgZS5tZXNzYWdlICs9ICdcXG5QbGVhc2UgcmVwb3J0IHRoaXMgdG8gaHR0cHM6Ly9naXRodWIuY29tL2NoamovbWFya2VkLic7XG4gICAgaWYgKChvcHQgfHwgbWFya2VkLmRlZmF1bHRzKS5zaWxlbnQpIHtcbiAgICAgIHJldHVybiAnPHA+QW4gZXJyb3Igb2NjdXJlZDo8L3A+PHByZT4nXG4gICAgICAgICsgZXNjYXBlKGUubWVzc2FnZSArICcnLCB0cnVlKVxuICAgICAgICArICc8L3ByZT4nO1xuICAgIH1cbiAgICB0aHJvdyBlO1xuICB9XG59XG5cbi8qKlxuICogT3B0aW9uc1xuICovXG5cbm1hcmtlZC5vcHRpb25zID1cbm1hcmtlZC5zZXRPcHRpb25zID0gZnVuY3Rpb24ob3B0KSB7XG4gIG1lcmdlKG1hcmtlZC5kZWZhdWx0cywgb3B0KTtcbiAgcmV0dXJuIG1hcmtlZDtcbn07XG5cbm1hcmtlZC5kZWZhdWx0cyA9IHtcbiAgZ2ZtOiB0cnVlLFxuICB0YWJsZXM6IHRydWUsXG4gIGJyZWFrczogZmFsc2UsXG4gIHBlZGFudGljOiBmYWxzZSxcbiAgc2FuaXRpemU6IGZhbHNlLFxuICBzbWFydExpc3RzOiBmYWxzZSxcbiAgc2lsZW50OiBmYWxzZSxcbiAgaGlnaGxpZ2h0OiBudWxsLFxuICBsYW5nUHJlZml4OiAnbGFuZy0nLFxuICBzbWFydHlwYW50czogZmFsc2Vcbn07XG5cbi8qKlxuICogRXhwb3NlXG4gKi9cblxubWFya2VkLlBhcnNlciA9IFBhcnNlcjtcbm1hcmtlZC5wYXJzZXIgPSBQYXJzZXIucGFyc2U7XG5cbm1hcmtlZC5MZXhlciA9IExleGVyO1xubWFya2VkLmxleGVyID0gTGV4ZXIubGV4O1xuXG5tYXJrZWQuSW5saW5lTGV4ZXIgPSBJbmxpbmVMZXhlcjtcbm1hcmtlZC5pbmxpbmVMZXhlciA9IElubGluZUxleGVyLm91dHB1dDtcblxubWFya2VkLnBhcnNlID0gbWFya2VkO1xuXG5pZiAodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnKSB7XG4gIG1vZHVsZS5leHBvcnRzID0gbWFya2VkO1xufSBlbHNlIGlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIHtcbiAgZGVmaW5lKGZ1bmN0aW9uKCkgeyByZXR1cm4gbWFya2VkOyB9KTtcbn0gZWxzZSB7XG4gIHRoaXMubWFya2VkID0gbWFya2VkO1xufVxuXG59KS5jYWxsKGZ1bmN0aW9uKCkge1xuICByZXR1cm4gdGhpcyB8fCAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgPyB3aW5kb3cgOiBnbG9iYWwpO1xufSgpKTtcblxufSkod2luZG93KSJdfQ==
;