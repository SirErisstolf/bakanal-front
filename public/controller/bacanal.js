var app = angular.module('tunaApp', ['ui.router']);




app.controller('MainCtrl', function($scope,$http) {
 $scope.provider = [];

    function contains(a, obj) {
        for (var i = 0; i < a.length; i++) {
            if (a[i] === obj) {
                return true;
            }
        }
        return false;
    };

    $scope.statistics = function(){
       // debugger;
        


         var browserInfo = "Browser CodeName: " + navigator.appCodeName + "";
        browserInfo+= "Browser Name: " + navigator.appName + "";
        browserInfo+= "Browser Version: " + navigator.appVersion + "";
        browserInfo+= "Cookies Enabled: " + navigator.cookieEnabled + "";
        browserInfo+= "Platform: " + navigator.platform + "";
        browserInfo+= "User-agent header: " + navigator.userAgent + "";
        browserInfo+= "User-agent language: " + navigator.systemLanguage + "";

        var now = new Date();

        var data = {ip:"0.0.0.0",browser:browserInfo,login:false,time:now};

        $http({
            method: 'POST',
            url: '/api/stats/',
            headers: {
                'Content-Type': 'application/json'
            },
            data: data
        }).success(function () {

                //window.location.href = '/view?key='+ $scope.key;
        }); 

    }

    $scope.init = function(){

        $scope.statistics();

    $http.get('/api/providers').
            success(function(data) {
                

                //$scope.provider = data;
                var pivote = [];

                for(var i = 0; i < data.length; i++){
                    if(typeof(data[i].nombre) != "undefined") 
                        pivote.push(data[i]);
                }

                $scope.provider = pivote;
                $scope.providerMaster = pivote;

                $scope.sectorOptions = function (){
     
                    $scope.sectores = [];
                    for(i = 0; i < $scope.provider.length; i++){
                        if(!contains($scope.sectores ,$scope.provider[i].sector)){

                            $scope.sectores.push($scope.provider[i].sector)
                        }
                    }
                    $scope.sectores.push("Todas");
                    return $scope.sectores
                }

                $scope.precioOptions = function (){
                    $scope.precios = [];
                    var item = {id:1,value:"Hasta $20.000"}
                    $scope.precios.push(item);

                    item = {id:2,value:"$20.000 a $30.000"}
                    $scope.precios.push(item);

                    item = {id:3,value:"$30.000 a $40.000"}
                    $scope.precios.push(item);

                    item = {id:4,value:"$40.000 a $50.000"}
                    $scope.precios.push(item);

                    item = {id:5,value:"Desde $50.000"}
                    $scope.precios.push(item);

                    item = {id:6,value:"Todas"}
                    $scope.precios.push(item);

                    return $scope.precios;
                } 

                $scope.edadOptions = function (){
                    $scope.edades = [];
                    var item = {id:1,value:"Hasta 20 Años"}
                    $scope.edades.push(item);

                    item = {id:2,value:"20-25"}
                    $scope.edades.push(item);

                    item = {id:3,value:"25-30"}
                    $scope.edades.push(item);

                    item = {id:4,value:"30-35"}
                    $scope.edades.push(item);

                    item = {id:5,value:"Desde 35 Años"}
                    $scope.edades.push(item);

                    item = {id:6,value:"Todas"}
                    $scope.edades.push(item);

                    return $scope.edades;
                } 

                $scope.sector = {
                      selected: "Todas",
                      availableOpcions: $scope.sectorOptions()
                };
                $scope.precio = {
                      selected: null,
                      availableOpcions: $scope.precioOptions()
                };
                $scope.edad = {
                      selected: null,
                      availableOpcions: $scope.edadOptions()
                };

                $scope.carousel = [];
                
                for(var i = 0; i < 1; i++){
                    var item = {img: $scope.provider[i].galeria[1],provider: $scope.provider[i].nombre, precio : $scope.provider[i].precio}
                    $scope.carousel.push(item)
                }//debugger;

            });
        }

    $scope.formatPrice = function (input) {
      var num = input;
      if (!isNaN(input)) {
        num = num.toString().split('').reverse().join('').replace(/(?=\d*\.?)(\d{3})/g, '$1.');
        num = "$ " + num.split('').reverse().join('').replace(/^[\.]/, '');
        return num
      }
    }

    $scope.buscar = function(){
        $scope.provider = $scope.providerMaster;

        if(typeof($scope.searchPrice) !== "undefined") {
            $scope.provider = priceFilter($scope.searchPrice);
        }
        if(typeof($scope.searchSector) !== "undefined") {
            $scope.provider = sectorFilter($scope.searchSector);
        }
        if(typeof($scope.searchAge) !== "undefined") {
            $scope.provider = ageFilter($scope.searchAge);

        }
    }

    var sectorFilter = function  (value) {
        var pivote = [];

        if(value != "Todas"){
            for(i = 0; i < $scope.provider.length; i++){
                if ($scope.provider[i].sector == value){
                    pivote.push($scope.provider[i]);
                }
            }    
        }else{
            pivote = $scope.provider;
        }
        
        return pivote;
    }

    var priceFilter = function (value){

        var pivote = [];
        var max, min;

        switch(value) {
            case "1":
                max = 20000;
                min = 0;
                break;
            case "2":
                max = 30000;
                min = 20000;
                break;
            case "3":
                max = 40000;
                min = 30000;
                break;
            case "4":
                max = 50000;
                min = 40000;
                break;        
            case "5":
                max = 200000;
                min = 50000;
                break;
            case "6":
                max = 200000;
                min = 0;
                break;          
            default:
                 return 
        }
        
        for(i = 0; i < $scope.provider.length; i++){

            if ($scope.provider[i].precio >= min && $scope.provider[i].precio <= max){

                pivote.push($scope.provider[i]);
            }

        }

        return pivote;
    }

    var ageFilter = function (value){

        var pivote = [];
        var max, min;

        switch(value) {
            case "1":
                max = 20;
                min = 0;
                break;
            case "2":
                max = 25;
                min = 20;
                break;
            case "3":
                max = 30;
                min = 25;
                break;
            case "4":
                max = 35;
                min = 30;
                break;        
            case "5":
                max = 100;
                min = 35;
                break;    
            case "6":
                max = 100;
                min = 18;
                break;      
            default:
                 return 
        }
        
        for(i = 0; i < $scope.provider.length; i++){

            if ($scope.provider[i].edad >= min && $scope.provider[i].edad <= max){

                pivote.push($scope.provider[i]);
            }

        }

        return pivote;
    }

});


