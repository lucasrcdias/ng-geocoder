(function () {
  angular
    .module("ng-geocoder")
    .directive("ngGeocoder", ngGeocoder);

  ngGeocoder.$inject = ["$timeout", "ngGeocoderService"];

  function ngGeocoder ($timeout, ngGeocoderService) {
    var directive = {
      "restrict": "AE",
      "scope": {
        "result": "=ngGeocoder",
        "id": "=",
        "wait": "=",
        "minLength": "=",
        "placeholder": "@",
        "textSearching": "@",
        "textNoResults": "@"
      },
      "controller": ngGeocoderCtrl,
      "controllerAs": "vm",
      "bindToController": true,
      "link": linkFunction,
      "template": INCLUDE_FILE("ng-geocoder.html")
    };

    return directive;

    function ngGeocoderCtrl () {
      var vm = this;

      vm.index   = 0;
      vm.results = [];

      vm.select        = select;
      vm.displayList   = displayList;
      vm.inputKeypress = inputKeypress;

      function select (index) {
        vm.result = vm.results[index];
      }

      function inputKeypress ($event) {
        if (event.keyCode === 38 || event.keyCode === 40) return handleArrowKeys($event.keyCode);
        if (event.keyCode === 13)                         return select(vm.index);
      }

      function handleArrowKeys(key) {
        var index         = vm.index;
        var resultsLength = vm.results.length;

        var arrowUp   = key === 38;
        var arrowDown = key === 40;

        if (arrowUp) {
          index = index > 0 ? index - 1 : resultsLength;
        }

        if (arrowDown) {
          index = index < resultsLength ? index + 1 : 0;
        }

        vm.index = index;
      }

      function displayList () {
        return vm.inputFocused || vm.results.length;
      }
    }

    function linkFunction (scope, element, attributes) {
      var waitTimeout;

      var $el   = element[0];
      var input = $el.querySelector(".ng-geocoder__input");

      input.addEventListener("input",    inputChanged);

      function inputChanged (event) {
        var length = input.value.length;

        if (length <= scope.vm.minLength || scope.vm.isSearching) { return; }

        if (waitTimeout) { $timeout.cancel(waitTimeout); }

        waitTimeout = $timeout(search, scope.vm.wait || 500);
      }

      function search (query) {
        scope.vm.isSearching = true;

        return ngGeocoderService.geocodeByQuery(query || input.value)
          .then(geocodeSuccess);
      }

      function geocodeSuccess (results) {
        scope.vm.isSearching = false;
        scope.vm.results     = results || [];
      }
    }
  }
})();
