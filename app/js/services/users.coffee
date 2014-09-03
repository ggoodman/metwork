module = angular.module "metwork.service.users", [
  "restangular"
]

module.config [ "RestangularProvider", (RestangularProvider) ->
  RestangularProvider.setBaseUrl "http://metwork-api.ggoodman.c9.io"
  RestangularProvider.setRestangularFields id: "_id"
]

module.factory "users", [ "Restangular", (Restangular) ->
  usersBase = Restangular.all("users")
  
  augment: (obj) -> 
  create: (json) -> usersBase.post(json)
]