(function () {
  angular
    .module("ng-geocoder")
    .directive("ngGeocoder", ngGeocoder);

  ngGeocoder.$inject = ["$timeout", "$templateCache", "ngGeocoderService"];

  function ngGeocoder ($timeout, $templateCache, ngGeocoderService) {
    var DEFAULT_TEMPLATE_URL = "/ng-geocoder/ng-geocoder.html";

    $templateCache.put(DEFAULT_TEMPLATE_URL, INCLUDE_FILE("ng-geocoder.html"));

    var directive = {
      "restrict": "AE",
      "scope": {
        "result": "=ngGeocoder",
        "inputId": "=",
        "wait": "=",
        "minLength": "=",
        "inputClass": "@",
        "placeholder": "@",
        "textSearching": "@",
        "textNoResults": "@",
        "maxHeight": "@"
      },
      "controller": ngGeocoderCtrl,
      "controllerAs": "vm",
      "bindToController": true,
      "link": linkFunction,
      "templateUrl": geocoderTemplate
    };

    return directive;

    function ngGeocoderCtrl () {
      var vm       = this;
      var dropdown = document.querySelector(".ng-geocoder__list");

      vm.index    = 0;
      vm.results  = [];
      vm.showList = false;

      vm.selectItem   = selectItem;
      vm.displayList  = displayList;
      vm.inputKeydown = inputKeydown;

      function selectItem (index) {
        vm.result   = vm.results[index];
        vm.query    = vm.result.formatted_address;

        vm.showList = false;
      }

      function displayList () {
        return vm.results.length && vm.showList;
      }

      function inputKeydown ($event) {
        if (!$event || !$event.keyCode) return;

        var enterPressed  = $event.keyCode === 13;
        var arrowsPressed = $event.keyCode === 38 || $event.keyCode === 40;

        if (enterPressed || arrowsPressed) {
          if (arrowsPressed) handleArrowKeys($event.keyCode);
          if (enterPressed)  selectItem(vm.index);

          $event.preventDefault();
          $event.stopPropagation();
        }
      }

      function handleArrowKeys(key) {
        var index         = vm.index;
        var resultsLength = vm.results.length;

        var arrowUp   = key === 38;
        var arrowDown = key === 40;

        if (arrowUp && (index - 1 >= 0)) {
          index--;
        }

        if (arrowDown && (index + 1 < resultsLength)) {
          index++;
        }

        vm.index = index;

        if (arrowUp   && vm.results.length) fixArrowUpScroll();
        if (arrowDown && vm.results.length) fixArrowDownScroll();
      }

      function fixArrowUpScroll() {
        var rowTop = dropdownRowTop();
        var height = dropdownRowOffsetHeight(getCurrentRow());

        if (rowTop < height) {
          dropdownScrollTo(rowTop - height);
        }
      }

      function fixArrowDownScroll () {
        var row = getCurrentRow();

        if (getDropdownHeight() < row.getBoundingClientRect().bottom) {
          dropdownScrollTo(dropdownRowOffsetHeight(row));
        }
      }

      function getCurrentRow () {
        return document.querySelector(".ng-geocoder__list__item--focus");
      }

      function dropdownRowTop () {
        return getCurrentRow().getBoundingClientRect().top - (dropdown.getBoundingClientRect().top + parseInt(getComputedStyle(dropdown).paddingTop, 10));
      }

      function dropdownScrollTo (offset) {
        dropdown.scrollTop = dropdown.scrollTop + offset;
      }

      function getDropdownHeight () {
        return dropdown.getBoundingClientRect().top + parseInt(getComputedStyle(dropdown).maxHeight, 10);
      }

      function dropdownRowOffsetHeight (row) {
        var css = getComputedStyle(row);

        return row.offsetHeight + parseInt(css.marginTop, 10) + parseInt(css.marginBottom, 10);
      }
    }

    function linkFunction (scope, element, attributes) {
      var waitTimeout;

      var $el   = element[0];
      var input = $el.querySelector(".ng-geocoder__input");

      input.addEventListener("input",          inputChanged);
      input.addEventListener("compositionend", inputChanged);

      var placeId = attributes.placeId;

      if (placeId) {
        ngGeocoderService.geocodeById(placeId)
          .then(geocodedWithPlaceId);
      }

      function inputChanged (event) {
        var length = scope.vm.query.length;

        if (length < scope.vm.minLength || scope.vm.isSearching) { return; }

        if (waitTimeout) { $timeout.cancel(waitTimeout); }

        waitTimeout = $timeout(search, scope.vm.wait || 500);
      }

      function search () {
        scope.vm.results     = [];
        scope.vm.isSearching = true;

        return ngGeocoderService.geocodeByQuery(scope.vm.query, attributes.region)
          .then(geocodeSuccess);
      }

      function geocodeSuccess (results) {
        scope.vm.isSearching = false;
        scope.vm.results     = results || [];
        scope.vm.showList    = true;
      }

      function geocodedWithPlaceId (results) {
        var result = results[0];

        if (result) {
          scope.vm.query    = result.formatted_address;
          scope.vm.result   = result;

          scope.vm.showList = false;
        }
      }
    }

    function geocoderTemplate (element, attributes) {
      return attributes.templateUrl || DEFAULT_TEMPLATE_URL
    }
  }
})();
