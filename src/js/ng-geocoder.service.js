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
      switch (status) {
        case google.maps.GeocoderStatus.OK:
          return defer.resolve(results);
        case google.maps.GeocoderStatus.ZERO_RESULTS:
          return defer.resolve([]);
        case google.maps.GeocoderStatus.OVER_QUERY_LIMIT:
          return defer.reject("Over query limit");
        case google.maps.GeocoderStatus.REQUEST_DENIED:
          return defer.reject("Request denied");
        default:
          return defer.reject("Unknown error");
      }
    }

    function geocodeById (placeId) {
      return geocode({ "placeId": placeId });
    }

    function geocodeByQuery (query, region) {
      var params = {
        "address": query,
        "region": region
      }

      return geocode(params);
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
