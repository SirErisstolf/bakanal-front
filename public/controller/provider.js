var app = angular.module('bacanalApp', ['ngFileUpload','color.picker','autocomplete']);
app.factory('MovieRetriever', function($http, $q, $timeout){
  var MovieRetriever = new Object();

  MovieRetriever.getmovies = function(i) {
    var moviedata = $q.defer();
    var movies;

    var someMovies = ["The Wolverine", "The Smurfs 2", "The Mortal Instruments: City of Bones", "Drinking Buddies", "All the Boys Love Mandy Lane", "The Act Of Killing", "Red 2", "Jobs", "Getaway", "Red Obsession", "2 Guns", "The World's End", "Planes", "Paranoia", "The To Do List", "Man of Steel"];

    var moreMovies = ["The Wolverine", "The Smurfs 2", "The Mortal Instruments: City of Bones", "Drinking Buddies", "All the Boys Love Mandy Lane", "The Act Of Killing", "Red 2", "Jobs", "Getaway", "Red Obsession", "2 Guns", "The World's End", "Planes", "Paranoia", "The To Do List", "Man of Steel", "The Way Way Back", "Before Midnight", "Only God Forgives", "I Give It a Year", "The Heat", "Pacific Rim", "Pacific Rim", "Kevin Hart: Let Me Explain", "A Hijacking", "Maniac", "After Earth", "The Purge", "Much Ado About Nothing", "Europa Report", "Stuck in Love", "We Steal Secrets: The Story Of Wikileaks", "The Croods", "This Is the End", "The Frozen Ground", "Turbo", "Blackfish", "Frances Ha", "Prince Avalanche", "The Attack", "Grown Ups 2", "White House Down", "Lovelace", "Girl Most Likely", "Parkland", "Passion", "Monsters University", "R.I.P.D.", "Byzantium", "The Conjuring", "The Internship"]

    if(i && i.indexOf('T')!=-1)
      movies=moreMovies;
    else
      movies=moreMovies;

    $timeout(function(){
      moviedata.resolve(movies);
    },1000);

    return moviedata.promise
  }

  return MovieRetriever;
});

