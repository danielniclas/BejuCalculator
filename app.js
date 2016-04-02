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

    app.factory('cropRemovalService', function ($http) {

        var cropRemovalLevels = [];

        return {
            get: function () {

                $http.get('cropRemoval.json')
                    .success(function (response) {
                        for (i=0;i<response.length; i++){
                            var currentArrayItem = response[i];
                            cropRemovalLevels.push(currentArrayItem);
                        }
                    })
                    .error(function (err) {
                        alert('ERROR from cropRemoval factory service ' + err)
                    });
                return cropRemovalLevels;
            }
        }
    });




    app.controller('myCtrl', function($scope, fertilizerService, cropRemovalService){

        var currentObject, currentItemsObject, property, currentCropElement;
        var fieldNameHolder, fieldAcresHolder, cropHolder, yieldGoalHolder, irrigationHolder, productionTypeHolder, tillageHolder;


        $scope.items = [];
        $scope.items = fertilizerService.get();         //  GET Objects from factory (JSON File)  <<  FACTORY DATA
        $scope.cropRemovalArray = [];
        $scope.cropRemovalArray = cropRemovalService.get();        //  GET Objects from factory (JSON File)  <<  FACTORY DATA

        $scope.customerProgramArray = [];                       //  Array for the Program Generator
        $scope.cropDisplayArray = [];

        $scope.appMethod = [                            //  Select - Array of objects
            { value: "None", label: "None" },
            { value: "Broadcast", label: "Broadcast" },
            { value: "Strip Till Dry", label: "Strip Till Dry"},
            { value: "Strip Till Liq", label: "Strip Till Liq"},
            { value: "Planter Starter", label: "Planter Starter"},
            { value: "Fertigation", label: "Fertigation"},
            { value: "Coulter Injection", label: "Coulter Injection"},
            { value: "Sprayer", label: "Sprayer"},
            { value: "Cultivation", label: "Cultivation"},
            { value: "Drill", label: "Drill"}
        ];

        $scope.cropList = [                            //  Select - Array of objects
            { value: "Corn", label: "Corn" },
            { value: "Wheat", label: "Wheat" },
            { value: "Soybean", label: "Soybean"},
            { value: "Alfalfa", label: "Alfalfa"},
            { value: "Beats", label: "Beats"},
            { value: "Pop Corn", label: "Pop Corn"},
            { value: "Edible Beans", label: "Edible Beans"}
        ];

        $scope.irrigation = [                            //  Select - Array of objects
            { value: "Irrigated", label: "Irrigated" },
            { value: "Dryland", label: "Dryland" },
            { value: "Summer Fallow", label: "Summer Fallow"}
        ];

        $scope.productionType = [                            //  Select - Array of objects
            { value: "Organic", label: "Organic" },
            { value: "Commercial", label: "Commercial" },
            { value: "Transition", label: "Transition"}
        ];

        $scope.tillage = [                            //  Select - Array of objects
            { value: "No Till", label: "No Till" },
            { value: "Vertical Tillage", label: "Vertical Tillage" },
            { value: "Strip Till", label: "Strip Till"},
            { value: "Full Tillage", label: "Full Tillage"},
            { value: "Minimal Tillage", label: "Minimal Tillage"}
        ];




    function FertilizerCollection () {          //  Constructor Function for FertilizerCollection Object >> create array of objects [{},{},{}]


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

        $scope.addProduct = function(product) {                 //  FORM (Fertility Program Generator) OBJECT: product

            //  Object from form is:  product   product[property]  >>  Build Product Form + elements from items ARRAY

            fieldNameHolder = product.fieldName;
            fieldAcresHolder = product.fieldAcres;
            cropHolder = product.crop;
            yieldGoalHolder = product.yieldGoal;
            irrigationHolder = product.irrigation;
            productionTypeHolder = product.productionType;
            tillageHolder = product.tillage;


            for (var i = 0; i<$scope.items.length; i++){                    //  Loop through [items] array
                currentItemsObject = $scope.items[i];                       //  current Items OBJECT in [items]

                console.log("currentItemsObject.productName: " + currentItemsObject.productName);

                if (currentItemsObject.productName == product.name){         //  if current ItemsObject.productName = product.name selected in drop down  >>
                    console.log("Finding Product in Array: " + currentItemsObject.productName);
                    for (property in currentItemsObject) {
                        product[property] = currentItemsObject[property];     //  product OBJECT(from Form) [property] << items OBJECT [property]
                                                                              //  product[idValue] = itemObject[idValue]
                    }
                }
            }

            function solutionCalculator (){



                if (product.inGallons == true){

                    product.poundAcre = (product.galWeightDensity * product.rateAcre);
                    product.totalPounds = (product.galWeightDensity * product.rateAcre * product.fieldAcres);   //  WARNING:  THIS NEEDS TO INCLUDE CUSTOMER ACERAGE TOO!!!!!!!!!!!!!
                    product.inGallons = "Yes";
                    product.nitrogen *= product.poundAcre;
                    product.phosphate *= product.poundAcre;
                    product.potasium *= product.poundAcre;
                    product.sulfur *= product.poundAcre;
                    product.totalMicro *= product.poundAcre;
                    product.om *= product.poundAcre;
                    product.costPerAcre = (product.costPound * product.poundAcre);

                } else {
                    product.poundAcre = (product.rateAcre);
                    product.totalPounds = (product.rateAcre * product.fieldAcres);
                    product.inGallons = "No";
                    product.nitrogen *= product.poundAcre;
                    product.phosphate *= product.poundAcre;
                    product.potasium *= product.poundAcre;
                    product.sulfur *= product.poundAcre;
                    product.totalMicro *= product.poundAcre;
                    product.om *= product.poundAcre;
                    product.costPerAcre = (product.costPound * product.rateAcre);
                }

            }
            solutionCalculator();


            function cropRemovalLevels () {

                for (i=0; i<$scope.cropRemovalArray.length; i++) {
                    currentCropElement = $scope.cropRemovalArray[i];
                    if (product.crop == currentCropElement.cropName &&  $scope.cropDisplayArray.length == 0){

                        console.log("product.yieldGoal:  " + product.yieldGoal);

                        currentCropElement.nitrogen *= product.yieldGoal;
                        currentCropElement.phosphate *= product.yieldGoal;
                        currentCropElement.potasium *= product.yieldGoal;
                        currentCropElement.sulfur *= product.yieldGoal;
                        currentCropElement.totalMicro *= product.yieldGoal;


                        $scope.cropDisplayArray.push(currentCropElement);
                    }
                }
            }
            cropRemovalLevels();




            $scope.customerProgramArray.push(product);       //  Program Array has added an Product Object that has Form Data + Data From ITEMS

            $scope.progForm.$setPristine();                 //  Clear form
            $scope.product = {};

            $scope.product.fieldName = fieldNameHolder;     //  Reset Form keeper values
            $scope.product.fieldAcres = fieldAcresHolder;
            $scope.product.crop = cropHolder;
            $scope.product.yieldGoal = yieldGoalHolder;
            $scope.product.irrigation = irrigationHolder;
            $scope.product.productionType = productionTypeHolder;
            $scope.product.tillage = tillageHolder;


        };      //  addProduct() FUNCTION - END



});  //  ng-CONTROLLER:  myCtrl - END
