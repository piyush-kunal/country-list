var app = angular.module('app', []);

app.factory('myfactory', function($http) {
  var urlBase = 'https://restcountries.eu/rest/v2/all';
  var dataFactory = {};
  dataFactory.get = $http.get(urlBase).then(function(resp) {
    return resp.data;
  });
  dataFactory.all = function() {
    return dataFactory.get;
  };
  return dataFactory;
});
app.controller('myCtrl', function($scope, $filter, myfactory) {
  myfactory.all().then(function(resp) {

    $scope.sortingOrder = sortingOrder;
    $scope.reverse = false;
    $scope.filteredItems = [];
    $scope.groupedItems = [];
    $scope.itemsPerPage = 5;
    $scope.pagedItems = [];
    $scope.currentPage = 0;
    $scope.items = resp;
    var searchMatch = function(haystack, needle) {
      if (!needle) {
        return true;
      }
      return haystack.toLowerCase().indexOf(needle.toLowerCase()) !== -1;
    };

    // init the filtered items
    $scope.search = function() {
      $scope.filteredItems = $filter('filter')($scope.items, function(item) {
        for (var attr in item) {
          if (searchMatch(item[attr], $scope.query))
            return true;
        }
        return false;
      });
      // take care of the sorting order
      if ($scope.sortingOrder !== '') {
        $scope.filteredItems = $filter('orderBy')($scope.filteredItems, $scope.sortingOrder, $scope.reverse);
      }
      $scope.currentPage = 0;
      // now group by pages
      $scope.groupToPages();
    };

    // calculate page in place
    $scope.groupToPages = function() {
      $scope.pagedItems = [];

      for (var i = 0; i < $scope.filteredItems.length; i++) {
        if (i % $scope.itemsPerPage === 0) {
          $scope.pagedItems[Math.floor(i / $scope.itemsPerPage)] = [$scope.filteredItems[i]];
        } else {
          $scope.pagedItems[Math.floor(i / $scope.itemsPerPage)].push($scope.filteredItems[i]);
        }
      }
    };

    $scope.range = function(start, end) {
      var ret = [];
      if (!end) {
        end = start;
        start = 0;
      }
      for (var i = start; i < end; i++) {
        ret.push(i);
      }
      return ret;
    };

    $scope.prevPage = function() {
      if ($scope.currentPage > 0) {
        $scope.currentPage--;
      }
    };

    $scope.nextPage = function() {
      if ($scope.currentPage < $scope.pagedItems.length - 1) {
        $scope.currentPage++;
      }
    };

    $scope.setPage = function() {
      $scope.currentPage = this.n;
    };

    // functions have been describe process the data for display
    $scope.search();

    // change sorting order
    $scope.sort_by = function(newSortingOrder) {
      if ($scope.sortingOrder == newSortingOrder)
        $scope.reverse = !$scope.reverse;

      $scope.sortingOrder = newSortingOrder;

      // icon setup
      // $('th i').each(function(){
      //     // icon reset
      //     $(this).removeClass().addClass('icon-sort');
      // });
      // if ($scope.reverse)
      //     $('th.'+new_sorting_order+' i').removeClass().addClass('icon-chevron-up');
      // else
      //     $('th.'+new_sorting_order+' i').removeClass().addClass('icon-chevron-down');
    };

  });
});