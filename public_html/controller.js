var catApp = angular.module("CatsWeb", ['ngResource']);

catApp.directive('fileModel', [ '$parse', function($parse) {
	return {
		restrict : 'A',
		link : function(scope, element, attrs) {
			var model = $parse(attrs.fileModel);
			var modelSetter = model.assign;

			element.bind('change', function() {
				scope.$apply(function() {
					modelSetter(scope, element[0].files[0]);
				});
			});
		}
	};
} ]);
catApp.service('fileUpload', ['$http', function($http) {
	this.uploadFileToUrl = function(uploadUrl, name, age, breed, file, cats) {
		var fd = new FormData();
		fd.append('name', name);
		fd.append('age', age);
		fd.append('breed', breed);
                fd.append('image', file);
		$http.post(uploadUrl, fd, {
			transformRequest : angular.identity,
			headers : {
				'Content-Type' : undefined
			}
		}).success(function(response) {
                    cats[cats.length] = response;
		}).error(function() {
		});
	};
        
        this.updateImgById = function(uploadUrl, id, file, cat) {
		var fd = new FormData();
		fd.append('id', id);
                fd.append('image', file);
		$http.post(uploadUrl, fd, {
			transformRequest : angular.identity,
			headers : {
				'Content-Type' : undefined
			}
		}).success(function(response) {
                    cat.imgName = response.imgName;
		}).error(function() {
		});
	};
}]);

catApp.controller("CatsCntrl", function($scope, $http, fileUpload) {
    
    $scope.query = {};
    $scope.queryBy = '$';
    $scope.cats = [];
    $scope.editingData = {};
    $scope.boxAddCat = false;
    $scope.boxSearchCat = false;
    
    $http.get("http://localhost:8080/rest/cat/").then(function (response) {
      $scope.cats = response.data;
      for (var i = 0, length = $scope.cats.length; i < length; i++) {
        $scope.editingData[$scope.cats[i].id] = false;
      }
    });
    
    $scope.modify = function(cat){
        $scope.editingData[cat.id] = true;
    };


    $scope.cancel = function(cat){
        $scope.editingData[cat.id] = false;
    };
    
    $scope.update = function(cat, imgCatUp){
        $scope.editingData[cat.id] = false;
        
        $http.put("http://localhost:8080/rest/cat/update", cat).
        success(function() {
        }).
        error(function(data) {
            alert( "failure message: " + JSON.stringify({data: data}));
        });
        var file = imgCatUp;
        var uploadUrl = "http://localhost:8080/rest/cat/imgUpdate";
        fileUpload.updateImgById(uploadUrl, cat.id, file, cat);   
        
        
    };
    $scope.addCat = function(){		

        var name = $scope.name;
	var age = $scope.age;
        var breed = $scope.breed;
        var file = $scope.imgCat;
	var uploadUrl = "http://localhost:8080/rest/cat/add";
	fileUpload.uploadFileToUrl(uploadUrl, name, age, breed, file, $scope.cats);
        
        $scope.name='';
        $scope.age='';
        $scope.breed='';
        
    }; 
    $scope.searchCancel = function(){
        $scope.query = {};
        $scope.strict = null;
    };
   
    $scope.removeRow = function(id, $index){
        
        var url = "http://localhost:8080/rest/cat/delete/" + id;
        
        $http.delete(url).
        success(function(){
            $scope.cats.splice($index, 1);
        }).error(function(data){
           alert("failure message: " + JSON.stringify({data : data}));
        });
    };
    
    $scope.SearchCatBox = function(){
        $scope.boxSearchCat=!$scope.boxSearchCat;
        if($scope.boxSearchCat === false){
            $scope.query = {};
            $scope.strict = null;
        }
    };
    
    
});
