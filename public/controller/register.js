
var app = angular.module('bacanalApp', []);


app.controller('RegisterCtrl', function($scope,$http,$location) {
    
    $scope.register = {};
    $scope.register.status = "activo";
    $scope.provider = {};


    var qs = $location.search();
   // debugger;
    //console.log(qs);

    $scope.key = getParameterByName("key","");
    $scope.mails = [];

    $http.get('/api/mails/').
        success(function(data) {  
            $scope.mails = data;
            
          

    });

    //debugger;
    function getParameterByName(name, url) {
       // debugger;
        if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    }
    
    function contains(a, obj) {
        for (var i = 0; i < a.length; i++) {
            if (a[i] === obj) {
                return true;
            }
        }
        return false;
    }

    generateLink();

    function generateLink (){
        $http({
        method: 'GET',
        url : '/api/oneregister',

    }).success(function(data){
        $scope.link = data.replace(/\"/g,"");
    });

    }

    function validateEmail(email) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }



    $scope.submit = function() {

        

        if(($scope.provider.username == "" ) || (typeof($scope.provider.username) == "undefined")) {
            alert("Debe completar todos los campos");
            return;
       }


        if(($scope.provider.email == "") || (typeof($scope.provider.email) == "undefined")) {
            alert("Debe completar todos los campos");
            return;
       }


        if(($scope.provider.password == "") || (typeof($scope.provider.password) == "undefined")) {
            alert("Debe completar todos los campos");
            return;
       }


        if(($scope.provider.password_confirm == "") || (typeof($scope.provider.password_confirm) == "undefined")) {
            alert("Debe completar todos los campos");
            return;
       }


       // debugger;
        if($scope.provider.password != $scope.provider.password_confirm) {
            alert("Contraseñas no coinciden");
            return;
        }

        if(!validateEmail($scope.provider.email)){
            alert("Formato email incorrecto");
            return;

        }
        
        if(contains($scope.mails,$scope.provider.email)){
            alert("Email ya registrado");
            return;
        }

        var register = {"status":"activo"};
        var user = {
            "username": $scope.provider.username,
            "email":$scope.provider.email,
            "password":$scope.provider.password,
            "key": $scope.key
        };

        var provider = {
            "user": $scope.provider.username,
            "key": $scope.key
        };

        $http({
            method: 'PUT',
            url: '/api/register/'+ $scope.key,
            headers: {
                'Content-Type': 'application/json'
            },
            data: register
        }).success(function () {
                    $http({
                        method: 'POST',
                        url: '/api/user',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        data: user
                    }).success(function () {
                                $http({
                                    method: 'POST',
                                    url: '/api/provider',
                                    headers: {
                                        'Content-Type': 'application/json'
                                    },
                                    data:provider
                                }).success(function () {
                                    $http({
                                        method: 'GET',
                                        url: '/api/folder/'+ $scope.provider.username,
                                        headers: {
                                            'Content-Type': 'application/json'
                                        }
                                    }).success(function () { 
                                            console.log('fine');
                                            //$scope.provider = data;


                                    });   
                                    window.location.href = '/login';
                                });  
                    });
        });         
    }

});




