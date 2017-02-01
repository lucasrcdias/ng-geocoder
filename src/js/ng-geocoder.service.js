(function () {
  angular
    .module("ng-geocoder")
    .factory("ngGeocoderService", ngGeocoderService);

  ngGeocoderService.$inject = ["$q"];

  function ngGeocoderService ($q) {
    var geocoder = new google.maps.Geocoder();
    var service  = {
      "geocodeById": geocodeById,
      "geocodeByQuery": geocodeByQuery
    }

    return service;

    function handleReply (defer, results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        return defer.resolve(results);
      } else if (status === google.maps.GeocoderStatus.ZERO_RESULTS) {
        return defer.resolve([]);
      } else if (status === google.maps.GeocoderStatus.OVER_QUERY_LIMIT) {
        return defer.reject("Over query limit");
      } else if (status === google.maps.GeocoderStatus.REQUEST_DENIED) {
        return defer.reject("Request denied");
      }

      return defer.reject("Unknown error");
    }

    function geocodeById (placeId) {
      return geocode({ "placeId": placeId });
    }

    function geocodeByQuery (query) {
      return geocode({ "address": query });
    }

    function geocode (options) {
      var defer = $q.defer();

      geocoder.geocode(options, function (results, status) {
        handleReply(defer, results, status);
      });

      return defer.promise;
    }
  }
})();
