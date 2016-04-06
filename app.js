/**
 * Created by danielniclas on 3/31/16.
 */


var app = angular.module('myApp',['ngRoute']);


    app.directive("repeatEnd", function(){        //  CUSTOM DIRECTIVE:  ng-repeat repeat-end Directive:
                                                  //  repeat-end="myFunc()"  <<  when ng-repeat is finished this function will be called
                                                  //  <h3 ng-repeat="name in names" repeat-end="onEnd()">{{name}}</h3>
                                                  //  NOT CURRENTLY IN USE IN THIS APPLICATION
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

        var fertProductsArray = [];


        //  This factory is designed to gather the data with EVERY controller load

        return {

            getFertProducts: function () {

                fertProductsArray = [];                                 //  EMPTY THE ARRAY and GET THE NEW DATA

                $http.get('fertProducts.json')
                    .success(function (response) {
                        for (i=0;i<response.length; i++){
                            var currentArrayItem = response[i];
                            fertProductsArray.push(currentArrayItem);
                        }
                    })
                    .error(function (err) {
                        alert('ERROR from factory service ' + err)
                    });

                return fertProductsArray;
            }
            };


        //  This factory is designed to only get the data ONCE, no matter how many times the controller is loaded <<  problem solution:  multiplication of data objects

        //var fertProducts = function(){                              //  FUNCTION:  GET data from JSON and push() into [fertProductsArray]
        //    $http.get('fertProducts.json')
        //        .success(function (response) {
        //            for (i=0;i<response.length; i++){
        //                var currentArrayItem = response[i];
        //                fertProductsArray.push(currentArrayItem);
        //            }
        //        })
        //        .error(function (err) {
        //            alert('ERROR from factory service ' + err)
        //        });
        //};
        //fertProducts();                                             //  INVOKE the function << CREATE the fertProductsArray
        //
        //return {                                                    //  FACTORY RETURNS >> function (getFertProducts) <<  that RETURNS the [fertProductsArray]
        //    getFertProducts: function(){
        //        return fertProductsArray
        //    }
        //}


        });     //  Factory END



    app.factory('cropRemovalService', function ($http) {

        var cropRemovalLevels = [];

        return {
            getCropRemovalData: function () {

                cropRemovalLevels = [];

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


    app.filter('percentage', function($filter){         //  Custom Filter for displaying percerntage value

        return function (input, decimals){
            return $filter('number')(input*100, decimals) + '%'
        }
    });


    app.config(function($routeProvider, $httpProvider){       //  Angular OBJECT  Injected Dynamically

        //$httpProvider.defaults.cache = true;

        $routeProvider.when('/', {
            templateUrl: 'partials/solutionCalculator.html',
            controller: 'myCtrl'
        });
        $routeProvider.when('/ProductData', {
            templateUrl: 'partials/productData.html',
            controller: 'myCtrl'
        });
        $routeProvider.when('/View3', {
            templateUrl: 'partials/placeholder1.html',
            controller: 'myCtrl2'
        });
        $routeProvider.otherwise({
            redirectTo: '/'                 // redirect to the ROOT  (View 1)
        });
    });

    app.controller('myCtrl2', function($scope){
        $scope.test = "Hello World";
    });


    app.controller('myCtrl', function($scope, $timeout, fertilizerService, cropRemovalService){


        var currentObject, currentItemsObject, property, currentCropElement, currentProgramViewArrayELement;
        var fieldNameHolder, fieldAcresHolder, cropHolder, yieldGoalHolder, irrigationHolder, productionTypeHolder, tillageHolder;

        var cropMarker = 1;
        var v = 0;



        //  UTILITY FUNCTION CONSTRUCTOR FUNCTION:  <<  Prepare OBJECT with Functions available to entire CONTROLLER

        function SolutionCalculatorConstructor (){


            this.initializeData = function (){


                $scope.product = {};
                $scope.formSectionOneComplete = false;
                $scope.disableAddProduct = true;


                //  FORM VALIDATION WATCHER:  Col1 and Col2 of FORM << Validation  --  If value in each of the spaces >>  Show NOTICE OF COMPLETION
                $scope.$watch('product', function(newValue, oldValue){       //  WATCHER:  $watch on the product OBJECT <<  For Field Data (Single Entry)
                    if ($scope.product.fieldName && $scope.product.crop && $scope.product.yieldGoal && $scope.product.irrigation && $scope.product.productionType && $scope.product.tillage)        //  If all true disable = false
                    {$scope.formSectionOneComplete = true;} else {$scope.formSectionOneComplete = false;}

                },true);


                //  FORM VALIDATION WATCHER:  Col3 of FORM << Validation  --  If value in each of the spaces <<  Enable the ADD PRODUCT BUTTON
                $scope.$watch('product', function(newValue, oldValue){
                    if ($scope.product.name && $scope.product.appMethod && $scope.product.rateAcre)        //  If all true disable = false
                    {$scope.disableAddProduct = false;} else {$scope.disableAddProduct = true;}
                },true);



                //  View Data Arrays:  DUMMY DATA
                $scope.programViewArray = [{"name": "Product", "rateAcre": 0, "inGallons": "yes/no", "poundAcre": 0, "appMethod": "Method", "totalPounds": 0,
                    "nitrogen": 0, "phosphate": 0, "potasium": 0, "sulfur": 0, "totalMicro": 0, "om": 0, "costPerAcre": 0}];                //  View Array with dummy data
                $scope.cropViewArray = [{"cropName": "Crop", "nitrogen": 0,"phosphate": 0,"potasium": 0,"sulfur": 0,"totalMicro": 0}];      //  Crop Removal Table dummy data



                //$scope.items = [];                              //  Array with Fertilizer product Data  (collected from JSON)
                //$scope.items = fertilizerService.get();         //  GET Objects from factory (JSON File)  <<  FACTORY DATA
                //
                //$scope.cropRemovalArray = [];
                //$scope.cropRemovalArray = cropRemovalService.get();        //  GET Objects from factory (JSON File)  <<  FACTORY DATA


                $scope.appMethod = [                            //  Select - Array of objects  << application method - Drop Down Menu
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

                $scope.cropList = [                            //  Select - Array of objects <<  crop list - Drop Down Menu
                    { value: "Corn", label: "Corn" },
                    { value: "Wheat", label: "Wheat" },
                    { value: "Soybeans", label: "Soybeans"},
                    { value: "Alfalfa", label: "Alfalfa"},
                    { value: "Beats", label: "Beats"},
                    { value: "Pop Corn", label: "Pop Corn"},
                    { value: "Edible Beans", label: "Edible Beans"}
                ];

                $scope.irrigation = [                            //  Select - Array of objects <<  irrigation - Drop Down Menu
                    { value: "Irrigated", label: "Irrigated" },
                    { value: "Dryland", label: "Dryland" },
                    { value: "Summer Fallow", label: "Summer Fallow"}
                ];

                $scope.productionType = [                            //  Select - Array of objects <<  production tyep - Drop Down Menu
                    { value: "Organic", label: "Organic" },
                    { value: "Commercial", label: "Commercial" },
                    { value: "Transition", label: "Transition"}
                ];

                $scope.tillage = [                            //  Select - Array of objects  <<  tillage - Drop Down Menu
                    { value: "No Till", label: "No Till" },
                    { value: "Vertical Tillage", label: "Vertical Tillage" },
                    { value: "Strip Till", label: "Strip Till"},
                    { value: "Full Tillage", label: "Full Tillage"},
                    { value: "Minimal Tillage", label: "Minimal Tillage"}
                ];
            };


            this.setDummyData =  function () {

                console.log("Set Dummy Data");

                $scope.programViewArray = [{"name": "Product", "rateAcre": 0, "inGallons": "yes/no", "poundAcre": 0, "appMethod": "Method", "totalPounds": 0,
                    "nitrogen": 0, "phosphate": 0, "potasium": 0, "sulfur": 0, "totalMicro": 0, "om": 0, "costPerAcre": 0}];                //  View Array with dummy data
                $scope.cropViewArray = [{"cropName": "Crop", "nitrogen": 0,"phosphate": 0,"potasium": 0,"sulfur": 0,"totalMicro": 0}];      //  Crop Removal Table dummy data
            };
            this.clearPristineForm = function () {

                console.log("Inside Clear Pristine Form");

                $scope.progForm.$setPristine();              // progForm is the main Form for Solution Calculator <<  set form to Pristine
                $scope.product = {};                         //  CLEAR OUT THE PRODUCT {OBJECT}
            };
            this.prepArrays = function(){

                console.log("Inside prepArrays");
                cropMarker = 1;
                currentCropElement = {};            //  current Element from loop through cropRemovalArrayFinal
                $scope.product = {};                //  Reset the product OBJECT created by the Form
                $scope.cropViewArray = [];          //  Reset the Array for the Crop Removal Table
                $scope.programViewArray = [];       //  Reset the Array for the Solution Calculator Table

                //cropRemovalArray = [];              //  Reset Array created from cropRemovalService.get()

            };

            this.clearLowerTableRowData = function () {

                $scope.sumLbAcre = 0;             //  CLEAR top GREEN ROW --  Total lbs/Acre row
                $scope.sumTotalPounds = 0;
                $scope.sumNitrogen = 0;
                $scope.sumPhosphate = 0;
                $scope.sumPotasium = 0;
                $scope.sumSulfur = 0;
                $scope.sumTotalMicro = 0;
                $scope.sumOm = 0;
                $scope.sumCostPerAcre = 0;

                $scope.percentNitrogen = 0;       //  Clear bottom GREEN ROW -- Est. Analysis
                $scope.percentPhosphate = 0;
                $scope.precentPotasium = 0;
                $scope.precentSulfur = 0;
                $scope.percentMicro = 0;
                $scope.percentOm = 0;
            };



            this.collectData = function(){                        //  ONLY EVER CALL THIS ONCE!!!!!!

                console.log("Inside COLLECT DATA");

                $scope.items = [];                                          //  Array with Fertilizer product Data  (collected from JSON)
                $scope.items = fertilizerService.getFertProducts();         //  GET Objects from factory (JSON File)  <<  FACTORY DATA

                cropRemovalArray = [];
                cropRemovalArray = cropRemovalService.getCropRemovalData();        //  GET Objects from factory (JSON File)  <<  FACTORY DATA      <<  THIS SEEMS TO MULTIPLY!!!!!!!!!!!!!!!

                v++;
                console.log("Data Collection Count: " + v);

            };

            this.utilityReport = function (){
                console.log("Using Functions from Solution Calculator Constructor Object")
            };

        }
        var utilityFunctions = new SolutionCalculatorConstructor();


        utilityFunctions.initializeData();  //  <<  Initialize $scope.DATA              <<  STEP 1 << <<
        utilityFunctions.collectData();     //  <<  Collect Data from JSON Arrays       <<  STEP 2





        //  BUTTON:  ADD PRODUCT  <<  function  <<<<<<<<<<<<<<<<  ADD PRODUCT  - Button #1

        $scope.addProduct = function(product) {                 //  FORM (Fertility Program Generator) OBJECT: product


            if($scope.programViewArray[0].name == "Product"){   //  <<  This is a test if the programViewArry has the Dummy Data in it:  name == "Product"
                $scope.programViewArray = [];                   //  <<  if Dummy Data --  clear programViewArray
                                                                //  programViewArray is the main array for the Solution Calculator Table
            }




            //  Product is the OBJECT created by completing the FORM
            //  Form OBJECT:  product   product[property]  >>  SAVE DATA COMMON TO EACH PRODUCT ENTERED - CUSTOMER/FIELD DATA

            fieldNameHolder = $scope.product.fieldName;            //  Holders for data to cary over
            fieldAcresHolder = $scope.product.fieldAcres;
            cropHolder = $scope.product.crop;
            yieldGoalHolder = $scope.product.yieldGoal;
            irrigationHolder = $scope.product.irrigation;
            productionTypeHolder = $scope.product.productionType;
            tillageHolder = $scope.product.tillage;


            for (var i = 0; i<$scope.items.length; i++){                    //  Loop through each {OBJECT} of the [items] array
                currentItemsObject = $scope.items[i];                       //  current {OBJECT} from the [items] array

                if (currentItemsObject.productName == $scope.product.name){        //  Match product selected in drop down (product.name) with product from [items] array >>
                    console.log("Finding Product in Array: " + currentItemsObject.productName);
                    for (property in currentItemsObject) {                  //  Loop through each property in the {OBJECT} from the [items] << the one selected from drop down
                        $scope.product[property] = currentItemsObject[property];   //  product OBJECT(from Form) [property] << items OBJECT [property]
                                                                            //  ADD the property from items {OBJECT} TO >>  the product {OBJECT} ex. product[idValue] = itemObject[idValue}
                    }                                                       //  Summary:  Adding data from selected [items] {OBJECT} to the product {OBJECT}
                }
            }

                                                            //  product {OBJECT} is the BIG MAIN OBJECT!!  with all the data

            function solutionCalculator (){                 //  CALCULATIONS with product {OBJECT} property values FOR the SOLUTION CALCULATOR Table

                if ($scope.product.inGallons == true){

                    $scope.product.poundAcre = ($scope.product.galWeightDensity * $scope.product.rateAcre);
                    $scope.product.totalPounds = ($scope.product.galWeightDensity * $scope.product.rateAcre * $scope.product.fieldAcres);
                    $scope.product.inGallons = "Yes";
                    $scope.product.nitrogen *= $scope.product.poundAcre;
                    $scope.product.phosphate *= $scope.product.poundAcre;
                    $scope.product.potasium *= $scope.product.poundAcre;
                    $scope.product.sulfur *= $scope.product.poundAcre;
                    $scope.product.totalMicro *= $scope.product.poundAcre;
                    $scope.product.om *= $scope.product.poundAcre;
                    $scope.product.costPerAcre = ($scope.product.costPound * $scope.product.poundAcre);

                } else {
                    $scope.product.poundAcre = ($scope.product.rateAcre);
                    $scope.product.totalPounds = ($scope.product.rateAcre * $scope.product.fieldAcres);
                    $scope.product.inGallons = "No";
                    $scope.product.nitrogen *= $scope.product.poundAcre;
                    $scope.product.phosphate *= $scope.product.poundAcre;
                    $scope.product.potasium *= $scope.product.poundAcre;
                    $scope.product.sulfur *= $scope.product.poundAcre;
                    $scope.product.totalMicro *= $scope.product.poundAcre;
                    $scope.product.om *= $scope.product.poundAcre;
                    $scope.product.costPerAcre = ($scope.product.costPound * $scope.product.rateAcre);
                }

            }
            solutionCalculator();


            function cropRemovalCalculator () {         //  Build cropViewArray with Data  << CALCULATIONS for the Crop Removal TABLE



                for (i=0; i<cropRemovalArray.length; i++) {          //  cropRemovalArray is the data collected from JSON << crop removal data:  Crop,N,P,K,S,Total Micro
                    currentCropElement = cropRemovalArray[i];

                    console.log("SOLUTION CALCULATOR:  cropRemovalArray Length: " + cropRemovalArray.length);
                    console.log("SOLUTION CALCULATOR:  Nitrogen from cropRemovalArray: " + cropRemovalArray[i].nitrogen);


                    //  TEST:  if the cropName added to the cropRemovalArray is the same as
                    if ($scope.product.crop == currentCropElement.cropName && $scope.cropViewArray.length == 1 && cropMarker <= 1){  //  cropViewArray will always have 1 element due to dummy data

                        //  currentCropElement is an OBJECT

                        console.log("Product Yield Goal: " + $scope.product.yieldGoal);

                        $scope.cropViewArray = [];                          //  VIEW ARRAY -- Now CLEAR OUT the dummy data for the Crop Removal Table

                        $scope.cropViewArray.push(currentCropElement);      //  <<< XXX Prepare FINAL array XXX for the Crop Removal Table
                        cropMarker++;                                       //  Now make sure don't go in here again <<  ONLY PREPARE DATA FOR CROP REMOVAL TABLE ONCE!!!
                    }
                }
            }
            cropRemovalCalculator();


            $scope.programViewArray.push($scope.product);       //  <<< XXX Prepare FINAL array XXX for Solution Calculator Table <<  push the product {OBJECT} into programViewArray()


            //  CALCULATOR for the Total lbs/Acre -- Table Row (Top Green)

            function totalLbsAcreCalculator() {

                $scope.sumLbAcre = 0;             //  Every time you push the AddProduct button - value reset to zero for new round of addition
                $scope.sumTotalPounds = 0;
                $scope.sumNitrogen = 0;
                $scope.sumPhosphate = 0;
                $scope.sumPotasium = 0;
                $scope.sumSulfur = 0;
                $scope.sumTotalMicro = 0;
                $scope.sumOm = 0;
                $scope.sumCostPerAcre = 0;

                                                                                            //  programViewArray has ONE OBJECT for EACH ROW IN THE TABLE
                for (i=0;i<$scope.programViewArray.length;i++){                             //  Iterate through each OBJECT of the programViewArray
                    currentProgramViewArrayELement = $scope.programViewArray[i];            //  << Current OBJECT -- One row of table, then next row, etc.

                    $scope.sumLbAcre += currentProgramViewArrayELement.poundAcre;            //  Add OBJECT Property Value (poundAcre) to the scoped variable for the table
                    $scope.sumTotalPounds += currentProgramViewArrayELement.totalPounds;     //  SUM of Column Data
                    $scope.sumNitrogen += currentProgramViewArrayELement.nitrogen;
                    $scope.sumPhosphate += currentProgramViewArrayELement.phosphate;
                    $scope.sumPotasium += currentProgramViewArrayELement.potasium;
                    $scope.sumSulfur += currentProgramViewArrayELement.sulfur;
                    $scope.sumTotalMicro += currentProgramViewArrayELement.totalMicro;
                    $scope.sumOm += currentProgramViewArrayELement.om;
                    $scope.sumCostPerAcre += currentProgramViewArrayELement.costPerAcre;
                }
            }
            totalLbsAcreCalculator();

            //  CALCULATOR for Est. Analysis --  Table Row (Bottom Green)

            function estAnaylsisCalculator() {

                $scope.percentNitrogen = 0;                                                 //  Clear out the data
                $scope.percentPhosphate = 0;
                $scope.precentPotasium = 0;
                $scope.precentSulfur = 0;
                $scope.percentMicro = 0;
                $scope.percentOm = 0;

                $scope.percentNitrogen = ($scope.sumNitrogen / $scope.sumLbAcre);           //  Calculate the new Row data
                $scope.percentPhosphate = ($scope.sumPhosphate / $scope.sumLbAcre);
                $scope.precentPotasium = ($scope.sumPotasium / $scope.sumLbAcre);
                $scope.precentSulfur = ($scope.sumSulfur / $scope.sumLbAcre);
                $scope.percentMicro = ($scope.sumTotalMicro / $scope.sumLbAcre);
                $scope.percentOm = ($scope.sumOm / $scope.sumLbAcre);

            }
            estAnaylsisCalculator();


            $scope.product = {};                                //  CLEAR OUT THE PRODUCT {OBJECT}


            function restoreData() {                            //  Restore data to product {OBJECT} that is fixed and only to be entered once
                $scope.product.fieldName = fieldNameHolder;     //  Restore Form Values that are retained for each product entered <<  FIELD INFO -- Form keeper values
                $scope.product.fieldAcres = fieldAcresHolder;
                $scope.product.crop = cropHolder;
                $scope.product.yieldGoal = yieldGoalHolder;
                $scope.product.irrigation = irrigationHolder;
                $scope.product.productionType = productionTypeHolder;
                $scope.product.tillage = tillageHolder;
            }
            restoreData();


        };      //  addProduct() FUNCTION - END


        //  BUTTON:  CLEAR FORM  <<  function  <<<<<<<<<<<<<<<<  CLEAR FORM  - Button #2

        $scope.resetProductForm = function () {
            utilityFunctions.utilityReport();
            utilityFunctions.clearPristineForm();
            utilityFunctions.prepArrays();
            utilityFunctions.clearLowerTableRowData();
            utilityFunctions.setDummyData();
        };


        setTimeout(function() {
                console.log("Length of Items Array: " + $scope.items.length);
                console.log($scope.items);
            }, 1000
        );


});  //  ng-CONTROLLER:  myCtrl - END



