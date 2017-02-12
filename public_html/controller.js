var catApp = angular.module("CatsWeb", ['ngResource']);

catApp.config(['$httpProvider', function ($httpProvider) {    
	$httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
}]);

catApp.controller("CatsCntrl", function($scope, $window, $http) {
    
    $scope.editingData = {};
    
    $http.get("http://localhost:8080/rest/cat/").then(function (response) {
      $scope.cats = response.data;
      for (var i = 0, length = $scope.tabelsData.length; i < length; i++) {
        $scope.editingData[$scope.cats[i].id] = false;
      }
    });

    $scope.modify = function(cat){
        $scope.editingData[cat.id] = true;
    };


    $scope.cancel = function(cat){
        $scope.editingData[cat.id] = false;
    };
    
    $scope.update = function(cat){
        $scope.editingData[cat.id] = false;
        
        $http.put("http://localhost:8080/rest/cat/update", cat).
        success(function() {
        }).
        error(function(data) {
            alert( "failure message: " + JSON.stringify({data: data}));
        });
        
    };
    $scope.addRow = function(){		

        var data = 'name=' + $scope.name + '&age=' + $scope.age+ '&breed=' + $scope.breed;

        $http.post("http://localhost:8080/rest/cat/add", data).
        success(function(data) {
            $scope.cats[$scope.cats.length] = data;
            $scope.editingData[data.id] = false;
        }).
        error(function(data) {
            alert( "failure message: " + JSON.stringify({data: data}));
        });
            
        $scope.name='';
        $scope.age='';
        $scope.breed='';
    }; 
    
    $scope.removeRow = function(id, $index){
        
        var url = "http://localhost:8080/rest/cat/delete/" + id;
        
        $http.delete(url).
        success(function(){
            $scope.cats.splice($index, 1);
            //$window.location.reload();
        }).error(function(data){
           alert("failure message: " + JSON.stringify({data : data}));
        });
    };
});