app.controller('ProviderCtrl', ['Upload','$scope','$window','$http',function(Upload,$scope,$window,$http){

    var vm = this;
    vm.submitProfile = function(){ //function to call on form submit
        if (vm.upload_form.file.$valid && vm.file) { //check if from is valid
            vm.upload(vm.file,'profile'); //call upload function
        }
    }
    
    vm.submitGallery = function(){ //function to call on form submit
        if (vm.upload_form.file.$valid && vm.file) { //check if from is valid
            vm.upload(vm.file,'gallery'); //call upload function
        }
    }
    vm.upload = function (file,typeForm) {

        var url = '';
        if(typeForm == 'profile') url = 'http://localhost:8081/uploadProfile'
        if(typeForm == 'gallery') url = 'http://localhost:8081/uploadGallery'

        //if(typeForm == 'profile') url = 'http://192.168.8.103:8081/uploadProfile'
        //if(typeForm == 'gallery') url = 'http://192.168.8.103:8081/uploadGallery'

        //if(typeForm == 'profile') url = 'http://bakanal.cl/uploadProfile'
        //if(typeForm == 'gallery') url = 'http://bakanal.cl/uploadGallery'

        
        Upload.upload({
            url: url, //webAPI exposed to upload the file
            data:{file:file} //pass file as data, should be user ng-model
        }).then(function (resp) { //upload function returns a promise
            if(resp.data.error_code === 0){ //validate success
                alert('Imagen Subida con exito');
                //debugger;
               if(typeForm == 'profile')  $scope.provider.foto = 'uploads/' + $scope.provider.user + '/profile/' + resp.data.filename;

               if(typeForm == 'gallery') $scope.provider.galeria.push('uploads/' + $scope.provider.user + '/gallery/' + resp.data.filename);
               
               // debugger; TODO: Push file into array
            } else {
                alert('an error occured');
            }
        }, function (resp) { //catch error
            console.log('Error status: ' + resp.status);
            alert('Error status: ' + resp.status);
        }, function (evt) { 
            console.log(evt);
            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
            vm.progress = 'progress: ' + progressPercentage + '% '; // capture upload progress
        });
    };

    $scope.key = getParameterByName("key","");
    $scope.logged = false;
    $scope.social = false;
    $scope.facebook = false;
    $scope.twitter = false;
    $scope.instagram = false;
    $scope.website = false;

    //var $scope.provider = {};
    

    //debugger;
    function getParameterByName(name, url) {

        if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    }
    $scope.formatPrice = function (input) {
      var num = input;
      if (!isNaN(input)) {
        num = num.toString().split('').reverse().join('').replace(/(?=\d*\.?)(\d{3})/g, '$1.');
        num = "$ " + num.split('').reverse().join('').replace(/^[\.]/, '') + " CLP";
        return num
      }
    }
    $scope.logged = false;
    $scope.islogged = function (){
        $http({
            method: 'GET',
            url: '/api/logged',
            headers: {
                'Content-Type': 'application/json'
            }
        }).success(function (data) { 
            $scope.logged = data;
        }); 

    }
    //$scope.islogged ();

    

    $scope.getProviderData = function(){

        $scope.test = "tester";


        $http({
            method: 'GET',
            url: '/api/provider/'+ $scope.key,
            headers: {
                'Content-Type': 'application/json'
            }
        }).success(function (data) { 
                console.log(data);
                $scope.provider = data;
                //debugger;
                if ($scope.provider.facebook != null && $scope.provider.facebook != ''){

                    $scope.social = true;
                    $scope.facebook = true;
                }

                if ($scope.provider.instagram != null && $scope.provider.instagram != ''){

                    $scope.social = true;
                    $scope.instagram = true;
                }

                if ($scope.provider.twitter != null && $scope.provider.twitter != ''){

                    $scope.social = true;
                    $scope.twitter = true;
                }

                if ($scope.provider.website != null && $scope.provider.website != ''){

                    $scope.social = true;
                    $scope.website = true;
                }

                    

                //$scope.provider.foto = "uploads/admin/profile/file-1463716097877.jpg";//$scope.provider""""
                //debugger;
                //$scope.provider.galeria = ["uploads/admin/gallery/file-1463716229534.jpg","uploads/admin/gallery/file-1463716831845.jpg"];
                //debugger;


        });   
    }

    $scope.removeImage = function(index){
        $scope.provider.galeria.splice(index, 1);
    }


    var validateForm = function(){



       if($scope.provider.nombre == "" || typeof($scope.provider.nombre) == "undefined") {
            alert("Debe completar el campo Nombre");
            return;
       }
       
       if($scope.provider.mensaje == "" || typeof($scope.provider.mensaje) == "undefined") {
            alert("Debe completar el campo Mensaje");
            return;
       }

       if($scope.provider.edad == "" || typeof($scope.provider.edad) == "undefined") {
            alert("Debe completar el campo Edad");
            return;
       }
       else if(Number($scope.provider.edad) === parseInt($scope.provider.edad, 10)){
                console.log("edad bien");
            }else{
                alert("Campo Edad mal ingresado. Solo números");
            return;
        }


       if($scope.provider.estatura == "" || typeof($scope.provider.estatura) == "undefined") {
            alert("Debe completar el campo Estatura");
            return;
       }

       if($scope.provider.peso == "" || typeof($scope.provider.peso) == "undefined") {
            alert("Debe completar el campo Peso");
            return;
       }

       if($scope.provider.medidas == "" || typeof($scope.provider.medidas) == "undefined") {
            alert("Debe completar el campo Medidas");
            return;
       }

        if($scope.provider.precio == "" || typeof($scope.provider.precio) == "undefined") {
            alert("Debe completar el campo Precio");
            return;
       } else if(Number($scope.provider.precio) === parseInt($scope.provider.precio, 10)){
                console.log("precio bien");
            }else{
                alert("Campo Precio mal ingresado. Solo números");
            return;
        }

        if($scope.provider.sector == "" || typeof($scope.provider.sector) == "undefined") {
            alert("Debe completar el campo Sector");
            return;
       }

        if($scope.provider.servicios == "" || typeof($scope.provider.servicios) == "undefined") {
            alert("Debe completar el campo Servicios");
            return;
       }

        if($scope.provider.telefono == "" || typeof($scope.provider.telefono) == "undefined") {
            alert("Debe completar el campo Telefono");
            return;
        }else if(Number($scope.provider.telefono) === parseInt($scope.provider.telefono, 10)){
                console.log("telefono bien");
            }else{
                alert("Campo Telefono mal ingresado. Solo los 8 numeros finales");
                return;
        }

        if ($scope.provider.telefono.length != 8) {
                alert("Campo Telefono: Ingresar solo los 8 numeros finales");
                return;
        }

        return true;
  
    }
    $scope.submit = function(){



      // debugger;
      if(validateForm()){
        $http({
            method: 'PUT',
            url: '/api/provider/'+ $scope.provider._id,
            headers: {
                'Content-Type': 'application/json'
            },
            data: $scope.provider
        }).success(function () {

                window.location.href = '/view?key='+ $scope.key;
        });   
      }
       //return;
        
    }


    //$scope.movies = ["The Wolverine", "The Smurfs 2", "The Mortal Instruments: City of Bones", "Drinking Buddies", "All the Boys Love Mandy Lane", "The Act Of Killing", "Red 2", "Jobs", "Getaway", "Red Obsession", "2 Guns", "The World's End", "Planes", "Paranoia", "The To Do List", "Man of Steel"];
//  $scope.movies.then(function(data){
//    $scope.movies = data;
 // });

  $scope.getmovies = function(){

    function contains(a, obj) {
        for (var i = 0; i < a.length; i++) {
            if (a[i] === obj) {
                return true;
            }
        }
        return false;
    }


    $http.get('/api/providers').
            success(function(data) {
     //debugger;
                    $scope.sectores = [];
                    for(i = 0; i < data.length; i++){
                        if(!contains($scope.sectores ,data[i].sector)){

                            $scope.sectores.push(data[i].sector)
                        }
                    }
                  //  $scope.sectores.push("Todas");
                    $scope.movies = $scope.sectores

                    return $scope.movies

            });

    //return $scope.movies;
  }

  $scope.movies = $scope.getmovies();

  $scope.doSomething = function(typedthings){
    console.log("Do something like reload data with this: " + typedthings );
    //$scope.newmovies = MovieRetriever.getmovies(typedthings);
    //$scope.newmovies.then(function(data){
     // $scope.movies = data;
    //});
  }


  $scope.doSomethingElse = function(suggestion){
    console.log("Suggestion selected: " + suggestion );
  }




}]);


