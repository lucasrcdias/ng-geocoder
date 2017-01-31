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
        "inputClass": "@",
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

      vm.index    = 0;
      vm.results  = [];
      vm.showList = false;

      vm.select       = select;
      vm.displayList  = displayList;
      vm.inputKeydown = inputKeydown;

      function select (index) {
        vm.result   = vm.results[index];
        vm.showList = false;
      }

      function inputKeydown ($event) {
        if (!$event || !$event.keyCode) return;

        var enterPressed  = $event.keyCode === 13;
        var arrowsPressed = $event.keyCode === 38 || $event.keyCode === 40;

        if (enterPressed || arrowsPressed) {
          if (arrowsPressed) handleArrowKeys($event.keyCode);
          if (enterPressed)  select(vm.index);

          $event.preventDefault();
          $event.stopPropagation();
        }
      }

      function handleArrowKeys(key) {
        var index         = vm.index;
        var resultsLength = vm.results.length;

        var arrowUp   = key === 38;
        var arrowDown = key === 40;

        if (arrowUp) {
          index--;
        }

        if (arrowDown) {
          index++;
        }

        if (index >= resultsLength) { index = 0; }
        if (index < 0) { index = resultsLength - 1; }

        vm.index = index;
      }

      function displayList () {
        return (vm.inputFocused || vm.results.length) && vm.showList;
      }
    }

    function linkFunction (scope, element, attributes) {
      var waitTimeout;

      var $el   = element[0];
      var input = $el.querySelector(".ng-geocoder__input");

      input.addEventListener("input", inputChanged);

      function inputChanged (event) {
        var length = input.value.length;

        if (length <= scope.vm.minLength || scope.vm.isSearching) { return; }

        if (waitTimeout) { $timeout.cancel(waitTimeout); }

        waitTimeout = $timeout(search, scope.vm.wait || 500);
      }

      function search (query) {
        scope.vm.results     = [];
        scope.vm.isSearching = true;

        return ngGeocoderService.geocodeByQuery(query || input.value)
          .then(geocodeSuccess);
      }

      function geocodeSuccess (results) {
        scope.vm.isSearching = false;
        scope.vm.results     = results || [];
        scope.vm.showList    = true;
      }
    }
  }
})();
