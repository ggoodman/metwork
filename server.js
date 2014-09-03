var coffee = require("coffee-script");

var server = require("./index");

server.listen(process.env.PORT || 8080, process.env.IP, function(){
  console.log("[OK] Server started");
});