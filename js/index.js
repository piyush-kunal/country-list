var app = angular.module("myApp", ['smart-table']);

app.controller('safeController', safeController);

function safeController($http) {
  var vm = this;
  vm.title = "hello world";
  $http
    .get('https://restcountries.eu/rest/v2/all')
    .then(function(response) {
      vm.countries = response.data;
    });
}
