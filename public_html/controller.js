var catApp = angular.module("CatsWeb", ['ngResource']);

catApp.config(['$httpProvider', function ($httpProvider) {    
	$httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
}]);

catApp.controller("CatsCntrl", function($scope, $window, $http) {
    $http.get("http://localhost:8080/rest/cat/").then(function (response) {
      $scope.cats = response.data;
    });
    
    $scope.addRow = function(){		

            var data = 'name=' + $scope.name + '&age=' + $scope.age+ '&breed=' + $scope.breed;

            $http.post("http://localhost:8080/rest/cat/add", data).
            success(function(data, status, headers, config) {
		$scope.message = data;
                $window.location.reload();
            }).
            error(function(data, status, headers, config) {
		alert( "failure message: " + JSON.stringify({data: data}));
            });
            
            $scope.name='';
            $scope.age='';
            $scope.breed='';
    };  
});

