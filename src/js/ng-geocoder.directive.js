(function () {
  angular
    .module("ng-geocoder")
    .directive("ngGeocoder", ngGeocoder);

  ngGeocoder.$inject = ["$timeout", "ngGeocoderService"];

  function ngGeocoder ($timeout, ngGeocoderService) {
    var directive = {
      "restrict": "AE",
      "scope": {
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
    }

    function linkFunction (scope, element, attributes) {
      var waitTimeout;
      var input = element[0].querySelector("input");

      input.addEventListener("input", inputChanged);

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
