/**
 * Created by danielniclas on 3/31/16.
 */


var app = angular.module('myApp',[]);

    //  SPINNER - START
    //app.run(spin);
    //spin.$inject = ['$rootScope'];
    //
    //function spin ($rootScope) {
    //    $rootScope.spinner = {
    //        active: false,
    //        on: function () {
    //            console.log("SPINNER ON");
    //            this.active = true;
    //        },
    //        off: function () {
    //            console.log("SPINNER OFF");
    //            this.active = false;
    //        },
    //        test: function () {
    //            console.log("SPINNER END");
    //        }
    //    };
    //
    //    $rootScope.spinner.on();
    //}
    //  SPINNER - END


    app.directive("repeatEnd", function(){        //  CUSTOM DIRECTIVE:  ng-repeat repeat-end Directive:
        return {
            restrict: "A",
            link: function (scope, element, attrs) {
                if (scope.$last) {
                    scope.$eval(attrs.repeatEnd);
                }
            }
        };
    });


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



    app.controller('myCtrl', function($scope, $timeout, fertilizerService, cropRemovalService){

        var currentObject, currentItemsObject, property, currentCropElement;
        var fieldNameHolder, fieldAcresHolder, cropHolder, yieldGoalHolder, irrigationHolder, productionTypeHolder, tillageHolder;

        var cropMarker = 1;

        //  View Data Arrays:
        $scope.programViewArray = [{"name": "Product", "rateAcre": 0, "inGallons": "yes/no", "poundAcre": 0, "appMethod": "Method", "totalPounds": 0,
            "nitrogen": 0, "phosphate": 0, "potasium": 0, "sulfur": 0, "totalMicro": 0, "om": 0, "costPerAcre": 0}];                             //  View Array with dummy data
        $scope.cropViewArray = [{"cropName": "Crop", "nitrogen": 0,"phosphate": 0,"potasium": 0,"sulfur": 0,"totalMicro": 0}];      //  Crop Removal Table dummy data


        $scope.items = [];                              //  Array with Fertilizer product Data  (collected from JSON)
        $scope.items = fertilizerService.get();         //  GET Objects from factory (JSON File)  <<  FACTORY DATA

        $scope.cropRemovalArray = [];
        $scope.cropRemovalArray = cropRemovalService.get();        //  GET Objects from factory (JSON File)  <<  FACTORY DATA

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
            { value: "Soybeans", label: "Soybeans"},
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


        //  EVENT to trigger DIGEST CYCLE for ng-show to work --  ng-show/ng-hide requires an EVENT to work properly
        //  Show & Hide Machine:
        //$scope.elementShow = false;
        //$timeout(function () {
        //    $scope.elementShow = true;
        //}, 750);


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





        //  BUTTON:  ADD PRODUCT  <<  function  <<<<<<<<<<<<<<<<  ADD PRODUCT  - Button #1

        $scope.addProduct = function(product) {                 //  FORM (Fertility Program Generator) OBJECT: product


            if($scope.programViewArray[0].name == "Product"){   //  <<  This is a test if the programViewArry has the Dummy Data in it:  name == "Product"
                $scope.programViewArray = [];                   //  <<  if Dummy Data --  clear programViewArray
                                                                //  programViewArray is the main array for the Solution Calculator Table
            }


            //  Product is the OBJECT created by completing the FORM
            //  Form OBJECT:  product   product[property]  >>  SAVE DATA COMMON TO EACH PRODUCT ENTERED - CUSTOMER/FIELD DATA

            fieldNameHolder = product.fieldName;            //  Holders for data to cary over
            fieldAcresHolder = product.fieldAcres;
            cropHolder = product.crop;
            yieldGoalHolder = product.yieldGoal;
            irrigationHolder = product.irrigation;
            productionTypeHolder = product.productionType;
            tillageHolder = product.tillage;


            for (var i = 0; i<$scope.items.length; i++){                    //  Loop through each {OBJECT} of the [items] array
                currentItemsObject = $scope.items[i];                       //  current {OBJECT} from the [items] array

                if (currentItemsObject.productName == product.name){        //  Match product selected in drop down (product.name) with product from [items] array >>
                    console.log("Finding Product in Array: " + currentItemsObject.productName);
                    for (property in currentItemsObject) {                  //  Loop through each property in the {OBJECT} from the [items] << the one selected from drop down
                        product[property] = currentItemsObject[property];   //  product OBJECT(from Form) [property] << items OBJECT [property]
                                                                            //  ADD the property from items {OBJECT} TO >>  the product {OBJECT} ex. product[idValue] = itemObject[idValue}
                    }                                                       //  Summary:  Adding data from selected [items] {OBJECT} to the product {OBJECT}
                }
            }

                                                            //  product {OBJECT} is the BIG MAIN OBJECT!!  with all the data

            function solutionCalculator (){                 //  CALCULATIONS with product {OBJECT} property values FOR the SOLUTION CALCULATOR Table

                if (product.inGallons == true){

                    product.poundAcre = (product.galWeightDensity * product.rateAcre);
                    product.totalPounds = (product.galWeightDensity * product.rateAcre * product.fieldAcres);
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


            function cropRemovalCalculator () {         //  Build cropViewArray with Data  << CALCULATIONS for the Crop Removal TABLE

                for (i=0; i<$scope.cropRemovalArray.length; i++) {          //  cropRemovalArray is the data collected from JSON << crop removal data:  Crop,N,P,K,S,Total Micro
                    currentCropElement = $scope.cropRemovalArray[i];

                        console.log("CROP MARKER ABOVE: " + cropMarker);

                                                                                                                              //  TEST:  if the cropName added to the cropRemovalArray is the same as
                    if (product.crop == currentCropElement.cropName && $scope.cropViewArray.length == 1 && cropMarker <= 1){  //  cropViewArray will always have 1 element due to dummy data


                        $scope.cropViewArray = [];                          //  VIEW ARRAY -- Now CLEAR OUT the dummy data for the Crop Removal Table

                        console.log("CROP MARKER  IN: " + cropMarker);

                        currentCropElement.nitrogen *= product.yieldGoal;   //  Calculate the values for the Crop Removal Table <<  N,P,K,S,Total Micro need to by multiplied with product.YieldTotal
                        currentCropElement.phosphate *= product.yieldGoal;  //  Reminder:  product {OBJECT} created with form and data from [items] added to it
                        currentCropElement.potasium *= product.yieldGoal;
                        currentCropElement.sulfur *= product.yieldGoal;
                        currentCropElement.totalMicro *= product.yieldGoal;

                        $scope.cropViewArray.push(currentCropElement);      //  <<< Prepare FINAL array for the Crop Removal Table
                        cropMarker++;                                       //  Now make sure don't go in here again <<  ONLY PREPARE DATA FOR CROP REMOVAL TABLE ONCE!!!
                    }
                }
            }
            cropRemovalCalculator();


            $scope.programViewArray.push(product);       //  <<<  Prepare FINAL array for Solution Calculator Table <<  push the product {OBJECT} into programViewArray()

            $scope.progForm.$setPristine();              // progForm is the main Form for Solution Calculator <<  set form to Pristine
            $scope.product = {};                         //  CLEAR OUT THE PRODUCT {OBJECT}

            $scope.product.fieldName = fieldNameHolder;     //  Restore Form Values that are retained for each product entered <<  FIELD INFO -- Form keeper values
            $scope.product.fieldAcres = fieldAcresHolder;
            $scope.product.crop = cropHolder;
            $scope.product.yieldGoal = yieldGoalHolder;
            $scope.product.irrigation = irrigationHolder;
            $scope.product.productionType = productionTypeHolder;
            $scope.product.tillage = tillageHolder;


        };      //  addProduct() FUNCTION - END


});  //  ng-CONTROLLER:  myCtrl - END



