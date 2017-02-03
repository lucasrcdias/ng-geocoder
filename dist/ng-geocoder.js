!function(){angular.module("ng-geocoder",[])}(),function(){function e(e){function t(e,t,n){switch(n){case google.maps.GeocoderStatus.OK:return e.resolve(t);case google.maps.GeocoderStatus.ZERO_RESULTS:return e.resolve([]);case google.maps.GeocoderStatus.OVER_QUERY_LIMIT:return e.reject("Over query limit");case google.maps.GeocoderStatus.REQUEST_DENIED:return e.reject("Request denied");default:return e.reject("Unknown error")}}function n(e){return r({placeId:e})}function o(e,t){var n={address:e,region:t};return r(n)}function r(n){var o=e.defer();return i.geocode(n,function(e,n){t(o,e,n)}),o.promise}var i=new google.maps.Geocoder,s={geocodeById:n,geocodeByQuery:o};return s}angular.module("ng-geocoder").factory("ngGeocoderService",e),e.$inject=["$q"]}(),function(){function e(e,t,n){function o(t,o,r){function i(e){var t=e.target.classList.contains("ng-geocoder__input");13===e.keyCode&&t&&(e.preventDefault(),e.stopPropagation())}function s(n){e(function(){t.showList=!1},100)}function c(e){t.$apply(function(){t.showList=!0})}function u(n){var o=t.query.length;o<t.minLength||t.isSearching||(w&&e.cancel(w),w=e(g,t.wait||500))}function l(e){if(e&&e.keyCode){var n=27===e.keyCode,o=13===e.keyCode,r=38===e.keyCode||40===e.keyCode;return o||r||n?(n&&_(),o&&f(t.index),r&&m(e.keyCode),e.preventDefault(),e.stopPropagation(),!1):void 0}}function g(){return t.$apply(function(){t.results=[],t.isEmpty=!1,t.isSearching=!0}),n.geocodeByQuery(t.query,r.region).then(d)}function d(e){t.index=0,t.isEmpty=0===e.length,t.results=e,t.showList=!0,t.isSearching=!1}function a(e){var n=e[0];n&&(t.query=n.formatted_address,t.result=n,t.showList=!1)}function p(){return t.query.length>=t.minLength&&t.showList}function _(){q.blur(),t.$apply(function(){t.showList=!1})}function f(n){e(function(){t.index=n,t.result=t.results[n],t.query=t.result.formatted_address,t.showList=!1},0)}function m(e){var n=t.index,o=t.results.length,r=38===e,i=40===e;r&&n-1>=0&&n--,i&&n+1<o&&n++,t.$apply(function(){t.index=n}),r&&t.results.length&&y(),i&&t.results.length&&h()}function y(){var e=x(),t=L(v());e<t&&E(e-t)}function h(){var e=v();S()<e.getBoundingClientRect().bottom&&E(L(e))}function v(){return C.querySelector(".ng-geocoder__list__item--focus")}function x(){return v().getBoundingClientRect().top-(k.getBoundingClientRect().top+parseInt(getComputedStyle(k).paddingTop,10))}function E(e){k.scrollTop=k.scrollTop+e}function S(){return k.getBoundingClientRect().top+parseInt(getComputedStyle(k).maxHeight,10)}function L(e){var t=getComputedStyle(e);return e.offsetHeight+parseInt(t.marginTop,10)+parseInt(t.marginBottom,10)}var w,C=o[0],I=C.closest("form"),q=C.querySelector(".ng-geocoder__input"),k=C.querySelector(".ng-geocoder__list"),R=r.placeId;t.index=0,t.query="",t.results=[],t.selectItem=f,t.displayList=p,t.inputKeydown=l,I.addEventListener("keydown",i),q.addEventListener("blur",s),q.addEventListener("focus",c),q.addEventListener("input",u),q.addEventListener("keydown",l),q.addEventListener("compositionend",u),R&&n.geocodeById(R).then(a)}function r(e,t){return t.templateUrl||i}var i="/ng-geocoder/ng-geocoder.html";t.put(i,'<div class="ng-geocoder">\n  <input id="{{ inputId }}" placeholder="{{ placeholder }}" class="ng-geocoder__input" type="text" ng-model="query" ng-class="inputClass" autocomplete="off"/>\n\n  <ul class="ng-geocoder__list" ng-show="displayList()" ng-style="{ \'max-height\': maxHeight || \'250px\' }">\n    <li class="ng-geocoder__list__item ng-geocoder__list__item--searching" ng-if="isSearching">\n      <strong class="ng-geocoder__list__item__text" ng-bind="textSearching"></strong>\n    </li>\n    <li class="ng-geocoder__list__item ng-geocoder__list__item--empty" ng-if="isEmpty">\n      <strong class="ng-geocoder__list__item__text" ng-bind="textNoResults"></strong>\n    </li>\n    <li class="ng-geocoder__list__item" ng-repeat="result in results" ng-class="{ \'ng-geocoder__list__item--focus\': index === $index }" ng-click="selectItem($index)">\n      <strong class="ng-geocoder__list__item__text" ng-bind="result.formatted_address" tabindex="{{ $index }}"></strong>\n    </li>\n  </ul>\n</div>\n');var s={restrict:"AE",scope:{result:"=ngGeocoder",inputId:"=",wait:"=",minLength:"=",inputClass:"@",placeholder:"@",textSearching:"@",textNoResults:"@",maxHeight:"@"},link:o,templateUrl:r};return s}angular.module("ng-geocoder").directive("ngGeocoder",e),e.$inject=["$timeout","$templateCache","ngGeocoderService"]}(),function(){window.Element&&!Element.prototype.closest&&(Element.prototype.closest=function(e){var t,n=(this.document||this.ownerDocument).querySelectorAll(e),o=this;do for(t=n.length;--t>=0&&n.item(t)!==o;);while(t<0&&(o=o.parentElement));return o})}();