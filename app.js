/**
 * Created by danielniclas on 3/31/16.
 */


var app = angular.module('myApp',[]);


    app.factory('fertilizerService', function ($http) {

        var fertProducts = [];

        return {
            get: function () {

                $http.get('fertProducts.json')
                    .success(function (response) {
                        for (i=0;i<response.length; i++){
                            var currentArrayItem = response[i];
                            fertProducts.push(currentArrayItem);
                        }
                    })
                    .error(function (err) {
                        alert('ERROR from factory service ' + err)
                    });
                return fertProducts;
            }
            }
        });

    app.controller('myCtrl', function($scope, fertilizerService){

        $scope.items = [];

    function FertilizerCollection () {          //  Constructor Function for FertilizerCollection Object >> create array of objects [{},{},{}]

    var currentObject;

    //  Constructor function for each product >>  Product Object
    function FertilizerProduct(idValue, productName, ph, costPound, costTon, costPoundNutrient, liquid,
    galWeightDensity, useFocus, nitrogen, phosphate, potasium, sulfur, calcium, zinc, magnesium, iron, manganese,
    copper, boron, totalMicro, om) {

        this.idValue = idValue;
        this.productName = productName;
        this.ph = ph;
        this.costPound = costPound;
        this.costTon = costTon;
        this.costPoundNutrient = costPoundNutrient;
        this.liquid = liquid;
        this.galWeightDensity = galWeightDensity;
        this.useFocus = useFocus;
        this.nitrogen = nitrogen;
        this.phosphate = phosphate;
        this.potasium = potasium;
        this.sulfer = sulfur;
        this.calcium = calcium;
        this.zing = zinc;
        this.magnesium = magnesium;
        this.iron = iron;
        this.manganese = manganese;
        this.copper = copper;
        this.boron = boron;
        this.totalMicro = totalMicro;
        this.om = om;
    }

    //  Array Methods:

    this.pushObject = function(object){         //  Push finished object into [items] array
        $scope.items.push(object);
    };

    this.push = function(idValue, productName, ph, costPound, costTon, costPoundNutrient, liquid,
                         galWeightDensity, useFocus, nitrogen, phosphate, potasium, sulfur, calcium, zinc, magnesium, iron, manganese,
                         copper, boron, totalMicro, om){       //  Add element to END of Queue

        var productElement = new FertilizerProduct(idValue, productName, ph, costPound, costTon, costPoundNutrient, liquid,
            galWeightDensity, useFocus, nitrogen, phosphate, potasium, sulfur, calcium, zinc, magnesium, iron, manganese,
            copper, boron, totalMicro, om);

        $scope.items.push(productElement);
    };
    this.shift = function(){             //  Remove element form BEGINNING of Queue
        return $scope.items.shift();
    };
    this.unshift = function(idValue, productName, ph, costPound, costTon, costPoundNutrient, liquid,
                            galWeightDensity, useFocus, nitrogen, phosphate, potasium, sulfur, calcium, zinc, magnesium, iron, manganese,
                            copper, boron, totalMicro, om){   //  Add element to BEGINNING of Queue

        var productElement = new FertilizerProduct(idValue, productName, ph, costPound, costTon, costPoundNutrient, liquid,
            galWeightDensity, useFocus, nitrogen, phosphate, potasium, sulfur, calcium, zinc, magnesium, iron, manganese,
            copper, boron, totalMicro, om);

        $scope.items.unshift(productElement);
    };
    this.pop = function(){              //  Remove element from END of Queue
        return $scope.items.pop();
    };
    //  Helper Methods:
    this.peek = function(){
        return $scope.items[$scope.items.length-1];    //  array[array.length -1]  array.length-1 = the last index  (RETURN the TERMINAL ELEMENT)
    };
    this.isEmpty = function(){
        return ($scope.items.length ==0);       //  returns TRUE if (items.length == 0) << evaluates to TRUE  or FALSE if items.length is NOT == 0
    };
    this.size = function(){
        return $scope.items.length;            //  returns the length of the array << the number of elements
    };
    this.clear = function() {
        $scope.items = [];                     //  set array to empty
    };
    this.print = function(){
        for (var i=0;i<$scope.items.length;i++){
            currentObject = $scope.items[i];
            console.log("Current Object ID: " + currentObject.idValue + " Name: " + currentObject.productName + " pH: "  + currentObject.ph + " Cost/Pound: " + currentObject.costPound);      //  Print Array to Console
        }
    };


    }  //  CONSTRUCTOR FUNCTION FertilizerCollection - END


    //  INSTANTIATE an Object Instance
    var fertModel = new FertilizerCollection();     //  Instantiate the FertilizerCollection Class >>  CREATE EMPTY [items] ARRAY

    //fertModel.push(1,"Beju",9,400, 1000, 500);      //  Create new OBJECT <<  Add into [items] array
    //fertModel.print();

        $scope.save = function(fert){                   //  Create new OBJECT from Form <<  Add into [items] arrray
            fertModel.pushObject(fert);
            $scope.fertForm.$setPristine();
            $scope.fert = {};

        };

        $scope.reset = function() {
            $scope.fertForm.$setPristine();                       //  Form Controller   $setPristine
            $scope.fert = {};
        };

        $scope.deQueue = function() {
            fertModel.pop();
        };

        $scope.items = fertilizerService.get();        //  GET Objects from factory (JSON File)





});  //  ng-CONTROLLER:  myCtrl - END
