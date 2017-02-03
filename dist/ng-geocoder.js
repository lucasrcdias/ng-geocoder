!function(){angular.module("ng-geocoder",[])}(),function(){function e(e){function t(e,t,n){return n==google.maps.GeocoderStatus.OK?e.resolve(t):n===google.maps.GeocoderStatus.ZERO_RESULTS?e.resolve([]):n===google.maps.GeocoderStatus.OVER_QUERY_LIMIT?e.reject("Over query limit"):n===google.maps.GeocoderStatus.REQUEST_DENIED?e.reject("Request denied"):e.reject("Unknown error")}function n(e){return r({placeId:e})}function o(e,t){return r({address:e,region:t})}function r(n){var o=e.defer();return i.geocode(n,function(e,n){t(o,e,n)}),o.promise}var i=new google.maps.Geocoder,s={geocodeById:n,geocodeByQuery:o};return s}angular.module("ng-geocoder").factory("ngGeocoderService",e),e.$inject=["$q"]}(),function(){function e(e,t,n){function o(t,o,r){function i(e){var t=e.target.classList.contains("ng-geocoder__input");13===e.keyCode&&t&&(e.preventDefault(),e.stopPropagation())}function s(n){e(function(){t.showList=!1},100)}function c(e){t.$apply(function(){t.showList=!0})}function l(n){var o=t.query.length;o<t.minLength||t.isSearching||(L&&e.cancel(L),L=e(u,t.wait||500))}function g(e){if(e&&e.keyCode){var n=13===e.keyCode,o=38===e.keyCode||40===e.keyCode;return n||o?(o&&m(e.keyCode),n&&p(t.index),e.preventDefault(),e.stopPropagation(),!1):void 0}}function u(){return t.$apply(function(){t.results=[],t.isEmpty=!1,t.isSearching=!0}),n.geocodeByQuery(t.query,r.region).then(d)}function d(e){t.index=0,t.isEmpty=0===e.length,t.results=e,t.showList=!0,t.isSearching=!1}function a(e){var n=e[0];n&&(t.query=n.formatted_address,t.result=n,t.showList=!1)}function p(n){e(function(){t.index=n,t.result=t.results[n],t.query=t.result.formatted_address,t.showList=!1},0)}function _(){return t.query.length>=t.minLength&&t.showList}function m(e){var n=t.index,o=t.results.length,r=38===e,i=40===e;r&&n-1>=0&&n--,i&&n+1<o&&n++,t.$apply(function(){t.index=n}),r&&t.results.length&&f(),i&&t.results.length&&y()}function f(){var e=v(),t=S(h());e<t&&x(e-t)}function y(){var e=h();E()<e.getBoundingClientRect().bottom&&x(S(e))}function h(){return w.querySelector(".ng-geocoder__list__item--focus")}function v(){return h().getBoundingClientRect().top-(q.getBoundingClientRect().top+parseInt(getComputedStyle(q).paddingTop,10))}function x(e){q.scrollTop=q.scrollTop+e}function E(){return q.getBoundingClientRect().top+parseInt(getComputedStyle(q).maxHeight,10)}function S(e){var t=getComputedStyle(e);return e.offsetHeight+parseInt(t.marginTop,10)+parseInt(t.marginBottom,10)}var L,w=o[0],C=w.closest("form"),I=w.querySelector(".ng-geocoder__input"),q=w.querySelector(".ng-geocoder__list"),R=r.placeId;t.index=0,t.query="",t.results=[],t.selectItem=p,t.displayList=_,t.inputKeydown=g,C.addEventListener("keydown",i),I.addEventListener("blur",s),I.addEventListener("focus",c),I.addEventListener("input",l),I.addEventListener("keydown",g),I.addEventListener("compositionend",l),R&&n.geocodeById(R).then(a)}function r(e,t){return t.templateUrl||i}var i="/ng-geocoder/ng-geocoder.html";t.put(i,'<div class="ng-geocoder">\n  <input id="{{ inputId }}" placeholder="{{ placeholder }}" class="ng-geocoder__input" type="text" ng-model="query" ng-class="inputClass" autocomplete="off"/>\n\n  <ul class="ng-geocoder__list" ng-show="displayList()" ng-style="{ \'max-height\': maxHeight || \'250px\' }">\n    <li class="ng-geocoder__list__item ng-geocoder__list__item--searching" ng-if="isSearching">\n      <strong class="ng-geocoder__list__item__text" ng-bind="textSearching"></strong>\n    </li>\n    <li class="ng-geocoder__list__item ng-geocoder__list__item--empty" ng-if="isEmpty">\n      <strong class="ng-geocoder__list__item__text" ng-bind="textNoResults"></strong>\n    </li>\n    <li class="ng-geocoder__list__item" ng-repeat="result in results" ng-class="{ \'ng-geocoder__list__item--focus\': index === $index }" ng-click="selectItem($index)">\n      <strong class="ng-geocoder__list__item__text" ng-bind="result.formatted_address" tabindex="{{ $index }}"></strong>\n    </li>\n  </ul>\n</div>\n');var s={restrict:"AE",scope:{result:"=ngGeocoder",inputId:"=",wait:"=",minLength:"=",inputClass:"@",placeholder:"@",textSearching:"@",textNoResults:"@",maxHeight:"@"},link:o,templateUrl:r};return s}angular.module("ng-geocoder").directive("ngGeocoder",e),e.$inject=["$timeout","$templateCache","ngGeocoderService"]}(),function(){window.Element&&!Element.prototype.closest&&(Element.prototype.closest=function(e){var t,n=(this.document||this.ownerDocument).querySelectorAll(e),o=this;do for(t=n.length;--t>=0&&n.item(t)!==o;);while(t<0&&(o=o.parentElement));return o})}();