(function(window, angular, undefined) {'use strict';

/**
 * @ngdoc overview
 * @name angulartics.snowplow
 * Enables analytics support for snowplow (http://snowplowanalytics.com)
 */
angular.module('angulartics.snowplow', ['angulartics'])
.config(['$analyticsProvider', function ($analyticsProvider) {

  /*
  * Function to extract the Snowplow user ID from the first-party cookie set by the Snowplow JavaScript Tracker
  *
  * @param string cookieName (optional) The value used for "cookieName" in the tracker constructor argmap
  * (leave blank if you did not set a custom cookie name)
  *
  * @return string or bool The ID string if the cookie exists or false if the cookie has not been set yet
  * https://github.com/snowplow/snowplow/wiki/1-General-parameters-for-the-Javascript-tracker#27-getting-the-user-id-from-the-snowplow-cookie
  */
  function getSnowplowDuid(cookieName) {
    cookieName = cookieName || '_sp_';
    var matcher = new RegExp(cookieName + 'id\\.[a-f0-9]+=([^;]+);');
    var match = document.cookie.match(matcher);
    if (match && match[1]) {
      return match[1].split('.')[0];
    } else {
      return false;
    }
  }

  if ( getSnowplowDuid() ) {
    var cookiedUserId = getSnowplowDuid();
  }

  // https://github.com/snowplow/snowplow/wiki/2-Specific-event-tracking-with-the-Javascript-tracker#trackPageView
  // snowplow('trackPageview', 'my custom page title');
  $analyticsProvider.registerPageTrack(function (path, title, context) {
    try {
      /* Instantiate $log service */
      var $log = instanceInjector().get('$log');

      /* Log Page */
      $log.debug('Snowplow page tracking: ', path, title, context);

      // snowplow('setCustomUrl', path); // TODO: do we need to get full page path?
      // snowplow('trackPageView', title ? title : undefined);
    } catch (e) {
      if (!(e instanceof ReferenceError)) {
        throw e;
      }
    }
  });

  // https://segment.com/docs/libraries/analytics.js/#track
  // analytics.track(event, [properties], [options], [callback]);
  $analyticsProvider.registerEventTrack(function (event, properties, options, callback) {
    try {
      analytics.track(event, properties, options, callback);
    } catch (e) {
      if (!(e instanceof ReferenceError)) {
        throw e;
      }
    }
  });

  // https://github.com/snowplow/snowplow/wiki/1-General-parameters-for-the-Javascript-tracker#231-setting-the-user-id
  // snowplow_name_here('setUserId', 'joe.blogs@email.com');
  $analyticsProvider.registerSetUserProperties(function (userId) {
    try {
      snowplow('setUserId', userId ? userId : cookiedUserId);
    } catch (e) {
      if (!(e instanceof ReferenceError)) {
        throw e;
      }
    }
  });

  // https://segment.com/docs/libraries/analytics.js/#identify
  // analytics.identify([userId], [traits], [options], [callback]);
  $analyticsProvider.registerSetUserPropertiesOnce(function (userId) {
    try {
      snowplow('setUserId', userId ? userId : cookiedUserId);
    } catch (e) {
      if (!(e instanceof ReferenceError)) {
        throw e;
      }
    }
  });

}]);

})(window, window.angular);
