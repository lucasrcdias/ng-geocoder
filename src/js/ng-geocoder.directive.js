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
        "wait": "=",
        "inputId": "=",
        "placeId": "=",
        "minLength": "=",
        "selectCallback": "=",
        "maxHeight": "@",
        "inputClass": "@",
        "placeholder": "@",
        "textSearching": "@",
        "textNoResults": "@"
      },
      "link": link,
      "templateUrl": geocoderTemplate
    };

    return directive;

    function link (scope, element, attributes) {
      var waitTimeout;

      var $el      = element[0];
      var form     = $el.closest("form");
      var input    = $el.querySelector(".ng-geocoder__input");
      var dropdown = $el.querySelector(".ng-geocoder__list");

      scope.index   = 0;
      scope.query   = "";
      scope.results = [];

      scope.selectItem   = selectItem;
      scope.displayList  = displayList;
      scope.inputKeydown = inputKeydown;

      scope.$watch("placeId", placeIdChanged);

      if (form) form.addEventListener("keydown", formKeydown);

      input.addEventListener("blur",           inputBlur);
      input.addEventListener("focus",          inputFocus);
      input.addEventListener("input",          inputChanged);
      input.addEventListener("keydown",        inputKeydown);
      input.addEventListener("compositionend", inputChanged);

      function formKeydown (event) {
        var targetIsGeocoderInput = event.target.classList.contains("ng-geocoder__input");

        if (event.keyCode === 13 && targetIsGeocoderInput) {
          event.preventDefault();
          event.stopPropagation();
        }
      }

      function inputBlur (event) {
        $timeout(function () {
          scope.showList = false;
        }, 100);
      }

      function inputFocus (event) {
        scope.$apply(function () {
          scope.showList = true;
        });
      }

      function inputChanged (event) {
        var length = scope.query.length;

        if (length < scope.minLength) return;

        if (waitTimeout) { $timeout.cancel(waitTimeout); }

        waitTimeout = $timeout(search, scope.wait || 500);
      }

      function inputKeydown (event) {
        if (!event || !event.keyCode) return;

        var escPressed    = event.keyCode === 27;
        var enterPressed  = event.keyCode === 13;
        var arrowsPressed = event.keyCode === 38 || event.keyCode === 40;

        if (enterPressed || arrowsPressed || escPressed) {
          if (escPressed)    hideList();
          if (enterPressed)  selectItem(scope.index);
          if (arrowsPressed) handleArrowKeys(event.keyCode);

          event.preventDefault();
          event.stopPropagation();

          return false;
        }
      }

      function search () {
        scope.$apply(function () {
          scope.results     = [];
          scope.isEmpty     = false;
          scope.isSearching = true;
        });

        return ngGeocoderService.geocodeByQuery(scope.query, attributes.region)
          .then(geocodeSuccess);
      }

      function geocodeSuccess (results) {
        scope.index       = 0;
        scope.isEmpty     = results.length === 0;
        scope.results     = results;
        scope.showList    = true;
        scope.isSearching = false;
      }

      function geocodedWithPlaceId (results) {
        var result = results[0];

        if (result) {
          scope.query    = result.formatted_address;
          scope.result   = result;

          scope.showList = false;
        }
      }

      function displayList () {
        return scope.query.length >= scope.minLength && scope.showList;
      }

      function hideList () {
        input.blur();

        scope.$apply(function () {
          scope.showList = false;
        });
      }

      function selectItem (index) {
        $timeout(function () {
          scope.index    = index;
          scope.result   = scope.results[index];
          scope.query    = scope.result.formatted_address;

          scope.showList = false;

          if (scope.selectCallback && typeof scope.selectCallback === "function") {
            scope.selectCallback();
          }
        }, 0);
      }

      function handleArrowKeys(key) {
        var index         = scope.index;
        var resultsLength = scope.results.length;

        var arrowUp   = key === 38;
        var arrowDown = key === 40;

        if (arrowUp && (index - 1 >= 0)) {
          index--;
        }

        if (arrowDown && (index + 1 < resultsLength)) {
          index++;
        }

        scope.$apply(function () {
          scope.index = index;
        });

        if (arrowUp   && scope.results.length) fixArrowUpScroll();
        if (arrowDown && scope.results.length) fixArrowDownScroll();
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
        return $el.querySelector(".ng-geocoder__list__item--focus");
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

      function placeIdChanged (placeId) {
        if (placeId) {
          return ngGeocoderService.geocodeById(placeId)
            .then(geocodedWithPlaceId);
        }
      }
    }

    function geocoderTemplate (element, attributes) {
      return attributes.templateUrl || DEFAULT_TEMPLATE_URL
    }
  }
})();
