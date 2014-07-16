angular.module('MyApp').
  filter('fromNow', function () {
      return function (airDateTime) {
          console.log(airDateTime);
          return moment(airDateTime).fromNow();
        }
    });