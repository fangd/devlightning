(function () {
    var demoApp = angular.module('demoApp', ['ngRoute', 'ngAnimate']);

    demoApp.config(function ($routeProvider) {
        $routeProvider.when('/', {
            templateUrl: 'views/home.html',
            controller: 'homeController'
        }).when('/transactions', {
            templateUrl: 'views/transactions.html',
            controller: 'transactionsController'
        }).when('/about', {
            templateUrl: 'views/about.html',
            controller: 'aboutController'
        }).when('/faq', {
            templateUrl: 'views/faq.html',
            controller: 'faqController'
        }).when('/details/:transaction_id', {
            templateUrl: 'views/details.html',
            controller: 'detailsController'
        })
        .otherwise({ redirectTo: '/' });
    });
    
    demoApp.controller('homeController', function ($scope) {
        $scope.message = 'Oat cake muffin cookie. Ice cream wafer I love marzipan. Oat cake jelly-o jelly beans dragée dessert powder pie donut toffee. Caramels sweet roll jelly fruitcake powder. Dragée donut gummi bears caramels I love. Cotton candy gummi bears dessert muffin bonbon toffee brownie gingerbread. Jelly bear claw lemon drops carrot cake biscuit chocolate bar ice cream I love. I love brownie chocolate cake sugar plum cake cake tiramisu wafer I love. Candy chocolate cake croissant I love powder macaroon. Jelly-o candy canes gummi bears jelly croissant croissant dragée cookie gingerbread. Jelly candy jelly beans toffee wafer cake chocolate cake I love chupa chups. Fruitcake tootsie roll cookie jelly. Gummi bears soufflé brownie tiramisu.' +
        'Gummi bears chocolate cake donut. Cheesecake toffee cheesecake tootsie roll tart bear claw chupa chups. Candy canes pie cupcake carrot cake powder. Soufflé cupcake I love brownie dessert pudding danish carrot cake. Wafer marshmallow jujubes. Dragée jelly beans ice cream chocolate icing cupcake croissant. Lollipop dragée bonbon toffee icing chocolate. Chocolate cake croissant powder icing. Jujubes fruitcake tart halvah. Pastry I love biscuit lollipop oat cake sesame snaps oat cake lemon drops marzipan. Oat cake sweet caramels soufflé dessert jelly-o. Topping sweet I love tootsie roll.' +
        'Dessert brownie jelly beans. Fruitcake chocolate cake bear claw. Sesame snaps donut soufflé chocolate bar liquorice halvah brownie tart dessert. Sugar plum wafer cotton candy I love tiramisu tart. Jelly beans muffin cake sweet roll biscuit. Bonbon chocolate cake carrot cake. Pie tiramisu sugar plum gingerbread powder cake brownie macaroon. Croissant jelly-o gummi bears oat cake jelly beans dragée chocolate bar tiramisu jelly beans. Dragée tiramisu chupa chups oat cake dessert sweet jelly-o pastry. Tootsie roll brownie chocolate bar dragée candy canes pastry sweet I love chocolate cake. Pudding bonbon marzipan apple pie halvah. Gummies I love croissant icing. Candy donut cake cotton candy wafer jujubes.' +
        'I love sesame snaps I love. Macaroon I love candy canes gingerbread. Jujubes chocolate sesame snaps croissant pudding toffee. Sesame snaps I love candy I love bear claw icing donut. Sesame snaps toffee icing. Topping marshmallow chupa chups muffin marzipan sweet roll croissant dragée. Tootsie roll muffin tootsie roll gummi bears jelly beans pie cookie pastry cotton candy. Croissant I love cheesecake. I love halvah chupa chups chocolate cake I love chupa chups. Pudding topping tart chupa chups. Brownie sugar plum I love jelly chocolate jelly beans I love donut. Dessert jelly gingerbread. Tiramisu gingerbread lollipop chocolate candy sugar plum.' +
        'Brownie cake marzipan cake jelly-o marzipan I love lollipop I love. Cookie chocolate bar powder gummies sweet roll candy canes carrot cake. Pie fruitcake danish icing. Cheesecake sesame snaps bear claw chocolate cake liquorice I love fruitcake powder. Tiramisu I love bear claw marshmallow pie. Donut apple pie cotton candy topping marshmallow donut. Chocolate bar icing caramels macaroon donut lemon drops marshmallow tiramisu. Oat cake tart croissant. Cheesecake I love fruitcake soufflé. Candy canes ice cream gummi bears carrot cake candy cake. Cupcake liquorice apple pie dragée danish. Croissant pudding jujubes tart sugar plum. Chocolate bar pie bonbon sugar plum dessert sesame snaps. Dessert jujubes tiramisu dragée.';
    });

    demoApp.controller('transactionsController', function ($scope, $rootScope) {
        var selectedIndex1 = null, selectedIndex2 = null;
        var pieChart1 = $("#myChart1");
        var jsondata = getJSONData();
        $rootScope.records = jsondata;
        var jsonTotal = jsondata.length;
        var lobVolume = [];
        var priorityVolume = [];
        $scope.selectedLOB = '';
        //Getting a unique list of LOBs here
        var uniqueLobs = $.unique(jsondata.map(function (d) { return d.lob; })).sort();
        //unique value for prioirty
        var uniquePriorities = [true, false];
        //Looping through each unique LOB here
        $.each(uniqueLobs, function (index, value) {
            //Grab all data from the CURRENT looped LOB
            var lobdata = $.grep(jsondata, function (x) { return x.lob == value; });
            //Store lob and total volume of that LOB transaction
            var lob = {
                lob: value,
                volume: lobdata.length
            };
            //Store into lob (lobname, volume) into new array
            lobVolume.push(lob);
        });
        $.each(uniquePriorities, function (index, value) {
            //Grab all data from the CURRENT looped LOB
            var prioritydata = $.grep(jsondata, function (x) { return x.priority == value; });
            //Store lob and total volume of that LOB transaction
            var priority = {
                priority: value,
                volume: prioritydata.length
            };
            //Store into lob (lobname, volume) into new array
            priorityVolume.push(priority);
        });
        var myChart1 = new Chart(pieChart1, {
            type: 'pie',
            data: {
                datasets: [{
                    data: lobVolume.map(function (x) { return x.volume }),
                    backgroundColor: [ 'red','blue','green','yellow','orange']
                }],
                labels: lobVolume.map(function (x) { return x.lob })
            },
            options: {
                onClick: function (evt, elements) {
                    if (elements && elements.length) {
                        var segment = elements[0];

                        $scope.$apply(function () {
                            if ($scope.selectedLOB != segment['_view'].label) {
                                $scope.selectedLOB = segment['_view'].label;
                            }
                            else {
                                $scope.selectedLOB = null;
                            }
                        });
                        
                        myChart1.update();
                        if (selectedIndex1 !== segment["_index"]) {
                            selectedIndex1 = segment["_index"];
                            segment._model.outerRadius += 10;
                        }
                        else {
                            selectedIndex1 = null;
                        }
                    }
                },
                layout: {
                    padding: { bottom: 10 }
                },
                legend: {
                    labels: {
                        boxWidth: 10
                    }
                }
            }
        });

        var pieChart2 = $("#myChart2");
        var myChart2 = new Chart(pieChart2, {
            type: 'pie',
            data: {
                datasets: [{
                    data: priorityVolume.map(function (y) { return y.volume }),

                    backgroundColor: ['orange', 'blue']
                }],
                // These labels appear in the legend and in the tooltips when hovering different arcs
                labels: ['Low','High']
                //priorityVolume.map(function (y) { return y.volume })
            },
            options: {
                onClick: function (evt, elements) {
                    if (elements && elements.length) {
                        var segment = elements[0];
                        myChart2.update();
                        if (selectedIndex2 !== segment["_index"]) {
                            selectedIndex2 = segment["_index"];
                            segment._model.outerRadius += 10;
                        }
                        else {
                            selectedIndex2 = null;
                        }
                    }
                },
                layout: {
                    padding: { bottom: 10 }
                }
            }
        });

        var lineChart = $("#myChart3");
        var myChart = new Chart(lineChart, {
            type: 'line',
            data: {
                labels: ["January", "February", "March", "April", "May", "June"],
                datasets: [{
                    label: 'Volume of Transactions',
                    data: [12, 19, 3, 5, 2, 3],
                    backgroundColor: 'rgba(122, 140, 230, 1)',
                    borderColor: [
                        'rgba(255,99,132,1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }
            }
        });    
    });

    demoApp.controller('detailsController', function ($rootScope, $scope, $routeParams) {
        var transactionId = ($routeParams.transaction_id) ? parseInt($routeParams.transaction_id) : 0;
        //console.log(transactionId);
        //console.log($rootScope);
        //console.log($rootScope.records);
        $scope.record = $.grep($rootScope.records, function (x) { return x.transaction_id == transactionId; })[0];
        //$scope.record = $filter('filter')(rec.results, { transaction_id: transactionId });
    });

    demoApp.controller('aboutController', function ($scope) {
        $scope.message = 'About Controller View';
    });

    demoApp.controller('faqController', function ($scope) {
        $scope.message = 'FAQ Controller View';
    });

    //$scope.isSelectedLOB = function (selectLOB) {
    //    return 
    //};

}());