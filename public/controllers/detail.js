angular.module('MyApp')
  .controller('DetailCtrl', ['$scope', '$rootScope', '$routeParams', 'Show', 'Subscription',
    function ($scope, $rootScope, $routeParams, Show, Subscription) {
        Show.get({ _id: $routeParams.id }, function (show) {
            $scope.show = show;


            $scope.isSubscribed = function () {
                return $scope.show.subscribers.indexOf($rootScope.currentUser._id) !== -1;
            };

            $scope.subscribe = function () {
                Subscription.subscribe(show).success(function () {
                    $scope.show.subscribers.push($rootScope.currentUser._id);
                });
            };

            $scope.unsubscribe = function () {
                Subscription.unsubscribe(show).success(function () {
                    var index = $scope.show.subscribers.indexOf($rootScope.currentUser._id);
                    $scope.show.subscribers.splice(index, 1);
                });
            };
            function parseHour(airTime) {
                var addHours = airTime.charAt(airTime.length - 2) == 'P' ? 12 : 0;
                var endIndex = airTime.charAt(1) == ':' ? 1 : 2;
                var hour = airTime.substring(0, endIndex);
                return addHours + parseInt(hour);
            }
            $scope.getAirDateTime = function (episode, airTime) {
                var hourNumber = parseHour(airTime);
                var air = moment.utc(episode.firstAired);
                air.hour(hourNumber);
                air.add(300, 'minutes');//Eastern Time
                return air
            }

            //Initialize each episode's airDateTime
            for (var i = 0; i < show.episodes.length; i++) {
                show.episodes[i].airDateTime = $scope.getAirDateTime(show.episodes[i], show.airsTime);
            }

            $scope.nextEpisode = show.episodes.filter(function (episode) {
                return episode.airDateTime.format() > moment().format();
            })[0];
            console.log($scope.nextEpisode.airDateTime);
        });
    }]);